package com.vg.portfolio.controller;

import com.vg.portfolio.model.ContainerInfo;
import com.vg.portfolio.model.ContainerStats;
import com.vg.portfolio.service.DockerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docker")
@RequiredArgsConstructor
public class DockerController {

    private final DockerService dockerService;

    // PUBLIC - running + labelled containers
    @GetMapping("/public")
    public ResponseEntity<List<ContainerInfo>> getPublicContainers() throws Exception {
        return ResponseEntity.ok(dockerService.listPublicContainers());
    }

    // ADMIN - labelled containers only
    @GetMapping("/dashboard")
    public ResponseEntity<List<ContainerInfo>> getDashboardContainers() throws Exception {
        return ResponseEntity.ok(dockerService.listDashboardContainers());
    }

    // ADMIN - all containers
    @GetMapping("/all")
    public ResponseEntity<List<ContainerInfo>> getAllContainers() throws Exception {
        return ResponseEntity.ok(dockerService.listAllContainers());
    }

    @GetMapping("/stats/{id}")
    public ResponseEntity<ContainerStats> getContainerStats(@PathVariable String id) throws Exception {
        return ResponseEntity.ok(dockerService.getContainerStats(id));
    }

    // START A CONTAINER
    @PostMapping("/start/{id}")
    public ResponseEntity<Void> startContainer(@PathVariable String id) throws Exception {
        dockerService.startContainer(id);
        return ResponseEntity.ok().build();
    }

    // STOP A CONTAINER
    @PostMapping("/stop/{id}")
    public ResponseEntity<Void> stopContainer(@PathVariable String id) throws Exception {
        dockerService.stopContainer(id);
        return ResponseEntity.ok().build();
    }
}