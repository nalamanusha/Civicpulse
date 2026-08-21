package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.model.WelfareScheme;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/governance")
@CrossOrigin(origins = "http://localhost:5173")
public class GovernanceAnalyticsController {

    // Milestone 3: Welfare & Budget API
    @GetMapping("/welfare")
    public WelfareScheme getWelfareSummary() {
        WelfareScheme scheme = new WelfareScheme();
        scheme.setWelfareId(UUID.randomUUID());
        scheme.setSchemeName("PM Awas Yojana");
        scheme.setTotalBeneficiaries(2847);
        scheme.setAllocatedFunds(new BigDecimal("2400000.00"));
        scheme.setDisbursedFunds(new BigDecimal("2100000.00"));
        scheme.setUtilizationPercentage(87);
        return scheme;
    }

    // Milestone 4: Executive Analytics Dashboard KPIs API
    @GetMapping("/analytics")
    public Map<String, Object> getExecutiveAnalytics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("citizenSatisfaction", "4.7/5");
        metrics.put("serviceSlaCompliance", "94%");
        metrics.put("revenueCollected", "$12.4M");
        metrics.put("monthlyGrievances", "12.4K");
        metrics.put("resolvedRate", "94%");
        metrics.put("departmentPerformance", Map.of(
                "Water", "94%",
                "Health", "91%",
                "Education", "89%"
        ));
        return metrics;
    }
}