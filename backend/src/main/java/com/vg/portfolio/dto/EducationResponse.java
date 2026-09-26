package com.vg.portfolio.dto;

import com.vg.portfolio.model.Education;

/** What the API returns for an education. */
public record EducationResponse(
        Long id,
        String institution,
        String degree,
        String field,
        String startDate,
        String endDate,
        String location
) {

    public static EducationResponse from(Education education) {
        return new EducationResponse(
                education.getId(),
                education.getInstitution(),
                education.getDegree(),
                education.getField(),
                education.getStartDate(),
                education.getEndDate(),
                education.getLocation()
        );
    }
}
