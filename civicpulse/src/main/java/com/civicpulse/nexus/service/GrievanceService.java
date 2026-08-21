package com.civicpulse.nexus.service;

import com.civicpulse.nexus.model.Grievance;
import com.civicpulse.nexus.repository.GrievanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GrievanceService {
    @Autowired
    private GrievanceRepository grievanceRepository;

    public Grievance createGrievance(Grievance grievance) {
        grievance.setStatus("SUBMITTED"); // Pass as a clean String
        return grievanceRepository.save(grievance);
    }
}