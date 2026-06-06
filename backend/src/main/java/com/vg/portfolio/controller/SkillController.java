package com.vg.portfolio.controller;

import com.vg.portfolio.model.Skill;
import com.vg.portfolio.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<Skill>> getAll() {
        return ResponseEntity.ok(skillService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getById(@PathVariable Long id) {
        return ResponseEntity.ok(skillService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Skill> create(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.create(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(@PathVariable Long id,
                                        @RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.update(id, skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        skillService.delete(id);
        return ResponseEntity.noContent().build();
    }
}