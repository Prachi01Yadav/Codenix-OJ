package com.algou.api.dto;

import java.util.List;

public record GeminiResponse(List<Candidate> candidates) {
    
    public record Candidate(Content content) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}

    public String getExtractedText() {
        if (candidates != null && !candidates.isEmpty() && 
            candidates.get(0).content() != null && 
            candidates.get(0).content().parts() != null && 
            !candidates.get(0).content().parts().isEmpty()) {
            return candidates.get(0).content().parts().get(0).text();
        }
        return "No review could be generated.";
    }
}
