package com.vg.portfolio.controller;

import com.vg.portfolio.model.Education;
import com.vg.portfolio.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/educations")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    public ResponseEntity<List<Education>> getAll() {
        return ResponseEntity.ok(educationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Education> getById(@PathVariable Long id) {
        return ResponseEntity.ok(educationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Education> create(@RequestBody Education education) {
        return ResponseEntity.ok(educationService.create(education));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> update(@PathVariable Long id,
                                            @RequestBody Education education) {
        return ResponseEntity.ok(educationService.update(id, education));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        educationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}