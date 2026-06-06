package com.vg.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_tech_stack",
            joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> techStack;

    private String url;
    private String githubUrl;
    private boolean featured;

    @Column(nullable = false)
    private String category; // "ai-assisted" or "self-built"
}