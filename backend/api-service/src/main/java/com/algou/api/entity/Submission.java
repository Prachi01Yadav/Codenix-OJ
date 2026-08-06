package com.algou.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "submissions", indexes = {
    @Index(name = "idx_submission_user", columnList = "user_id"),
    @Index(name = "idx_submission_problem", columnList = "problem_id"),
    @Index(name = "idx_submission_verdict", columnList = "verdict")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Verdict verdict = Verdict.PENDING;

    @Builder.Default
    @Column(nullable = false)
    private int executionTimeMs = 0;

    @Builder.Default
    @Column(nullable = false)
    private int memoryUsedKb = 0;

    @Builder.Default
    @Column(nullable = false)
    private int passedTestCases = 0;

    @Builder.Default
    @Column(nullable = false)
    private int totalTestCases = 0;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant submittedAt;
}
