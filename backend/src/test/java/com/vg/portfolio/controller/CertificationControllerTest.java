package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.model.Certification;
import com.vg.portfolio.service.CertificationService;
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
class CertificationControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CertificationService certificationService;

    private Certification cert1;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        cert1 = new Certification(1L, "AWS Certified Developer", "Amazon",
                "2023-08", "https://aws.amazon.com/verification/cert1");
    }

    @Test
    void getAll_returns200WithCertificationList() throws Exception {
        Certification cert2 = new Certification(2L, "Spring Professional", "VMware",
                "2024-01", "https://vmware.com/verification/cert2");

        when(certificationService.getAll()).thenReturn(List.of(cert1, cert2));

        mockMvc.perform(get("/api/certifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("AWS Certified Developer")));
    }

    @Test
    void getById_returns200WithCertification() throws Exception {
        when(certificationService.getById(1L)).thenReturn(cert1);

        mockMvc.perform(get("/api/certifications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("AWS Certified Developer")))
                .andExpect(jsonPath("$.issuer", is("Amazon")));
    }

    @Test
    void create_returns200AndCreatesCertification_withAdminAuth() throws Exception {
        Certification newCert = new Certification(null, "GCP Associate", "Google",
                "2024-06", "https://google.com/cert3");
        Certification saved = new Certification(3L, "GCP Associate", "Google",
                "2024-06", "https://google.com/cert3");

        when(certificationService.create(any(Certification.class))).thenReturn(saved);

        mockMvc.perform(post("/api/certifications")
                        .with(httpBasic("admin", "admin"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCert)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("GCP Associate")));
    }

    @Test
    void delete_returns204_withAdminAuth() throws Exception {
        doNothing().when(certificationService).delete(1L);

        mockMvc.perform(delete("/api/certifications/1")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isNoContent());
    }
}