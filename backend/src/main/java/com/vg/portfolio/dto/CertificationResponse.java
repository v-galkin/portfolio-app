package com.vg.portfolio.dto;

import com.vg.portfolio.model.Certification;

/** What the API returns for a certification. */
public record CertificationResponse(
        Long id,
        String name,
        String issuer,
        String date,
        String credentialUrl
) {

    public static CertificationResponse from(Certification certification) {
        return new CertificationResponse(
                certification.getId(),
                certification.getName(),
                certification.getIssuer(),
                certification.getDate(),
                certification.getCredentialUrl()
        );
    }
}
