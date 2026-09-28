/**
 * Business logic, one service per resource.
 *
 * Resource services: Project, Experience, Education, Skill, Certification, HistoryEntry
 * - getAll, getById, create, update and delete
 * - getAll returns the order set by the repository, e.g. experiences newest first
 * - an unknown id throws ResourceNotFoundException, returned as 404
 * - update copies the fields onto the stored entity, so the id never changes
 *
 * Special services:
 * - ProfileService: get and update the single profile row, no create or delete
 *
 * Conventions:
 * - services work with entities only; DTOs stay in the controllers
 * - called by the controllers, use the repositories for database access
 */
package com.vg.portfolio.service;
