package com.vg.portfolio.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Admin session login:
 * - the browser never stores the password
 * - logout (POST /api/auth/logout) is handled in SecurityConfig
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SecurityContextRepository sessionRepository = new HttpSessionSecurityContextRepository();

    /**
     * POST /api/auth/login: logs the admin in.
     * - credentials are already checked by Spring Security and the brute-force filter
     * - stores the login in the session, which sets the JSESSIONID cookie
     */
    @PostMapping("/login")
    public Map<String, String> login(Authentication authentication,
                                     HttpServletRequest request,
                                     HttpServletResponse response) {
        if (request.getSession(false) != null) {
            request.changeSessionId(); // prevent session fixation
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        sessionRepository.saveContext(context, request, response);
        return Map.of("username", authentication.getName());
    }

    /**
     * GET /api/auth/me: who is logged in.
     * - the frontend calls it on every page load to check for an existing session
     * - logged in: 200 with the username
     * - not logged in: 204 with no body, a normal answer rather than a 401 error
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("username", authentication.getName()));
    }
}
