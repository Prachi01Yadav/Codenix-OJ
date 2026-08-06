package com.algou.api.controller;

import com.algou.api.service.AiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/explain")
    public Map<String, String> explainCode(@RequestBody Map<String, String> request) {
        String code = request.getOrDefault("code", "");
        String language = request.getOrDefault("language", "CPP");
        String result = aiService.explainCode(code, language);
        return Map.of("result", result);
    }

    @PostMapping("/review")
    public Map<String, String> reviewCode(@RequestBody Map<String, String> request) {
        String code = request.getOrDefault("code", "");
        String language = request.getOrDefault("language", "CPP");
        String problemTitle = request.getOrDefault("problemTitle", "Unknown Problem");
        String result = aiService.reviewCode(code, language, problemTitle);
        return Map.of("result", result);
    }

    @PostMapping("/debug")
    public Map<String, String> debugCode(@RequestBody Map<String, String> request) {
        String code = request.getOrDefault("code", "");
        String language = request.getOrDefault("language", "CPP");
        String errorMessage = request.getOrDefault("errorMessage", "");
        String result = aiService.debugCode(code, language, errorMessage);
        return Map.of("result", result);
    }

    @PostMapping("/complexity")
    public Map<String, String> analyzeComplexity(@RequestBody Map<String, String> request) {
        String code = request.getOrDefault("code", "");
        String language = request.getOrDefault("language", "CPP");
        String result = aiService.analyzeComplexity(code, language);
        return Map.of("result", result);
    }

    @PostMapping("/hint")
    public Map<String, String> getHint(@RequestBody Map<String, String> request) {
        String problemTitle = request.getOrDefault("problemTitle", "");
        String problemDescription = request.getOrDefault("problemDescription", "");
        int hintLevel = Integer.parseInt(request.getOrDefault("hintLevel", "1"));
        String result = aiService.getHint(problemTitle, problemDescription, hintLevel);
        return Map.of("result", result);
    }
}
