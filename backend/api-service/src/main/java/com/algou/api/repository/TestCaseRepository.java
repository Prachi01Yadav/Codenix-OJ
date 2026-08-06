package com.algou.api.repository;

import com.algou.api.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemIdAndIsSampleTrueOrderByOrderIndex(Long problemId);

    List<TestCase> findByProblemIdOrderByOrderIndex(Long problemId);

    void deleteByProblemId(Long problemId);

    int countByProblemId(Long problemId);
}
