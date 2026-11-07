package com.geetcode.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.geetcode.controller.SubmissionController.RunRequest;
import com.geetcode.controller.SubmissionController.RunResponse;
import com.geetcode.controller.SubmissionController.SubmitRequest;
import com.geetcode.entity.Submission;
import com.geetcode.entity.TestCase;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.SubmissionRepository;
import com.geetcode.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;


@Service 
@RequiredArgsConstructor 

public class JudgeService {
    private final SubmissionRepository submissionRepo;
    private final TestCaseRepository testCaseRepo;
    private final ProblemRepository problemRepo;
    private final SimpMessagingTemplate ws;

    private final RestClient restClient=RestClient.create();
    @Value("${EXECUTOR_URL:http://localhost:8081/execute}")
    private String EXECUTOR_URL;

    // The envelope we send over the telephone to the Executor Microservice
    public record ExecRequest(String language,String code,List<String> inputs,int timeLimitMs){}
    public record CaseResult(String output,String error,long timeMs,boolean timedOut){}
    public record ExecResponse(String compileError,List<CaseResult> results){}

    /*Before we write runCode and submitCode, notice something: Both runCode (Scratchpad) and submitCode (Official Exam) 
    need to pick up the telephone (restClient) and dial EXECUTOR_URL (http://localhost:8081/execute).
     So let's write a tiny 7-line phone-call helper method (callExecutor) once, and reuse it in both places! */

    private ExecResponse callExecutor(String lang,String code,List<String> inputs,int timeLimitMs){
        return restClient.post()
                .uri(EXECUTOR_URL)
                .body(new ExecRequest(lang,code,inputs,timeLimitMs))
                .retrieve()
                .body(ExecResponse.class);
    }

    public RunResponse runCode(RunRequest req){
        ExecResponse res=callExecutor(req.language(), req.code(), List.of(req.input()), 2000);

        // Did their C++ code fail to compile (syntax error)?
        if(res.compileError()!=null){
            return new RunResponse("", res.compileError(), 0);
        }
        // Otherwise, grab the 1st (and only) test result and return it!
        CaseResult r=res.results().get(0);
        return new RunResponse(r.output(), r.error(), r.timeMs());
    }

    public Submission submitCode(SubmitRequest req){
        //1. Create the Pending Submission receipt
        Submission sub=new Submission();
        sub.setUserId(req.userId());
        sub.setProblemId(req.problemId());
        sub.setLanguage(req.language());
        sub.setCode(req.code());

        //2. Save in PostgreSql to get an Official ID (eg, #42)
        Submission saved=submissionRepo.save(sub);

        //3. Hand off heavy judging to a background worker thread
        CompletableFuture.runAsync(()->evaluate(saved));

        //4. Immediately hand the PENDING receipt back to the browser!
        return saved;
    }

    private void evaluate(Submission sub) {
        try {
            // 1. Get the problem's time limit (default 2000ms)
            int timeLimit = problemRepo.findById(sub.getProblemId())
                    .map(p -> p.getTimeLimitMs())
                    .orElse(2000);

            // 2. Fetch all test cases for this problem from PostgreSQL
            List<TestCase> cases = testCaseRepo.findByProblemId(sub.getProblemId());
            sub.setTotal(cases.size());

            // 3. Extract all input strings using a Stream and call the Executor ONCE!
            List<String> inputs = cases.stream().map(t -> t.getInput()).toList();
            ExecResponse res = callExecutor(sub.getLanguage(), sub.getCode(), inputs, timeLimit);

            // (we will grade the results here!)
            if (res.compileError() != null) {
                sub.setVerdict("COMPILATION_ERROR");
                sub.setErrorMessage(res.compileError());
            } else {
                int passed = 0;
                long maxTime = 0;

                for (int i = 0; i < cases.size(); i++) {
                    CaseResult r = res.results().get(i);
                    maxTime = Math.max(maxTime, r.timeMs());

                    if (r.timedOut()) {
                        sub.setVerdict("TIME_LIMIT_EXCEEDED");
                        break;
                    }
                    if (r.error() != null && !r.error().isEmpty()) {
                        sub.setVerdict("RUNTIME_ERROR");
                        sub.setErrorMessage(r.error());
                        break;
                    }
                    if (!r.output().trim().equals(cases.get(i).getExpectedOutput().trim())) {
                        sub.setVerdict("WRONG_ANSWER");
                        break;
                    }
                    passed++;
                }

                sub.setPassed(passed);
                sub.setTimeMs(maxTime);
                if ("PENDING".equals(sub.getVerdict())) {
                    sub.setVerdict("ACCEPTED");
                }
            }

        } catch (Exception e) {
            sub.setVerdict("RUNTIME_ERROR");
            sub.setErrorMessage(e.getMessage());
        }

        // Save final verdict in PostgreSQL & broadcast over Walkie-Talkie!
        Submission updated = submissionRepo.save(sub);
        ws.convertAndSend("/topic/submissions/" + sub.getId(), updated);
    }
}
