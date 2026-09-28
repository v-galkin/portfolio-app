/**
 * REST controllers: the HTTP layer of the API.
 *
 * Resource controllers, one per resource, all at /api/{resource}:
 * - Project, Experience, Education, Skill, Certification, HistoryEntry
 * - GET /api/{resource} and GET /api/{resource}/{id} are public
 * - POST, PUT and DELETE are admin only, see SecurityConfig
 *
 * Special controllers:
 * - ProfileController: the single profile row, GET and PUT only, no id
 * - AuthController: admin login and "who is logged in"
 *
 * Conventions:
 * - requests are *Request DTOs, validated with @Valid; responses are *Response DTOs
 * - no logic here: controllers call the service and convert the result
 * - errors are thrown as exceptions and turned into JSON by GlobalExceptionHandler
 */
package com.vg.portfolio.controller;
