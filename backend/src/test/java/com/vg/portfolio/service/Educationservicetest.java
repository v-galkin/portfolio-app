package com.vg.portfolio.service;

import com.vg.portfolio.model.Education;
import com.vg.portfolio.repository.EducationRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EducationServiceTest {

    @Mock
    private EducationRepository educationRepository;

    @InjectMocks
    private EducationService educationService;

    private Education education1;
    private Education education2;

    @BeforeEach
    void setUp() {
        education1 = new Education(1L, "University of Auckland", "Bachelor of Science",
                "Computer Science", "2016-02", "2019-11", "Auckland, NZ");

        education2 = new Education(2L, "MIT Online", "Certificate",
                "Machine Learning", "2021-01", "2021-06", "Online");
    }

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    @Test
    void getAll_returnsAllEducations() {
        when(educationRepository.findAll()).thenReturn(List.of(education1, education2));

        List<Education> result = educationService.getAll();

        assertThat(result).hasSize(2).containsExactly(education1, education2);
        verify(educationRepository).findAll();
    }

    // -------------------------------------------------------------------------
    // getById
    // -------------------------------------------------------------------------

    @Test
    void getById_returnsEducation_whenExists() {
        when(educationRepository.findById(1L)).thenReturn(Optional.of(education1));

        Education result = educationService.getById(1L);

        assertThat(result).isEqualTo(education1);
        verify(educationRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(educationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> educationService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(educationRepository).findById(99L);
    }

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------

    @Test
    void create_savesAndReturnsEducation() {
        Education newEducation = new Education(null, "Victoria University", "Master of IT",
                "Software Engineering", "2023-02", "2025-11", "Wellington, NZ");
        Education saved = new Education(3L, "Victoria University", "Master of IT",
                "Software Engineering", "2023-02", "2025-11", "Wellington, NZ");

        when(educationRepository.save(newEducation)).thenReturn(saved);

        Education result = educationService.create(newEducation);

        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getInstitution()).isEqualTo("Victoria University");
        verify(educationRepository).save(newEducation);
    }
}