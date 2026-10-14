package com.example.civicpulsebackend.certificate.service;

import com.example.civicpulsebackend.certificate.dto.ApplicationRequest;
import com.example.civicpulsebackend.certificate.dto.StatusUpdateRequest;
import com.example.civicpulsebackend.certificate.entity.Application;
import com.example.civicpulsebackend.certificate.entity.ApplicationStatusHistory;
import com.example.civicpulsebackend.certificate.repository.ApplicationRepository;
import com.example.civicpulsebackend.certificate.repository.ApplicationStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    public static final String STATUS_SUBMITTED = "Submitted";

    private static final SecureRandom RANDOM = new SecureRandom();

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              ApplicationStatusHistoryRepository historyRepository) {
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public Application create(ApplicationRequest request) {
        Instant now = Instant.now();

        Application application = new Application();
        application.setTrackingId(generateTrackingId());
        application.setServiceType(request.serviceType());
        application.setApplicantName(request.applicantName());
        application.setEmail(request.email());
        application.setPhone(request.phone());
        application.setAddress(request.address());
        application.setRemarks(request.remarks());
        application.setOwnerId(request.ownerId());
        application.setStatus(STATUS_SUBMITTED);
        application.setCreatedAt(now);
        application.setUpdatedAt(now);
        Application saved = applicationRepository.save(application);

        saveHistory(saved.getId(), STATUS_SUBMITTED, "Application submitted successfully.", request.applicantName());
        return saved;
    }

    @Transactional
    public Application updateStatus(UUID id, StatusUpdateRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        String newStatus = request.status().trim();
        application.setStatus(newStatus);
        application.setUpdatedAt(Instant.now());
        if (request.note() != null && !request.note().isBlank()) {
            application.setRemarks(request.note());
        }
        Application saved = applicationRepository.save(application);

        saveHistory(saved.getId(), newStatus, request.note(), request.changedBy());
        return saved;
    }

    public List<Application> list(UUID ownerId) {
        if (ownerId == null) {
            return applicationRepository.findAll();
        }
        return applicationRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Application getByTrackingId(String trackingId) {
        return applicationRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
    }

    public List<ApplicationStatusHistory> history(UUID applicationId) {
        return historyRepository.findByApplicationIdOrderByChangedAtAsc(applicationId);
    }

    private void saveHistory(UUID applicationId, String status, String note, String changedBy) {
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplicationId(applicationId);
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
            trackingId = "APP-" + Year.now().getValue() + "-" + number;
        } while (applicationRepository.existsByTrackingId(trackingId));
        return trackingId;
    }
}
