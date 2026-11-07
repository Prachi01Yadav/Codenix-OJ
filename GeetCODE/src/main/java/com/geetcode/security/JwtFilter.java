
//Will act as the bouncer, give access to the holder of this token,
//WHEN SOMEONE  clicks on submit, run or anything, bascially authorize krega

package com.geetcode.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component 
@RequiredArgsConstructor 
//As its name says: Once Per Request, before any Controller runs, Spring automatically wakes up this Bouncer to inspect the incoming request!
public class JwtFilter extends OncePerRequestFilter { //extends built in bouncer template
    private final JwtUtil jwtUtil;


    @Override 
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse reponse,FilterChain chain) throws ServletException, IOException{


        // 1. Ask the guest: "Show me your Authorization header!"
        String header=request.getHeader("Authorization");

         // 2. Did they bring a header, and does it start with "Bearer "?
         if(header!=null && header.startsWith("Bearer ")){
            // Cut off the first 7 letters ("Bearer ") to get just the raw token!
            String token=header.substring(7);

            // (Next step: we will scan this token here!)

            try{
                 // Step A: Scan the wristband with our UV scanner!
                Claims claims=jwtUtil.extractClaims(token);
                 // Step B: Read the email and role printed on the wristband
                String email=claims.getSubject();
                String role=claims.get("role",String.class);

                 // Step C: Make an official "Verified Guest Badge" for Spring Security
                var auth = new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_" + role)));

                // Step D: Pin the badge into Spring's VIP Guestbook for this request!
                SecurityContextHolder.getContext().setAuthentication(auth);
            }catch (Exception ignored){
                 // If the wristband is fake or expired, extractClaims() throws an error.
                // We catch it and do nothing -> they don't get put in the VIP Guestbook!
            }
         }

         // 3. Wave the request forward into the hallway!
         chain.doFilter(request, reponse);

    }

}
