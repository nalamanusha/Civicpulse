package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.model.Grievance;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "http://localhost:5173")
public class GrievanceController {

    @GetMapping
    public List<Grievance> getAllGrievances() {
        List<Grievance> list = new ArrayList<>();
        Grievance g = new Grievance();
        g.setGrievId(UUID.randomUUID());
        g.setCategory("Water Supply");
        g.setSeverity("High");
        g.setStatus("In Progress");
        g.setDescription("No water supply for 5 days");
        g.setLocation("Sector 5");
        g.setCitizenId("CTZ-2024-1247");
        g.setDueDate(LocalDate.of(2026, 6, 15));
        list.add(g);
        return list;
    }

    @PostMapping
    public Grievance createGrievance(@RequestBody Grievance grievance) {
        grievance.setGrievId(UUID.randomUUID());
        grievance.setStatus("In Progress");
        return grievance;
    }
}