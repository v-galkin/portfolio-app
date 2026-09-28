package com.vg.portfolio.repository;

import com.vg.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /** The single profile row, seeded by Flyway V3. */
    Optional<Profile> findFirstByOrderByIdAsc();
}
