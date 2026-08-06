package com.algou.api.controller;

import com.algou.api.dto.CompileRequest;
import com.algou.api.dto.CompileResponse;
import com.algou.api.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compile")
public class CompileController {

    private final CodeExecutionService codeExecutionService;

    public CompileController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping
    public ResponseEntity<CompileResponse> compileCode(@RequestBody CompileRequest request) {
        CompileResponse response = codeExecutionService.compileAndRun(request);
        return ResponseEntity.ok(response);
    }
}
