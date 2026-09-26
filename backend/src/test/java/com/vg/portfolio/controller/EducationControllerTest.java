package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Education;
import com.vg.portfolio.service.EducationService;
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
class EducationControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EducationService educationService;

    private Education education1;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        education1 = new Education(1L, "University of Auckland", "Bachelor of Science",
                "Computer Science", "2018-02", "2021-11", "Auckland, NZ");
    }

    @Test
    void getAll_returns200WithEducationList() throws Exception {
        Education education2 = new Education(2L, "AUT", "Postgraduate Diploma",
                "Software Engineering", "2022-02", "2022-11", "Auckland, NZ");

        when(educationService.getAll()).thenReturn(List.of(education1, education2));

        mockMvc.perform(get("/api/educations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].institution", is("University of Auckland")));
    }

    @Test
    void getById_returns200WithEducation() throws Exception {
        when(educationService.getById(1L)).thenReturn(education1);

        mockMvc.perform(get("/api/educations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.degree", is("Bachelor of Science")))
                .andExpect(jsonPath("$.field", is("Computer Science")));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(educationService.getById(99L)).thenThrow(new ResourceNotFoundException("Education not found: 99"));

        mockMvc.perform(get("/api/educations/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns200AndCreatesEducation_withAdminAuth() throws Exception {
        Education newEd = new Education(null, "MIT", "Master of Science",
                "AI", "2023-09", null, "Remote");
        Education saved = new Education(3L, "MIT", "Master of Science",
                "AI", "2023-09", null, "Remote");

        when(educationService.create(any(Education.class))).thenReturn(saved);

        mockMvc.perform(post("/api/educations")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEd)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.institution", is("MIT")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(educationService).delete(1L);

        mockMvc.perform(delete("/api/educations/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Education not found with id: 99"))
                .when(educationService).delete(99L);

        mockMvc.perform(delete("/api/educations/99")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/educations")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fields").isMap());

        verify(educationService, never()).create(any());
    }

    @Test
    void update_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(put("/api/educations/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(educationService, never()).update(any(), any());
    }
}
