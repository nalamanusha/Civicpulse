package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "welfare_schemes")
public class WelfareScheme {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID welfareId;

    private String schemeName; // e.g., PM Awas Yojana
    private int totalBeneficiaries;
    private BigDecimal allocatedFunds;
    private BigDecimal disbursedFunds;
    private int utilizationPercentage;

    public UUID getWelfareId() { return welfareId; }
    public void setWelfareId(UUID welfareId) { this.welfareId = welfareId; }
    public String getSchemeName() { return schemeName; }
    public void setSchemeName(String schemeName) { this.schemeName = schemeName; }
    public int getTotalBeneficiaries() { return totalBeneficiaries; }
    public void setTotalBeneficiaries(int totalBeneficiaries) { this.totalBeneficiaries = totalBeneficiaries; }
    public BigDecimal getAllocatedFunds() { return allocatedFunds; }
    public void setAllocatedFunds(BigDecimal allocatedFunds) { this.allocatedFunds = allocatedFunds; }
    public BigDecimal getDisbursedFunds() { return disbursedFunds; }
    public void setDisbursedFunds(BigDecimal disbursedFunds) { this.disbursedFunds = disbursedFunds; }
    public int getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(int utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }
}