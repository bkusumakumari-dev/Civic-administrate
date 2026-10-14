package com.example.civicpulsebackend.citizen.repository;

import com.example.civicpulsebackend.citizen.entity.GrievanceStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GrievanceStatusHistoryRepository extends JpaRepository<GrievanceStatusHistory, UUID> {
    List<GrievanceStatusHistory> findByGrievanceIdOrderByChangedAtAsc(UUID grievanceId);
}
