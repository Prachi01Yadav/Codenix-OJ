package com.algou.api.service;

import com.algou.api.dto.CompileRequest;
import com.algou.api.dto.CompileResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class CodeExecutionService {

    private final RestClient restClient;
    private final String executionEngineUrl;

    public CodeExecutionService(
            RestClient.Builder restClientBuilder,
            @Value("${app.execution-engine.url:http://localhost:5000}") String executionEngineUrl) {
        this.restClient = restClientBuilder.build();
        this.executionEngineUrl = executionEngineUrl;
    }

    public CompileResponse compileAndRun(CompileRequest request) {
        try {
            return restClient.post()
                    .uri(executionEngineUrl + "/execute")
                    .header("Content-Type", "application/json")
                    .body(request)
                    .retrieve()
                    .body(CompileResponse.class);
        } catch (RestClientException e) {
            e.printStackTrace();
            return new CompileResponse(
                    "",
                    "Error connecting to execution engine: " + e.getMessage(),
                    1,
                    0,
                    0
            );
        }
    }
}
