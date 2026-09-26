package com.vg.portfolio.dto;

import com.vg.portfolio.model.Skill;

import java.util.List;

/** What the API returns for a skill. */
public record SkillResponse(
        Long id,
        String category,
        List<String> items
) {

    public static SkillResponse from(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getCategory(),
                DtoLists.copyOf(skill.getItems())
        );
    }
}
