package com.vg.portfolio.controller;

import com.vg.portfolio.dto.HistoryEntryRequest;
import com.vg.portfolio.dto.HistoryEntryResponse;
import com.vg.portfolio.service.HistoryEntryService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<HistoryEntryResponse>> getAll() {
        return ResponseEntity.ok(historyEntryService.getAll().stream().map(HistoryEntryResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoryEntryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(HistoryEntryResponse.from(historyEntryService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<HistoryEntryResponse> create(@Valid @RequestBody HistoryEntryRequest request) {
        return ResponseEntity.ok(HistoryEntryResponse.from(historyEntryService.create(request.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoryEntryResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody HistoryEntryRequest request) {
        return ResponseEntity.ok(HistoryEntryResponse.from(historyEntryService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        historyEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
