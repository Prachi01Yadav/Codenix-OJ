package com.geetcode.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.geetcode.entity.Problem;

public interface ProblemRepository extends JpaRepository<Problem,Long>  {

    Optional<Problem> findByTitle(String title);

 
    List<Problem> findByTitleContainingIgnoreCase(String title);
    
}
