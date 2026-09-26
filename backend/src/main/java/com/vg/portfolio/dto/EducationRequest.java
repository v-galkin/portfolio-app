package com.vg.portfolio.dto;

import com.vg.portfolio.model.Education;
import jakarta.validation.constraints.NotBlank;

/** Request body for creating or updating an education. Has no id: clients can't choose or change it. */
public record EducationRequest(
        @NotBlank String institution,
        @NotBlank String degree,
        @NotBlank String field,
        String startDate,
        String endDate,
        String location
) {

    public Education toEntity() {
        Education education = new Education();
        education.setInstitution(institution);
        education.setDegree(degree);
        education.setField(field);
        education.setStartDate(startDate);
        education.setEndDate(endDate);
        education.setLocation(location);
        return education;
    }
}
