package com.vg.portfolio.controller;

import com.vg.portfolio.dto.EducationRequest;
import com.vg.portfolio.dto.EducationResponse;
import com.vg.portfolio.service.EducationService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<EducationResponse>> getAll() {
        return ResponseEntity.ok(educationService.getAll().stream().map(EducationResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EducationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(EducationResponse.from(educationService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<EducationResponse> create(@Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(EducationResponse.from(educationService.create(request.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationResponse> update(@PathVariable Long id,
                                            @Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(EducationResponse.from(educationService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        educationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}