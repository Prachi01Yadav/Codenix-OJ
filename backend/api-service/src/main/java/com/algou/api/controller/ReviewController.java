package com.algou.api.controller;

import com.algou.api.service.AiReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    private final AiReviewService aiReviewService;

    public ReviewController(AiReviewService aiReviewService) {
        this.aiReviewService = aiReviewService;
    }

    @PostMapping
    public Map<String, Object> reviewCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String rawReview = aiReviewService.getReview(code);
        
        List<String> suggestions = Arrays.stream(rawReview.split("\n"))
                .filter(line -> !line.trim().isEmpty())
                .collect(Collectors.toList());
        
        return Map.of("suggestions", suggestions);
    }
}
