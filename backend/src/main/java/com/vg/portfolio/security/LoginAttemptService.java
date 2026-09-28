package com.vg.portfolio.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Counts failed logins per client IP:
 * - {@code maxAttempts} failures within {@code window} block the IP for the same duration
 * - a successful login resets the count
 * - kept in memory, so it resets on restart
 */
@Component
public class LoginAttemptService {

    // Stop the map growing without bound if many different IPs fail
    private static final int CLEANUP_THRESHOLD = 10_000;

    private final int maxAttempts;
    private final Duration window;
    private final Clock clock;
    private final Map<String, Attempts> attemptsByIp = new ConcurrentHashMap<>();

    @Autowired
    public LoginAttemptService(@Value("${security.login.max-attempts:5}") int maxAttempts,
                               @Value("${security.login.block-minutes:15}") long blockMinutes) {
        this(maxAttempts, Duration.ofMinutes(blockMinutes), Clock.systemUTC());
    }

    LoginAttemptService(int maxAttempts, Duration window, Clock clock) {
        this.maxAttempts = maxAttempts;
        this.window = window;
        this.clock = clock;
    }

    public boolean isBlocked(String ip) {
        Attempts attempts = attemptsByIp.get(ip);
        return attempts != null && attempts.blockedUntil != null
                && clock.instant().isBefore(attempts.blockedUntil);
    }

    /** Seconds until the block ends, for the Retry-After header. */
    public long secondsUntilUnblocked(String ip) {
        Attempts attempts = attemptsByIp.get(ip);
        if (attempts == null || attempts.blockedUntil == null) {
            return 0;
        }
        return Math.max(0, Duration.between(clock.instant(), attempts.blockedUntil).toSeconds());
    }

    public void loginFailed(String ip) {
        Instant now = clock.instant();
        attemptsByIp.compute(ip, (key, attempts) -> {
            if (attempts == null || attempts.isExpired(now, window)) {
                attempts = new Attempts(now);
            }
            attempts.failures++;
            if (attempts.failures >= maxAttempts) {
                attempts.blockedUntil = now.plus(window);
            }
            return attempts;
        });
        if (attemptsByIp.size() > CLEANUP_THRESHOLD) {
            attemptsByIp.values().removeIf(a -> a.isExpired(now, window));
        }
    }

    public void loginSucceeded(String ip) {
        attemptsByIp.remove(ip);
    }

    private static final class Attempts {
        private final Instant firstFailure;
        private int failures;
        private Instant blockedUntil;

        private Attempts(Instant firstFailure) {
            this.firstFailure = firstFailure;
        }

        private boolean isExpired(Instant now, Duration window) {
            Instant end = blockedUntil != null ? blockedUntil : firstFailure.plus(window);
            return !now.isBefore(end);
        }
    }
}
