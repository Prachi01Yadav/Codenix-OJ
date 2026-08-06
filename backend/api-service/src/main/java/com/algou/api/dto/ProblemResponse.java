package com.algou.api.dto;

import com.algou.api.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProblemResponse {
    private Long id;
    private String title;
    private String statement;
    private Difficulty difficulty;
    private String constraints;
    private String createdByName;
    private Instant createdAt;
    private Instant updatedAt;
}
