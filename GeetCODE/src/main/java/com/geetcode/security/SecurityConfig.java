package com.geetcode.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration 
//The Rulebook / Factory Room! When Spring sees @Configuration, it reads this class at startup to configure how the whole server behaves and to build custom @Bean objects for the IoC container!
@RequiredArgsConstructor 
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    // /@BEan tells spring Run this method once at startup, take whatever object it returns (SecurityFilterChain), and store THAT in the IoC container!
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // Rule 1: Turn off cookie-based CSRF protection (because we use JWT headers, not cookies!)
                .csrf(csrf -> csrf.disable())
                // Rule 2: STATELESS! Don't store sessions in server RAM — every request brings its own wristband!
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Rule 3: Which doors are open vs. locked?
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/problems/**").permitAll()
                        .anyRequest().authenticated()
                )
                // Rule 4: Station our Bouncer (jwtFilter) right at the front gate!
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // Rule 5: Build and lock in the rulebook!
                .build();
    }


    //for password, it will generates its hash and when a user types a password at login, it will match that pass hash with one stored in db
    @Bean 
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
