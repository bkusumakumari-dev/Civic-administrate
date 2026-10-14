package com.example.civicpulsebackend.certificate.controller;

import com.example.civicpulsebackend.certificate.dto.ApplicationRequest;
import com.example.civicpulsebackend.certificate.dto.StatusUpdateRequest;
import com.example.civicpulsebackend.certificate.entity.Application;
import com.example.civicpulsebackend.certificate.entity.ApplicationStatusHistory;
import com.example.civicpulsebackend.certificate.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /** List all applications, or only one citizen's when ownerId is provided. */
    @GetMapping
    public List<Application> getAll(@RequestParam(required = false) UUID ownerId) {
        return applicationService.list(ownerId);
    }

    @GetMapping("/{trackingId}")
    public Application getByTrackingId(@PathVariable String trackingId) {
        return applicationService.getByTrackingId(trackingId);
    }

    @GetMapping("/{trackingId}/history")
    public List<ApplicationStatusHistory> getHistory(@PathVariable String trackingId) {
        Application application = applicationService.getByTrackingId(trackingId);
        return applicationService.history(application.getId());
    }

    @PostMapping
    public ResponseEntity<Application> create(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.create(request));
    }

    @PatchMapping("/{id}/status")
    public Application updateStatus(@PathVariable UUID id,
                                    @Valid @RequestBody StatusUpdateRequest request) {
        return applicationService.updateStatus(id, request);
    }
}
