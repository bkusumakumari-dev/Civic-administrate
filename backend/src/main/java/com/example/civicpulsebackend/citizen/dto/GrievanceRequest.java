package com.example.civicpulsebackend.citizen.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record GrievanceRequest(
        @NotBlank(message = "Category is required") String category,
        @NotBlank(message = "Subject is required") String subject,
        @NotBlank(message = "Description is required") String description,
        String relatedTrackingId,
        UUID ownerId) {
}
