package com.geetcode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.geetcode.controller.UserController.AuthResponse;
import com.geetcode.controller.UserController.LoginRequest;
import com.geetcode.controller.UserController.RegisterRequest;
import com.geetcode.entity.User;
import com.geetcode.repository.UserRepository;
import com.geetcode.security.JwtUtil;
import com.geetcode.service.UserService;

@ExtendWith(MockitoExtension.class) // Turns on the Mockito Hologram Projector for JUnit 5!
class UserServiceTest {

    @Mock private UserRepository userRepo; // Fake DB Clerk
    @Mock private JwtUtil jwt;             // Fake Wristband Printer
    @Mock private PasswordEncoder encoder; // Fake Smoothie Blender

    @InjectMocks private UserService userService; // REAL UserService with the 3 fakes injected!

    @Test
    void registerShouldHashPasswordAndReturnToken() {
        // 1. Script the stunt doubles:
        when(userRepo.existsByEmail("prachi@geetcode.com")).thenReturn(false);
        when(encoder.encode("secret123")).thenReturn("hashed-smoothie");
        when(jwt.generateToken("prachi@geetcode.com", "USER")).thenReturn("real-jwt-token");

        // 2. Call the REAL UserService.register()
        AuthResponse res = userService.register(new RegisterRequest("Prachi", "prachi@geetcode.com", "secret123"));

        // 3. Verify the results!
        assertEquals("real-jwt-token", res.token());
        assertEquals("Prachi", res.user().getName());
        assertEquals("hashed-smoothie", res.user().getPassword()); // Proves raw password was hashed!
        verify(userRepo).save(any(User.class)); // Proves userRepo.save() was actually called!
    }

    @Test
    void registerShouldThrowWhenEmailAlreadyExists() {
        // Script stunt double: pretend this email is already in PostgreSQL!
        when(userRepo.existsByEmail("taken@geetcode.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () ->
            userService.register(new RegisterRequest("Prachi", "taken@geetcode.com", "secret123"))
        );
    }

    @Test
    void loginShouldSucceedWhenPasswordMatches() {
        User dbUser = new User();
        dbUser.setEmail("prachi@geetcode.com");
        dbUser.setPassword("hashed-smoothie");

        when(userRepo.existsByEmail("prachi@geetcode.com")).thenReturn(true);
        when(userRepo.findByEmail("prachi@geetcode.com")).thenReturn(Optional.of(dbUser));
        when(encoder.matches("secret123", "hashed-smoothie")).thenReturn(true);
        when(jwt.generateToken("prachi@geetcode.com", "USER")).thenReturn("login-jwt-token");

        AuthResponse res = userService.login(new LoginRequest("prachi@geetcode.com", "secret123"));
        assertEquals("login-jwt-token", res.token());
    }

    @Test
    void loginShouldThrowWhenPasswordIsWrong() {
        User dbUser = new User();
        dbUser.setEmail("prachi@geetcode.com");
        dbUser.setPassword("hashed-smoothie");

        when(userRepo.existsByEmail("prachi@geetcode.com")).thenReturn(true);
        when(userRepo.findByEmail("prachi@geetcode.com")).thenReturn(Optional.of(dbUser));
        when(encoder.matches("wrong-pass", "hashed-smoothie")).thenReturn(false);

        assertThrows(RuntimeException.class, () ->
            userService.login(new LoginRequest("prachi@geetcode.com", "wrong-pass"))
        );
    }
}