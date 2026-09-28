/**
 * Database access with Spring Data JPA.
 *
 * One repository per entity:
 * - standard methods such as findById, save and deleteById come from JpaRepository
 * - no hand-written queries: Spring Data builds them from the method names
 *
 * Display order, used by the services' getAll:
 * - Experience, Education: start date, newest first
 * - Certification, HistoryEntry: date, newest first
 * - Project, Skill: in the order they were added
 *
 * Special repositories:
 * - ProfileRepository: findFirstByOrderByIdAsc returns the single profile row
 */
package com.vg.portfolio.repository;
