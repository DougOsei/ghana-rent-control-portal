-- ====================================================================
-- GHANA RENT CONTROL DEPARTMENT - PROPERTY & TENANCY PORTAL
-- PostgreSQL Complete DDL Database Schema
-- In compliance with Ghana Rent Act (Act 220 of 1963) & Digital Housing Regulations
-- ====================================================================

-- Create Custom ENUM Types
CREATE TYPE "Role" AS ENUM ('LANDLORD', 'TENANT', 'ADMIN_OFFICER');
CREATE TYPE "PropertyType" AS ENUM ('SINGLE_ROOM', 'CHAMBER_AND_HALL', 'APARTMENT_1BED', 'APARTMENT_2BED', 'APARTMENT_3BED', 'DETACHED_HOUSE', 'COMMERCIAL_SHOP');
CREATE TYPE "PriceStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED_CAPPED', 'REJECTED');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED');
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'SIGNED_ACTIVE', 'EXPIRED', 'TERMINATED');
CREATE TYPE "DisputeCategory" AS ENUM ('UNLAWFUL_RENT_INCREASE', 'EXCESSIVE_ADVANCE_DEMAND', 'EVICTION_WITHOUT_NOTICE', 'MAINTENANCE_NEGLECT', 'SECURITY_DEPOSIT_BREACH');
CREATE TYPE "DisputeStatus" AS ENUM ('LODGED', 'HEARING_SCHEDULED', 'RESOLVED', 'DISMISSED');
CREATE TYPE "PaymentMethod" AS ENUM ('MTN_MOMO', 'VODAFONE_CASH', 'AIRTELTIGO_MONEY', 'BANK_TRANSFER');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- 1. USERS TABLE (Landlords, Tenants, Rent Control Officers)
CREATE TABLE "User" (
    "id" VARCHAR(64) PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TENANT',
    "fullName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "ghanaCardNumber" VARCHAR(25) NOT NULL, -- e.g. GHA-123456789-0
    "ghanaCardVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "address" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_user_ghanacard" ON "User"("ghanaCardNumber");
CREATE INDEX "idx_user_role" ON "User"("role");

-- 2. PROPERTIES TABLE
CREATE TABLE "Property" (
    "id" VARCHAR(64) PRIMARY KEY,
    "landlordId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL DEFAULT 'APARTMENT_2BED',
    "address" TEXT NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "districtTown" VARCHAR(100) NOT NULL,
    "gpsAddress" VARCHAR(50), -- GhanaPost GPS format (e.g. GA-183-9022)
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "sizeSqm" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "housingAgeYears" INTEGER NOT NULL DEFAULT 3,
    "amenities" TEXT NOT NULL, -- JSON-stringified array
    "images" TEXT NOT NULL,    -- JSON-stringified array
    "requestedRentGhs" DOUBLE PRECISION NOT NULL,
    "allowableRentGhs" DOUBLE PRECISION,
    "priceStatus" "PriceStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "certNumber" VARCHAR(100) UNIQUE, -- e.g. GRC-ACC-2026-98124
    "certifiedAt" TIMESTAMP WITH TIME ZONE,
    "rejectionReason" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_property_location" ON "Property"("region", "districtTown");
CREATE INDEX "idx_property_pricestatus" ON "Property"("priceStatus");
CREATE INDEX "idx_property_landlord" ON "Property"("landlordId");

-- 3. PRICE VALUATION / ASSESSMENTS TABLE
CREATE TABLE "PriceValuation" (
    "id" VARCHAR(64) PRIMARY KEY,
    "propertyId" VARCHAR(64) NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
    "baseRateGhs" DOUBLE PRECISION NOT NULL,
    "zoneWeight" DOUBLE PRECISION NOT NULL,
    "ageDepreciationFactor" DOUBLE PRECISION NOT NULL,
    "amenitiesBonusGhs" DOUBLE PRECISION NOT NULL,
    "calculatedMaxRentGhs" DOUBLE PRECISION NOT NULL,
    "flaggedOverpriced" BOOLEAN NOT NULL DEFAULT FALSE,
    "variancePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "assessedBy" VARCHAR(100),
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_valuation_property" ON "PriceValuation"("propertyId");

-- 4. TENANCY APPLICATIONS TABLE
CREATE TABLE "Application" (
    "id" VARCHAR(64) PRIMARY KEY,
    "propertyId" VARCHAR(64) NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
    "tenantId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "monthlyIncomeGhs" DOUBLE PRECISION NOT NULL,
    "employerOrOccupation" VARCHAR(255) NOT NULL,
    "proposedMoveInDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "proposedAdvanceMonths" INTEGER NOT NULL DEFAULT 6, -- Max 6 months statutory under Rent Act
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_application_property" ON "Application"("propertyId");
CREATE INDEX "idx_application_tenant" ON "Application"("tenantId");

-- 5. DIGITAL TENANCY CONTRACTS TABLE
CREATE TABLE "TenancyContract" (
    "id" VARCHAR(64) PRIMARY KEY,
    "contractNumber" VARCHAR(100) NOT NULL UNIQUE,
    "propertyId" VARCHAR(64) NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
    "landlordId" VARCHAR(64) NOT NULL REFERENCES "User"("id"),
    "tenantId" VARCHAR(64) NOT NULL REFERENCES "User"("id"),
    "applicationId" VARCHAR(64) REFERENCES "Application"("id"),
    "officerId" VARCHAR(64) REFERENCES "User"("id"),
    "rentAmountGhs" DOUBLE PRECISION NOT NULL,
    "advanceMonths" INTEGER NOT NULL DEFAULT 6,
    "advanceAmountGhs" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "landlordSignedAt" TIMESTAMP WITH TIME ZONE,
    "tenantSignedAt" TIMESTAMP WITH TIME ZONE,
    "officerApprovedAt" TIMESTAMP WITH TIME ZONE,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "certPdfUrl" TEXT,
    "termsNotes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_contract_property" ON "TenancyContract"("propertyId");
CREATE INDEX "idx_contract_landlord" ON "TenancyContract"("landlordId");
CREATE INDEX "idx_contract_tenant" ON "TenancyContract"("tenantId");

-- 6. DISPUTE & GRIEVANCE RESOLUTION MODULE
CREATE TABLE "Dispute" (
    "id" VARCHAR(64) PRIMARY KEY,
    "caseNumber" VARCHAR(100) NOT NULL UNIQUE,
    "propertyId" VARCHAR(64) NOT NULL REFERENCES "Property"("id"),
    "contractId" VARCHAR(64) REFERENCES "TenancyContract"("id"),
    "complainantId" VARCHAR(64) NOT NULL REFERENCES "User"("id"),
    "respondentId" VARCHAR(64) NOT NULL REFERENCES "User"("id"),
    "category" "DisputeCategory" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceFiles" TEXT, -- JSON array of file paths
    "status" "DisputeStatus" NOT NULL DEFAULT 'LODGED',
    "hearingDate" TIMESTAMP WITH TIME ZONE,
    "resolutionDetails" TEXT,
    "resolvedByOfficerId" VARCHAR(64),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_dispute_complainant" ON "Dispute"("complainantId");
CREATE INDEX "idx_dispute_respondent" ON "Dispute"("respondentId");
CREATE INDEX "idx_dispute_status" ON "Dispute"("status");

-- 7. RENT PAYMENT & MOBILE MONEY TRACKING TABLE
CREATE TABLE "RentPayment" (
    "id" VARCHAR(64) PRIMARY KEY,
    "transactionRef" VARCHAR(100) NOT NULL UNIQUE,
    "contractId" VARCHAR(64) NOT NULL REFERENCES "TenancyContract"("id") ON DELETE CASCADE,
    "tenantId" VARCHAR(64) NOT NULL REFERENCES "User"("id"),
    "amountGhs" DOUBLE PRECISION NOT NULL,
    "momoNetwork" "PaymentMethod" NOT NULL DEFAULT 'MTN_MOMO',
    "momoNumber" VARCHAR(50) NOT NULL,
    "billingPeriodMonth" VARCHAR(50) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CONFIRMED',
    "receiptNumber" VARCHAR(100) NOT NULL UNIQUE,
    "paidAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_payment_contract" ON "RentPayment"("contractId");
CREATE INDEX "idx_payment_tenant" ON "RentPayment"("tenantId");
