package com.algou.api.config;

import com.algou.api.entity.Role;
import com.algou.api.entity.User;
import com.algou.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds demo and admin users on startup using Spring's PasswordEncoder
 * so the BCrypt hash is always correct.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        // Demo user: demo@algou.dev / demo123
        userRepository.findByEmail("demo@algou.dev").ifPresentOrElse(
                user -> {
                    user.setPasswordHash(passwordEncoder.encode("demo123"));
                    userRepository.save(user);
                    log.info("✅ Updated demo account password: demo@algou.dev / demo123");
                },
                () -> {
                    User demo = User.builder()
                            .name("Demo User")
                            .email("demo@algou.dev")
                            .handle("demo_user")
                            .passwordHash(passwordEncoder.encode("demo123"))
                            .role(Role.USER)
                            .rating(1200)
                            .maxRating(1200)
                            .build();
                    userRepository.save(demo);
                    log.info("✅ Created demo account: demo@algou.dev / demo123");
                }
        );

        // Admin user: admin@algou.dev / admin123
        userRepository.findByEmail("admin@algou.dev").ifPresentOrElse(
                user -> {
                    user.setPasswordHash(passwordEncoder.encode("admin123"));
                    userRepository.save(user);
                    log.info("✅ Updated admin account password: admin@algou.dev / admin123");
                },
                () -> {
                    User admin = User.builder()
                            .name("Admin")
                            .email("admin@algou.dev")
                            .handle("admin")
                            .passwordHash(passwordEncoder.encode("admin123"))
                            .role(Role.ADMIN)
                            .rating(2500)
                            .maxRating(2500)
                            .build();
                    userRepository.save(admin);
                    log.info("✅ Created admin account: admin@algou.dev / admin123");
                }
        );
    }
}
