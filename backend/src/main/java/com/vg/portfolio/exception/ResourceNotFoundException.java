package com.vg.portfolio.exception;

/** Mapped to 404 with a JSON body by GlobalExceptionHandler. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}