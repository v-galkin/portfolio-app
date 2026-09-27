package com.vg.portfolio.dto;

import com.vg.portfolio.model.HistoryEntry;
import jakarta.validation.constraints.NotBlank;

public record HistoryEntryRequest(
        @NotBlank String date,
        @NotBlank String title,
        String description,
        @NotBlank String category
) {

    public HistoryEntry toEntity() {
        HistoryEntry historyEntry = new HistoryEntry();
        historyEntry.setDate(date);
        historyEntry.setTitle(title);
        historyEntry.setDescription(description);
        historyEntry.setCategory(category);
        return historyEntry;
    }
}
