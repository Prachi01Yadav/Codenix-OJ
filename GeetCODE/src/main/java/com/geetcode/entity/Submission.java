package com.geetcode.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Getter 
@Setter 
@Entity 
@Table(name="submissions")
public class Submission {
    
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;


    private Long userId;

    private Long problemId;

    
    private String language;

    @Column(columnDefinition = "TEXT",nullable = false)
    private String code;


    private String verdict="PENDING";


    private int passed;

    private int total;


    private Long timeMs;

    @Column(columnDefinition="TEXT")
    private String errorMessage;


    private Instant submittedAt=Instant.now();


}
