package com.vg.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Profile API against a real database:
// - H2 migrated by Flyway, so this also checks the V3 migration and its seed
// - @Transactional rolls back each test
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String VALID = """
            {"name": "New Name", "headline": "New headline", "bio": "New bio",
             "githubUrl": "https://github.com/new", "linkedinUrl": "https://linkedin.com/in/new", "email": "me@example.com"}
            """;

    @Test
    void get_isPublic_andReturnsSeededProfile() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Vitalii Galkin"))
                .andExpect(jsonPath("$.headline").value("Engineer transitioning into Software & Automation"))
                .andExpect(jsonPath("$.githubUrl").value("https://github.com/v-galkin"))
                .andExpect(jsonPath("$.email").doesNotExist());
    }

    @Test
    void update_requiresAdmin() throws Exception {
        mockMvc.perform(put("/api/profile").contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void update_asAdmin_savesAndReturnsProfile() throws Exception {
        mockMvc.perform(put("/api/profile").with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"))
                .andExpect(jsonPath("$.email").value("me@example.com"));

        mockMvc.perform(get("/api/profile"))
                .andExpect(jsonPath("$.name").value("New Name"))
                .andExpect(jsonPath("$.bio").value("New bio"));
    }

    @Test
    void update_withBlankName_returns400() throws Exception {
        mockMvc.perform(put("/api/profile").with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\": \"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.name").exists());
    }

    @Test
    void update_withInvalidEmail_returns400() throws Exception {
        mockMvc.perform(put("/api/profile").with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\": \"X\", \"email\": \"not-an-email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.email").exists());
    }
}
