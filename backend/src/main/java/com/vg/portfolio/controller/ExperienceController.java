package com.vg.portfolio.controller;

import com.vg.portfolio.model.Experience;
import com.vg.portfolio.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<List<Experience>> getAll() {
        return ResponseEntity.ok(experienceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getById(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Experience> create(@RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.create(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> update(@PathVariable Long id,
                                             @RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.update(id, experience));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}