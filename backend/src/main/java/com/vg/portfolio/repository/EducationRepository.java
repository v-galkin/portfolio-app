package com.vg.portfolio.repository;

import com.vg.portfolio.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
}