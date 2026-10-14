package com.example.civicpulsebackend.analytics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        // Executive KPIs
        data.put("citizenSatisfaction", "4.7 / 5");
        data.put("serviceSla", "94%");
        data.put("revenueCollected", "$12.4M");

        // Service metrics
        data.put("serviceRequests", "24.7K");
        data.put("requestsResolved", "94%");
        data.put("avgResolutionTime", "2.4 days");

        // Grievance analytics
        data.put("grievancesFiled", "12.4K");
        data.put("grievancesResolved", "94%");
        data.put("mttr", "47 hrs");

        // Revenue tracking
        data.put("propertyTaxContribution", "67%");
        data.put("licenseRevenueContribution", "23%");

        // Budget utilization
        data.put("budgetAllocated", "$47M");
        data.put("budgetUtilized", "$41M");
        data.put("budgetUtilizationRate", "87%");

        // Department performance
        data.put("deptWater", "94%");
        data.put("deptHealth", "91%");
        data.put("deptEducation", "89%");

        // Citizen satisfaction
        data.put("complaintsTrend", "↓ 23%");
        data.put("servicesDeliveredTrend", "↑ 47%");

        return ResponseEntity.ok(data);
    }
}