package com.vg.portfolio.controller;

import com.vg.portfolio.model.Project;
import com.vg.portfolio.service.ProjectService;
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
    public ResponseEntity<List<Project>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Project>> getFeatured() {
        return ResponseEntity.ok(projectService.getFeatured());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Project>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(projectService.getByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.create(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id,
                                          @RequestBody Project project) {
        return ResponseEntity.ok(projectService.update(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}