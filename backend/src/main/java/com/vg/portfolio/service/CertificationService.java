package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Certification;
import com.vg.portfolio.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public List<Certification> getAll() {
        return certificationRepository.findAll();
    }

    public Certification getById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + id));
    }

    public Certification create(Certification certification) {
        return certificationRepository.save(certification);
    }

    public Certification update(Long id, Certification updated) {
        Certification existing = getById(id);
        existing.setName(updated.getName());
        existing.setIssuer(updated.getIssuer());
        existing.setDate(updated.getDate());
        existing.setCredentialUrl(updated.getCredentialUrl());
        return certificationRepository.save(existing);
    }

    public void delete(Long id) {
        certificationRepository.deleteById(id);
    }
}