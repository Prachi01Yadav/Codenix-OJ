package com.geetcode.entity;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="problems")

@Getter 
@Setter

public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false,columnDefinition = "TEXT") //means tells sql to allow unlimited text length
    //as description could be quite longer
    private String statement;

    @Column (nullable = false)
    private String difficulty;


    private int timeLimitMs=2000;


    @ElementCollection(fetch = FetchType.EAGER)
    //A single SQL column cannot easily hold a List<String>. @ElementCollection tells JPA: "Automatically create
    //  a small side-table in Postgres (problem_tags) that stores (problem_id, tag) pairs for me, and load them immediately 
    // (EAGER) whenever I fetch a Problem
    private List<String> tags=new ArrayList<>();


    
    //Allows an Admin to send testCases in JSON when creating a problem, 
    //but hides testCases when sending a problem to the browser so users can't see hidden test cases in Inspect Element!
    @JsonProperty(access=JsonProperty.Access.WRITE_ONLY)
    //One problem has many test cases, linked via the problem field in TestCase.
    // Saving/deleting a problem automatically saves/deletes its test cases.
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TestCase> testCases=new ArrayList<>();


    //get only sample testcases to be shown to user
    public List<TestCase> getSamples(){
        return testCases.stream().filter(TestCase::isSample).toList();
    }


    public void setTestCases(List<TestCase> newCases){
        testCases.clear();
        if(newCases!=null){
            for(TestCase tc:newCases){
                tc.setProblem(this);
                testCases.add(tc);
            }
        }
    }
    // /(Why do we need tc.setProblem(this)? Because when an Admin sends 
    // JSON with a list of test cases, each TestCase in the JSON doesn't
    // know who its parent Problem is yet. This loop links every test case back to this problem so Postgres gets the problem_id!)

}
