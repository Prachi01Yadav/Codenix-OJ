/*Think of a Controller as the receptionist of your backend:

The React frontend sends an HTTP request to a URL (like GET /api/auth).
The Controller listens to that URL, asks the Repository for data, and returns 
the result as JSON. */
package com.geetcode.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.geetcode.entity.User;
import com.geetcode.repository.UserRepository;
import com.geetcode.service.UserService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/auth")
@RestController 
@RequiredArgsConstructor 

public class UserController {
    
    private final UserService uService;

    public record RegisterRequest(String name,String email,String password){}

    public record LoginRequest(String email, String password){}

    public record AuthResponse(String token,User user){}

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req){
        return uService.register(req);
    }
    /*@RequestBody = Tells Spring: "Open the sealed JSON envelope (the HTTP Request Body)!" */

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req){
        return uService.login(req);
    }

    @PostMapping("/google")
    public AuthResponse GoogleRequest(@RequestBody RegisterRequest req){
        return uService.GoogleRequest(req);
    }

    
    
}


/*1. Life WITHOUT a JWT (The Annoying Way)
You walk up to the entrance (POST /api/auth/login), pull out your ID & password, and wait while the guard flips through a giant 10,000-page guestbook (PostgreSQL).
He finds your name: "Cool, you're Prachi! Go ahead."
10 seconds later, you walk up to the coding stage (POST /api/submissions/submit).
Because the guard has 5-second memory loss, he stares at you blankly: "Who are you?! Show me your email and password again!"
Imagine if LeetCode made you type your email and password every time you clicked "Run", "Submit", or "Next Problem"!
2. Enter the JWT: The Festival Wristband 🎟️

To fix this, the festival invents Wristbands (JWTs):

At the Entrance (/login or /register): You show your email and password once. The guard checks PostgreSQL once, and then hands you a Wristband (the JWT string) that says:

Email: prachi@geetcode.com Role: USER Valid Until: Tomorrow 8:00 PM

You put the Wristband in your pocket (localStorage in React): Now, every time you click "Run" or "Submit", your browser just flashes that wristband at the guard 
(Authorization: Bearer <wristband>). The guard glances at the wristband and lets you right through — without even opening PostgreSQL! */
