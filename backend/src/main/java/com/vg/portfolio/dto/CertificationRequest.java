package com.vg.portfolio.dto;

import com.vg.portfolio.model.Certification;
import jakarta.validation.constraints.NotBlank;

/** Request body for creating or updating a certification. Has no id: clients can't choose or change it. */
public record CertificationRequest(
        @NotBlank String name,
        @NotBlank String issuer,
        String date,
        String credentialUrl
) {

    public Certification toEntity() {
        Certification certification = new Certification();
        certification.setName(name);
        certification.setIssuer(issuer);
        certification.setDate(date);
        certification.setCredentialUrl(credentialUrl);
        return certification;
    }
}
