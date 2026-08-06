package com.algou.api.dto;

import com.algou.api.entity.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionMessageDTO implements Serializable {
    private Long submissionId;
    private Long problemId;
    private String userEmail;
    private Language language;
    private String code;
    private String customInput;
    private boolean isRunOnly; // true if just a run request, false if submit
    
    // For Run Only requests, since they aren't saved to DB
    private String runRequestId; 
}
