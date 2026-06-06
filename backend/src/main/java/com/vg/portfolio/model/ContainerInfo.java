package com.vg.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContainerInfo {
    private String id;
    private String shortId;
    private String name;
    private String image;
    private String status;
    private String state;

    public boolean isRunning() {
        return "running".equalsIgnoreCase(state);
    }
}