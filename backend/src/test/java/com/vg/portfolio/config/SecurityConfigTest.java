package com.vg.portfolio.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SecurityConfigTest {

    private SecurityConfig configWith(String username, String password) {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "adminUsername", username);
        ReflectionTestUtils.setField(config, "adminPassword", password);
        return config;
    }

    @Test
    void userDetailsService_createsAdmin_whenCredentialsSet() {
        UserDetailsService service = configWith("admin", "secret").userDetailsService();

        assertThat(service.loadUserByUsername("admin").getAuthorities())
                .extracting(Object::toString)
                .containsExactly("ROLE_ADMIN");
    }

    @Test
    void userDetailsService_fails_whenPasswordEmpty() {
        // What docker-compose passes when ADMIN_PASSWORD is missing from .env
        assertThatThrownBy(() -> configWith("admin", "").userDetailsService())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ADMIN_PASSWORD");
    }

    @Test
    void userDetailsService_fails_whenUsernameBlank() {
        assertThatThrownBy(() -> configWith("   ", "secret").userDetailsService())
                .isInstanceOf(IllegalStateException.class);
    }
}
