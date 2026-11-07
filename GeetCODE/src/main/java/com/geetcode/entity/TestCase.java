package com.geetcode.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;

@Table(name="testcases")
@Entity 

@Getter
@Setter

@AllArgsConstructor 
@NoArgsConstructor


public class TestCase{
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false,columnDefinition="TEXT")
    private String input;

    @Column(nullable=false,columnDefinition="TEXT")
    // it doesnt means that output cant be null, just that some expected
    //output should be there, in terms of sql, this means this
    private String expectedOutput;

    private boolean sample=false; //this testcase will be hidden
    //until marked as true



    @ManyToOne(fetch=FetchType.LAZY) //tells JPA that 
    //many testcases can belong to one single problem
    // and LAZY- when loading a testcase dont waste time on loading
    // entire problem unless we actually need it by calling- testCase.getProblem()

    @JoinColumn(name="problem_id",nullable=false)
    // JPA In the testcases SQL table, create a foreign key column named 
    // problem_id that stores the id of the Problem
    @JsonIgnore // Prevents infinite loop 
    private Problem problem; //each testcase needs to know which problem it belongs to


    public Long getId(){
        return this.id;
    }
    public void setId(Long x){
        this.id=x;
    }
    public String getInput(){
        return this.input;
    }


}
