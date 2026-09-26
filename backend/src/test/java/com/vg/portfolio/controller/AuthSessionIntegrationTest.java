package com.vg.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSessionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private MockHttpSession login() throws Exception {
        MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .with(httpBasic("admin", "admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andReturn().getRequest().getSession(false);
        assertThat(session).isNotNull();
        return session;
    }

    @Test
    void login_withWrongPassword_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(httpBasic("admin", "wrong")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_withoutCredentials_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_withoutSession_returns204() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isNoContent());
    }

    @Test
    void me_withSession_returnsUsername() throws Exception {
        MockHttpSession session = login();

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void session_authorizesAdminWrites_withoutPassword() throws Exception {
        MockHttpSession session = login();

        mockMvc.perform(post("/api/skills").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"category\": \"Session test\", \"items\": []}"))
                .andExpect(status().isOk());
    }

    @Test
    void logout_endsSession() throws Exception {
        MockHttpSession session = login();

        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isNoContent());

        assertThat(session.isInvalid()).isTrue();
        mockMvc.perform(get("/api/auth/me").session(new MockHttpSession()))
                .andExpect(status().isNoContent());
    }

    @Test
    void logout_viaGet_isNotAccepted() throws Exception {
        MockHttpSession session = login();

        mockMvc.perform(get("/api/auth/logout").session(session));

        assertThat(session.isInvalid()).isFalse();
    }

    @Test
    void writes_withoutSessionOrCredentials_return401() throws Exception {
        mockMvc.perform(post("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"category\": \"x\", \"items\": []}"))
                .andExpect(status().isUnauthorized());
    }
}
