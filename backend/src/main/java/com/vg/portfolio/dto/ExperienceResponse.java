package com.vg.portfolio.dto;

import com.vg.portfolio.model.Experience;

import java.util.List;

public record ExperienceResponse(
        Long id,
        String company,
        String role,
        String startDate,
        String endDate,
        String location,
        List<String> responsibilities
) {

    public static ExperienceResponse from(Experience experience) {
        return new ExperienceResponse(
                experience.getId(),
                experience.getCompany(),
                experience.getRole(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.getLocation(),
                DtoLists.copyOf(experience.getResponsibilities())
        );
    }
}
