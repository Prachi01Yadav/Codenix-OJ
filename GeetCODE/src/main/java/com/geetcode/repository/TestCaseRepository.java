package com.geetcode.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.geetcode.entity.TestCase;

public interface TestCaseRepository extends JpaRepository<TestCase,Long> {

    List<TestCase> findByProblemId(Long problemId);
    
}
