package com.vg.portfolio.service;

import com.vg.portfolio.exception.ResourceNotFoundException;
import com.vg.portfolio.model.HistoryEntry;
import com.vg.portfolio.repository.HistoryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryEntryService {

    private final HistoryEntryRepository historyEntryRepository;

    public List<HistoryEntry> getAll() {
        return historyEntryRepository.findAllByOrderByDateDesc();
    }

    public HistoryEntry getById(Long id) {
        return historyEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("History entry not found with id: " + id));
    }

    public HistoryEntry create(HistoryEntry entry) {
        return historyEntryRepository.save(entry);
    }

    public HistoryEntry update(Long id, HistoryEntry updated) {
        HistoryEntry existing = getById(id);
        existing.setDate(updated.getDate());
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        return historyEntryRepository.save(existing);
    }

    public void delete(Long id) {
        if (!historyEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("History entry not found with id: " + id);
        }
        historyEntryRepository.deleteById(id);
    }
}
