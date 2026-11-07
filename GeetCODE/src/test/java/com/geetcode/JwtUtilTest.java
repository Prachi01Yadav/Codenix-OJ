package com.geetcode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.geetcode.security.JwtUtil;

import io.jsonwebtoken.Claims;

public class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    void shouldGenerateAndExtractValidToken() {
        // 1. Print a wristband
        String token = jwtUtil.generateToken("prachi@geetcode.com", "ADMIN");
        assertNotNull(token);

        // 2. Scan the wristband with our UV scanner
        Claims claims = jwtUtil.extractClaims(token);

        // 3. JUnit Inspector checks that the extracted email & role match!
        assertEquals("prachi@geetcode.com", claims.getSubject());
        assertEquals("ADMIN", claims.get("role", String.class));
    }

    @Test
    void shouldRejectTamperedToken() {
        String validToken = jwtUtil.generateToken("user@geetcode.com", "USER");
        // Hacker modifies the end of the wristband signature!
        String tamperedToken = validToken.substring(0, validToken.length() - 2) + "XX";
        // JUnit verifies that extractClaims() throws an exception when tampered!
        assertThrows(Exception.class, () -> jwtUtil.extractClaims(tamperedToken));
    }

    @Test
    void shouldRejectMalformedToken() {
        assertThrows(Exception.class, () -> jwtUtil.extractClaims("fake.wristband.token"));
    }
}
