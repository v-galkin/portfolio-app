package com.vg.portfolio.service;

import com.vg.portfolio.model.HistoryEntry;
import com.vg.portfolio.repository.HistoryEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistoryEntryServiceTest {

    @Mock
    private HistoryEntryRepository historyEntryRepository;

    @InjectMocks
    private HistoryEntryService historyEntryService;

    private HistoryEntry entry1;
    private HistoryEntry entry2;

    @BeforeEach
    void setUp() {
        // entry1 is more recent — should come first when ordered by date desc
        entry1 = new HistoryEntry(1L, "2024-06", "Joined Acme Corp",
                "Started as Senior Developer", "work");

        entry2 = new HistoryEntry(2L, "2022-03", "Completed AWS Certification",
                "Passed the AWS Developer Associate exam", "education");
    }

    // -------------------------------------------------------------------------
    // getAll
    // -------------------------------------------------------------------------

    @Test
    void getAll_returnsEntriesOrderedByDateDesc() {
        // Repository returns already-sorted list (newest first)
        when(historyEntryRepository.findAllByOrderByDateDesc()).thenReturn(List.of(entry1, entry2));

        List<HistoryEntry> result = historyEntryService.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getDate()).isEqualTo("2024-06");
        assertThat(result.get(1).getDate()).isEqualTo("2022-03");
        verify(historyEntryRepository).findAllByOrderByDateDesc();
    }

    // -------------------------------------------------------------------------
    // getById
    // -------------------------------------------------------------------------

    @Test
    void getById_returnsEntry_whenExists() {
        when(historyEntryRepository.findById(1L)).thenReturn(Optional.of(entry1));

        HistoryEntry result = historyEntryService.getById(1L);

        assertThat(result).isEqualTo(entry1);
        assertThat(result.getTitle()).isEqualTo("Joined Acme Corp");
        verify(historyEntryRepository).findById(1L);
    }

    @Test
    void getById_throwsException_whenNotFound() {
        when(historyEntryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> historyEntryService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");

        verify(historyEntryRepository).findById(99L);
    }

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------

    @Test
    void update_updatesAllFields_andReturns() {
        HistoryEntry updated = new HistoryEntry(null, "2024-09", "Promoted to Lead",
                "Took on team leadership responsibilities", "work");

        HistoryEntry savedResult = new HistoryEntry(1L, "2024-09", "Promoted to Lead",
                "Took on team leadership responsibilities", "work");

        when(historyEntryRepository.findById(1L)).thenReturn(Optional.of(entry1));
        when(historyEntryRepository.save(any(HistoryEntry.class))).thenReturn(savedResult);

        HistoryEntry result = historyEntryService.update(1L, updated);

        assertThat(result.getDate()).isEqualTo("2024-09");
        assertThat(result.getTitle()).isEqualTo("Promoted to Lead");
        assertThat(result.getDescription()).isEqualTo("Took on team leadership responsibilities");
        assertThat(result.getCategory()).isEqualTo("work");
        verify(historyEntryRepository).findById(1L);
        verify(historyEntryRepository).save(any(HistoryEntry.class));
    }
}