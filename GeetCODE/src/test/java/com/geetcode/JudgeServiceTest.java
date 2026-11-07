package com.geetcode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.geetcode.controller.SubmissionController.SubmitRequest;
import com.geetcode.entity.Submission;
import com.geetcode.repository.ProblemRepository;
import com.geetcode.repository.SubmissionRepository;
import com.geetcode.repository.TestCaseRepository;
import com.geetcode.service.JudgeService;

@ExtendWith(MockitoExtension.class)
class JudgeServiceTest {

    @Mock private SubmissionRepository submissionRepo;
    @Mock private TestCaseRepository testCaseRepo;
    @Mock private ProblemRepository problemRepo;
    @Mock private SimpMessagingTemplate ws;

    @InjectMocks private JudgeService judgeService;

    @Test
    void submitCodeShouldReturnPendingReceiptImmediatelyUnder50Ms() {
        when(submissionRepo.save(any(Submission.class))).thenAnswer(inv -> {
            Submission s = inv.getArgument(0);
            s.setId(42L);
            return s;
        });

        long start = System.currentTimeMillis();
        Submission receipt = judgeService.submitCode(new SubmitRequest(1L, 5L, "cpp", "int main(){}"));
        long latencyMs = System.currentTimeMillis() - start;

        assertEquals(42L, receipt.getId());
        assertEquals("PENDING", receipt.getVerdict());
        assertTrue(latencyMs < 50);

        verify(ws, timeout(2000)).convertAndSend(eq("/topic/submissions/42"), any(Submission.class));
    }

    @Test
    void shouldHandle100ConcurrentSubmissionsWithZeroFailures() throws Exception {
        int CONCURRENT_USERS = 100;
        AtomicLong idGenerator = new AtomicLong(1); // Auto-increments 1, 2, 3 ... 100!

        when(submissionRepo.save(any(Submission.class))).thenAnswer(inv -> {
            Submission s = inv.getArgument(0);
            if (s.getId() == null) {
                s.setId(idGenerator.getAndIncrement());
            }
            return s;
        });

        ExecutorService pool = Executors.newFixedThreadPool(CONCURRENT_USERS);
        CountDownLatch startGun = new CountDownLatch(1);
        List<Future<Long>> futures = new ArrayList<>();

        for (int i = 1; i <= CONCURRENT_USERS; i++) {
            final long userId = i;
            futures.add(pool.submit(() -> {
                startGun.await(); // All 100 threads wait here for the starting pistol!
                long t0 = System.currentTimeMillis();
                Submission sub = judgeService.submitCode(new SubmitRequest(userId, 1L, "cpp", "int main(){}"));
                long elapsed = System.currentTimeMillis() - t0;
                assertEquals("PENDING", sub.getVerdict());
                return elapsed;
            }));
        }

        // Fire the starting pistol — all 100 users submit at the exact same instant!
        startGun.countDown();

        List<Long> latencies = new ArrayList<>();
        for (Future<Long> f : futures) {
            latencies.add(f.get()); // Ensures 0 exceptions across all 100 submissions!
        }
        pool.shutdown();

        Collections.sort(latencies);
        long p95Latency = latencies.get((int) (CONCURRENT_USERS * 0.95) - 1);

        System.out.println("==================================================");
        System.out.println("CONCURRENT SUBMISSIONS TESTED: " + CONCURRENT_USERS + " (0 failures!)");
        System.out.println("MEASURED p95 SUBMIT LATENCY:   " + p95Latency + " ms");
        System.out.println("==================================================");

        assertEquals(100, latencies.size());
        assertTrue(p95Latency < 100);
    }
}