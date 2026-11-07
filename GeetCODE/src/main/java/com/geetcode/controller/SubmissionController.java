package com.geetcode.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.geetcode.entity.Submission;
import com.geetcode.service.JudgeService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController 
@RequiredArgsConstructor 
@RequestMapping("/api/submissions")
@CrossOrigin(origins="*")

public class SubmissionController {
    
    private final JudgeService jservice;

    //1. DTO envelopes for "Run Code"(Scratchpad)
    public record RunRequest(String language,String code,String input){}
    public record RunResponse(String output,String error,long timeMs){}


    //2. DTO for "Submit Code"(Official Judging)
    public record SubmitRequest(Long userId,Long problemId,String language, String code){}


    // Button 1: Run code against custom input
    @PostMapping("/run")
    public RunResponse run(@RequestBody RunRequest req){
        return jservice.runCode(req);
    }

    //Button 2: Submit code against all databse testcases
    @PostMapping("/submit")
    public Submission submit(@RequestBody SubmitRequest req){
        return jservice.submitCode(req);
    }
    

    
}
