package com.vg.portfolio.controller;

import com.vg.portfolio.dto.CertificationRequest;
import com.vg.portfolio.dto.CertificationResponse;
import com.vg.portfolio.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getAll() {
        return ResponseEntity.ok(certificationService.getAll().stream().map(CertificationResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(CertificationResponse.from(certificationService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<CertificationResponse> create(@Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.ok(CertificationResponse.from(certificationService.create(request.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.ok(CertificationResponse.from(certificationService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}