package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "certificates")
public class CertificateApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID appId;

    private String type;
    private String applicantName;
    private String childName;
    private LocalDate dob;
    private boolean documentsVerified;
    private String status;
    private String certificateNumber;
    private LocalDate issuedDate;

    public UUID getAppId() { return appId; }
    public void setAppId(UUID appId) { this.appId = appId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public boolean isDocumentsVerified() { return documentsVerified; }
    public void setDocumentsVerified(boolean documentsVerified) { this.documentsVerified = documentsVerified; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }
}