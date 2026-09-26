package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.Profile;
import com.vg.portfolio.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile get() {
        return profileRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    public Profile update(Profile updated) {
        Profile existing = get();
        existing.setName(updated.getName());
        existing.setHeadline(updated.getHeadline());
        existing.setBio(updated.getBio());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setLinkedinUrl(updated.getLinkedinUrl());
        existing.setEmail(updated.getEmail());
        return profileRepository.save(existing);
    }
}
