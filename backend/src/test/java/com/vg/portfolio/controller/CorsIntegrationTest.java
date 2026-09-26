package com.vg.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// CORS is configured only in SecurityConfig, from cors.allowed.origins
// (http://localhost:3000 in application-test.properties).
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CorsIntegrationTest {

    private static final String ALLOWED = "http://localhost:3000";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void preflight_fromAllowedOrigin_isAccepted() throws Exception {
        mockMvc.perform(options("/api/skills")
                        .header("Origin", ALLOWED)
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", ALLOWED));
    }

    @Test
    void preflight_fromOtherOrigin_isRejected() throws Exception {
        mockMvc.perform(options("/api/skills")
                        .header("Origin", "https://evil.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    // The old CorsConfig hard-coded the Vite dev origin; it must not be allowed
    // unless it's listed in cors.allowed.origins.
    @Test
    void preflight_fromViteDevOrigin_isRejected_whenNotConfigured() throws Exception {
        mockMvc.perform(options("/api/skills")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void get_fromOtherOrigin_isRejected() throws Exception {
        mockMvc.perform(get("/api/skills").header("Origin", "https://evil.example"))
                .andExpect(status().isForbidden());
    }
}
