package com.example.civicpulsebackend.citizen.entity;

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
 * A citizen grievance / complaint with a clear resolution workflow.
 */
@Entity
@Table(name = "grievance")
@Data
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Human readable ID generated on the backend, e.g. GRV-2026-374112 */
    @Column(unique = true)
    private String trackingId;

    private String category;
    private String subject;

    @Column(length = 2000)
    private String description;

    /** Optional related application tracking ID, e.g. APP-2026-482913 */
    private String relatedTrackingId;

    /** Submitted | In Progress | Resolved | Rejected */
    private String status;

    @Column(length = 1000)
    private String resolutionNote;

    private UUID ownerId;

    private Instant createdAt;
    private Instant updatedAt;

    /** Deadline used to flag overdue grievances. */
    private Instant dueAt;
}
