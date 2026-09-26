package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Experience;
import com.vg.portfolio.service.ExperienceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExperienceControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ExperienceService experienceService;

    private Experience experience1;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        experience1 = new Experience(1L, "Acme Corp", "Software Engineer",
                "2022-01", "2024-06", "Auckland, NZ",
                List.of("Built REST APIs", "Led code reviews"));
    }

    @Test
    void getAll_returns200WithExperienceList() throws Exception {
        Experience experience2 = new Experience(2L, "Beta Ltd", "Junior Dev",
                "2020-01", "2021-12", "Remote", List.of("Frontend work"));

        when(experienceService.getAll()).thenReturn(List.of(experience1, experience2));

        mockMvc.perform(get("/api/experiences"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].company", is("Acme Corp")));
    }

    @Test
    void getById_returns200WithExperience() throws Exception {
        when(experienceService.getById(1L)).thenReturn(experience1);

        mockMvc.perform(get("/api/experiences/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.company", is("Acme Corp")))
                .andExpect(jsonPath("$.role", is("Software Engineer")));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(experienceService.getById(99L)).thenThrow(new ResourceNotFoundException("Experience not found: 99"));

        mockMvc.perform(get("/api/experiences/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns200AndCreatesExperience_withAdminAuth() throws Exception {
        Experience newExp = new Experience(null, "New Corp", "Senior Dev",
                "2024-07", null, "Wellington", List.of("Architected systems"));
        Experience saved = new Experience(3L, "New Corp", "Senior Dev",
                "2024-07", null, "Wellington", List.of("Architected systems"));

        when(experienceService.create(any(Experience.class))).thenReturn(saved);

        mockMvc.perform(post("/api/experiences")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newExp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.company", is("New Corp")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(experienceService).delete(1L);

        mockMvc.perform(delete("/api/experiences/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Experience not found with id: 99"))
                .when(experienceService).delete(99L);

        mockMvc.perform(delete("/api/experiences/99")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/experiences")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fields").isMap());

        verify(experienceService, never()).create(any());
    }

    @Test
    void update_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(put("/api/experiences/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(experienceService, never()).update(any(), any());
    }
}
