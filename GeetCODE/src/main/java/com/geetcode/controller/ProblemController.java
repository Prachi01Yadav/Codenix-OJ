package com.geetcode.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.geetcode.entity.Problem;
import com.geetcode.entity.Submission;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.SubmissionRepository;
import com.geetcode.service.ProblemService;

import lombok.RequiredArgsConstructor;

@RestController // tells spring this class handles web requests and returns json
@RequestMapping("/api/problems") // Every endpoint inside this class will start with /api/problems.
@RequiredArgsConstructor // Lombok automatically generates a constructor for any private final fields
                         // inside this class.

public class ProblemController {

    private final ProblemService pService;
    /*
     * Why private final + @RequiredArgsConstructor? In Spring,
     * we never write new ProblemRepository(). Because of
     * private final + @RequiredArgsConstructor, Spring automatically
     * passes the working ProblemRepository and SubmissionRepository into
     * our controller when the app starts!
     */

    @GetMapping("/{id}")
    public Problem getById(@PathVariable Long id) {
        return pService.getById(id);
    }
    // @PathVariable -> Grabs the {id} from the URL (like 1) and passes it into the
    // Long id parameter.

    public record ProblemItem(Long id, String title, String difficulty, List<String> tags, String status) {
    }

    @GetMapping
    public List<ProblemItem> getAll(@RequestParam(required = false) String search,
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) Long userId){
                return pService.getAll(search, difficulty, tag, userId);
    }


    @GetMapping("{id}/submissions")
    public List<Submission> getProblemSubmissions(@PathVariable Long id, @RequestParam Long userId){
        return pService.getSubmissions(id, userId);
    }

    @PostMapping
    public Problem create(@RequestBody Problem problem){
        return pService.create(problem);
    }

/*What is @RequestBody?
@PathVariable reads from the URL path (/api/problems/1).
@RequestParam reads from the URL query (?search=sum).
@RequestBody reads the JSON sent inside the body of a POST or PUT
 request and turns it into a Java Problem object! */

    @PutMapping("/{id}")
    public Problem update(@PathVariable Long id,@RequestBody Problem updated){
        return pService.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        pService.delete(id);
    }


}
