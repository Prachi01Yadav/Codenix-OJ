package com.algou.api.service;

import com.algou.api.dto.GeminiRequest;
import com.algou.api.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiReviewService {

    private final RestClient restClient;
    private final String apiUrl;
    private final String apiKey;

    public AiReviewService(
            RestClient.Builder restClientBuilder,
            @Value("${app.gemini.api-url}") String apiUrl,
            @Value("${app.gemini.api-key}") String apiKey) {
        this.restClient = restClientBuilder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public String getReview(String code) {
        String prompt = "Review the following code and provide 3-4 concise, helpful suggestions for improvement. Keep it brief. Do not wrap the whole response in markdown code blocks, just return plain text/markdown.\n\nCode:\n" + code;
        
        GeminiRequest request = GeminiRequest.of(prompt);

        try {
            GeminiResponse response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            return response != null ? response.getExtractedText() : "Failed to get review from AI.";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "An error occurred while contacting the AI review service.";
        }
    }
}
