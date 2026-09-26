package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.model.Project;
import com.vg.portfolio.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // MockBeans needed so the context loads (other controller tests may share context)
    @MockitoBean
    private ProjectService projectService;

    @Test
    void postProject_returns401_whenNoCredentials() throws Exception {
        Project newProject = new Project(null, "Test", "Desc", List.of(), null, null, false, "self-built");

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postProject_returns401_whenWrongCredentials() throws Exception {
        Project newProject = new Project(null, "Test", "Desc", List.of(), null, null, false, "self-built");

        mockMvc.perform(post("/api/projects")
                        .with(httpBasic("wronguser", "wrongpass"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteProject_returns401_whenNoCredentials() throws Exception {
        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjects_returns200_withoutAnyAuth() throws Exception {
        when(projectService.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk());
    }
}