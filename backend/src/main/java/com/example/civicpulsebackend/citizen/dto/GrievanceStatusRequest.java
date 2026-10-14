package com.example.civicpulsebackend.citizen.dto;

import jakarta.validation.constraints.NotBlank;

public record GrievanceStatusRequest(
        @NotBlank(message = "Status is required") String status,
        String note,
        String changedBy) {
}
