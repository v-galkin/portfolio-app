package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Project;
import com.vg.portfolio.repository.ProjectRepository;
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
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        project1 = new Project(1L, "Project Alpha", "A cool AI project",
                List.of("Java", "Spring"), "https://alpha.com", "https://github.com/alpha",
                true, "ai-assisted");

        project2 = new Project(2L, "Project Beta", "A self-built project",
                List.of("React", "Node"), "https://beta.com", "https://github.com/beta",
                false, "self-built");
    }

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    @Test
    void getAll_returnsAllProjects() {
        when(projectRepository.findAll()).thenReturn(List.of(project1, project2));

        List<Project> result = projectService.getAll();

        assertThat(result).hasSize(2).containsExactly(project1, project2);
        verify(projectRepository).findAll();
    }

    // -------------------------------------------------------------------------
    // getById
    // -------------------------------------------------------------------------

    @Test
    void getById_returnsProject_whenExists() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project1));

        Project result = projectService.getById(1L);

        assertThat(result).isEqualTo(project1);
        verify(projectRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(projectRepository).findById(99L);
    }

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------

    @Test
    void create_savesAndReturnsProject() {
        Project newProject = new Project(null, "New Project", "Description",
                List.of("Kotlin"), null, null, false, "self-built");
        Project saved = new Project(3L, "New Project", "Description",
                List.of("Kotlin"), null, null, false, "self-built");

        when(projectRepository.save(newProject)).thenReturn(saved);

        Project result = projectService.create(newProject);

        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getName()).isEqualTo("New Project");
        verify(projectRepository).save(newProject);
    }

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------

    @Test
    void update_updatesAllFields_andReturns() {
        Project updated = new Project(null, "Updated Name", "Updated Desc",
                List.of("Go"), "https://new.com", "https://github.com/new",
                true, "ai-assisted");

        Project savedResult = new Project(1L, "Updated Name", "Updated Desc",
                List.of("Go"), "https://new.com", "https://github.com/new",
                true, "ai-assisted");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project1));
        when(projectRepository.save(any(Project.class))).thenReturn(savedResult);

        Project result = projectService.update(1L, updated);

        assertThat(result.getName()).isEqualTo("Updated Name");
        assertThat(result.getDescription()).isEqualTo("Updated Desc");
        assertThat(result.getTechStack()).containsExactly("Go");
        assertThat(result.getUrl()).isEqualTo("https://new.com");
        assertThat(result.getGithubUrl()).isEqualTo("https://github.com/new");
        assertThat(result.isFeatured()).isTrue();
        assertThat(result.getCategory()).isEqualTo("ai-assisted");
        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
    }

    // -------------------------------------------------------------------------
    // delete
    // -------------------------------------------------------------------------

    @Test
    void delete_callsRepository_whenExists() {
        when(projectRepository.existsById(1L)).thenReturn(true);

        projectService.delete(1L);

        verify(projectRepository).deleteById(1L);
    }

    @Test
    void delete_throwsException_whenNotFound() {
        when(projectRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> projectService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(projectRepository, never()).deleteById(any());
    }
}