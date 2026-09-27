package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Experience;
import com.vg.portfolio.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExperienceServiceTest {

    @Mock
    private ExperienceRepository experienceRepository;

    @InjectMocks
    private ExperienceService experienceService;

    private Experience experience1;
    private Experience experience2;

    @BeforeEach
    void setUp() {
        experience1 = new Experience(1L, "Acme Corp", "Senior Developer",
                "2022-01", "2024-06", "Auckland, NZ",
                List.of("Built REST APIs", "Led team of 4"));

        experience2 = new Experience(2L, "Startup Ltd", "Junior Developer",
                "2020-03", "2021-12", "Remote",
                List.of("Maintained legacy code"));
    }

    @Test
    void getAll_returnsAllExperiences() {
        when(experienceRepository.findAll()).thenReturn(List.of(experience1, experience2));

        List<Experience> result = experienceService.getAll();

        assertThat(result).hasSize(2).containsExactly(experience1, experience2);
        verify(experienceRepository).findAll();
    }

    @Test
    void getById_returnsExperience_whenExists() {
        when(experienceRepository.findById(1L)).thenReturn(Optional.of(experience1));

        Experience result = experienceService.getById(1L);

        assertThat(result).isEqualTo(experience1);
        verify(experienceRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(experienceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> experienceService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(experienceRepository).findById(99L);
    }

    @Test
    void create_savesAndReturnsExperience() {
        Experience newExperience = new Experience(null, "New Co", "Engineer",
                "2025-01", null, "Wellington, NZ", List.of("Designed systems"));
        Experience saved = new Experience(3L, "New Co", "Engineer",
                "2025-01", null, "Wellington, NZ", List.of("Designed systems"));

        when(experienceRepository.save(newExperience)).thenReturn(saved);

        Experience result = experienceService.create(newExperience);

        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getCompany()).isEqualTo("New Co");
        verify(experienceRepository).save(newExperience);
    }

    @Test
    void update_updatesFields_andReturns() {
        Experience updated = new Experience(null, "Updated Co", "Lead Engineer",
                "2023-06", "2025-01", "Christchurch, NZ",
                List.of("Architected platform", "Mentored juniors"));

        Experience savedResult = new Experience(1L, "Updated Co", "Lead Engineer",
                "2023-06", "2025-01", "Christchurch, NZ",
                List.of("Architected platform", "Mentored juniors"));

        when(experienceRepository.findById(1L)).thenReturn(Optional.of(experience1));
        when(experienceRepository.save(any(Experience.class))).thenReturn(savedResult);

        Experience result = experienceService.update(1L, updated);

        assertThat(result.getCompany()).isEqualTo("Updated Co");
        assertThat(result.getRole()).isEqualTo("Lead Engineer");
        assertThat(result.getStartDate()).isEqualTo("2023-06");
        assertThat(result.getEndDate()).isEqualTo("2025-01");
        assertThat(result.getLocation()).isEqualTo("Christchurch, NZ");
        assertThat(result.getResponsibilities()).containsExactly("Architected platform", "Mentored juniors");
        verify(experienceRepository).findById(1L);
        verify(experienceRepository).save(any(Experience.class));
    }

    @Test
    void delete_callsRepository_whenExists() {
        when(experienceRepository.existsById(1L)).thenReturn(true);

        experienceService.delete(1L);

        verify(experienceRepository).deleteById(1L);
    }

    @Test
    void delete_throwsException_whenNotFound() {
        when(experienceRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> experienceService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(experienceRepository, never()).deleteById(any());
    }
}
