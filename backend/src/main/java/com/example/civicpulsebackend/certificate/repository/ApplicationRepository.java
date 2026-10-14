package com.example.civicpulsebackend.certificate.repository;

import com.example.civicpulsebackend.certificate.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    Optional<Application> findByTrackingId(String trackingId);
    boolean existsByTrackingId(String trackingId);
    List<Application> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
