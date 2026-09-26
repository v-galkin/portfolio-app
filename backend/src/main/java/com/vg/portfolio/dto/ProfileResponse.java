package com.vg.portfolio.dto;

import com.vg.portfolio.model.Profile;

/** What the API returns for the profile. */
public record ProfileResponse(
        String name,
        String headline,
        String bio,
        String githubUrl,
        String linkedinUrl,
        String email
) {

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getName(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getEmail()
        );
    }
}
