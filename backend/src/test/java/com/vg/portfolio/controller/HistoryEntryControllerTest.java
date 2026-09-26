package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.HistoryEntry;
import com.vg.portfolio.service.HistoryEntryService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HistoryEntryControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private HistoryEntryService historyEntryService;

    private HistoryEntry entry1;
    private HistoryEntry entry2;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        entry1 = new HistoryEntry(1L, "2024-06", "Launched Portfolio", "Built and deployed portfolio site", "project");
        entry2 = new HistoryEntry(2L, "2023-01", "Started new role", "Joined Acme Corp as Software Engineer", "career");
    }

    @Test
    void getAll_returns200WithEntriesOrderedByDateDesc() throws Exception {
        when(historyEntryService.getAll()).thenReturn(List.of(entry1, entry2));

        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].date", is("2024-06")))
                .andExpect(jsonPath("$[1].date", is("2023-01")));
    }

    @Test
    void getById_returns200WithEntry() throws Exception {
        when(historyEntryService.getById(1L)).thenReturn(entry1);

        mockMvc.perform(get("/api/history/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Launched Portfolio")))
                .andExpect(jsonPath("$.category", is("project")));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(historyEntryService.getById(99L)).thenThrow(new ResourceNotFoundException("HistoryEntry not found: 99"));

        mockMvc.perform(get("/api/history/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns200AndCreatesEntry_withAdminAuth() throws Exception {
        HistoryEntry newEntry = new HistoryEntry(null, "2025-01", "New milestone", "Completed certification", "learning");
        HistoryEntry saved = new HistoryEntry(3L, "2025-01", "New milestone", "Completed certification", "learning");

        when(historyEntryService.create(any(HistoryEntry.class))).thenReturn(saved);

        mockMvc.perform(post("/api/history")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.title", is("New milestone")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(historyEntryService).delete(1L);

        mockMvc.perform(delete("/api/history/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("History entry not found with id: 99"))
                .when(historyEntryService).delete(99L);

        mockMvc.perform(delete("/api/history/99")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/history")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fields").isMap());

        verify(historyEntryService, never()).create(any());
    }

    @Test
    void update_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(put("/api/history/1")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(historyEntryService, never()).update(any(), any());
    }
}
