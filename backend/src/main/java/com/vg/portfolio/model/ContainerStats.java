package com.vg.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContainerStats {
    private String id;
    private double cpuPercent;
    private long memoryUsage;
    private long memoryLimit;
    private double memoryPercent;
    private long networkIn;
    private long networkOut;
    private int restartCount;
    private String uptime;
    private String ports;
}