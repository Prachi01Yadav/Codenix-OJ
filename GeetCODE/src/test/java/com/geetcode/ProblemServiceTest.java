package com.geetcode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.geetcode.controller.ProblemController.ProblemItem;
import com.geetcode.entity.Problem;
import com.geetcode.entity.Submission;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.SubmissionRepository;
import com.geetcode.service.ProblemService;

@ExtendWith(MockitoExtension.class)
class ProblemServiceTest {

    @Mock private ProblemRepository problemRepo;       // Fake Problem DB Clerk
    @Mock private SubmissionRepository submissionRepo; // Fake Submission DB Clerk

    @InjectMocks private ProblemService problemService; // REAL ProblemService

    @Test
    void getAllShouldFilterByDifficultyAndComputeSolvedStatus() {
        // 1. Create 2 fake problems (Problem #1 is EASY, Problem #2 is HARD)
        Problem p1 = new Problem();
        p1.setId(1L);
        p1.setTitle("Two Sum");
        p1.setDifficulty("EASY");
        p1.setTags(List.of("Arrays"));

        Problem p2 = new Problem();
        p2.setId(2L);
        p2.setTitle("Median of Arrays");
        p2.setDifficulty("HARD");
        p2.setTags(List.of("Arrays"));

        // 2. Create 1 ACCEPTED submission for Problem #1 by User #10
        Submission sub = new Submission();
        sub.setProblemId(1L);
        sub.setVerdict("ACCEPTED");

        when(problemRepo.findAll()).thenReturn(List.of(p1, p2));
        when(submissionRepo.findByUserId(10L)).thenReturn(List.of(sub));

        // 3. Call getAll filtering for "EASY" problems for User #10
        List<ProblemItem> items = problemService.getAll(null, "EASY", null, 10L);

        // 4. Only Problem #1 ("EASY") should remain, and its status should be "SOLVED"!
        assertEquals(1, items.size());
        assertEquals("Two Sum", items.get(0).title());
        assertEquals("SOLVED", items.get(0).status());
    }

    @Test
    void getAllShouldMarkAttemptedWhenVerdictIsNotAccepted() {
        Problem p1 = new Problem();
        p1.setId(1L);
        p1.setTitle("Two Sum");
        p1.setDifficulty("EASY");
        p1.setTags(List.of("Arrays"));

        Submission wrongSub = new Submission();
        wrongSub.setProblemId(1L);
        wrongSub.setVerdict("WRONG_ANSWER");

        when(problemRepo.findAll()).thenReturn(List.of(p1));
        when(submissionRepo.findByUserId(10L)).thenReturn(List.of(wrongSub));

        List<ProblemItem> items = problemService.getAll(null, null, null, 10L);
        assertEquals("ATTEMPTED", items.get(0).status());
    }

    @Test
    void updateShouldModifyExistingProblemFields() {
        Problem existing = new Problem();
        existing.setId(1L);
        existing.setTitle("Old Title");

        Problem updated = new Problem();
        updated.setTitle("New Title");
        updated.setDifficulty("MEDIUM");

        when(problemRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(problemRepo.save(existing)).thenReturn(existing);

        Problem res = problemService.update(1L, updated);
        assertEquals("New Title", res.getTitle());
        assertEquals("MEDIUM", res.getDifficulty());
    }

    @Test
    void deleteShouldCallRepositoryDeleteById() {
        problemService.delete(5L);
        verify(problemRepo).deleteById(5L);
    }
}