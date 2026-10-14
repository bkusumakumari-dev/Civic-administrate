package com.example.civicpulsebackend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

/**
 * Application user. Two roles are supported for this student demonstration:
 * ADMIN (government staff) and CANDIDATE (citizen applicant).
 * Passwords are never stored in plain text; see PasswordUtil.
 */
@Entity
@Table(name = "app_user")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    /** ADMIN or CANDIDATE */
    @Column(nullable = false)
    private String role;

    private String fullName;
    private String email;
    private String phone;

    /** Preferred UI language: "en" or "te" */
    private String preferredLanguage;

    private Instant createdAt;
}
