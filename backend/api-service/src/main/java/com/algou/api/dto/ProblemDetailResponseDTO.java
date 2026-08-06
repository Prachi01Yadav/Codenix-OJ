package com.algou.api.dto;

import com.algou.api.entity.Difficulty;
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
public class ProblemDetailResponseDTO {
    private Long id;
    private String title;
    private String slug;
    private Difficulty difficulty;
    private List<String> tags;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private int timeLimit;
    private int memoryLimit;
    private List<TestCaseDTO> sampleTestCases;
    private Instant createdAt;
    private Instant updatedAt;
}
