package com.example.civicpulsebackend.certificate.entity;

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
 * A citizen's application for a government service (e.g. residence certificate).
 * This is a student-project demonstration and is not sent to any real department.
 */
@Entity
@Table(name = "service_application")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Human readable ID generated on the backend, e.g. APP-2026-482913 */
    @Column(unique = true)
    private String trackingId;

    private String serviceType;
    private String applicantName;
    private String email;
    private String phone;
    private String address;

    /** Submitted | Under Review | Approved | Rejected */
    private String status;

    @Column(length = 1000)
    private String remarks;

    /** The citizen who created this application. */
    private UUID ownerId;

    private Instant createdAt;
    private Instant updatedAt;
}
