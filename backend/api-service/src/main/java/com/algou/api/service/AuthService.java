package com.algou.api.service;

import com.algou.api.dto.AuthResponse;
import com.algou.api.dto.LoginRequest;
import com.algou.api.dto.RegisterRequest;
import com.algou.api.dto.UserResponse;
import com.algou.api.entity.Role;
import com.algou.api.entity.User;
import com.algou.api.exception.DuplicateEmailException;
import com.algou.api.exception.InvalidCredentialsException;
import com.algou.api.exception.ResourceNotFoundException;
import com.algou.api.repository.SubmissionRepository;
import com.algou.api.repository.UserRepository;
import com.algou.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use");
        }

        String handle = request.getHandle();
        if (handle == null || handle.isBlank()) {
            handle = request.getEmail().split("@")[0];
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .handle(handle)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, mapToUserResponse(user));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        long solvedCount = submissionRepository.countDistinctSolvedByUserId(user.getId());
        long submissionCount = submissionRepository.countTotalByUserId(user.getId());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .handle(user.getHandle())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .rating(user.getRating())
                .maxRating(user.getMaxRating())
                .rank(user.getRank())
                .solvedCount(solvedCount)
                .submissionCount(submissionCount)
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
