package com.algou.api.dto;

import com.algou.api.entity.Language;
import com.algou.api.entity.Verdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionListItemDTO {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private Verdict verdict;
    private Language language;
    private int executionTime;
    private int memoryUsed;
    private Instant submittedAt;
}
