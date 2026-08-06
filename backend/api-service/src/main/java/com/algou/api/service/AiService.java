package com.algou.api.service;

import com.algou.api.dto.GeminiRequest;
import com.algou.api.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiService {

    private final RestClient restClient;
    private final String apiUrl;
    private final String apiKey;

    public AiService(
            RestClient.Builder restClientBuilder,
            @Value("${app.gemini.api-url}") String apiUrl,
            @Value("${app.gemini.api-key}") String apiKey) {
        this.restClient = restClientBuilder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    private String callGemini(String prompt) {
        GeminiRequest request = GeminiRequest.of(prompt);
        try {
            GeminiResponse response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            return response != null ? response.getExtractedText() : "Failed to get response from AI.";
        } catch (Exception e) {
            e.printStackTrace();
            return "An error occurred while contacting the AI service: " + e.getMessage();
        }
    }

    public String explainCode(String code, String language) {
        String prompt = """
                You are a coding tutor helping competitive programmers. Explain the following %s code line by line.
                Be concise but thorough. Use markdown formatting with headers, bold, and code blocks.
                Focus on the algorithm and logic, not basic syntax.

                ```%s
                %s
                ```
                """.formatted(language, language.toLowerCase(), code);

        return callGemini(prompt);
    }

    public String reviewCode(String code, String language, String problemTitle) {
        String prompt = """
                You are a senior competitive programmer and code reviewer. Review this %s solution for the problem "%s":

                ```%s
                %s
                ```

                Provide a structured review with:
                1. ✅ **What's Good** — things done correctly
                2. ⚠️ **Potential Issues** — bugs, edge cases, or logical errors
                3. 🚀 **Performance** — time/space complexity analysis and optimizations
                4. 💡 **Suggestions** — specific improvements with code snippets

                Use markdown formatting. Be constructive and educational.
                """.formatted(language, problemTitle, language.toLowerCase(), code);

        return callGemini(prompt);
    }

    public String debugCode(String code, String language, String errorMessage) {
        String prompt;
        if (errorMessage != null && !errorMessage.isEmpty()) {
            prompt = """
                    You are a debugging expert. This %s code produces the following error:

                    **Error:**
                    ```
                    %s
                    ```

                    **Code:**
                    ```%s
                    %s
                    ```

                    Provide:
                    1. 🐛 **Bug Found** — describe the issue clearly
                    2. 📖 **Why It Happens** — explain the root cause
                    3. ✅ **Fix** — show the corrected code snippet
                    4. 🛡️ **Prevention** — how to avoid this in the future

                    Use markdown formatting.
                    """.formatted(language, errorMessage, language.toLowerCase(), code);
        } else {
            prompt = """
                    You are a debugging expert. Analyze this %s code for potential bugs, edge cases, and runtime errors.

                    ```%s
                    %s
                    ```

                    Provide:
                    1. 🐛 **Potential Bugs** — identify likely issues
                    2. 📖 **Edge Cases** — inputs that could cause failures
                    3. ✅ **Suggested Fixes** — show corrected code snippets
                    4. 🛡️ **Best Practices** — improvements for robustness

                    Use markdown formatting.
                    """.formatted(language, language.toLowerCase(), code);
        }

        return callGemini(prompt);
    }

    public String analyzeComplexity(String code, String language) {
        String prompt = """
                You are an algorithm analysis expert. Analyze the time and space complexity of this %s code.

                ```%s
                %s
                ```

                Provide:
                1. ⏱️ **Time Complexity** — Big-O notation with detailed explanation of each loop/recursion
                2. 💾 **Space Complexity** — Big-O notation with explanation of memory usage
                3. 📊 **Breakdown** — a table showing each significant operation and its complexity
                4. 🚀 **Can It Be Optimized?** — if yes, briefly explain the better approach and its complexity

                Use markdown formatting with clear headers.
                """.formatted(language, language.toLowerCase(), code);

        return callGemini(prompt);
    }

    public String getHint(String problemTitle, String problemDescription, int hintLevel) {
        String prompt = """
                You are a coding mentor for competitive programming. The student is solving this problem:

                **Problem:** %s
                **Description:** %s

                Give hint level %d (out of 3 progressive hints):
                - Level 1 (Orient): A gentle nudge about the approach. Ask questions that guide thinking. Do NOT name the algorithm.
                - Level 2 (Approach): Name the algorithm or data structure to use. Give a high-level strategy.
                - Level 3 (Pseudocode): Provide a pseudocode outline, but NOT the actual code solution.

                CRITICAL: NEVER give the actual code solution. The learning value is in solving it themselves.
                Use markdown formatting. Be encouraging.
                """.formatted(problemTitle, problemDescription, hintLevel);

        return callGemini(prompt);
    }
}
