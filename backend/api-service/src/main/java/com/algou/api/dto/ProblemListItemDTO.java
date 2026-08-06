package com.algou.api.dto;

import com.algou.api.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemListItemDTO {
    private Long id;
    private String title;
    private String slug;
    private Difficulty difficulty;
    private List<String> tags;
    private double acceptanceRate;
    private long totalSubmissions;
    private long acceptedSubmissions;
    private String status; // SOLVED, ATTEMPTED, UNSOLVED
}
