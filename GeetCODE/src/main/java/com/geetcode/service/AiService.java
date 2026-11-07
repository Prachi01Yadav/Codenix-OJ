package com.geetcode.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.geetcode.controller.AiController.AiRequest;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

@Service
public class AiService {

    /*
     * If you hardcode your Google Gemini API key ("AIzaSy...") directly inside
     * AiService.java and push your code to GitHub, bots will steal your key in 30
     * seconds! Instead, we put the key in application.properties and tell Spring to
     * inject it using @Value
     */
    /*
     * (The : at the end means:
     * "Look up gemini.api.key in application.properties; if it's not set yet, default to empty "" so the server still starts!"
     * )
     */
    @Value("${gemini.api.key:}")
    private String apiKey;

    private String buildPrompt(AiRequest req) {
        String task = switch (req.mode()) {
            case "hint" -> "Give a short helpful hint without giving away the full code.";
            case "explain" -> "Explain what this code does step-by-step in simple terms.";
            case "debug" -> "Find the bug or edge-case failure in this code and explain how to fix it.";
            case "complexity" -> "Give the Time and Space Complexity (Big-O) of this code with a brief explanation.";
            default -> "Review this code for cleanliness, edge cases, and best practices.";
        };
        return task + "\n\nProblem:\n" + req.problem()
                + "\n\nLanguage: " + req.language()
                + "\nCode:\n" + req.code();
    }

    private final RestClient restClient;

    public AiService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(20));
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    public record Part(String text) {
    }

    public record Content(List<Part> parts) {
    }

    public record Candidate(Content content) {
    }

    public record GeminiResponse(List<Candidate> candidates) {
    }

    public String askGemini(AiRequest req) {
        if (apiKey == null || apiKey.isBlank()) {
            return "Please set GEMINI_API_KEY in your .env file to enable the AI Coding Mentor.";
        }
        var body = Map.of("contents", List.of(
                Map.of("parts", List.of(Map.of("text", buildPrompt(req))))));

        // Try gemini-3.8-flash first, then fallback to gemini-3.8-flash-lite if 3.8-flash is overloaded (503/timeout)
        List<String> models = List.of("gemini-3.8-flash", "gemini-3.8-flash-lite");
        String lastError = "";

        for (String model : models) {
            try {
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key="
                        + apiKey;
                GeminiResponse res = restClient.post()
                        .uri(url)
                        .body(body)
                        .retrieve()
                        .body(GeminiResponse.class);
                return res.candidates().get(0).content().parts().get(0).text();
            } catch (Exception e) {
                lastError = e.getMessage();
            }
        }
        return "Gemini API error: " + lastError;
    }

}
