package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Project;
import com.vg.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAll() {
        return projectRepository.findAllByOrderByIdAsc();
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project create(Project project) {
        return projectRepository.save(project);
    }

    public Project update(Long id, Project updated) {
        Project existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setTechStack(updated.getTechStack());
        existing.setUrl(updated.getUrl());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setFeatured(updated.isFeatured());
        existing.setCategory(updated.getCategory());
        return projectRepository.save(existing);
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
}