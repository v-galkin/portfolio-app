package com.vg.portfolio.service;

import com.vg.portfolio.model.Skill;
import com.vg.portfolio.repository.SkillRepository;
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
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private SkillService skillService;

    private Skill skill1;
    private Skill skill2;

    @BeforeEach
    void setUp() {
        skill1 = new Skill(1L, "Backend", List.of("Java", "Spring Boot", "PostgreSQL"));
        skill2 = new Skill(2L, "Frontend", List.of("React", "TypeScript", "Tailwind"));
    }

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    @Test
    void getAll_returnsAllSkills() {
        when(skillRepository.findAll()).thenReturn(List.of(skill1, skill2));

        List<Skill> result = skillService.getAll();

        assertThat(result).hasSize(2).containsExactly(skill1, skill2);
        verify(skillRepository).findAll();
    }

    // -------------------------------------------------------------------------
    // getById
    // -------------------------------------------------------------------------

    @Test
    void getById_returnsSkill_whenExists() {
        when(skillRepository.findById(1L)).thenReturn(Optional.of(skill1));

        Skill result = skillService.getById(1L);

        assertThat(result).isEqualTo(skill1);
        assertThat(result.getCategory()).isEqualTo("Backend");
        verify(skillRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(skillRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> skillService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(skillRepository).findById(99L);
    }
}