package com.vg.portfolio.dto;

import com.vg.portfolio.model.Skill;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

/** Request body for creating or updating a skill. Has no id: clients can't choose or change it. */
public record SkillRequest(
        @NotBlank String category,
        List<String> items
) {

    public Skill toEntity() {
        Skill skill = new Skill();
        skill.setCategory(category);
        skill.setItems(items);
        return skill;
    }
}
