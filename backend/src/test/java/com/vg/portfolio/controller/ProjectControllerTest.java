package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.model.Project;
import com.vg.portfolio.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
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
import com.vg.portfolio.exception.ResourceNotFoundException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProjectService projectService;

    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        project1 = new Project(1L, "Project Alpha", "A cool AI project",
                List.of("Java", "Spring"), "https://alpha.com", "https://github.com/alpha",
                true, "ai-assisted");

        project2 = new Project(2L, "Project Beta", "A self-built project",
                List.of("React", "Node"), "https://beta.com", "https://github.com/beta",
                false, "self-built");
    }

    @Test
    void getAll_returns200WithProjectList() throws Exception {
        when(projectService.getAll()).thenReturn(List.of(project1, project2));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Project Alpha")))
                .andExpect(jsonPath("$[1].name", is("Project Beta")));
    }

    @Test
    void getById_returns200WithProject() throws Exception {
        when(projectService.getById(1L)).thenReturn(project1);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Project Alpha")));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(projectService.getById(99L)).thenThrow(new ResourceNotFoundException("Project not found: 99"));

        mockMvc.perform(get("/api/projects/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns200AndCreatesProject_withAdminAuth() throws Exception {
        Project newProject = new Project(null, "New Project", "Desc",
                List.of("Kotlin"), null, null, false, "self-built");
        Project saved = new Project(3L, "New Project", "Desc",
                List.of("Kotlin"), null, null, false, "self-built");

        when(projectService.create(any(Project.class))).thenReturn(saved);

        mockMvc.perform(post("/api/projects")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("New Project")));
    }

    @Test
    void update_returns200AndUpdatesProject_withAdminAuth() throws Exception {
        Project updated = new Project(null, "Updated", "Updated Desc",
                List.of("Go"), null, null, true, "ai-assisted");
        Project savedResult = new Project(1L, "Updated", "Updated Desc",
                List.of("Go"), null, null, true, "ai-assisted");

        when(projectService.update(eq(1L), any(Project.class))).thenReturn(savedResult);

        mockMvc.perform(put("/api/projects/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(projectService).delete(1L);

        mockMvc.perform(delete("/api/projects/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Project not found with id: 99"))
                .when(projectService).delete(99L);

        mockMvc.perform(delete("/api/projects/99")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fields").isMap());

        verify(projectService, never()).create(any());
    }

    @Test
    void update_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(put("/api/projects/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(projectService, never()).update(any(), any());
    }

    @Test
    void create_ignoresClientSuppliedId() throws Exception {
        Project saved = new Project(3L, "New", null, List.of(), null, null, false, "self-built");
        when(projectService.create(any(Project.class))).thenReturn(saved);

        mockMvc.perform(post("/api/projects")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\": 999, \"name\": \"New\", \"category\": \"self-built\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)));

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectService).create(captor.capture());
        assertThat(captor.getValue().getId()).isNull();
    }

    @Test
    void create_storesBlankCategoryAsNull() throws Exception {
        Project saved = new Project(4L, "No label", null, List.of(), null, null, false, null);
        when(projectService.create(any(Project.class))).thenReturn(saved);

        mockMvc.perform(post("/api/projects")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"No label\", \"category\": \"  \"}"))
                .andExpect(status().isOk());

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectService).create(captor.capture());
        assertThat(captor.getValue().getCategory()).isNull();
    }

    @Test
    void update_ignoresIdInBody() throws Exception {
        Project saved = new Project(1L, "Updated", null, List.of(), null, null, false, "self-built");
        when(projectService.update(eq(1L), any(Project.class))).thenReturn(saved);

        mockMvc.perform(put("/api/projects/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\": 2, \"name\": \"Updated\", \"category\": \"self-built\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectService).update(eq(1L), captor.capture());
        assertThat(captor.getValue().getId()).isNull();
    }

    @Test
    void getById_returnsEmptyTechStack_whenNullInDatabase() throws Exception {
        Project noTech = new Project(5L, "No tech", null, null, null, null, false, "self-built");
        when(projectService.getById(5L)).thenReturn(noTech);

        mockMvc.perform(get("/api/projects/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.techStack").isArray())
                .andExpect(jsonPath("$.techStack", hasSize(0)));
    }
}
