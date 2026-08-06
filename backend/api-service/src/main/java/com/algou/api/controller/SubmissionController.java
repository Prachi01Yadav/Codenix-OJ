package com.algou.api.controller;

import com.algou.api.dto.*;
import com.algou.api.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/run")
    public ResponseEntity<RunResultDTO> runCode(
            @Valid @RequestBody RunRequestDTO request,
            @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(submissionService.run(request, email));
    }

    @PostMapping("/submit")
    public ResponseEntity<SubmissionResultDTO> submitCode(
            @Valid @RequestBody SubmissionRequestDTO request,
            @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(submissionService.submit(request, email));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionListItemDTO>> getProblemSubmissions(
            @PathVariable Long problemId,
            @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.ok(submissionService.getProblemSubmissions(problemId, email));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<SubmissionListItemDTO>> getUserSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal String email
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(submissionService.getUserSubmissions(email, pageable));
    }
}
