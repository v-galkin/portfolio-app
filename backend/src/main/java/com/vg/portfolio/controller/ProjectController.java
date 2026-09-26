package com.vg.portfolio.controller;

import com.vg.portfolio.dto.ProjectRequest;
import com.vg.portfolio.dto.ProjectResponse;
import com.vg.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll() {
        return ResponseEntity.ok(projectService.getAll().stream().map(ProjectResponse::from).toList());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProjectResponse>> getFeatured() {
        return ResponseEntity.ok(projectService.getFeatured().stream().map(ProjectResponse::from).toList());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProjectResponse>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(projectService.getByCategory(category).stream().map(ProjectResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ProjectResponse.from(projectService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ProjectResponse.from(projectService.create(request.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id,
                                          @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ProjectResponse.from(projectService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}