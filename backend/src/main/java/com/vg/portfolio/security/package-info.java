/**
 * Brute-force protection for the admin login:
 * - LoginAttemptFilter checks every request that sends credentials
 * - LoginAttemptService counts the failures per IP
 */
package com.vg.portfolio.security;
