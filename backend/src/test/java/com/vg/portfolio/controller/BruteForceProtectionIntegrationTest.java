package com.vg.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Each test uses its own client IP so the shared in-memory counters don't interfere.
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "security.login.max-attempts=3")
class BruteForceProtectionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static RequestPostProcessor from(String ip) {
        return request -> {
            request.setRemoteAddr(ip);
            return request;
        };
    }

    private void failLogin(String ip, int times) throws Exception {
        for (int i = 0; i < times; i++) {
            mockMvc.perform(get("/api/skills").with(from(ip)).with(httpBasic("admin", "wrong")))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Test
    void blocksIp_afterTooManyFailedLogins() throws Exception {
        failLogin("10.0.0.1", 3);

        mockMvc.perform(get("/api/skills").with(from("10.0.0.1")).with(httpBasic("admin", "wrong")))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(jsonPath("$.error").value("Too many failed login attempts. Try again later."));
    }

    @Test
    void blockedIp_isRejected_evenWithCorrectPassword() throws Exception {
        failLogin("10.0.0.2", 3);

        mockMvc.perform(get("/api/skills").with(from("10.0.0.2")).with(httpBasic("admin", "admin")))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void blockedIp_canStillBrowseWithoutCredentials() throws Exception {
        failLogin("10.0.0.3", 3);

        mockMvc.perform(get("/api/skills").with(from("10.0.0.3")))
                .andExpect(status().isOk());
    }

    @Test
    void otherIps_areNotBlocked() throws Exception {
        failLogin("10.0.0.4", 3);

        mockMvc.perform(get("/api/skills").with(from("10.0.0.5")).with(httpBasic("admin", "admin")))
                .andExpect(status().isOk());
    }

    @Test
    void successfulLogin_resetsCounter() throws Exception {
        failLogin("10.0.0.6", 2);
        mockMvc.perform(get("/api/skills").with(from("10.0.0.6")).with(httpBasic("admin", "admin")))
                .andExpect(status().isOk());

        failLogin("10.0.0.6", 2);

        mockMvc.perform(get("/api/skills").with(from("10.0.0.6")).with(httpBasic("admin", "admin")))
                .andExpect(status().isOk());
    }
}
