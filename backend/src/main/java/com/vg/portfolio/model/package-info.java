/**
 * JPA entities, one per database table.
 *
 * Entities:
 * - Project, Experience, Education, Skill, Certification, HistoryEntry, Profile
 * - Profile has a single row, shown in About, Contact and the footer
 *
 * Schema:
 * - created and changed only by the Flyway migrations in db/migration
 * - Hibernate only validates that the entities match it
 * - list fields are stored in their own tables: project_tech_stack, skill_items,
 *   experience_responsibilities
 *
 * Conventions:
 * - Lombok generates getters, setters and constructors
 * - never returned by the API directly; the controllers convert them to DTOs
 */
package com.vg.portfolio.model;
