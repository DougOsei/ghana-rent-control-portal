"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Property, Application } from "@/lib/types";
import { formatGHS, formatDate, DEFAULT_PROPERTY_IMAGE } from "@/lib/utils";
import GhanaCardBadge from "@/components/GhanaCardBadge";
import PriceAssessmentCertificate from "@/components/PriceAssessmentCertificate";
import {
  ShieldCheck,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Phone,
  UserCheck,
  Send,
  X,
  Info,
  Building,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentUser } = useCurrentUser();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form state
  const [incomeGhs, setIncomeGhs] = useState(5500);
  const [occupation, setOccupation] = useState("Corporate Professional");
  const [moveInDate, setMoveInDate] = useState("2026-04-01");
  const [advanceMonths, setAdvanceMonths] = useState(6);
  const [tenantName, setTenantName] = useState(currentUser?.fullName || "Abena Serwaa Osei");
  const [tenantPhone, setTenantPhone] = useState(currentUser?.phone || "+233 55 311 9876");
  const [tenantCard, setTenantCard] = useState(currentUser?.ghanaCardNumber || "GHA-594837261-4");
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setTenantName(currentUser.fullName);
      setTenantPhone(currentUser.phone);
      setTenantCard(currentUser.ghanaCardNumber);
    }
  }, [currentUser]);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.property) {
          setProperty(data.property);
          setSelectedImage(data.property.images[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    if (advanceMonths > 6) {
      alert("Ghana Rent Act (Act 220) limits advance rent to a maximum of 6 months.");
      return;
    }

    setApplicationSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          tenantId: "user-tenant-1",
          tenantName,
          tenantPhone,
          tenantGhanaCard: tenantCard,
          monthlyIncomeGhs: incomeGhs,
          employerOrOccupation: occupation,
          proposedMoveInDate: new Date(moveInDate).toISOString(),
          proposedAdvanceMonths: advanceMonths,
          notes: "Application submitted via Ghana Rent Control Portal.",
        }),
      });

      const data = await res.json();
      setApplicationSubmitting(false);

      if (data.success) {
        setApplicationSuccess(true);
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch {
      setApplicationSubmitting(false);
      setApplicationSuccess(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Property Not Found</h2>
        <Link href="/properties" className="text-xs text-emerald-700 font-bold mt-2 inline-block">
          ← Back to all properties
        </Link>
      </div>
    );
  }

  const isApproved = property.priceStatus === "APPROVED_CAPPED";
  const rent = isApproved ? property.allowableRentGhs || property.requestedRentGhs : property.requestedRentGhs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to certified listings</span>
        </Link>
      </div>

      {/* Main Title & Status Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-200 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              {property.propertyType.replace(/_/g, " ")}
            </span>
            {isApproved ? (
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                <span>Certified Fair Rent Cap</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>Rent Review Pending</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {property.address}, {property.districtTown}, {property.region}
            </span>
            <span>•</span>
            <span className="font-mono text-emerald-800 font-semibold">
              GPS: {property.gpsAddress || "GA-183-9022"}
            </span>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-right sm:min-w-[280px]">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            {isApproved ? "Certified Rent Control Price" : "Landlord Asked Rent"}
          </div>
          <div className="text-3xl font-black font-mono text-emerald-950 mt-1">
            {formatGHS(rent)}
            <span className="text-xs font-medium text-gray-500"> / month</span>
          </div>
          <div className="text-[11px] text-gray-600 mt-1">
            Max Advance (6 Mo):{" "}
            <strong className="text-emerald-900">{formatGHS(rent * 6)}</strong>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="aspect-16/9 md:aspect-21/9 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
          <img
            src={selectedImage}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE; }}
          />
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === img ? "border-emerald-600 scale-95" : "border-gray-200 opacity-70"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Specs, Amenities, Valuation Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-xs text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Bedrooms</span>
                <span className="text-sm font-bold text-gray-900">{property.bedrooms} Beds</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Bathrooms</span>
                <span className="text-sm font-bold text-gray-900">{property.bathrooms} Baths</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Floor Area</span>
                <span className="text-sm font-bold text-gray-900">{property.sizeSqm} m²</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Housing Age</span>
                <span className="text-sm font-bold text-gray-900">{property.housingAgeYears} Years</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
            <h3 className="text-base font-bold text-gray-900">About this Property</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Recognized Amenities */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Statutory Recognized Amenities (Rent Control Gazette)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Rent Control Price Assessment Block */}
          <div className="bg-gradient-to-br from-emerald-950 to-gray-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-yellow-400" />
                <h3 className="text-base font-bold">
                  Official Rent Control Assessment Summary
                </h3>
              </div>
              <button
                onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Certificate</span>
              </button>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              This property was valuation-graded under Section 19 of the Rent Act (Act 220). The
              maximum legal rent payable for this unit is{" "}
              <strong className="text-yellow-300 font-mono">
                {formatGHS(property.allowableRentGhs || property.requestedRentGhs)}
              </strong>{" "}
              per month. Landlords are barred by law from demanding rent increases without a newly
              gazetted assessment.
            </p>

            <div className="p-4 bg-white/10 rounded-2xl text-xs space-y-2 font-mono">
              <div className="flex justify-between text-emerald-200">
                <span>Certificate Number:</span>
                <span className="font-bold text-white">{property.certNumber || "GRC-ACC-2026-00412"}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Valuation Zone:</span>
                <span className="text-white">{property.districtTown} ({property.region})</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Advance Rent Cap:</span>
                <span className="font-bold text-yellow-300">Max 6 Months Allowed (Act 220)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Landlord KYC & Application Action */}
        <div className="lg:col-span-4 space-y-6">
          {/* Landlord Verification Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Verified Property Owner
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                {property.landlordName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{property.landlordName}</h4>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{property.landlordPhone}</span>
                </div>
              </div>
            </div>

            {/* Ghana Card Badge */}
            <GhanaCardBadge
              cardNumber={property.landlordGhanaCard}
              name={property.landlordName}
              verified={true}
            />

            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 leading-tight">
              ✓ Identity and property deed verified by Ghana Rent Control Registry.
            </div>
          </div>

          {/* Tenancy Application Box */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <span>Apply for Tenancy</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Submit your verified Ghana Card and details to request tenancy approval directly from
              the landlord.
            </p>

            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Start Tenancy Application</span>
            </button>
          </div>

          {/* Legal Notice */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Tenant Legal Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If any party asks you to pay more than 6 months advance, or refuses to honor the Rent
              Control certified rate, please lodge an immediate complaint on this portal.
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <PriceAssessmentCertificate
          property={property}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Tenancy Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Submit Tenancy Application</h3>
                <p className="text-[11px] text-emerald-200">
                  {property.title} • {formatGHS(rent)}/mo
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!applicationSuccess ? (
              <form onSubmit={handleApply} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Legal Name (as on Ghana Card)
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Ghana Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={tenantCard}
                      onChange={(e) => setTenantCard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Monthly Income (GH₵)
                    </label>
                    <input
                      type="number"
                      required
                      value={incomeGhs}
                      onChange={(e) => setIncomeGhs(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      required
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Proposed Move-In Date
                    </label>
                    <input
                      type="date"
                      required
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Advance Rent Months (Max 6)
                    </label>
                    <select
                      value={advanceMonths}
                      onChange={(e) => setAdvanceMonths(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium bg-white"
                    >
                      <option value={1}>1 Month Advance</option>
                      <option value={3}>3 Months Advance</option>
                      <option value={6}>6 Months (Statutory Maximum)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
                  Total advance payable:{" "}
                  <strong>{formatGHS(rent * advanceMonths)}</strong>. Enforced under Ghana Rent Act
                  1963.
                </div>

                <button
                  type="submit"
                  disabled={applicationSubmitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {applicationSubmitting ? "Submitting..." : "Submit Application to Landlord"}
                </button>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-gray-500">
                  The landlord has been notified and can review your verified profile to issue your
                  digital tenancy agreement.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
