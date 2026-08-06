package com.algou.api.controller;

import com.algou.api.dto.ProblemDetailResponseDTO;
import com.algou.api.dto.ProblemListItemDTO;
import com.algou.api.dto.ProblemRequest;
import com.algou.api.entity.Difficulty;
import com.algou.api.entity.User;
import com.algou.api.repository.UserRepository;
import com.algou.api.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<ProblemListItemDTO>> listProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag,
            @AuthenticationPrincipal String email
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Difficulty diffEnum = null;
        if (difficulty != null && !difficulty.isBlank()) {
            try {
                diffEnum = Difficulty.valueOf(difficulty.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        UUID userId = null;
        if (email != null) {
            userRepository.findByEmail(email).ifPresent(u -> {});
            userId = userRepository.findByEmail(email).map(User::getId).orElse(null);
        }

        return ResponseEntity.ok(problemService.list(pageable, diffEnum, search, tag, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemDetailResponseDTO> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProblemDetailResponseDTO> getProblemBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(problemService.getBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProblemDetailResponseDTO> createProblem(
            @Valid @RequestBody ProblemRequest request,
            @AuthenticationPrincipal String email
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.create(request, email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProblemDetailResponseDTO> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request
    ) {
        return ResponseEntity.ok(problemService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
