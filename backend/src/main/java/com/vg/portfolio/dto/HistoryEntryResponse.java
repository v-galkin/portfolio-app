package com.vg.portfolio.dto;

import com.vg.portfolio.model.HistoryEntry;

public record HistoryEntryResponse(
        Long id,
        String date,
        String title,
        String description,
        String category
) {

    public static HistoryEntryResponse from(HistoryEntry historyEntry) {
        return new HistoryEntryResponse(
                historyEntry.getId(),
                historyEntry.getDate(),
                historyEntry.getTitle(),
                historyEntry.getDescription(),
                historyEntry.getCategory()
        );
    }
}
