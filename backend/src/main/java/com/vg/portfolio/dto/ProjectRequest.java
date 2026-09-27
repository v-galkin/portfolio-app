package com.vg.portfolio.dto;

import com.vg.portfolio.model.Project;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ProjectRequest(
        @NotBlank String name,
        String description,
        List<String> techStack,
        String url,
        String githubUrl,
        boolean featured,
        @NotBlank String category
) {

    public Project toEntity() {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setTechStack(techStack);
        project.setUrl(url);
        project.setGithubUrl(githubUrl);
        project.setFeatured(featured);
        project.setCategory(category);
        return project;
    }
}
