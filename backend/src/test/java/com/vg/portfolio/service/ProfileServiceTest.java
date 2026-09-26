package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Profile;
import com.vg.portfolio.repository.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    private Profile profile() {
        return new Profile(1L, "Old Name", "Old headline", "Old bio", "https://github.com/old", "https://linkedin.com/in/old", null);
    }

    @Test
    void get_returnsTheProfile() {
        Profile p = profile();
        when(profileRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(p));

        assertThat(profileService.get()).isSameAs(p);
    }

    @Test
    void get_throwsNotFound_whenMissing() {
        when(profileRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.get()).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_copiesAllFields_andKeepsId() {
        Profile existing = profile();
        when(profileRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(existing));
        when(profileRepository.save(existing)).thenReturn(existing);

        Profile updated = new Profile(99L, "New Name", "New headline", "New bio", "https://github.com/new", "https://linkedin.com/in/new", "me@example.com");
        Profile result = profileService.update(updated);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("New Name");
        assertThat(result.getHeadline()).isEqualTo("New headline");
        assertThat(result.getBio()).isEqualTo("New bio");
        assertThat(result.getGithubUrl()).isEqualTo("https://github.com/new");
        assertThat(result.getLinkedinUrl()).isEqualTo("https://linkedin.com/in/new");
        assertThat(result.getEmail()).isEqualTo("me@example.com");
        verify(profileRepository).save(existing);
    }
}
