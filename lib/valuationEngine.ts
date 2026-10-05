import { PropertyType } from "./types";

export interface ZoneConfig {
  region: string;
  districts: {
    name: string;
    zoneCategory: "PRIME" | "URBAN" | "DEVELOPING" | "SUBURBAN";
    weight: number;
  }[];
}

export const GHANA_ZONES: ZoneConfig[] = [
  {
    region: "Greater Accra",
    districts: [
      { name: "East Legon", zoneCategory: "PRIME", weight: 1.70 },
      { name: "Airport Residential", zoneCategory: "PRIME", weight: 1.75 },
      { name: "Cantonments", zoneCategory: "PRIME", weight: 1.80 },
      { name: "Ridge / Labone", zoneCategory: "PRIME", weight: 1.65 },
      { name: "Roman Ridge", zoneCategory: "PRIME", weight: 1.60 },
      { name: "Dzorwulu", zoneCategory: "URBAN", weight: 1.45 },
      { name: "Osu / Ringway", zoneCategory: "URBAN", weight: 1.40 },
      { name: "Spintex Road", zoneCategory: "URBAN", weight: 1.35 },
      { name: "Achimota / Tesano", zoneCategory: "URBAN", weight: 1.30 },
      { name: "Dansoman", zoneCategory: "URBAN", weight: 1.20 },
      { name: "Adenta / Frafraha", zoneCategory: "DEVELOPING", weight: 1.15 },
      { name: "Madina", zoneCategory: "DEVELOPING", weight: 1.10 },
      { name: "Haatso / Agbogba", zoneCategory: "DEVELOPING", weight: 1.15 },
      { name: "Tema (Comm 1 - 25)", zoneCategory: "DEVELOPING", weight: 1.15 },
      { name: "Kasoa (GA-Central boundary)", zoneCategory: "SUBURBAN", weight: 0.95 },
      { name: "Amasaman / Pokuase", zoneCategory: "SUBURBAN", weight: 0.95 },
      { name: "Dawhenya / Prampram", zoneCategory: "SUBURBAN", weight: 0.90 },
      { name: "Other Greater Accra", zoneCategory: "SUBURBAN", weight: 1.00 },
    ],
  },
  {
    region: "Ashanti",
    districts: [
      { name: "Ahodwo / Nhyiaeso", zoneCategory: "PRIME", weight: 1.30 },
      { name: "Asokwa / Ridge", zoneCategory: "PRIME", weight: 1.25 },
      { name: "KNUST / Ayeduase", zoneCategory: "URBAN", weight: 1.15 },
      { name: "Bantama / Kwadaso", zoneCategory: "URBAN", weight: 1.05 },
      { name: "Tafo / Suame", zoneCategory: "DEVELOPING", weight: 0.95 },
      { name: "Santasi / Tanoso", zoneCategory: "DEVELOPING", weight: 0.95 },
      { name: "Ejisu", zoneCategory: "SUBURBAN", weight: 0.85 },
      { name: "Other Ashanti", zoneCategory: "SUBURBAN", weight: 0.85 },
    ],
  },
  {
    region: "Western",
    districts: [
      { name: "Takoradi Beach Road", zoneCategory: "PRIME", weight: 1.25 },
      { name: "Airport Ridge Takoradi", zoneCategory: "PRIME", weight: 1.20 },
      { name: "Sekondi / Effiakuma", zoneCategory: "URBAN", weight: 0.95 },
      { name: "Kwesimintsim / Anaji", zoneCategory: "DEVELOPING", weight: 0.95 },
      { name: "Other Western", zoneCategory: "SUBURBAN", weight: 0.85 },
    ],
  },
  {
    region: "Central",
    districts: [
      { name: "Cape Coast Metropolis", zoneCategory: "URBAN", weight: 0.90 },
      { name: "UCC Campus Area", zoneCategory: "URBAN", weight: 0.95 },
      { name: "Winneba", zoneCategory: "DEVELOPING", weight: 0.85 },
      { name: "Kasoa Town Center", zoneCategory: "DEVELOPING", weight: 0.95 },
      { name: "Other Central", zoneCategory: "SUBURBAN", weight: 0.80 },
    ],
  },
  {
    region: "Eastern",
    districts: [
      { name: "Koforidua Central", zoneCategory: "URBAN", weight: 0.90 },
      { name: "Akosombo / Somanya", zoneCategory: "DEVELOPING", weight: 0.85 },
      { name: "Other Eastern", zoneCategory: "SUBURBAN", weight: 0.75 },
    ],
  },
  {
    region: "Northern",
    districts: [
      { name: "Tamale Central", zoneCategory: "URBAN", weight: 0.85 },
      { name: "Other Northern", zoneCategory: "SUBURBAN", weight: 0.70 },
    ],
  },
];

export const BASE_RATES: Record<PropertyType, { baseRent: number; baselineSqm: number }> = {
  SINGLE_ROOM: { baseRent: 260, baselineSqm: 18 },
  CHAMBER_AND_HALL: { baseRent: 650, baselineSqm: 36 },
  APARTMENT_1BED: { baseRent: 1250, baselineSqm: 52 },
  APARTMENT_2BED: { baseRent: 2100, baselineSqm: 85 },
  APARTMENT_3BED: { baseRent: 3300, baselineSqm: 130 },
  DETACHED_HOUSE: { baseRent: 4900, baselineSqm: 220 },
  COMMERCIAL_SHOP: { baseRent: 1900, baselineSqm: 40 },
};

export const AMENITY_VALUATIONS: Record<string, number> = {
  "Self-Contained Bathroom": 160,
  "Dedicated ECG Prepaid Meter": 120,
  "Ghana Water (GWCL) Piped": 130,
  "Polytank Water Reservoir": 80,
  "Standby Generator / Solar": 260,
  "Walled & Gated Compound": 150,
  "Air Conditioning": 180,
  "Security Guard / CCTV": 160,
  "Paved Compound / Parking": 100,
  "Fitted Kitchen Cabinets": 150,
  "High Speed Internet Ready": 90,
  "Tiled Floors": 110,
};

export function getZoneWeight(region: string, districtTown: string): number {
  const reg = GHANA_ZONES.find((z) => z.region.toLowerCase() === region.toLowerCase());
  if (!reg) return 0.90;

  const dist = reg.districts.find(
    (d) =>
      d.name.toLowerCase().includes(districtTown.toLowerCase()) ||
      districtTown.toLowerCase().includes(d.name.toLowerCase())
  );

  return dist ? dist.weight : reg.districts[reg.districts.length - 1].weight;
}

export function getAgeDepreciationFactor(years: number): number {
  if (years <= 3) return 1.08; // New construction bonus
  if (years <= 8) return 1.00; // Optimal standard
  if (years <= 15) return 0.94; // Mild aging
  if (years <= 25) return 0.85; // Medium aging
  if (years <= 40) return 0.75; // Depreciated structure
  return 0.65; // Heavily depreciated
}

export interface ValuationCalculationInput {
  propertyType: PropertyType;
  region: string;
  districtTown: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  housingAgeYears: number;
  amenities: string[];
  requestedRentGhs: number;
}

export interface ValuationResult {
  baseRateGhs: number;
  zoneWeight: number;
  ageDepreciationFactor: number;
  amenitiesBonusGhs: number;
  sizeAdjustmentMultiplier: number;
  calculatedMaxRentGhs: number;
  requestedRentGhs: number;
  flaggedOverpriced: boolean;
  variancePercent: number; // Positive means requested is over allowable
  varianceAmountGhs: number;
  recommendation: string;
  officialCertCode: string;
}

export function calculateRentValuation(input: ValuationCalculationInput): ValuationResult {
  const baseConfig = BASE_RATES[input.propertyType] || BASE_RATES.APARTMENT_1BED;
  const baseRate = baseConfig.baseRent;

  // Zone Weight
  const zoneWeight = getZoneWeight(input.region, input.districtTown);

  // Age Depreciation Factor
  const ageFactor = getAgeDepreciationFactor(input.housingAgeYears);

  // Amenity Sum
  let amenitiesBonus = 0;
  for (const amenity of input.amenities) {
    if (AMENITY_VALUATIONS[amenity]) {
      amenitiesBonus += AMENITY_VALUATIONS[amenity];
    } else {
      amenitiesBonus += 60; // generic recognized amenity
    }
  }

  // Size adjustment (compare actual size to baseline)
  const sizeRatio = input.sizeSqm / baseConfig.baselineSqm;
  // Apply a tempered 35% sensitivity to size differences
  const sizeMultiplier = Math.max(0.75, Math.min(1.45, 1 + (sizeRatio - 1) * 0.35));

  // Rent Control Formula:
  // (BaseRate * ZoneWeight * SizeMultiplier * AgeFactor) + (AmenitiesBonus * ZoneWeight * 0.7)
  const structuralRent = baseRate * zoneWeight * sizeMultiplier * ageFactor;
  const amenityContribution = amenitiesBonus * (0.8 + zoneWeight * 0.2);

  const rawCalculatedRent = structuralRent + amenityContribution;

  // Round up to nearest GH₵ 10 for clean official gazette pricing
  const calculatedMaxRentGhs = Math.round(rawCalculatedRent / 10) * 10;

  const varianceAmountGhs = input.requestedRentGhs - calculatedMaxRentGhs;
  const variancePercent = Number(((varianceAmountGhs / calculatedMaxRentGhs) * 100).toFixed(1));

  // Flagged overpriced if requested exceeds calculated max legal rent by more than 3%
  const flaggedOverpriced = variancePercent > 3.0;

  let recommendation = "";
  if (flaggedOverpriced) {
    recommendation = `Requested rent of GH₵ ${input.requestedRentGhs.toLocaleString()} exceeds the legally assessed Rent Control threshold of GH₵ ${calculatedMaxRentGhs.toLocaleString()} by ${variancePercent}%. Under Ghana Rent Act 1963 (Act 220), this property must be price-capped at GH₵ ${calculatedMaxRentGhs.toLocaleString()} prior to approval.`;
  } else {
    recommendation = `Requested rent of GH₵ ${input.requestedRentGhs.toLocaleString()} falls within the approved Rent Control ceiling of GH₵ ${calculatedMaxRentGhs.toLocaleString()}. Qualified for immediate Rent Assessment Certification.`;
  }

  // Generate unique certificate ID preview
  const prefix = input.region.substring(0, 3).toUpperCase();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const officialCertCode = `GRC-${prefix}-2026-${randNum}`;

  return {
    baseRateGhs: baseRate,
    zoneWeight,
    ageDepreciationFactor: ageFactor,
    amenitiesBonusGhs: Math.round(amenityContribution),
    sizeAdjustmentMultiplier: Number(sizeMultiplier.toFixed(2)),
    calculatedMaxRentGhs,
    requestedRentGhs: input.requestedRentGhs,
    flaggedOverpriced,
    variancePercent,
    varianceAmountGhs,
    recommendation,
    officialCertCode,
  };
}
