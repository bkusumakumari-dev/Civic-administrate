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
 * One recorded action/status change on a grievance, used for the action history.
 */
@Entity
@Table(name = "grievance_status_history")
@Data
public class GrievanceStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID grievanceId;

    @Column(nullable = false)
    private String status;

    @Column(length = 1000)
    private String note;

    private String changedBy;

    private Instant changedAt;
}
