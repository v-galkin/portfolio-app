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
 * Session login for the admin panel, so the browser never has to store the password.
 * Logout (POST /api/auth/logout) is handled by Spring Security, see SecurityConfig.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SecurityContextRepository sessionRepository = new HttpSessionSecurityContextRepository();

    /**
     * Called with Basic credentials (checked by Spring Security and the brute-force filter before
     * this runs). Stores the login in the session, which sets the JSESSIONID cookie.
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
     * Who is logged in, used to restore the login after a page refresh. The frontend calls this
     * on every page load, so "not logged in" is a normal 204 rather than a 401 error.
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("username", authentication.getName()));
    }
}
