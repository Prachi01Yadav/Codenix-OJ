package com.algou.api.service;

import com.algou.api.dto.*;
import com.algou.api.entity.*;
import com.algou.api.exception.ResourceNotFoundException;
import com.algou.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Cacheable(value = "problemsList", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #difficulty + '-' + #search + '-' + #tag")
    public Page<ProblemListItemDTO> list(Pageable pageable, Difficulty difficulty, String search, String tag, UUID userId) {
        Page<Problem> problems;

        if (difficulty != null || search != null) {
            problems = problemRepository.findWithFilters(difficulty, search, pageable);
        } else {
            problems = problemRepository.findAll(pageable);
        }

        // Filter by tag in memory (ElementCollection makes SQL filtering complex)
        List<ProblemListItemDTO> filtered = problems.getContent().stream()
                .filter(p -> tag == null || p.getTags().contains(tag))
                .map(p -> mapToListItem(p, userId))
                .collect(Collectors.toList());

        return new PageImpl<>(filtered, pageable, problems.getTotalElements());
    }

    @Cacheable(value = "problemDetail", key = "#id")
    public ProblemDetailResponseDTO getById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id " + id));
        return mapToDetailResponse(problem);
    }

    @Cacheable(value = "problemDetailSlug", key = "#slug")
    public ProblemDetailResponseDTO getBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with slug " + slug));
        return mapToDetailResponse(problem);
    }

    @Transactional
    public ProblemDetailResponseDTO create(ProblemRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = generateSlug(request.getTitle());
        }

        Problem problem = Problem.builder()
                .title(request.getTitle())
                .slug(slug)
                .statement(request.getStatement())
                .difficulty(request.getDifficulty())
                .constraints(request.getConstraints())
                .inputFormat(request.getInputFormat())
                .outputFormat(request.getOutputFormat())
                .timeLimitMs(request.getTimeLimitMs() > 0 ? request.getTimeLimitMs() : 1000)
                .memoryLimitMb(request.getMemoryLimitMb() > 0 ? request.getMemoryLimitMb() : 256)
                .tags(request.getTags() != null ? request.getTags() : List.of())
                .createdBy(user)
                .build();

        Problem savedProblem = problemRepository.save(problem);

        // Create test cases if provided
        if (request.getTestCases() != null) {
            for (int i = 0; i < request.getTestCases().size(); i++) {
                TestCaseDTO tc = request.getTestCases().get(i);
                TestCase testCase = TestCase.builder()
                        .problem(savedProblem)
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .isSample(tc.isSample())
                        .explanation(tc.getExplanation())
                        .orderIndex(i)
                        .build();
                testCaseRepository.save(testCase);
            }
        }

        return mapToDetailResponse(savedProblem);
    }

    @Transactional
    public ProblemDetailResponseDTO update(Long id, ProblemRequest request) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id " + id));

        problem.setTitle(request.getTitle());
        problem.setStatement(request.getStatement());
        problem.setDifficulty(request.getDifficulty());
        problem.setConstraints(request.getConstraints());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        if (request.getTimeLimitMs() > 0) problem.setTimeLimitMs(request.getTimeLimitMs());
        if (request.getMemoryLimitMb() > 0) problem.setMemoryLimitMb(request.getMemoryLimitMb());
        if (request.getTags() != null) problem.setTags(request.getTags());
        if (request.getSlug() != null && !request.getSlug().isBlank()) problem.setSlug(request.getSlug());

        Problem updatedProblem = problemRepository.save(problem);
        return mapToDetailResponse(updatedProblem);
    }

    public void delete(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Problem not found with id " + id);
        }
        problemRepository.deleteById(id);
    }

    // --- Mapping helpers ---

    private ProblemListItemDTO mapToListItem(Problem problem, UUID userId) {
        String status = "UNSOLVED";
        if (userId != null) {
            if (submissionRepository.existsByProblemIdAndUserIdAndVerdict(problem.getId(), userId, Verdict.ACCEPTED)) {
                status = "SOLVED";
            } else if (submissionRepository.existsByProblemIdAndUserId(problem.getId(), userId)) {
                status = "ATTEMPTED";
            }
        }

        return ProblemListItemDTO.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .slug(problem.getSlug())
                .difficulty(problem.getDifficulty())
                .tags(problem.getTags())
                .acceptanceRate(problem.getAcceptanceRate())
                .totalSubmissions(problem.getTotalSubmissions())
                .acceptedSubmissions(problem.getAcceptedSubmissions())
                .status(status)
                .build();
    }

    private ProblemDetailResponseDTO mapToDetailResponse(Problem problem) {
        List<TestCase> sampleCases = testCaseRepository.findByProblemIdAndIsSampleTrueOrderByOrderIndex(problem.getId());

        return ProblemDetailResponseDTO.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .slug(problem.getSlug())
                .difficulty(problem.getDifficulty())
                .tags(problem.getTags())
                .description(problem.getStatement())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .constraints(problem.getConstraints())
                .timeLimit(problem.getTimeLimitMs())
                .memoryLimit(problem.getMemoryLimitMb())
                .sampleTestCases(sampleCases.stream().map(this::mapToTestCaseDTO).collect(Collectors.toList()))
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .build();
    }

    private TestCaseDTO mapToTestCaseDTO(TestCase tc) {
        return TestCaseDTO.builder()
                .id(tc.getId())
                .input(tc.getInput())
                .expectedOutput(tc.getExpectedOutput())
                .isSample(tc.isSample())
                .explanation(tc.getExplanation())
                .build();
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
