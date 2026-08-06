package com.algou.api.service;

import com.algou.api.dto.ProblemRequest;
import com.algou.api.dto.ProblemListItemDTO;
import com.algou.api.dto.ProblemDetailResponseDTO;
import com.algou.api.entity.Difficulty;
import com.algou.api.entity.Problem;
import com.algou.api.entity.Role;
import com.algou.api.entity.User;
import com.algou.api.exception.ResourceNotFoundException;
import com.algou.api.repository.ProblemRepository;
import com.algou.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProblemServiceTest {

    @Mock
    private ProblemRepository problemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProblemService problemService;

    private User adminUser;
    private Problem testProblem;
    private ProblemRequest problemRequest;

    @BeforeEach
    void setUp() {
        adminUser = User.builder()
                .id(UUID.randomUUID())
                .name("Admin")
                .email("admin@example.com")
                .passwordHash("hash")
                .role(Role.ADMIN)
                .build();

        testProblem = Problem.builder()
                .id(1L)
                .title("Two Sum")
                .statement("Find two numbers...")
                .difficulty(Difficulty.EASY)
                .constraints("array size...")
                .createdBy(adminUser)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        problemRequest = new ProblemRequest();
        problemRequest.setTitle("Two Sum");
        problemRequest.setStatement("Find two numbers...");
        problemRequest.setDifficulty(Difficulty.EASY);
        problemRequest.setConstraints("array size...");
    }

    @Test
    void list_ReturnsPageOfProblems() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Problem> problemPage = new PageImpl<>(List.of(testProblem));
        when(problemRepository.findAll(pageable)).thenReturn(problemPage);

        Page<ProblemListItemDTO> result = problemService.list(pageable, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testProblem.getTitle(), result.getContent().get(0).getTitle());
    }

    @Test
    void getById_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(testProblem));

        ProblemDetailResponseDTO response = problemService.getById(1L);

        assertNotNull(response);
        assertEquals(testProblem.getTitle(), response.getTitle());
    }

    @Test
    void getById_ThrowsResourceNotFoundException() {
        when(problemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> problemService.getById(1L));
    }

    @Test
    void create_Success() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(adminUser));
        when(problemRepository.save(any())).thenReturn(testProblem);

        ProblemDetailResponseDTO response = problemService.create(problemRequest, adminUser.getEmail());

        assertNotNull(response);
        assertEquals(testProblem.getTitle(), response.getTitle());
        verify(problemRepository).save(any());
    }

    @Test
    void update_Success() {
        when(problemRepository.findById(1L)).thenReturn(Optional.of(testProblem));
        when(problemRepository.save(any())).thenReturn(testProblem);

        ProblemDetailResponseDTO response = problemService.update(1L, problemRequest);

        assertNotNull(response);
        verify(problemRepository).save(any());
    }

    @Test
    void delete_Success() {
        when(problemRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> problemService.delete(1L));
        verify(problemRepository).deleteById(1L);
    }
}
