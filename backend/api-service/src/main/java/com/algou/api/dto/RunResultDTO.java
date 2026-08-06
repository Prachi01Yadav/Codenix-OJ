package com.algou.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunResultDTO {
    private boolean success;
    private String output;
    private String error;
    private int executionTime;
    private int exitCode;
}
