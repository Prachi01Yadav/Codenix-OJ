package com.algou.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String handle;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    private String avatarUrl;

    @Builder.Default
    @Column(nullable = false)
    private int rating = 0;

    @Builder.Default
    @Column(nullable = false)
    private int maxRating = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public String getDisplayName() {
        return name;
    }

    public String getRank() {
        if (rating >= 2400) return "Grandmaster";
        if (rating >= 2100) return "Master";
        if (rating >= 1900) return "Candidate Master";
        if (rating >= 1600) return "Expert";
        if (rating >= 1400) return "Specialist";
        if (rating >= 1200) return "Pupil";
        return "Newbie";
    }
}
