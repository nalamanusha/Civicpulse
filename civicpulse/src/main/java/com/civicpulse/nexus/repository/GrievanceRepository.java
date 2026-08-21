package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, UUID> {

    // Changed parameter type from Grievance.Status to String
    long countByStatus(String status);

    // Tracking ID tho search cheyadaniki method
    Grievance findByGrievId(UUID grievId);
}