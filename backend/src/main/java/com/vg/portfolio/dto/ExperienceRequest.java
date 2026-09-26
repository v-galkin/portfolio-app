package com.vg.portfolio.dto;

import com.vg.portfolio.model.Experience;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

/** Request body for creating or updating an experience. Has no id: clients can't choose or change it. */
public record ExperienceRequest(
        @NotBlank String company,
        @NotBlank String role,
        @NotBlank String startDate,
        String endDate,
        String location,
        List<String> responsibilities
) {

    public Experience toEntity() {
        Experience experience = new Experience();
        experience.setCompany(company);
        experience.setRole(role);
        experience.setStartDate(startDate);
        experience.setEndDate(endDate);
        experience.setLocation(location);
        experience.setResponsibilities(responsibilities);
        return experience;
    }
}
