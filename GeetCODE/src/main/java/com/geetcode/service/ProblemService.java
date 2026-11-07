package com.geetcode.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.geetcode.controller.ProblemController.ProblemItem;
import com.geetcode.entity.Problem;
import com.geetcode.entity.Submission;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.SubmissionRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service 

public class ProblemService {
    private final ProblemRepository problemRepo;

    private final SubmissionRepository submissionRepo;

    public Problem getById(Long id){
        return problemRepo.findById(id).orElseThrow();
    }

    public List<ProblemItem> getAll(
            String search,
            String difficulty,
            String tag,
            Long userId
    ) {
        List<Problem> problems = (search != null && !search.isBlank())
                ? problemRepo.findByTitleContainingIgnoreCase(search)
                : problemRepo.findAll();

        List<Submission> userSubs = (userId != null)
                ? submissionRepo.findByUserId(userId)
                : List.of();

        return problems.stream()
                .filter(p -> difficulty == null || difficulty.isBlank() || p.getDifficulty().equalsIgnoreCase(difficulty))
                .filter(p -> tag == null || tag.isBlank() || p.getTags().contains(tag))
                .map(p -> {
                    boolean solved = userSubs.stream().anyMatch(s ->
                            s.getProblemId().equals(p.getId()) && "ACCEPTED".equals(s.getVerdict()));
                    boolean attempted = userSubs.stream().anyMatch(s -> s.getProblemId().equals(p.getId()));
                    String status = solved ? "SOLVED" : (attempted ? "ATTEMPTED" : "UNSOLVED");
                    return new ProblemItem(p.getId(), p.getTitle(), p.getDifficulty(), p.getTags(), status);
                })
                .toList();
    }

    public List<Submission> getSubmissions(Long id,Long userId){
        return submissionRepo.findByUserIdAndProblemId(userId, id);
    }

    public Problem create(Problem problem){
        return  problemRepo.save(problem);
    }

    public Problem update(Long id, Problem updated){
        Problem existing=problemRepo.findById(id).orElseThrow();
        existing.setTitle(updated.getTitle());
        existing.setStatement(updated.getStatement());
        existing.setDifficulty(updated.getDifficulty());
        existing.setTimeLimitMs(updated.getTimeLimitMs());
        existing.setTags(updated.getTags());
        return problemRepo.save(existing);
    }

    public void delete(Long id){
        problemRepo.deleteById(id);
    }
}

