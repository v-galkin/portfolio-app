package com.vg.portfolio.dto;

import com.vg.portfolio.model.Profile;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileRequest(
        @NotBlank String name,
        String headline,
        String bio,
        String githubUrl,
        String linkedinUrl,
        @Email String email
) {

    public Profile toEntity() {
        Profile profile = new Profile();
        profile.setName(name);
        profile.setHeadline(headline);
        profile.setBio(bio);
        profile.setGithubUrl(githubUrl);
        profile.setLinkedinUrl(linkedinUrl);
        profile.setEmail(email);
        return profile;
    }
}
