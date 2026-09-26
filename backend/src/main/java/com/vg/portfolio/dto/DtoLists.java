package com.vg.portfolio.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class DtoLists {

    private DtoLists() {
    }

    /** Copies an entity's list so responses never expose (or lazily load later) the JPA collection; null becomes []. */
    static List<String> copyOf(List<String> list) {
        return list == null ? List.of() : Collections.unmodifiableList(new ArrayList<>(list));
    }
}
