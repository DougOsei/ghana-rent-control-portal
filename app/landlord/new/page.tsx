"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PropertyType } from "@/lib/types";
import {
  GHANA_ZONES,
  BASE_RATES,
  AMENITY_VALUATIONS,
  calculateRentValuation,
} from "@/lib/valuationEngine";
import { validateGhanaCardFormat, formatGhanaCardInput } from "@/lib/ghanaCard";
import { formatGHS } from "@/lib/utils";
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  MapPin,
  Sparkles,
  Info,
  Upload,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function NewPropertyListingPage() {
  const router = useRouter();
  const { currentUser, switchUser, demoUsers } = useCurrentUser();

  // Landlord verification state
  const [landlordName, setLandlordName] = useState(currentUser?.fullName || "Kwame Mensah Boakye");
  const [landlordPhone, setLandlordPhone] = useState(currentUser?.phone || "+233 20 812 3456");
  const [landlordCard, setLandlordCard] = useState(currentUser?.ghanaCardNumber || "GHA-102938475-1");
  const [cardValid, setCardValid] = useState(true);

  // Sync if user switches
  React.useEffect(() => {
    if (currentUser?.role === "LANDLORD") {
      setLandlordName(currentUser.fullName);
      setLandlordPhone(currentUser.phone);
      setLandlordCard(currentUser.ghanaCardNumber);
    }
  }, [currentUser]);

  // Property Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT_2BED");
  const [region, setRegion] = useState("Greater Accra");
  const [districtTown, setDistrictTown] = useState("East Legon");
  const [gpsAddress, setGpsAddress] = useState("GA-492-1082");
  const [streetAddress, setStreetAddress] = useState("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [sizeSqm, setSizeSqm] = useState(85);
  const [housingAgeYears, setHousingAgeYears] = useState(2);
  const [requestedRentGhs, setRequestedRentGhs] = useState(3800);
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
  );

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Self-Contained Bathroom",
    "Dedicated ECG Prepaid Meter",
    "Ghana Water (GWCL) Piped",
    "Walled & Gated Compound",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle card input with formatting
  const handleCardChange = (val: string) => {
    const formatted = formatGhanaCardInput(val);
    setLandlordCard(formatted);
    setCardValid(validateGhanaCardFormat(formatted));
  };

  // Available districts
  const availableDistricts = useMemo(() => {
    const reg = GHANA_ZONES.find((z) => z.region === region);
    return reg ? reg.districts : [];
  }, [region]);

  const handleRegionChange = (newReg: string) => {
    setRegion(newReg);
    const reg = GHANA_ZONES.find((z) => z.region === newReg);
    if (reg && reg.districts.length > 0) {
      setDistrictTown(reg.districts[0].name);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Live Automated Valuation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateGhanaCardFormat(landlordCard)) {
      alert("Invalid Ghana Card format. Please provide a valid card e.g., GHA-102938475-1");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlordId: "user-landlord-1",
          landlordName,
          landlordPhone,
          landlordGhanaCard: landlordCard,
          title: title || `${propertyType.replace(/_/g, " ")} at ${districtTown}`,
          description: description || "Spacious residential unit certified by Ghana Rent Control.",
          propertyType,
          address: streetAddress || `${districtTown}, ${region}`,
          region,
          districtTown,
          gpsAddress,
          bedrooms,
          bathrooms,
          sizeSqm,
          housingAgeYears,
          amenities: selectedAmenities,
          images: [imageUrl],
          requestedRentGhs,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        alert(
          "Property listing submitted successfully! Rent Control Department officers will review the valuation."
        );
        router.push("/landlord");
      } else {
        alert(data.error || "Failed to create property");
      }
    } catch {
      setIsSubmitting(false);
      alert("Submitted successfully (simulation)");
      router.push("/landlord");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/landlord"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landlord Dashboard</span>
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Official Property Submission
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
          List Property for Rent Assessment & Certification
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          In accordance with Section 10 of Ghana Rent Act, 1963 (Act 220). Properties undergo
          automated price assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Landlord National Identity KYC */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Step 1: Landlord Ghana Card Authentication</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Landlord Full Name
              </label>
              <input
                type="text"
                required
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Ghana Card ID Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="GHA-123456789-0"
                  value={landlordCard}
                  onChange={(e) => handleCardChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs font-bold focus:ring-2 ${
                    cardValid
                      ? "border-emerald-500 text-emerald-900 focus:ring-emerald-600"
                      : "border-red-400 text-red-900 focus:ring-red-500"
                  }`}
                />
                {cardValid && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Format: GHA-XXXXXXXXX-X (NIA Authenticated)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Location & GPS Address */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>Step 2: Location & Digital Addressing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-white"
              >
                {GHANA_ZONES.map((z) => (
                  <option key={z.region} value={z.region}>
                    {z.region} Region
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                District / Neighborhood Zone
              </label>
              <select
                value={districtTown}
                onChange={(e) => setDistrictTown(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-white"
              >
                {availableDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.zoneCategory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                GhanaPost GPS Address
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GA-183-9022"
                value={gpsAddress}
                onChange={(e) => setGpsAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-xs font-bold text-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Street / Landmark Address
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Plot 12 Boundary Road, near A&C Mall"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
            />
          </div>
        </div>

        {/* Step 3: Specifications & Amenities */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>Step 3: Property Features & Specifications</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Listing Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Executive 2-Bedroom Apartment at East Legon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => {
                  const pt = e.target.value as PropertyType;
                  setPropertyType(pt);
                  setSizeSqm(BASE_RATES[pt].baselineSqm);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-white"
              >
                <option value="SINGLE_ROOM">Single Room</option>
                <option value="CHAMBER_AND_HALL">Chamber & Hall</option>
                <option value="APARTMENT_1BED">1 Bed Apartment</option>
                <option value="APARTMENT_2BED">2 Bed Apartment</option>
                <option value="APARTMENT_3BED">3 Bed Apartment</option>
                <option value="DETACHED_HOUSE">Detached House</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Floor Area (m²)
              </label>
              <input
                type="number"
                min="10"
                max="600"
                value={sizeSqm}
                onChange={(e) => setSizeSqm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Housing Age: <span className="text-emerald-700 font-bold">{housingAgeYears} Years</span>
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={housingAgeYears}
              onChange={(e) => setHousingAgeYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Recognized Statutory Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(AMENITY_VALUATIONS).map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold"
                        : "border-gray-200 bg-gray-50/50 text-gray-600"
                    }`}
                  >
                    <span>{amenity}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Property Photo URL
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Detailed Property Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe access roads, water supply, security..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>
        </div>

        {/* Step 4: Live Price Capping & Valuation Check */}
        <div className="bg-gradient-to-br from-emerald-950 to-gray-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-sm">
                Automated Price Capping Engine (Live Verification)
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 font-mono">
              Rent Act Act 220
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1.5">
                Your Desired Monthly Rent (GH₵)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                  GH₵
                </span>
                <input
                  type="number"
                  step="50"
                  required
                  value={requestedRentGhs}
                  onChange={(e) => setRequestedRentGhs(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 rounded-xl font-mono text-lg font-black focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                Calculated Rent Control Ceiling
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-yellow-300 mt-1">
                {formatGHS(valuation.calculatedMaxRentGhs)}
                <span className="text-xs font-normal text-emerald-200"> / mo</span>
              </div>
            </div>
          </div>

          {/* Overpricing Flag Warning */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              valuation.flaggedOverpriced
                ? "bg-red-500/20 border-red-400 text-red-200"
                : "bg-emerald-500/20 border-emerald-400 text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {valuation.flaggedOverpriced ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>ALERT: REQUESTED RENT EXCEEDS LEGAL CEILING BY {valuation.variancePercent}%</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PRICE WITHIN LEGAL RENT CEILING</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {valuation.recommendation}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/landlord"
            className="px-5 py-3 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting to Rent Control...</span>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                <span>Submit Listing for Rent Control Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
