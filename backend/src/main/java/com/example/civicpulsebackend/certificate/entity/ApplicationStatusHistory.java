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
 * An immutable record of one application status change, used to build the
 * citizen-facing timeline.
 */
@Entity
@Table(name = "application_status_history")
@Data
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID applicationId;

    @Column(nullable = false)
    private String status;

    @Column(length = 1000)
    private String note;

    private String changedBy;

    private Instant changedAt;
}
