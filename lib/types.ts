export type Role = "LANDLORD" | "TENANT" | "ADMIN_OFFICER";

export type PropertyType =
  | "SINGLE_ROOM"
  | "CHAMBER_AND_HALL"
  | "APARTMENT_1BED"
  | "APARTMENT_2BED"
  | "APARTMENT_3BED"
  | "DETACHED_HOUSE"
  | "COMMERCIAL_SHOP";

export type PriceStatus = "PENDING_REVIEW" | "APPROVED_CAPPED" | "REJECTED";

export type ApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "DECLINED";

export type ContractStatus = "DRAFT" | "SIGNED_ACTIVE" | "EXPIRED" | "TERMINATED";

export type DisputeCategory =
  | "UNLAWFUL_RENT_INCREASE"
  | "EXCESSIVE_ADVANCE_DEMAND"
  | "EVICTION_WITHOUT_NOTICE"
  | "MAINTENANCE_NEGLECT"
  | "SECURITY_DEPOSIT_BREACH";

export type DisputeStatus = "LODGED" | "HEARING_SCHEDULED" | "RESOLVED" | "DISMISSED";

export type PaymentMethod = "MTN_MOMO" | "VODAFONE_CASH" | "AIRTELTIGO_MONEY" | "BANK_TRANSFER";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED";

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  phone: string;
  ghanaCardNumber: string; // e.g. GHA-123456789-0
  ghanaCardVerified: boolean;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  landlordGhanaCard: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  region: string;
  districtTown: string;
  gpsAddress?: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  housingAgeYears: number;
  amenities: string[];
  images: string[];
  requestedRentGhs: number;
  allowableRentGhs?: number;
  priceStatus: PriceStatus;
  certNumber?: string;
  certifiedAt?: string;
  rejectionReason?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  valuation?: PriceValuation;
}

export interface PriceValuation {
  id: string;
  propertyId: string;
  baseRateGhs: number;
  zoneWeight: number;
  ageDepreciationFactor: number;
  amenitiesBonusGhs: number;
  calculatedMaxRentGhs: number;
  flaggedOverpriced: boolean;
  variancePercent: number; // Positive if requested > allowable
  assessedBy?: string;
  notes?: string;
  assessedAt: string;
}

export interface Application {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantGhanaCard: string;
  monthlyIncomeGhs: number;
  employerOrOccupation: string;
  proposedMoveInDate: string;
  proposedAdvanceMonths: number;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
}

export interface TenancyContract {
  id: string;
  contractNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordId: string;
  landlordName: string;
  tenantId: string;
  tenantName: string;
  officerId?: string;
  rentAmountGhs: number;
  advanceMonths: number; // Max 6 months legally permitted under Rent Act 1963
  advanceAmountGhs: number;
  startDate: string;
  endDate: string;
  landlordSignedAt?: string;
  tenantSignedAt?: string;
  officerApprovedAt?: string;
  status: ContractStatus;
  certPdfUrl?: string;
  termsNotes?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  caseNumber: string;
  propertyId: string;
  propertyTitle: string;
  complainantId: string;
  complainantName: string;
  complainantRole: Role;
  respondentId: string;
  respondentName: string;
  category: DisputeCategory;
  title: string;
  description: string;
  status: DisputeStatus;
  hearingDate?: string;
  resolutionDetails?: string;
  createdAt: string;
}

export interface RentPayment {
  id: string;
  transactionRef: string;
  contractId: string;
  tenantId: string;
  tenantName: string;
  amountGhs: number;
  momoNetwork: PaymentMethod;
  momoNumber: string;
  billingPeriodMonth: string;
  status: PaymentStatus;
  receiptNumber: string;
  paidAt: string;
}
