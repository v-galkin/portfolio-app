package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Education;
import com.vg.portfolio.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository educationRepository;

    public List<Education> getAll() {
        return educationRepository.findAll();
    }

    public Education getById(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));
    }

    public Education create(Education education) {
        return educationRepository.save(education);
    }

    public Education update(Long id, Education updated) {
        Education existing = getById(id);
        existing.setInstitution(updated.getInstitution());
        existing.setDegree(updated.getDegree());
        existing.setField(updated.getField());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setLocation(updated.getLocation());
        return educationRepository.save(existing);
    }

    public void delete(Long id) {
        if (!educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Education not found with id: " + id);
        }
        educationRepository.deleteById(id);
    }
}