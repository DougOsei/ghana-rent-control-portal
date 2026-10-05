import {
  Property,
  User,
  Application,
  TenancyContract,
  Dispute,
  RentPayment,
  PropertyType,
  PriceStatus,
} from "./types";
import { calculateRentValuation } from "./valuationEngine";

// Seeded Users
export const INITIAL_USERS: User[] = [
  {
    id: "user-admin-1",
    email: "officer.sampson@rentcontrol.gov.gh",
    role: "ADMIN_OFFICER",
    fullName: "Chief Insp. Sampson Abbey",
    phone: "+233 24 492 8190",
    ghanaCardNumber: "GHA-849302194-9",
    ghanaCardVerified: true,
    address: "Rent Control Department H/Q, Ministries, Accra",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "user-landlord-1",
    email: "kwame.mensah@gmail.com",
    role: "LANDLORD",
    fullName: "Kwame Mensah Boakye",
    phone: "+233 20 812 3456",
    ghanaCardNumber: "GHA-102938475-1",
    ghanaCardVerified: true,
    address: "Plot 42, Ambassadorial Enclave, East Legon, Accra",
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "user-landlord-2",
    email: "kofi.darko@yahoo.com",
    role: "LANDLORD",
    fullName: "Kofi Annan Darko",
    phone: "+233 24 998 1234",
    ghanaCardNumber: "GHA-783920194-8",
    ghanaCardVerified: true,
    address: "House 18, Block B, Ahodwo, Kumasi",
    createdAt: "2024-03-01T14:20:00Z",
  },
  {
    id: "user-tenant-1",
    email: "abena.serwaa@gmail.com",
    role: "TENANT",
    fullName: "Abena Serwaa Osei",
    phone: "+233 55 311 9876",
    ghanaCardNumber: "GHA-594837261-4",
    ghanaCardVerified: true,
    address: "Achimota Forest Link, Accra",
    createdAt: "2024-03-12T09:15:00Z",
  },
  {
    id: "user-tenant-2",
    email: "frimpong.akosua@outlook.com",
    role: "TENANT",
    fullName: "Akosua Mansah Frimpong",
    phone: "+233 27 765 4321",
    ghanaCardNumber: "GHA-392817465-2",
    ghanaCardVerified: true,
    address: "Asokwa Residential Area, Kumasi",
    createdAt: "2024-04-05T11:45:00Z",
  },
];

// Seeded Properties
export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    landlordId: "user-landlord-1",
    landlordName: "Kwame Mensah Boakye",
    landlordPhone: "+233 20 812 3456",
    landlordGhanaCard: "GHA-102938475-1",
    title: "Executive 2-Bedroom Apartment at East Legon",
    description:
      "Modern luxury apartment with fitted kitchen, standby generator, 24/7 security guard, and dedicated ECG prepaid meter. 5 minutes drive from A&C Mall.",
    propertyType: "APARTMENT_2BED",
    address: "Boundary Road, near A&C Mall",
    region: "Greater Accra",
    districtTown: "East Legon",
    gpsAddress: "GA-392-8104",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 90,
    housingAgeYears: 2,
    amenities: [
      "Self-Contained Bathroom",
      "Dedicated ECG Prepaid Meter",
      "Ghana Water (GWCL) Piped",
      "Standby Generator / Solar",
      "Walled & Gated Compound",
      "Air Conditioning",
      "Security Guard / CCTV",
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 4200,
    allowableRentGhs: 4200,
    priceStatus: "APPROVED_CAPPED",
    certNumber: "GRC-ACC-2026-00412",
    certifiedAt: "2026-02-10T12:00:00Z",
    isAvailable: true,
    createdAt: "2026-02-05T08:30:00Z",
    updatedAt: "2026-02-10T12:00:00Z",
  },
  {
    id: "prop-2",
    landlordId: "user-landlord-1",
    landlordName: "Kwame Mensah Boakye",
    landlordPhone: "+233 20 812 3456",
    landlordGhanaCard: "GHA-102938475-1",
    title: "Spacious 3-Bedroom Duplex with Compound - Spintex",
    description:
      "Comfortable self-compound property near Coastal junction. Constant water supply with large reserve tanks and electrified fencing.",
    propertyType: "APARTMENT_3BED",
    address: "Coastal Junction, off Spintex Road",
    region: "Greater Accra",
    districtTown: "Spintex Road",
    gpsAddress: "GZ-145-2091",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 140,
    housingAgeYears: 5,
    amenities: [
      "Self-Contained Bathroom",
      "Dedicated ECG Prepaid Meter",
      "Ghana Water (GWCL) Piped",
      "Polytank Water Reservoir",
      "Walled & Gated Compound",
      "Paved Compound / Parking",
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 6000, // Landlord asking high price
    allowableRentGhs: 4850, // Capped legal limit
    priceStatus: "PENDING_REVIEW",
    isAvailable: true,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "prop-3",
    landlordId: "user-landlord-2",
    landlordName: "Kofi Annan Darko",
    landlordPhone: "+233 24 998 1234",
    landlordGhanaCard: "GHA-783920194-8",
    title: "Modern 1-Bedroom Studio Flat in Ahodwo, Kumasi",
    description:
      "Tastefully finished self-contained 1 bedroom apartment in prime Ahodwo. Ideal for professionals and lecturers. Calm neighborhood with paved access.",
    propertyType: "APARTMENT_1BED",
    address: "Near Golden Tulip, Ahodwo",
    region: "Ashanti",
    districtTown: "Ahodwo / Nhyiaeso",
    gpsAddress: "AK-045-8812",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqm: 55,
    housingAgeYears: 1,
    amenities: [
      "Self-Contained Bathroom",
      "Dedicated ECG Prepaid Meter",
      "Ghana Water (GWCL) Piped",
      "Polytank Water Reservoir",
      "Air Conditioning",
      "Tiled Floors",
    ],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 1950,
    allowableRentGhs: 1950,
    priceStatus: "APPROVED_CAPPED",
    certNumber: "GRC-ASH-2026-00891",
    certifiedAt: "2026-02-20T15:30:00Z",
    isAvailable: true,
    createdAt: "2026-02-18T11:00:00Z",
    updatedAt: "2026-02-20T15:30:00Z",
  },
  {
    id: "prop-4",
    landlordId: "user-landlord-2",
    landlordName: "Kofi Annan Darko",
    landlordPhone: "+233 24 998 1234",
    landlordGhanaCard: "GHA-783920194-8",
    title: "Chamber and Hall Self-Contained at KNUST Ayeduase",
    description:
      "Clean, secure chamber and hall with private meter, water reservoir, and tiled interior. Just 7 minutes walk to KNUST tech junction gate.",
    propertyType: "CHAMBER_AND_HALL",
    address: "Ayeduase New Site, KNUST",
    region: "Ashanti",
    districtTown: "KNUST / Ayeduase",
    gpsAddress: "AK-190-3341",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqm: 40,
    housingAgeYears: 4,
    amenities: [
      "Self-Contained Bathroom",
      "Dedicated ECG Prepaid Meter",
      "Polytank Water Reservoir",
      "Tiled Floors",
    ],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 950,
    allowableRentGhs: 950,
    priceStatus: "APPROVED_CAPPED",
    certNumber: "GRC-ASH-2026-00904",
    certifiedAt: "2026-01-15T09:00:00Z",
    isAvailable: true,
    createdAt: "2026-01-12T14:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "prop-5",
    landlordId: "user-landlord-1",
    landlordName: "Kwame Mensah Boakye",
    landlordPhone: "+233 20 812 3456",
    landlordGhanaCard: "GHA-102938475-1",
    title: "Decent Single Room with Shared Kitchen - Kasoa GA Boundary",
    description:
      "Affordable single room in clean compound. Tiled floor, ceiling fan, and steady borehole and GWCL water hookup.",
    propertyType: "SINGLE_ROOM",
    address: "Galilea Road, near Toll Booth",
    region: "Greater Accra",
    districtTown: "Kasoa (GA-Central boundary)",
    gpsAddress: "GC-021-4491",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqm: 20,
    housingAgeYears: 6,
    amenities: [
      "Dedicated ECG Prepaid Meter",
      "Polytank Water Reservoir",
      "Tiled Floors",
    ],
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 350,
    allowableRentGhs: 350,
    priceStatus: "APPROVED_CAPPED",
    certNumber: "GRC-ACC-2026-00188",
    certifiedAt: "2026-01-20T10:00:00Z",
    isAvailable: true,
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "prop-6",
    landlordId: "user-landlord-2",
    landlordName: "Kofi Annan Darko",
    landlordPhone: "+233 24 998 1234",
    landlordGhanaCard: "GHA-783920194-8",
    title: "Luxury 4-Bedroom Detached House at Cantonments",
    description:
      "High-end diplomatic residence with boys quarters, swimming pool, automated gate, and generator. Landlord requested GH₵ 18,000.",
    propertyType: "DETACHED_HOUSE",
    address: "Fourth Circular Road, Cantonments",
    region: "Greater Accra",
    districtTown: "Cantonments",
    gpsAddress: "GL-019-3382",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 280,
    housingAgeYears: 2,
    amenities: [
      "Self-Contained Bathroom",
      "Dedicated ECG Prepaid Meter",
      "Ghana Water (GWCL) Piped",
      "Standby Generator / Solar",
      "Walled & Gated Compound",
      "Air Conditioning",
      "Security Guard / CCTV",
      "Fitted Kitchen Cabinets",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    ],
    requestedRentGhs: 16500,
    allowableRentGhs: 11800,
    priceStatus: "PENDING_REVIEW",
    isAvailable: true,
    createdAt: "2026-03-02T16:00:00Z",
    updatedAt: "2026-03-02T16:00:00Z",
  },
];

// Seeded Tenancy Contracts
export const INITIAL_CONTRACTS: TenancyContract[] = [
  {
    id: "contract-1",
    contractNumber: "GRC-TC-2026-00104",
    propertyId: "prop-1",
    propertyTitle: "Executive 2-Bedroom Apartment at East Legon",
    propertyAddress: "Boundary Road, near A&C Mall, East Legon",
    landlordId: "user-landlord-1",
    landlordName: "Kwame Mensah Boakye",
    tenantId: "user-tenant-1",
    tenantName: "Abena Serwaa Osei",
    rentAmountGhs: 4200,
    advanceMonths: 6, // Under Ghana Rent Act max 6 months
    advanceAmountGhs: 25200,
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2027-02-28T23:59:59Z",
    landlordSignedAt: "2026-02-22T10:00:00Z",
    tenantSignedAt: "2026-02-23T14:30:00Z",
    officerApprovedAt: "2026-02-24T16:00:00Z",
    status: "SIGNED_ACTIVE",
    termsNotes:
      "Statutory Rent Control Agreement compliant with Section 19 of the Rent Act (Act 220). Landlord agrees not to increase rent or demand further advance without Rent Control assessment.",
    createdAt: "2026-02-22T08:00:00Z",
  },
];

// Seeded Applications
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    propertyId: "prop-3",
    propertyTitle: "Modern 1-Bedroom Studio Flat in Ahodwo, Kumasi",
    tenantId: "user-tenant-2",
    tenantName: "Akosua Mansah Frimpong",
    tenantPhone: "+233 27 765 4321",
    tenantGhanaCard: "GHA-392817465-2",
    monthlyIncomeGhs: 6500,
    employerOrOccupation: "Senior Accountant, Commercial Bank Ghana",
    proposedMoveInDate: "2026-04-01T00:00:00Z",
    proposedAdvanceMonths: 6,
    status: "UNDER_REVIEW",
    notes: "Non-smoker, single occupant, verified employment.",
    createdAt: "2026-03-03T11:20:00Z",
  },
  // Demo tenant (Abena) — accepted application that resulted in contract-1
  {
    id: "app-2",
    propertyId: "prop-1",
    propertyTitle: "Executive 2-Bedroom Apartment at East Legon",
    tenantId: "user-tenant-1",
    tenantName: "Abena Serwaa Osei",
    tenantPhone: "+233 24 492 8190",
    tenantGhanaCard: "GHA-594837261-4",
    monthlyIncomeGhs: 12000,
    employerOrOccupation: "Operations Manager, Ghana Commercial Bank",
    proposedMoveInDate: "2026-03-01T00:00:00Z",
    proposedAdvanceMonths: 6,
    status: "ACCEPTED",
    notes: "Stable employment, excellent rental history. Single family occupancy.",
    createdAt: "2026-02-15T09:30:00Z",
  },
  // Demo tenant (Abena) — pending application for a second property
  {
    id: "app-3",
    propertyId: "prop-4",
    propertyTitle: "Affordable 2-Bedroom House in Kasoa New Town",
    tenantId: "user-tenant-1",
    tenantName: "Abena Serwaa Osei",
    tenantPhone: "+233 24 492 8190",
    tenantGhanaCard: "GHA-594837261-4",
    monthlyIncomeGhs: 12000,
    employerOrOccupation: "Operations Manager, Ghana Commercial Bank",
    proposedMoveInDate: "2026-05-01T00:00:00Z",
    proposedAdvanceMonths: 3,
    status: "SUBMITTED",
    notes: "Looking for a second option closer to family in Kasoa.",
    createdAt: "2026-03-10T14:00:00Z",
  },
];

// Seeded Disputes
export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: "disp-1",
    caseNumber: "GRC-DSP-2026-0044",
    propertyId: "prop-2",
    propertyTitle: "Spacious 3-Bedroom Duplex with Compound - Spintex",
    complainantId: "user-tenant-1",
    complainantName: "Abena Serwaa Osei",
    complainantRole: "TENANT",
    respondentId: "user-landlord-1",
    respondentName: "Kwame Mensah Boakye",
    category: "EXCESSIVE_ADVANCE_DEMAND",
    title: "Landlord demanding 2 years advance rent contrary to Rent Act 1963",
    description:
      "During tenancy negotiation, the landlord insisted on taking a 2-year advance payment of GH₵ 144,000, which directly violates Section 25(5) of Ghana Rent Act, 1963 (Act 220) limiting rent advances to a maximum of 6 months.",
    status: "HEARING_SCHEDULED",
    hearingDate: "2026-03-18T10:00:00Z",
    resolutionDetails: "Both parties summoned to Greater Accra Regional Rent Office, Ministries.",
    createdAt: "2026-02-28T09:00:00Z",
  },
  {
    id: "disp-2",
    caseNumber: "GRC-DSP-2026-0021",
    propertyId: "prop-5",
    propertyTitle: "Decent Single Room with Shared Kitchen - Kasoa GA Boundary",
    complainantId: "user-tenant-2",
    complainantName: "Akosua Mansah Frimpong",
    complainantRole: "TENANT",
    respondentId: "user-landlord-1",
    respondentName: "Kwame Mensah Boakye",
    category: "MAINTENANCE_NEGLECT",
    title: "Water pumping machine breakdown and sewage blockage unaddressed",
    description:
      "Tenants have been without running water for 3 weeks after borehole submersible pump burned out. Landlord has refused repairs.",
    status: "LODGED",
    createdAt: "2026-03-02T13:45:00Z",
  },
];

// Seeded Payments
export const INITIAL_PAYMENTS: RentPayment[] = [
  {
    id: "pay-1",
    transactionRef: "MOMO-GRC-202603-9182",
    contractId: "contract-1",
    tenantId: "user-tenant-1",
    tenantName: "Abena Serwaa Osei",
    amountGhs: 4200,
    momoNetwork: "MTN_MOMO",
    momoNumber: "0244918273",
    billingPeriodMonth: "March 2026",
    status: "CONFIRMED",
    receiptNumber: "GRC-RCP-81920",
    paidAt: "2026-03-01T09:12:00Z",
  },
];

// Global in-memory singleton for live interactive persistence across Next.js API turns
class DataStore {
  private users: User[] = [...INITIAL_USERS];
  private properties: Property[] = [...INITIAL_PROPERTIES];
  private contracts: TenancyContract[] = [...INITIAL_CONTRACTS];
  private applications: Application[] = [...INITIAL_APPLICATIONS];
  private disputes: Dispute[] = [...INITIAL_DISPUTES];
  private payments: RentPayment[] = [...INITIAL_PAYMENTS];

  constructor() {
    // Attach initial valuations to properties
    this.properties.forEach((prop) => {
      const val = calculateRentValuation({
        propertyType: prop.propertyType,
        region: prop.region,
        districtTown: prop.districtTown,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sizeSqm: prop.sizeSqm,
        housingAgeYears: prop.housingAgeYears,
        amenities: prop.amenities,
        requestedRentGhs: prop.requestedRentGhs,
      });

      prop.valuation = {
        id: `val-${prop.id}`,
        propertyId: prop.id,
        baseRateGhs: val.baseRateGhs,
        zoneWeight: val.zoneWeight,
        ageDepreciationFactor: val.ageDepreciationFactor,
        amenitiesBonusGhs: val.amenitiesBonusGhs,
        calculatedMaxRentGhs: val.calculatedMaxRentGhs,
        flaggedOverpriced: val.flaggedOverpriced,
        variancePercent: val.variancePercent,
        assessedBy: "AUTOMATED_RENT_CONTROL_ENGINE",
        assessedAt: prop.createdAt,
      };

      if (!prop.allowableRentGhs) {
        prop.allowableRentGhs = val.calculatedMaxRentGhs;
      }
    });
  }

  // Properties
  getProperties(filters?: {
    region?: string;
    districtTown?: string;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
    status?: PriceStatus;
  }): Property[] {
    return this.properties.filter((p) => {
      if (filters?.region && filters.region !== "ALL" && p.region.toLowerCase() !== filters.region.toLowerCase()) {
        return false;
      }
      if (
        filters?.districtTown &&
        !p.districtTown.toLowerCase().includes(filters.districtTown.toLowerCase())
      ) {
        return false;
      }
      if (filters?.maxPrice && (p.allowableRentGhs || p.requestedRentGhs) > filters.maxPrice) {
        return false;
      }
      if (filters?.propertyType && filters.propertyType !== "ALL" && p.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters?.bedrooms && p.bedrooms < filters.bedrooms) {
        return false;
      }
      if (filters?.status && p.priceStatus !== filters.status) {
        return false;
      }
      return true;
    });
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  createProperty(
    data: Omit<Property, "id" | "createdAt" | "updatedAt" | "valuation" | "priceStatus">
  ): Property {
    const val = calculateRentValuation({
      propertyType: data.propertyType,
      region: data.region,
      districtTown: data.districtTown,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sizeSqm: data.sizeSqm,
      housingAgeYears: data.housingAgeYears,
      amenities: data.amenities,
      requestedRentGhs: data.requestedRentGhs,
    });

    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...data,
      id: newId,
      allowableRentGhs: val.calculatedMaxRentGhs,
      priceStatus: "PENDING_REVIEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      valuation: {
        id: `val-${newId}`,
        propertyId: newId,
        baseRateGhs: val.baseRateGhs,
        zoneWeight: val.zoneWeight,
        ageDepreciationFactor: val.ageDepreciationFactor,
        amenitiesBonusGhs: val.amenitiesBonusGhs,
        calculatedMaxRentGhs: val.calculatedMaxRentGhs,
        flaggedOverpriced: val.flaggedOverpriced,
        variancePercent: val.variancePercent,
        assessedBy: "AUTOMATED_RENT_CONTROL_ENGINE",
        assessedAt: new Date().toISOString(),
      },
    };

    this.properties.unshift(newProperty);
    return newProperty;
  }

  adminReviewProperty(
    id: string,
    action: "APPROVE_AS_IS" | "APPROVE_CAPPED" | "REJECT",
    cappedPrice?: number,
    rejectionReason?: string
  ): Property | null {
    const property = this.properties.find((p) => p.id === id);
    if (!property) return null;

    if (action === "REJECT") {
      property.priceStatus = "REJECTED";
      property.rejectionReason = rejectionReason || "Valuation rejected by Rent Control Department.";
    } else if (action === "APPROVE_CAPPED") {
      property.priceStatus = "APPROVED_CAPPED";
      property.allowableRentGhs = cappedPrice || property.valuation?.calculatedMaxRentGhs || property.requestedRentGhs;
      property.certNumber = `GRC-${property.region.substring(0, 3).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      property.certifiedAt = new Date().toISOString();
      property.rejectionReason = undefined;
    } else {
      property.priceStatus = "APPROVED_CAPPED";
      property.allowableRentGhs = property.requestedRentGhs;
      property.certNumber = `GRC-${property.region.substring(0, 3).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      property.certifiedAt = new Date().toISOString();
      property.rejectionReason = undefined;
    }

    property.updatedAt = new Date().toISOString();
    return property;
  }

  // Applications
  createApplication(
    data: Omit<Application, "id" | "createdAt" | "status">
  ): Application {
    const newApp: Application = {
      ...data,
      id: `app-${Date.now()}`,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  getApplications(userId?: string, role?: string): Application[] {
    if (!userId || role === "ADMIN_OFFICER") return this.applications;
    if (role === "TENANT") {
      return this.applications.filter((a) => a.tenantId === userId);
    }
    // For landlord, find properties owned by landlord
    const myPropIds = this.properties
      .filter((p) => p.landlordId === userId)
      .map((p) => p.id);
    return this.applications.filter((a) => myPropIds.includes(a.propertyId));
  }

  updateApplicationStatus(id: string, status: Application["status"]): Application | null {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;
    app.status = status;
    return app;
  }

  // Contracts
  getContracts(userId?: string): TenancyContract[] {
    if (!userId) return this.contracts;
    return this.contracts.filter(
      (c) => c.tenantId === userId || c.landlordId === userId
    );
  }

  getContractById(id: string): TenancyContract | undefined {
    return this.contracts.find((c) => c.id === id);
  }

  createContract(
    data: Omit<TenancyContract, "id" | "contractNumber" | "createdAt" | "status">
  ): TenancyContract {
    const contractNumber = `GRC-TC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newContract: TenancyContract = {
      ...data,
      id: `contract-${Date.now()}`,
      contractNumber,
      advanceMonths: Math.min(data.advanceMonths || 6, 6), // Enforce statutory 6 months cap
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };
    this.contracts.unshift(newContract);
    return newContract;
  }

  signContract(id: string, role: "LANDLORD" | "TENANT" | "ADMIN_OFFICER"): TenancyContract | null {
    const contract = this.contracts.find((c) => c.id === id);
    if (!contract) return null;

    const now = new Date().toISOString();
    if (role === "LANDLORD") {
      contract.landlordSignedAt = now;
    } else if (role === "TENANT") {
      contract.tenantSignedAt = now;
    } else if (role === "ADMIN_OFFICER") {
      contract.officerApprovedAt = now;
    }

    if (contract.landlordSignedAt && contract.tenantSignedAt) {
      contract.status = "SIGNED_ACTIVE";
    }

    return contract;
  }

  // Disputes
  getDisputes(): Dispute[] {
    return this.disputes;
  }

  createDispute(data: Omit<Dispute, "id" | "caseNumber" | "createdAt" | "status">): Dispute {
    const caseNumber = `GRC-DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute: Dispute = {
      ...data,
      id: `disp-${Date.now()}`,
      caseNumber,
      status: "LODGED",
      createdAt: new Date().toISOString(),
    };
    this.disputes.unshift(newDispute);
    return newDispute;
  }

  updateDisputeStatus(
    id: string,
    status: Dispute["status"],
    hearingDate?: string,
    resolutionDetails?: string
  ): Dispute | null {
    const disp = this.disputes.find((d) => d.id === id);
    if (!disp) return null;
    disp.status = status;
    if (hearingDate) disp.hearingDate = hearingDate;
    if (resolutionDetails) disp.resolutionDetails = resolutionDetails;
    return disp;
  }

  // Payments
  getPayments(userId?: string): RentPayment[] {
    if (!userId) return this.payments;
    return this.payments.filter((p) => p.tenantId === userId);
  }

  createPayment(data: Omit<RentPayment, "id" | "transactionRef" | "paidAt" | "receiptNumber" | "status">): RentPayment {
    const ref = `MOMO-GRC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `GRC-RCP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: RentPayment = {
      ...data,
      id: `pay-${Date.now()}`,
      transactionRef: ref,
      receiptNumber,
      status: "CONFIRMED",
      paidAt: new Date().toISOString(),
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // Analytics for Rent Control Admin
  getAdminStats() {
    const totalListings = this.properties.length;
    const approvedListings = this.properties.filter((p) => p.priceStatus === "APPROVED_CAPPED").length;
    const pendingReview = this.properties.filter((p) => p.priceStatus === "PENDING_REVIEW").length;
    const rejectedListings = this.properties.filter((p) => p.priceStatus === "REJECTED").length;
    const totalDisputes = this.disputes.length;
    const activeDisputes = this.disputes.filter((d) => d.status !== "RESOLVED" && d.status !== "DISMISSED").length;
    const activeContracts = this.contracts.filter((c) => c.status === "SIGNED_ACTIVE").length;

    // Price index by district
    const districtPrices: Record<string, { count: number; totalRent: number }> = {};
    for (const prop of this.properties) {
      const town = prop.districtTown;
      const rent = prop.allowableRentGhs || prop.requestedRentGhs;
      if (!districtPrices[town]) {
        districtPrices[town] = { count: 0, totalRent: 0 };
      }
      districtPrices[town].count += 1;
      districtPrices[town].totalRent += rent;
    }

    const priceIndexByDistrict = Object.entries(districtPrices).map(([district, data]) => ({
      district,
      avgRentGhs: Math.round(data.totalRent / data.count),
      listingCount: data.count,
    }));

    return {
      totalListings,
      approvedListings,
      pendingReview,
      rejectedListings,
      totalDisputes,
      activeDisputes,
      activeContracts,
      priceIndexByDistrict,
    };
  }
}

// Global declaration for hot reload singleton
declare global {
  // eslint-disable-next-line no-var
  var __rentControlStore: DataStore | undefined;
}

export const dbStore = globalThis.__rentControlStore || new DataStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__rentControlStore = dbStore;
}
