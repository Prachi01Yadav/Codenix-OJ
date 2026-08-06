package com.algou.api.service;

import com.algou.api.dto.*;
import com.algou.api.entity.Problem;
import com.algou.api.entity.Submission;
import com.algou.api.entity.TestCase;
import com.algou.api.entity.Verdict;
import com.algou.api.exception.ResourceNotFoundException;
import com.algou.api.repository.ProblemRepository;
import com.algou.api.repository.SubmissionRepository;
import com.algou.api.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionProcessor {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeExecutionService codeExecutionService;

    @Transactional
    public SubmissionResultDTO processSubmission(SubmissionMessageDTO dto) {
        Submission submission = submissionRepository.findById(dto.getSubmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        Problem problem = problemRepository.findById(dto.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

        List<TestCase> testCases = testCaseRepository
                .findByProblemIdOrderByOrderIndex(dto.getProblemId());

        List<TestCaseResultDTO> results = new ArrayList<>();
        int passed = 0;
        int maxTime = 0;
        int maxMemory = 0;
        Verdict finalVerdict = Verdict.ACCEPTED;
        String errorMsg = null;

        for (TestCase tc : testCases) {
            CompileRequest compileRequest = new CompileRequest();
            compileRequest.setCode(dto.getCode());
            compileRequest.setLanguage(dto.getLanguage().name());
            compileRequest.setInput(tc.getInput());

            CompileResponse execResult = codeExecutionService.compileAndRun(compileRequest);

            Verdict tcVerdict;
            boolean tcPassed;

            if (execResult.getExitCode() != 0 || (execResult.getStderr() != null && !execResult.getStderr().isBlank())) {
                if (execResult.getStderr() != null && (execResult.getStderr().contains("timed out") || execResult.getStderr().contains("Execution timed out"))) {
                    tcVerdict = Verdict.TIME_LIMIT_EXCEEDED;
                } else if (execResult.getExitCode() != 0 && execResult.getStdout().isEmpty()) {
                    tcVerdict = Verdict.COMPILATION_ERROR;
                } else {
                    tcVerdict = Verdict.RUNTIME_ERROR;
                }
                tcPassed = false;
                if (errorMsg == null) {
                    errorMsg = (execResult.getStderr() != null && !execResult.getStderr().isBlank()) 
                                ? execResult.getStderr() 
                                : "Execution failed with exit code " + execResult.getExitCode();
                }
            } else {
                String actual = normalizeOutput(execResult.getStdout());
                String expected = normalizeOutput(tc.getExpectedOutput());
                if (actual.equals(expected)) {
                    tcVerdict = Verdict.ACCEPTED;
                    tcPassed = true;
                    passed++;
                } else {
                    tcVerdict = Verdict.WRONG_ANSWER;
                    tcPassed = false;
                    if (errorMsg == null) {
                        errorMsg = String.format("Expected '%s' but got '%s'",
                                tc.getExpectedOutput().trim(), execResult.getStdout().trim());
                    }
                }
            }

            maxTime = Math.max(maxTime, execResult.getTimeMs());
            maxMemory = Math.max(maxMemory, execResult.getMemoryKb());

            if (tcVerdict != Verdict.ACCEPTED && finalVerdict == Verdict.ACCEPTED) {
                finalVerdict = tcVerdict;
            }

            results.add(TestCaseResultDTO.builder()
                    .testCaseId(tc.getId())
                    .verdict(tcVerdict)
                    .executionTime(execResult.getTimeMs())
                    .memoryUsed(execResult.getMemoryKb())
                    .output(execResult.getStdout() != null ? execResult.getStdout().trim() : "")
                    .expectedOutput(tc.getExpectedOutput().trim())
                    .passed(tcPassed)
                    .build());

            if (tcVerdict == Verdict.COMPILATION_ERROR) break;
        }

        submission.setVerdict(finalVerdict);
        submission.setPassedTestCases(passed);
        submission.setExecutionTimeMs(maxTime);
        submission.setMemoryUsedKb(maxMemory);
        submission.setErrorMessage(errorMsg);
        submissionRepository.save(submission);

        problem.setTotalSubmissions(problem.getTotalSubmissions() + 1);
        if (finalVerdict == Verdict.ACCEPTED) {
            problem.setAcceptedSubmissions(problem.getAcceptedSubmissions() + 1);
        }
        problemRepository.save(problem);

        return SubmissionResultDTO.builder()
                .id(submission.getId())
                .problemId(problem.getId())
                .verdict(finalVerdict)
                .language(dto.getLanguage())
                .executionTime(maxTime)
                .memoryUsed(maxMemory)
                .passedTestCases(passed)
                .totalTestCases(testCases.size())
                .errorMessage(errorMsg)
                .testCaseResults(results)
                .submittedAt(submission.getSubmittedAt())
                .build();
    }

    private String normalizeOutput(String output) {
        if (output == null) return "";
        return output.trim().replaceAll("\\r\\n", "\n").replaceAll("\\s+$", "");
    }
}
