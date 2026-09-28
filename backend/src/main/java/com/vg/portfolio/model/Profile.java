package com.vg.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** The site owner's profile: a single row, shown in About, Contact and the footer. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String githubUrl;
    private String linkedinUrl;
    private String email;
}
