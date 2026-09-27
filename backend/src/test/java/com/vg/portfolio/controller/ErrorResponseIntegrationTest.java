package com.vg.portfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

// Runs a real server: MockMvc skips the servlet container's error handling
// (the forward to /error), so it can't catch problems there.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ErrorResponseIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getMissingItem_returns404_withoutCredentials() throws Exception {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/skills/999", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(json(response).path("error").asText()).isEqualTo("Skill not found with id: 999");
    }

    @Test
    void deleteMissingItem_returns404_withAdminAuth() throws Exception {
        ResponseEntity<String> response = restTemplate
                .withBasicAuth("admin", "admin")
                .exchange("/api/skills/999", HttpMethod.DELETE, null, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(json(response).path("error").asText()).contains("999");
    }

    @Test
    void createWithMissingRequiredField_returns400_withFieldErrors() throws Exception {
        ResponseEntity<String> response = postSkillAsAdmin("{\"items\": [\"Java\"]}");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        JsonNode body = json(response);
        assertThat(body.path("error").asText()).isEqualTo("Validation failed");
        assertThat(body.path("fields").has("category")).isTrue();
    }

    @Test
    void createWithMalformedJson_returns400() throws Exception {
        ResponseEntity<String> response = postSkillAsAdmin("{not json");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(json(response).path("error").asText()).isNotBlank();
    }

    @Test
    void unknownApiPath_returns404_withJsonError() throws Exception {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/does-not-exist", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(json(response).path("error").asText()).isNotBlank();
    }

    // /error must be reachable without credentials,
    // otherwise errors that reach it are turned into 401 for anonymous callers.
    @Test
    void errorEndpoint_isNotBlockedBySecurity() {
        ResponseEntity<String> response = restTemplate.getForEntity("/error", String.class);

        assertThat(response.getStatusCode()).isNotEqualTo(HttpStatus.UNAUTHORIZED);
    }

    // Real server, so this checks the actual Set-Cookie header Tomcat sends
    @Test
    void login_setsHttpOnlySameSiteStrictSessionCookie() {
        ResponseEntity<String> response = restTemplate
                .withBasicAuth("admin", "admin")
                .postForEntity("/api/auth/login", null, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        String cookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertThat(cookie)
                .startsWith("JSESSIONID=")
                .contains("HttpOnly")
                .contains("SameSite=Strict");
    }

    @Test
    void publicRequests_doNotCreateSessions() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/skills", String.class);

        assertThat(response.getHeaders().get(HttpHeaders.SET_COOKIE)).isNull();
    }

    @Test
    void basicAuthRequests_doNotCreateSessions() {
        ResponseEntity<String> response = restTemplate
                .withBasicAuth("admin", "admin")
                .getForEntity("/api/skills", String.class);

        assertThat(response.getHeaders().get(HttpHeaders.SET_COOKIE)).isNull();
    }

    @Test
    void rejectedRequests_doNotCreateSessions() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/skills", new HttpEntity<>("{\"category\": \"x\"}", headers), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getHeaders().get(HttpHeaders.SET_COOKIE)).isNull();
    }

    private ResponseEntity<String> postSkillAsAdmin(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate
                .withBasicAuth("admin", "admin")
                .postForEntity("/api/skills", new HttpEntity<>(body, headers), String.class);
    }

    private JsonNode json(ResponseEntity<String> response) throws Exception {
        return objectMapper.readTree(response.getBody());
    }
}
