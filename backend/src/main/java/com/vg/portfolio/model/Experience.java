package com.vg.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String startDate;

    private String endDate;
    private String location;

    @ElementCollection
    @CollectionTable(name = "experience_responsibilities",
            joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "responsibility")
    private List<String> responsibilities;
}