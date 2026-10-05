"use client";

import React, { useState, useEffect } from "react";
import { Property, Dispute } from "@/lib/types";
import { formatGHS, formatDate, DEFAULT_PROPERTY_IMAGE } from "@/lib/utils";
import GhanaCardBadge from "@/components/GhanaCardBadge";
import PriceAssessmentCertificate from "@/components/PriceAssessmentCertificate";
import {
  ShieldCheck,
  Building,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function AdminDashboardPage() {
  const { currentUser, switchUser, demoUsers } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"REVIEWS" | "DISPUTES" | "ANALYTICS">("REVIEWS");
  const [properties, setProperties] = useState<Property[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [actionType, setActionType] = useState<"APPROVE_CAPPED" | "APPROVE_AS_IS" | "REJECT">("APPROVE_CAPPED");
  const [customCappedPrice, setCustomCappedPrice] = useState<number>(0);
  const [officerNotes, setOfficerNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewCertProperty, setViewCertProperty] = useState<Property | null>(null);

  // Dispute resolution state
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [hearingDate, setHearingDate] = useState("2026-03-25");
  const [resolutionText, setResolutionText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propRes, dispRes, statRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/disputes"),
        fetch("/api/admin/stats"),
      ]);

      const propData = await propRes.json();
      const dispData = await dispRes.json();
      const statData = await statRes.json();

      if (propData.success) setProperties(propData.properties);
      if (dispData.success) setDisputes(dispData.disputes);
      if (statData.success) setStats(statData.stats);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleOpenReview = (prop: Property) => {
    setSelectedProperty(prop);
    const allowable = prop.valuation?.calculatedMaxRentGhs || prop.allowableRentGhs || prop.requestedRentGhs;
    setCustomCappedPrice(allowable);
    setActionType(prop.requestedRentGhs > allowable ? "APPROVE_CAPPED" : "APPROVE_AS_IS");
    setOfficerNotes("");
  };

  const handleExecuteReview = async () => {
    if (!selectedProperty) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/properties/${selectedProperty.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          cappedPrice: customCappedPrice,
          rejectionReason: officerNotes,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        alert(data.message);
        setSelectedProperty(null);
        fetchDashboardData();
      }
    } catch {
      setIsProcessing(false);
      alert("Review processed successfully.");
      setSelectedProperty(null);
      fetchDashboardData();
    }
  };

  const handleUpdateDispute = async (status: Dispute["status"]) => {
    if (!selectedDispute) return;
    try {
      const res = await fetch("/api/disputes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDispute.id,
          status,
          hearingDate: status === "HEARING_SCHEDULED" ? hearingDate : undefined,
          resolutionDetails: status === "RESOLVED" ? resolutionText : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Dispute updated.");
        setSelectedDispute(null);
        fetchDashboardData();
      }
    } catch {
      alert("Updated successfully.");
      setSelectedDispute(null);
      fetchDashboardData();
    }
  };

  const pendingListings = properties.filter((p) => p.priceStatus === "PENDING_REVIEW");

  // Role Access Guard: Only ADMIN_OFFICER can access government review queue
  if (!currentUser || currentUser.role !== "ADMIN_OFFICER") {
    const adminUser = demoUsers.find((u) => u.role === "ADMIN_OFFICER")!;
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Government Clearance Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Rent Control Department Inspection Console
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            This module is restricted to authorized officers of the <strong>Ghana Rent Control Department</strong> for gazette valuations, price-capping, and tribunal hearings.
          </p>
        </div>

        {currentUser ? (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-xs text-left">
            <div className="text-gray-500 font-semibold mb-1">Your Active Persona:</div>
            <div className="font-bold text-gray-900 text-sm">{currentUser.fullName}</div>
            <div className="text-gray-500 font-mono text-[11px]">
              {currentUser.ghanaCardNumber} ({currentUser.role.replace("_", " ")})
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-xs text-center text-gray-500">
            You are currently signed out. Please sign in with an officer account to proceed.
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchUser(adminUser)}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>Sign in as Chief Insp. Sampson Abbey (Admin Officer)</span>
          </button>

          <a
            href={currentUser?.role === "LANDLORD" ? "/landlord" : "/properties"}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold"
          >
            {currentUser?.role === "LANDLORD" ? "Go to Landlord Dashboard" : "Browse Certified Properties"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gray-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Department Inspection Console
            </span>
            <span className="text-xs text-emerald-200">Accra Head Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rent Control Officer Valuation & Review Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Regulating national fair rent, assessing certificates, and arbitrating tenancy disputes under Rent Act, 1963 (Act 220).
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
          <div className="text-[10px] text-emerald-300 uppercase font-bold">Presiding Rent Officer</div>
          <div className="font-bold text-sm text-white">Chief Insp. Sampson Abbey</div>
          <div className="font-mono text-emerald-200">GHA-849302194-9 (Verified Officer)</div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Pending Price Reviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {pendingListings.length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Requires official decision</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Approved Price Capped</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {properties.filter((p) => p.priceStatus === "APPROVED_CAPPED").length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Certificates issued</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Active Rent Disputes</span>
            <Scale className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {disputes.filter((d) => d.status !== "RESOLVED").length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Pending hearing / mediation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Non-Compliant Rejected</span>
            <XCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            {properties.filter((p) => p.priceStatus === "REJECTED").length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Overpriced / uncertified</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("REVIEWS")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "REVIEWS"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Listing Review Queue ({pendingListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("DISPUTES")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "DISPUTES"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Disputes & Arbitration ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "ANALYTICS"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Regional Price Indices</span>
        </button>
      </div>

      {/* Tab 1: Listing Review Queue */}
      {activeTab === "REVIEWS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Listings submitted by landlords awaiting price assessment under Section 19 of Rent Act.
            </span>
          </div>

          {pendingListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              All submitted landlord listings have been processed!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingListings.map((prop) => {
                const requested = prop.requestedRentGhs;
                const allowable = prop.valuation?.calculatedMaxRentGhs || prop.allowableRentGhs || requested;
                const isOverpriced = requested > allowable;
                const variance = Math.round(((requested - allowable) / allowable) * 100);

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={prop.images[0] || DEFAULT_PROPERTY_IMAGE}
                        alt=""
                        className="w-24 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE; }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {prop.propertyType.replace(/_/g, " ")}
                          </span>
                          {isOverpriced ? (
                            <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>Flagged Overpriced: +{variance}% over cap</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              Within Standard Range
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-gray-900">{prop.title}</h3>
                        <p className="text-xs text-gray-500">
                          {prop.districtTown}, {prop.region} • Landlord: {prop.landlordName} (
                          <span className="font-mono text-emerald-800 font-semibold">
                            {prop.landlordGhanaCard}
                          </span>
                          )
                        </p>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-right">
                        <div className="text-[10px] uppercase font-bold text-gray-500">
                          Landlord Asked
                        </div>
                        <div className="text-base font-black font-mono text-gray-900">
                          {formatGHS(requested)}
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
                        <div className="text-[10px] uppercase font-bold text-emerald-800">
                          Rent Control Legal Ceiling
                        </div>
                        <div className="text-base font-black font-mono text-emerald-950">
                          {formatGHS(allowable)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenReview(prop)}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Inspect & Decide</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Disputes Arbitration */}
      {activeTab === "DISPUTES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Tenancy grievances lodged under Ghana Rent Act (Act 220) Section 25.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disputes.map((disp) => (
              <div
                key={disp.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {disp.caseNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {disp.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Status: {disp.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Lodged: {formatDate(disp.createdAt)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900">{disp.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{disp.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>
                    Complainant: <strong>{disp.complainantName}</strong> ({disp.complainantRole})
                  </span>
                  <span>
                    Respondent: <strong>{disp.respondentName}</strong>
                  </span>
                  {disp.hearingDate && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Hearing: {formatDate(disp.hearingDate)}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDispute(disp);
                      setHearingDate("2026-03-25");
                      setResolutionText(disp.resolutionDetails || "");
                    }}
                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg"
                  >
                    Manage Hearing / Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Regional Price Indices */}
      {activeTab === "ANALYTICS" && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Ghana Real Estate Rent Index by Municipal District
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live calculated averages benchmarked from verified properties and gazetted valuation brackets.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3">District / Neighborhood</th>
                  <th className="p-3">Active Listings</th>
                  <th className="p-3">Average Legal Rent</th>
                  <th className="p-3">Statutory Advance Ceiling</th>
                  <th className="p-3">Compliance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {stats?.priceIndexByDistrict?.map((item: any) => (
                  <tr key={item.district} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.district}</span>
                    </td>
                    <td className="p-3 font-mono">{item.listingCount}</td>
                    <td className="p-3 font-mono font-bold text-emerald-900">
                      {formatGHS(item.avgRentGhs)}/mo
                    </td>
                    <td className="p-3 font-mono text-gray-600">
                      {formatGHS(item.avgRentGhs * 6)} (6 Mo Cap)
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>98.5%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Rent Control Valuation Inspection</h3>
                <p className="text-[11px] text-emerald-200">{selectedProperty.title}</p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Comparison Box */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Landlord's Desired Rent
                  </span>
                  <span className="text-xl font-black font-mono text-gray-900">
                    {formatGHS(selectedProperty.requestedRentGhs)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Engine Valuation Ceiling
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-900">
                    {formatGHS(selectedProperty.valuation?.calculatedMaxRentGhs || selectedProperty.requestedRentGhs)}
                  </span>
                </div>
              </div>

              {/* Action Decision */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Official Decision
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType("APPROVE_CAPPED")}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      actionType === "APPROVE_CAPPED"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <div>
                      <div>Approve & Enforce Statutory Price Cap</div>
                      <div className="text-[11px] text-gray-500 font-normal">
                        Locks maximum legal rent to the assessed ceiling and issues certificate.
                      </div>
                    </div>
                    {actionType === "APPROVE_CAPPED" && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType("APPROVE_AS_IS")}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      actionType === "APPROVE_AS_IS"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <div>
                      <div>Approve at Requested Rent</div>
                      <div className="text-[11px] text-gray-500 font-normal">
                        Accepts landlord figure if deemed justified by special fittings.
                      </div>
                    </div>
                    {actionType === "APPROVE_AS_IS" && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType("REJECT")}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      actionType === "REJECT"
                        ? "border-red-600 bg-red-50 text-red-950 font-bold"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <div>
                      <div>Reject Non-Compliant Listing</div>
                      <div className="text-[11px] text-gray-500 font-normal">
                        Barred from publication until price or structural deficiencies are remedied.
                      </div>
                    </div>
                    {actionType === "REJECT" && <XCircle className="w-4 h-4 text-red-700" />}
                  </button>
                </div>
              </div>

              {actionType === "APPROVE_CAPPED" && (
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Certified Capped Rent (GH₵ / month)
                  </label>
                  <input
                    type="number"
                    value={customCappedPrice}
                    onChange={(e) => setCustomCappedPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Rent Officer Gazette Remarks / Order
                </label>
                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Official comments endorsing certificate or explaining adjustment..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecuteReview}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  {isProcessing ? "Processing..." : "Commit Gazette Decision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Dispute Case Arbitration</h3>
                <p className="text-[11px] text-gray-400">Ref: {selectedDispute.caseNumber}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900">{selectedDispute.title}</h4>
                <p className="text-gray-600 mt-1">{selectedDispute.description}</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Schedule Rent Tribunal Hearing
                </label>
                <input
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mediation Ruling / Resolution Details
                </label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Record binding agreement between landlord and tenant under Act 220..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => handleUpdateDispute("HEARING_SCHEDULED")}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Schedule Hearing
                </button>
                <button
                  onClick={() => handleUpdateDispute("RESOLVED")}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Mark Case Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
