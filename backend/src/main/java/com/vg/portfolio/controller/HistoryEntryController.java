package com.vg.portfolio.controller;

import com.vg.portfolio.model.HistoryEntry;
import com.vg.portfolio.service.HistoryEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryEntryController {

    private final HistoryEntryService historyEntryService;

    @GetMapping
    public ResponseEntity<List<HistoryEntry>> getAll() {
        return ResponseEntity.ok(historyEntryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoryEntry> getById(@PathVariable Long id) {
        return ResponseEntity.ok(historyEntryService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HistoryEntry> create(@RequestBody HistoryEntry entry) {
        return ResponseEntity.ok(historyEntryService.create(entry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoryEntry> update(@PathVariable Long id,
                                               @RequestBody HistoryEntry entry) {
        return ResponseEntity.ok(historyEntryService.update(id, entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        historyEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
