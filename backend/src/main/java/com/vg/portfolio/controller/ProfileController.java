package com.vg.portfolio.controller;

import com.vg.portfolio.dto.ProfileRequest;
import com.vg.portfolio.dto.ProfileResponse;
import com.vg.portfolio.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> get() {
        return ResponseEntity.ok(ProfileResponse.from(profileService.get()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> update(@Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ProfileResponse.from(profileService.update(request.toEntity())));
    }
}
