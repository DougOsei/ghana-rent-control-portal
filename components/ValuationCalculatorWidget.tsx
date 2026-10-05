"use client";

import React, { useState, useMemo } from "react";
import { PropertyType } from "@/lib/types";
import {
  GHANA_ZONES,
  BASE_RATES,
  AMENITY_VALUATIONS,
  calculateRentValuation,
} from "@/lib/valuationEngine";
import { formatGHS } from "@/lib/utils";
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Building,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function ValuationCalculatorWidget() {
  const [region, setRegion] = useState("Greater Accra");
  const [districtTown, setDistrictTown] = useState("East Legon");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT_2BED");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [sizeSqm, setSizeSqm] = useState(85);
  const [housingAgeYears, setHousingAgeYears] = useState(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Self-Contained Bathroom",
    "Dedicated ECG Prepaid Meter",
    "Ghana Water (GWCL) Piped",
    "Walled & Gated Compound",
    "Air Conditioning",
  ]);
  const [requestedRentGhs, setRequestedRentGhs] = useState(3800);

  // Available districts for chosen region
  const availableDistricts = useMemo(() => {
    const reg = GHANA_ZONES.find((z) => z.region === region);
    return reg ? reg.districts : [];
  }, [region]);

  // Handle region change
  const handleRegionChange = (newReg: string) => {
    setRegion(newReg);
    const reg = GHANA_ZONES.find((z) => z.region === newReg);
    if (reg && reg.districts.length > 0) {
      setDistrictTown(reg.districts[0].name);
    }
  };

  // Toggle amenity
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Live Valuation Calculation
  const valuation = useMemo(() => {
    return calculateRentValuation({
      propertyType,
      region,
      districtTown,
      bedrooms,
      bathrooms,
      sizeSqm,
      housingAgeYears,
      amenities: selectedAmenities,
      requestedRentGhs,
    });
  }, [
    propertyType,
    region,
    districtTown,
    bedrooms,
    bathrooms,
    sizeSqm,
    housingAgeYears,
    selectedAmenities,
    requestedRentGhs,
  ]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-yellow-400 border border-white/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  Rent Control Official Valuation Engine
                </h2>
                <span className="text-[10px] uppercase font-bold bg-yellow-400 text-emerald-950 px-2 py-0.5 rounded-full">
                  Rent Act 220
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Simulate Ghana Rent Control legally assessed ceiling rates by zone, age & amenities
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-emerald-300 uppercase font-semibold">Regulatory Framework</div>
            <div className="text-xs font-mono font-bold text-white">Act 220 of 1963 (Ghana Gazette)</div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Location Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
              >
                {GHANA_ZONES.map((z) => (
                  <option key={z.region} value={z.region}>
                    {z.region} Region
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                District / Neighborhood Zone
              </label>
              <select
                value={districtTown}
                onChange={(e) => setDistrictTown(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
              >
                {availableDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.zoneCategory})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Property Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => {
                  const pt = e.target.value as PropertyType;
                  setPropertyType(pt);
                  setSizeSqm(BASE_RATES[pt].baselineSqm);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="SINGLE_ROOM">Single Room</option>
                <option value="CHAMBER_AND_HALL">Chamber & Hall</option>
                <option value="APARTMENT_1BED">1-Bedroom Flat</option>
                <option value="APARTMENT_2BED">2-Bedroom Apartment</option>
                <option value="APARTMENT_3BED">3-Bedroom Apartment</option>
                <option value="DETACHED_HOUSE">Detached House</option>
                <option value="COMMERCIAL_SHOP">Commercial Shop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Floor Area (m²)
              </label>
              <input
                type="number"
                min="10"
                max="800"
                value={sizeSqm}
                onChange={(e) => setSizeSqm(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Housing Age: <span className="text-emerald-700">{housingAgeYears} yrs</span>
              </label>
              <input
                type="range"
                min="1"
                max="40"
                value={housingAgeYears}
                onChange={(e) => setHousingAgeYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
              />
            </div>
          </div>

          {/* Statutory Amenities Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Recognized Amenities (Rent Control Gazette)
              </label>
              <span className="text-xs text-gray-400">
                {selectedAmenities.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(AMENITY_VALUATIONS).map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold"
                        : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="truncate">{amenity}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">
                        +{AMENITY_VALUATIONS[amenity]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Landlord Proposed Rent Input */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Landlord's Desired Monthly Rent (GH₵)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                GH₵
              </span>
              <input
                type="number"
                step="50"
                value={requestedRentGhs}
                onChange={(e) => setRequestedRentGhs(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-2.5 bg-white rounded-xl border border-gray-300 font-mono text-base font-bold text-gray-900 focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. 3500"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              The engine compares this figure against Section 19 Rent Ceiling guidelines for this district.
            </p>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-radial from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/50 relative overflow-hidden">
            {/* Watermark */}
            <ShieldCheck className="absolute -right-6 -bottom-6 w-44 h-44 text-emerald-800/20 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                Official Valuation Result
              </span>
              <span className="text-[10px] font-mono text-emerald-200 bg-white/10 px-2 py-0.5 rounded">
                Ref: {valuation.officialCertCode}
              </span>
            </div>

            {/* Ceiling Figure */}
            <div className="mb-6">
              <span className="text-xs text-emerald-200 block uppercase font-medium">
                Maximum Allowable Rent (Price Cap)
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-yellow-300 mt-0.5">
                {formatGHS(valuation.calculatedMaxRentGhs)}
                <span className="text-sm font-normal text-emerald-200"> / month</span>
              </div>
            </div>

            {/* Price Compliance Status Banner */}
            <div
              className={`p-3.5 rounded-xl border mb-6 text-xs ${
                valuation.flaggedOverpriced
                  ? "bg-red-500/20 border-red-400 text-red-200"
                  : "bg-emerald-500/20 border-emerald-400 text-emerald-100"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {valuation.flaggedOverpriced ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-red-300">EXCEEDS RENT CONTROL CEILING</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-emerald-300">PRICE COMPLIANT & QUALIFIED</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {valuation.recommendation}
              </p>
            </div>

            {/* Algorithm Breakdown table */}
            <div className="space-y-2 text-xs border-t border-emerald-800/80 pt-4">
              <div className="flex justify-between text-emerald-200">
                <span>Base Structural Rate:</span>
                <span className="font-mono text-white">{formatGHS(valuation.baseRateGhs)}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Location Multiplier ({districtTown}):</span>
                <span className="font-mono text-white">x {valuation.zoneWeight}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Size Adjustment ({sizeSqm}m²):</span>
                <span className="font-mono text-white">x {valuation.sizeAdjustmentMultiplier}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Age Depreciation ({housingAgeYears} yrs):</span>
                <span className="font-mono text-white">x {valuation.ageDepreciationFactor}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Amenities Valuation Contribution:</span>
                <span className="font-mono text-yellow-300">+{formatGHS(valuation.amenitiesBonusGhs)}</span>
              </div>
            </div>
          </div>

          {/* Statutory Advance Rent Notice */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Rent Act Section 25(5) Statutory Advance Rule:</span>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Maximum legal advance rent payable for this property is{" "}
                <strong className="underline">
                  {formatGHS(valuation.calculatedMaxRentGhs * 6)} (6 Months)
                </strong>
                . Demanding 1 or 2 years advance is an actionable offense.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
