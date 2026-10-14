package com.example.civicpulsebackend.admin.controller;

import com.example.civicpulsebackend.certificate.entity.Application;
import com.example.civicpulsebackend.certificate.repository.ApplicationRepository;
import com.example.civicpulsebackend.citizen.entity.Grievance;
import com.example.civicpulsebackend.citizen.repository.GrievanceRepository;
import com.example.civicpulsebackend.user.repository.UserRepository;
import com.example.civicpulsebackend.user.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Small read-only summary used by the administrator dashboard.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ApplicationRepository applicationRepository;
    private final GrievanceRepository grievanceRepository;
    private final UserRepository userRepository;

    public AdminController(ApplicationRepository applicationRepository,
                           GrievanceRepository grievanceRepository,
                           UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.grievanceRepository = grievanceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        List<Application> applications = applicationRepository.findAll();
        List<Grievance> grievances = grievanceRepository.findAll();
        Instant now = Instant.now();

        long pendingApplications = applications.stream()
                .filter(a -> "Submitted".equalsIgnoreCase(a.getStatus())
                        || "Under Review".equalsIgnoreCase(a.getStatus()))
                .count();
        long approvedApplications = applications.stream()
                .filter(a -> "Approved".equalsIgnoreCase(a.getStatus()))
                .count();
        long rejectedApplications = applications.stream()
                .filter(a -> "Rejected".equalsIgnoreCase(a.getStatus()))
                .count();

        long openGrievances = grievances.stream()
                .filter(g -> !"Resolved".equalsIgnoreCase(g.getStatus())
                        && !"Rejected".equalsIgnoreCase(g.getStatus()))
                .count();
        long overdueGrievances = grievances.stream()
                .filter(g -> !"Resolved".equalsIgnoreCase(g.getStatus())
                        && !"Rejected".equalsIgnoreCase(g.getStatus())
                        && g.getDueAt() != null
                        && g.getDueAt().isBefore(now))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", applications.size());
        stats.put("pendingApplications", pendingApplications);
        stats.put("approvedApplications", approvedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        stats.put("totalGrievances", grievances.size());
        stats.put("openGrievances", openGrievances);
        stats.put("overdueGrievances", overdueGrievances);
        stats.put("totalCandidates", userRepository.findByRoleOrderByCreatedAtDesc(AuthService.ROLE_CANDIDATE).size());
        return stats;
    }
}
