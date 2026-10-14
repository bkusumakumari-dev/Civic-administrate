package com.example.civicpulsebackend.citizen.service;

import com.example.civicpulsebackend.citizen.dto.GrievanceRequest;
import com.example.civicpulsebackend.citizen.dto.GrievanceStatusRequest;
import com.example.civicpulsebackend.citizen.entity.Grievance;
import com.example.civicpulsebackend.citizen.entity.GrievanceStatusHistory;
import com.example.civicpulsebackend.citizen.repository.GrievanceRepository;
import com.example.civicpulsebackend.citizen.repository.GrievanceStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class GrievanceService {

    public static final String STATUS_SUBMITTED = "Submitted";
    private static final int SLA_DAYS = 5;

    private static final SecureRandom RANDOM = new SecureRandom();

    private final GrievanceRepository grievanceRepository;
    private final GrievanceStatusHistoryRepository historyRepository;

    public GrievanceService(GrievanceRepository grievanceRepository,
                            GrievanceStatusHistoryRepository historyRepository) {
        this.grievanceRepository = grievanceRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public Grievance create(GrievanceRequest request) {
        Instant now = Instant.now();

        Grievance grievance = new Grievance();
        grievance.setTrackingId(generateTrackingId());
        grievance.setCategory(request.category());
        grievance.setSubject(request.subject());
        grievance.setDescription(request.description());
        grievance.setRelatedTrackingId(request.relatedTrackingId());
        grievance.setOwnerId(request.ownerId());
        grievance.setStatus(STATUS_SUBMITTED);
        grievance.setCreatedAt(now);
        grievance.setUpdatedAt(now);
        grievance.setDueAt(now.plus(SLA_DAYS, ChronoUnit.DAYS));
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved.getId(), STATUS_SUBMITTED, "Grievance received. It will be reviewed shortly.", "System");
        return saved;
    }

    @Transactional
    public Grievance updateStatus(UUID id, GrievanceStatusRequest request) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found"));

        String newStatus = request.status().trim();
        grievance.setStatus(newStatus);
        grievance.setUpdatedAt(Instant.now());
        if (request.note() != null && !request.note().isBlank()) {
            grievance.setResolutionNote(request.note());
        }
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved.getId(), newStatus, request.note(), request.changedBy());
        return saved;
    }

    public List<Grievance> list(UUID ownerId) {
        if (ownerId == null) {
            return grievanceRepository.findAll();
        }
        return grievanceRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Grievance getByTrackingId(String trackingId) {
        return grievanceRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found"));
    }

    public List<GrievanceStatusHistory> history(UUID grievanceId) {
        return historyRepository.findByGrievanceIdOrderByChangedAtAsc(grievanceId);
    }

    private void saveHistory(UUID grievanceId, String status, String note, String changedBy) {
        GrievanceStatusHistory history = new GrievanceStatusHistory();
        history.setGrievanceId(grievanceId);
        history.setStatus(status);
        history.setNote(note);
        history.setChangedBy(changedBy);
        history.setChangedAt(Instant.now());
        historyRepository.save(history);
    }

    private String generateTrackingId() {
        String trackingId;
        do {
            int number = 100000 + RANDOM.nextInt(900000);
            trackingId = "GRV-" + Year.now().getValue() + "-" + number;
        } while (grievanceRepository.existsByTrackingId(trackingId));
        return trackingId;
    }
}
