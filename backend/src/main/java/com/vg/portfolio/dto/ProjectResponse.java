package com.vg.portfolio.dto;

import com.vg.portfolio.model.Project;

import java.util.List;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        List<String> techStack,
        String url,
        String githubUrl,
        boolean featured,
        String category
) {

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                DtoLists.copyOf(project.getTechStack()),
                project.getUrl(),
                project.getGithubUrl(),
                project.isFeatured(),
                project.getCategory()
        );
    }
}
