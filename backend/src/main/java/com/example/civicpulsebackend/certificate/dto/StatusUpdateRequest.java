package com.example.civicpulsebackend.certificate.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusUpdateRequest(
        @NotBlank(message = "Status is required") String status,
        String note,
        String changedBy) {
}
