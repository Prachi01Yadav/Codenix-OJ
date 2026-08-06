package com.algou.api.dto;

import com.algou.api.entity.Verdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResultDTO {
    private Long testCaseId;
    private Verdict verdict;
    private int executionTime;
    private int memoryUsed;
    private String output;
    private String expectedOutput;
    private boolean passed;
}
