package com.vg.portfolio.controller;

import com.vg.portfolio.model.Certification;
import com.vg.portfolio.service.CertificationService;
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
    public ResponseEntity<List<Certification>> getAll() {
        return ResponseEntity.ok(certificationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getById(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Certification> create(@RequestBody Certification certification) {
        return ResponseEntity.ok(certificationService.create(certification));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certification> update(@PathVariable Long id,
                                                @RequestBody Certification certification) {
        return ResponseEntity.ok(certificationService.update(id, certification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}