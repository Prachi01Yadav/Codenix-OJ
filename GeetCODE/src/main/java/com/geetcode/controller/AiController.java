package com.geetcode.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.geetcode.service.AiService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/ai")
@RequiredArgsConstructor 
@CrossOrigin(origins = "*")
public class AiController {
    
    private final AiService aiService;
    
    // The request from the browser (mode = "hint" | "explain" | "debug" | "complexity" | "review")

    public record AiRequest(String mode,String language,String code,String problem){}
    public record AiResponse(String reply){}

    @PostMapping 
    public AiResponse ask(@RequestBody AiRequest req){
        return new AiResponse(aiService.askGemini(req));
    }


}
