package com.algou.api.repository;

import com.algou.api.entity.Submission;
import com.algou.api.entity.Verdict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Page<Submission> findByUserIdOrderBySubmittedAtDesc(UUID userId, Pageable pageable);

    List<Submission> findByProblemIdAndUserIdOrderBySubmittedAtDesc(Long problemId, UUID userId);

    long countByProblemIdAndVerdict(Long problemId, Verdict verdict);

    long countByProblemId(Long problemId);

    boolean existsByProblemIdAndUserIdAndVerdict(Long problemId, UUID userId, Verdict verdict);

    boolean existsByProblemIdAndUserId(Long problemId, UUID userId);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.verdict = 'ACCEPTED'")
    long countDistinctSolvedByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.user.id = :userId")
    long countTotalByUserId(@Param("userId") UUID userId);
}
