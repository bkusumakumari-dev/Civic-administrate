package com.example.civicpulsebackend.certificate.repository;

import com.example.civicpulsebackend.certificate.entity.ApplicationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, UUID> {
    List<ApplicationStatusHistory> findByApplicationIdOrderByChangedAtAsc(UUID applicationId);
}
