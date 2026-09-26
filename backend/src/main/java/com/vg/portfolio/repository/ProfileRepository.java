package com.vg.portfolio.repository;

import com.vg.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /** The single profile row (seeded by Flyway V3). */
    Optional<Profile> findFirstByOrderByIdAsc();
}
