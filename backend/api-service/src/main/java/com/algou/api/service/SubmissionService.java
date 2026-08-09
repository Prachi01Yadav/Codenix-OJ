package com.algou.api.service;

import com.algou.api.dto.*;
import com.algou.api.entity.*;
import com.algou.api.exception.ResourceNotFoundException;
import com.algou.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService codeExecutionService;
    private final SubmissionProcessor submissionProcessor;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public RunResultDTO run(RunRequestDTO request, String userEmail) {
        CompileRequest compileRequest = new CompileRequest();
        compileRequest.setCode(request.getCode());
        compileRequest.setLanguage(request.getLanguage().name());

        String input = request.getCustomInput();
        if (input == null || input.isBlank()) {
            List<TestCase> samples = testCaseRepository
                    .findByProblemIdAndIsSampleTrueOrderByOrderIndex(request.getProblemId());
            if (!samples.isEmpty()) {
                input = samples.get(0).getInput();
            } else {
                input = "";
            }
        }
        compileRequest.setInput(input);

        CompileResponse execResult = codeExecutionService.compileAndRun(compileRequest);

        boolean success = execResult.getExitCode() == 0;
        String output = execResult.getStdout() != null ? execResult.getStdout() : "";
        String error = null;
        if (!success) {
            error = (execResult.getStderr() != null && !execResult.getStderr().isBlank())
                    ? execResult.getStderr()
                    : "Execution failed with exit code " + execResult.getExitCode();
        }

        return RunResultDTO.builder()
                .success(success)
                .output(output)
                .error(error)
                .executionTime(execResult.getTimeMs())
                .exitCode(execResult.getExitCode())
                .build();
    }

    @Transactional
    public SubmissionResultDTO submit(SubmissionRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

        int totalCases = testCaseRepository.countByProblemId(request.getProblemId());

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .language(request.getLanguage())
                .code(request.getCode())
                .verdict(Verdict.PENDING)
                .totalTestCases(totalCases)
                .build();

        submission = submissionRepository.save(submission);

        SubmissionMessageDTO message = SubmissionMessageDTO.builder()
                .submissionId(submission.getId())
                .problemId(problem.getId())
                .userEmail(userEmail)
                .language(request.getLanguage())
                .code(request.getCode())
                .isRunOnly(false)
                .build();

        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                SubmissionResultDTO result = submissionProcessor.processSubmission(message);
                String destination = "/topic/submissions/" + result.getId();
                log.info("Pushing result to WebSocket topic {}", destination);
                messagingTemplate.convertAndSend(destination, result);
            } catch (Exception e) {
                log.error("Error processing submission message", e);
            }
        });

        return SubmissionResultDTO.builder()
                .id(submission.getId())
                .problemId(problem.getId())
                .verdict(Verdict.PENDING)
                .language(request.getLanguage())
                .totalTestCases(totalCases)
                .submittedAt(submission.getSubmittedAt())
                .build();
    }

    public Page<SubmissionListItemDTO> getUserSubmissions(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId(), pageable)
                .map(this::mapToListItem);
    }

    public List<SubmissionListItemDTO> getProblemSubmissions(Long problemId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByProblemIdAndUserIdOrderBySubmittedAtDesc(problemId, user.getId())
                .stream()
                .map(this::mapToListItem)
                .toList();
    }

    private SubmissionListItemDTO mapToListItem(Submission s) {
        return SubmissionListItemDTO.builder()
                .id(s.getId())
                .problemId(s.getProblem().getId())
                .problemTitle(s.getProblem().getTitle())
                .verdict(s.getVerdict())
                .language(s.getLanguage())
                .executionTime(s.getExecutionTimeMs())
                .memoryUsed(s.getMemoryUsedKb())
                .submittedAt(s.getSubmittedAt())
                .build();
    }
}
