package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.model.Skill;
import com.vg.portfolio.service.SkillService;
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
class SkillControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SkillService skillService;

    private Skill skill1;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        skill1 = new Skill(1L, "Backend", List.of("Java", "Spring Boot", "PostgreSQL"));
    }

    @Test
    void getAll_returns200WithSkillList() throws Exception {
        Skill skill2 = new Skill(2L, "Frontend", List.of("React", "TypeScript"));

        when(skillService.getAll()).thenReturn(List.of(skill1, skill2));

        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].category", is("Backend")))
                .andExpect(jsonPath("$[1].category", is("Frontend")));
    }

    @Test
    void getById_returns200WithSkill() throws Exception {
        when(skillService.getById(1L)).thenReturn(skill1);

        mockMvc.perform(get("/api/skills/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.category", is("Backend")))
                .andExpect(jsonPath("$.items", hasSize(3)));
    }

    @Test
    void create_returns200AndCreatesSkill_withAdminAuth() throws Exception {
        Skill newSkill = new Skill(null, "DevOps", List.of("Docker", "Kubernetes"));
        Skill saved = new Skill(3L, "DevOps", List.of("Docker", "Kubernetes"));

        when(skillService.create(any(Skill.class))).thenReturn(saved);

        mockMvc.perform(post("/api/skills")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSkill)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.category", is("DevOps")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(skillService).delete(1L);

        mockMvc.perform(delete("/api/skills/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }
}