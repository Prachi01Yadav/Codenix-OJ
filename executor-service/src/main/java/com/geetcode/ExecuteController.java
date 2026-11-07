package com.geetcode;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor

public class ExecuteController {

    // Our back-office worker that actually compiles & runs the C++/Python code
    private final CodeRunnerService runnerService;

    // The exact 3 DTO envelopes that JudgeService (on Port 8080) sends and expects back!
    public record ExecRequest(String language, String code, List<String> inputs, int timeLimitMs) {}
    public record CaseResult(String output, String error, long timeMs, boolean timedOut) {}
    public record ExecResponse(String compileError, List<CaseResult> results) {}

    
    // Matches EXECUTOR_URL = "http://localhost:8081/execute" in JudgeService!
    @PostMapping("/execute")
    public ExecResponse execute(@RequestBody ExecRequest req){
        return runnerService.execute(req);
    }


}
