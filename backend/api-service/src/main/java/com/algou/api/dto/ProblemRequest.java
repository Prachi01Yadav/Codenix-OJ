package com.algou.api.dto;

import com.algou.api.entity.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Statement is required")
    private String statement;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private int timeLimitMs = 1000;
    private int memoryLimitMb = 256;
    private List<String> tags;
    private List<TestCaseDTO> testCases;
}
