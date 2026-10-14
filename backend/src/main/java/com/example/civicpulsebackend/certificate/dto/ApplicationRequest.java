package com.example.civicpulsebackend.certificate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ApplicationRequest(
        @NotBlank(message = "Service type is required") String serviceType,
        @NotBlank(message = "Applicant name is required") String applicantName,
        @NotBlank(message = "Email is required") @Email(message = "Enter a valid email") String email,
        @NotBlank(message = "Phone number is required") String phone,
        @NotBlank(message = "Address is required") String address,
        String remarks,
        UUID ownerId) {
}
