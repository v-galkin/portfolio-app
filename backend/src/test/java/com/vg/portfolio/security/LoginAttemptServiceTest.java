package com.vg.portfolio.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class LoginAttemptServiceTest {

    private static final String IP = "203.0.113.7";

    /** A clock the test can move forward. */
    private static final class MutableClock extends Clock {
        private Instant now = Instant.parse("2026-01-01T00:00:00Z");

        void advance(Duration duration) { now = now.plus(duration); }
        @Override public Instant instant() { return now; }
        @Override public ZoneId getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(ZoneId zone) { return this; }
    }

    private MutableClock clock;
    private LoginAttemptService service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock();
        service = new LoginAttemptService(3, Duration.ofMinutes(15), clock);
    }

    private void fail(int times) {
        for (int i = 0; i < times; i++) {
            service.loginFailed(IP);
        }
    }

    @Test
    void notBlocked_belowLimit() {
        fail(2);

        assertThat(service.isBlocked(IP)).isFalse();
    }

    @Test
    void blocked_atLimit() {
        fail(3);

        assertThat(service.isBlocked(IP)).isTrue();
        assertThat(service.secondsUntilUnblocked(IP)).isEqualTo(15 * 60);
    }

    @Test
    void unblocked_afterBlockExpires() {
        fail(3);

        clock.advance(Duration.ofMinutes(15));

        assertThat(service.isBlocked(IP)).isFalse();
        assertThat(service.secondsUntilUnblocked(IP)).isZero();
    }

    @Test
    void oldFailures_stopCounting_afterWindow() {
        fail(2);
        clock.advance(Duration.ofMinutes(16));

        fail(2);

        assertThat(service.isBlocked(IP)).isFalse();
    }

    @Test
    void success_resetsFailures() {
        fail(2);

        service.loginSucceeded(IP);
        fail(2);

        assertThat(service.isBlocked(IP)).isFalse();
    }

    @Test
    void otherIps_areNotAffected() {
        fail(3);

        assertThat(service.isBlocked("198.51.100.1")).isFalse();
    }
}
