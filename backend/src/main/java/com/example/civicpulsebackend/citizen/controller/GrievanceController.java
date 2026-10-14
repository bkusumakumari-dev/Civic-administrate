package com.example.civicpulsebackend.citizen.controller;

import com.example.civicpulsebackend.citizen.dto.GrievanceRequest;
import com.example.civicpulsebackend.citizen.dto.GrievanceStatusRequest;
import com.example.civicpulsebackend.citizen.entity.Grievance;
import com.example.civicpulsebackend.citizen.entity.GrievanceStatusHistory;
import com.example.civicpulsebackend.citizen.service.GrievanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceService grievanceService;

    public GrievanceController(GrievanceService grievanceService) {
        this.grievanceService = grievanceService;
    }

    /** List all grievances, or only one citizen's when ownerId is provided. */
    @GetMapping
    public List<Grievance> getAll(@RequestParam(required = false) UUID ownerId) {
        return grievanceService.list(ownerId);
    }

    @GetMapping("/{trackingId}")
    public Grievance getByTrackingId(@PathVariable String trackingId) {
        return grievanceService.getByTrackingId(trackingId);
    }

    @GetMapping("/{trackingId}/history")
    public List<GrievanceStatusHistory> getHistory(@PathVariable String trackingId) {
        Grievance grievance = grievanceService.getByTrackingId(trackingId);
        return grievanceService.history(grievance.getId());
    }

    @PostMapping
    public ResponseEntity<Grievance> create(@Valid @RequestBody GrievanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(grievanceService.create(request));
    }

    @PatchMapping("/{id}/status")
    public Grievance updateStatus(@PathVariable UUID id,
                                  @Valid @RequestBody GrievanceStatusRequest request) {
        return grievanceService.updateStatus(id, request);
    }
}
