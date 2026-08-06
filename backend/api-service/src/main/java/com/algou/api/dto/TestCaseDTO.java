package com.algou.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseDTO {
    private Long id;
    private String input;
    private String expectedOutput;
    private boolean isSample;
    private String explanation;
}
