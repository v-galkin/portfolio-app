package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Skill;
import com.vg.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getAll() {
        return skillRepository.findAllByOrderByIdAsc();
    }

    public Skill getById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
    }

    public Skill create(Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill update(Long id, Skill updated) {
        Skill existing = getById(id);
        existing.setCategory(updated.getCategory());
        existing.setItems(updated.getItems());
        return skillRepository.save(existing);
    }

    public void delete(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
    }
}