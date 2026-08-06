package com.algou.api.dto;

import com.algou.api.entity.Language;
import com.algou.api.entity.Verdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResultDTO {
    private Long id;
    private Long problemId;
    private Verdict verdict;
    private Language language;
    private int executionTime;
    private int memoryUsed;
    private int passedTestCases;
    private int totalTestCases;
    private String errorMessage;
    private List<TestCaseResultDTO> testCaseResults;
    private Instant submittedAt;
}
