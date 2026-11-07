package com.geetcode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import com.geetcode.ExecuteController.ExecRequest;
import com.geetcode.ExecuteController.ExecResponse;

class CodeRunnerServiceTest {

    // Put CodeRunnerService directly on the testing table!
    private final CodeRunnerService runner = new CodeRunnerService();

    @Test
    void shouldExecutePythonBatchCorrectly() {
        String pyCode = "import sys\na, b = map(int, sys.stdin.read().split())\nprint(a + b)";
        ExecResponse res = runner.execute(new ExecRequest("python", pyCode, List.of("2 3", "10 20", "100 200"), 2000));

        assertNull(res.compileError());
        assertEquals(3, res.results().size());
        assertEquals("5", res.results().get(0).output().trim());
        assertEquals("30", res.results().get(1).output().trim());
        assertEquals("300", res.results().get(2).output().trim());
    }

    @Test
    void shouldExecuteCppBatchCorrectly() {
        String cppCode = "#include <iostream>\nusing namespace std;\nint main(){ int a,b; if(cin>>a>>b) cout<<(a+b); return 0; }";
        ExecResponse res = runner.execute(new ExecRequest("cpp", cppCode, List.of("5 7", "40 60"), 2000));

        assertNull(res.compileError());
        assertEquals(2, res.results().size());
        assertEquals("12", res.results().get(0).output().trim());
        assertEquals("100", res.results().get(1).output().trim());
    }

    @Test
    void shouldCatchCppCompilationError() {
        // Missing semicolon in C++!
        String brokenCpp = "#include <iostream>\nint main(){ int x = 5 return 0; }";
        ExecResponse res = runner.execute(new ExecRequest("cpp", brokenCpp, List.of("1"), 2000));

        assertNotNull(res.compileError());
        assertTrue(res.results().isEmpty());
    }

    @Test
    void shouldKillInfiniteLoopOnTimeLimitExceeded() {
        // Infinite loop in Python with a 300ms time limit!
        String infinitePy = "while True:\n    pass";
        ExecResponse res = runner.execute(new ExecRequest("python", infinitePy, List.of("1"), 300));

        assertTrue(res.results().get(0).timedOut());
        assertEquals("Time Limit Exceeded", res.results().get(0).error());
    }

    @Test
    void benchmarkSingleCompileVsPerCaseCompileSpeedup() {
        String cppCode = "#include <iostream>\nusing namespace std;\nint main(){ int a,b; if(cin>>a>>b) cout<<(a+b); return 0; }";
        List<String> twentyInputs = Collections.nCopies(20, "10 20");

        // 1. Naive Way (Compile 20 separate times for 20 test cases)
        long startNaive = System.currentTimeMillis();
        for (String in : twentyInputs) {
            runner.execute(new ExecRequest("cpp", cppCode, List.of(in), 2000));
        }
        long naiveMs = System.currentTimeMillis() - startNaive;

        // 2. GeetCODE Batch Way (Compile ONCE, run all 20 test cases in 1 batch)
        long startBatch = System.currentTimeMillis();
        ExecResponse batchRes = runner.execute(new ExecRequest("cpp", cppCode, twentyInputs, 2000));
        long batchMs = System.currentTimeMillis() - startBatch;

        double speedup = (double) naiveMs / Math.max(1, batchMs);
        System.out.println("==================================================");
        System.out.println("20 Test Cases (Naive Compile-Per-Case): " + naiveMs + " ms");
        System.out.println("20 Test Cases (GeetCODE Compile-Once):  " + batchMs + " ms");
        System.out.printf("MEASURED SPEEDUP: %.1fx FASTER!%n", speedup);
        System.out.println("==================================================");

        assertEquals(20, batchRes.results().size());
        assertTrue(speedup > 1.5);
    }
}