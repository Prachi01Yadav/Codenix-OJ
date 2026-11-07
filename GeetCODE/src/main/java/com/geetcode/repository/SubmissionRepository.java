package com.geetcode.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.geetcode.entity.Submission;

public interface SubmissionRepository extends JpaRepository<Submission,Long> {
    List<Submission> findByUserId(Long userId);
    List<Submission> findByUserIdAndProblemId(Long userId,Long problemId);
}
