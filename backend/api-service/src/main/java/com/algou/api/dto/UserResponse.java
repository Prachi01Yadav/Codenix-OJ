package com.algou.api.dto;

import com.algou.api.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String handle;
    private String displayName;
    private String avatarUrl;
    private int rating;
    private int maxRating;
    private String rank;
    private long solvedCount;
    private long submissionCount;
    private Role role;
    private Instant createdAt;
}
