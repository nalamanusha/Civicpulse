package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "citizens")
public class Citizen {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID citizenid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String aadhar;

    private String ward;

    public UUID getCitizenid() { return citizenid; }
    public void setCitizenid(UUID citizenid) { this.citizenid = citizenid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAadhar() { return aadhar; }
    public void setAadhar(String aadhar) { this.aadhar = aadhar; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
}
