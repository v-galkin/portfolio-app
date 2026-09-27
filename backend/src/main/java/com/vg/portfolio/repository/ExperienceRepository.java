package com.vg.portfolio.repository;

import com.vg.portfolio.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findAllByOrderByStartDateDesc();
}