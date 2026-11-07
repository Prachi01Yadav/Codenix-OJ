package com.geetcode.service;

import java.security.AuthProvider;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.geetcode.controller.UserController.AuthResponse;
import com.geetcode.controller.UserController.LoginRequest;
import com.geetcode.controller.UserController.RegisterRequest;
import com.geetcode.entity.User;
import com.geetcode.repository.UserRepository;
import com.geetcode.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service  //tells spring that this class holds business logic
@RequiredArgsConstructor //so Spring injects private final UserRepository userRepo; here)




public class UserService {
    private final UserRepository userRepo;
    private final JwtUtil jwt;
    private final PasswordEncoder encoder;

    public AuthResponse register(RegisterRequest req){
        if(userRepo.existsByEmail(req.email())){
            throw new RuntimeException("Email already in user");
        }
        User user=new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(encoder.encode(req.password()));

        userRepo.save(user);
        return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()), user);
    }

    public AuthResponse login(LoginRequest req){
        if(!userRepo.existsByEmail(req.email())){
            throw new RuntimeException("User not registered!");
        }
        User user=userRepo.findByEmail(req.email()).orElseThrow();
        if(encoder.matches(req.password(), user.getPassword())) return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()),user );
        else throw new RuntimeException("Invalid Password");
    }

    public AuthResponse GoogleRequest(RegisterRequest req){
        if(userRepo.existsByEmail(req.email())){
            User user=userRepo.findByEmail(req.email()).orElseThrow();
            return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()), user);
        }
        User user=new User();
        user.setEmail(req.email());
        user.setName(req.name());
        user.setPassword(encoder.encode(req.password() != null ? req.password() : "GOOGLE_OAUTH"));
        userRepo.save(user);
        return new AuthResponse(jwt.generateToken(user.getEmail(), user.getRole()), user);
    }

}
