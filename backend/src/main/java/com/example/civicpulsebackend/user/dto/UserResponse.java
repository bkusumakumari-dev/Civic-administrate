package com.example.civicpulsebackend.user.dto;

public record UserResponse(
        String id,
        String username,
        String role,
        String fullName,
        String email,
        String phone,
        String preferredLanguage) {
}
