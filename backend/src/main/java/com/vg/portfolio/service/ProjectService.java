package com.vg.portfolio.service;

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
        return projectRepository.findAll();
    }

    public List<Project> getByCategory(String category) {
        return projectRepository.findByCategory(category);
    }

    public List<Project> getFeatured() {
        return projectRepository.findByFeaturedTrue();
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
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
        projectRepository.deleteById(id);
    }
}