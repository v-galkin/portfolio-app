package com.vg.portfolio.repository;

import com.vg.portfolio.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByOrderByStartDateDesc();
}