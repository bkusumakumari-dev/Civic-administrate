package com.example.civicpulsebackend.user.dto;

public record ProfileUpdateRequest(
        String fullName,
        String email,
        String phone,
        String preferredLanguage) {
}
