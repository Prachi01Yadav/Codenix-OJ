package com.geetcode.security;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore.SecretKeyEntry;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component 
public class JwtUtil {

   // Must be at least 32 characters (256 bits) for HS256 cryptography!
    private final String SECRET = "geetcode-super-secret-jwt-key-must-be-32-chars-long";
    
    // 24 hours in milliseconds (24 * 60 * 60 * 1000)
    private final long EXPIRATION_MS=86400000L;
    
    // Turns our SECRET text string into a cryptographic stamp key
    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    //Generate jwt token

    public String generateToken(String email,String role){
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+EXPIRATION_MS))
                .signWith(getKey())
                .compact();
                
    }
    /*.signWith(getKey()) — Stamps the secret UV hologram signature using your getKey() method!
     .compact() — Packs all of that into the final "aaaa.bbbb.cccc" String! */


    public Claims extractClaims(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    /* What is Claims (The Return Type)->
Remember when we printed the wristband, we wrote .claim("role", role)? In JWT, the pieces of information 
written on the wristband (email, role, issuedAt, expiration) are called Claims! So when the scanner finishes reading
a wristband, it returns a Claims box (from import io.jsonwebtoken.Claims;) holding all the text that was printed on the wristband: */

/*User clicks Submit and sends their wristband (Header.Payload.Signature).
extractClaims takes the Header + Payload from their wristband, runs the math again using our server's getKey(), and generates a fresh signature.
It compares that fresh signature with the Signature on the user's wristband:
Match? Valid wristband! Hand back the Claims (email + role).
Even 1 letter changed? Signature mismatch! Throws an exception and blocks them at the gate! */


}

