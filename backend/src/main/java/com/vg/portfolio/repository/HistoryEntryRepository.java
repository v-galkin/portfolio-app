package com.vg.portfolio.repository;

import com.vg.portfolio.model.HistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryEntryRepository extends JpaRepository<HistoryEntry, Long> {
    List<HistoryEntry> findAllByOrderByDateDesc();
}
