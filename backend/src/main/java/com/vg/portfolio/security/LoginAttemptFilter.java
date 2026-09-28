package com.vg.portfolio.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Blocks brute-force attempts on the admin login:
 * - only requests with credentials are counted
 * - runs before BasicAuthenticationFilter
 * - registered in SecurityConfig, not a @Component, so it isn't registered twice
 */
public class LoginAttemptFilter extends OncePerRequestFilter {

    private final LoginAttemptService loginAttemptService;

    public LoginAttemptFilter(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        if (request.getHeader(HttpHeaders.AUTHORIZATION) == null) {
            chain.doFilter(request, response);
            return;
        }

        // With server.forward-headers-strategy=native this is the real client IP behind nginx
        String ip = request.getRemoteAddr();

        if (loginAttemptService.isBlocked(ip)) {
            response.setStatus(429);
            response.setHeader(HttpHeaders.RETRY_AFTER,
                    String.valueOf(loginAttemptService.secondsUntilUnblocked(ip)));
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many failed login attempts. Try again later.\"}");
            return;
        }

        chain.doFilter(request, response);

        if (response.getStatus() == HttpServletResponse.SC_UNAUTHORIZED) {
            loginAttemptService.loginFailed(ip);
        } else {
            loginAttemptService.loginSucceeded(ip);
        }
    }
}
