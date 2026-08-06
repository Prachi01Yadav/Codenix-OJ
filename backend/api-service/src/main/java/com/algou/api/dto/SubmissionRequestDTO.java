package com.algou.api.dto;

import com.algou.api.entity.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequestDTO {
    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotNull(message = "Language is required")
    private Language language;

    @NotBlank(message = "Code is required")
    private String code;
}
