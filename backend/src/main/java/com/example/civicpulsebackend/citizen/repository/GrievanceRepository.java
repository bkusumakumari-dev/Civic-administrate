package com.example.civicpulsebackend.citizen.repository;

import com.example.civicpulsebackend.citizen.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GrievanceRepository extends JpaRepository<Grievance, UUID> {
    Optional<Grievance> findByTrackingId(String trackingId);
    boolean existsByTrackingId(String trackingId);
    List<Grievance> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
