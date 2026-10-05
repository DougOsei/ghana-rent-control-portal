"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Property, Application, TenancyContract } from "@/lib/types";
import { formatGHS, formatDate, DEFAULT_PROPERTY_IMAGE } from "@/lib/utils";
import GhanaCardBadge from "@/components/GhanaCardBadge";
import PriceAssessmentCertificate from "@/components/PriceAssessmentCertificate";
import {
  Building2,
  PlusCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileText,
  CreditCard,
  Shield,
  Eye,
  ExternalLink,
  User,
  ArrowRight,
} from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function LandlordPortalPage() {
  const { currentUser, switchUser, demoUsers } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"PROPERTIES" | "APPLICATIONS" | "CONTRACTS">("PROPERTIES");
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [contracts, setContracts] = useState<TenancyContract[]>([]);
  const [selectedPropertyCert, setSelectedPropertyCert] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Active landlord ID
  const landlordId = currentUser?.role === "LANDLORD" ? currentUser.id : "user-landlord-1";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propRes, appRes, contRes] = await Promise.all([
        fetch("/api/properties"),
        fetch(`/api/applications?userId=${landlordId}&role=LANDLORD`),
        fetch(`/api/contracts?userId=${landlordId}`),
      ]);

      const propData = await propRes.json();
      const appData = await appRes.json();
      const contData = await contRes.json();

      if (propData.success) {
        // Filter to properties belonging to demo landlord
        setProperties(propData.properties.filter((p: Property) => p.landlordId === landlordId));
      }
      if (appData.success) {
        setApplications(appData.applications);
      }
      if (contData.success) {
        setContracts(contData.contracts);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleApproveApp = async (app: Application) => {
    const prop = properties.find((p) => p.id === app.propertyId);
    const rentAmount = prop?.allowableRentGhs || prop?.requestedRentGhs || 3000;

    // Create contract
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: app.propertyId,
          propertyTitle: app.propertyTitle,
          propertyAddress: prop?.address || "Greater Accra",
          landlordId: "user-landlord-1",
          landlordName: "Kwame Mensah Boakye",
          tenantId: app.tenantId,
          tenantName: app.tenantName,
          rentAmountGhs: rentAmount,
          advanceMonths: app.proposedAdvanceMonths || 6,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
          termsNotes: "Digital statutory tenancy agreement compliant with Rent Act 1963 (Act 220).",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Application accepted! Tenancy contract ${data.contract.contractNumber} generated.`);
        fetchData();
      }
    } catch {
      alert("Failed to create contract");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Contextual notice if persona is not landlord */}
      {(!currentUser || currentUser.role !== "LANDLORD") && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <span className="font-bold">
              {currentUser
                ? `Viewing as ${currentUser.fullName} (${currentUser.role.replace("_", " ")}):`
                : "Not signed in:"}
            </span>
            <span className="text-amber-800">
              You are browsing the Landlord Portal. Switch persona or sign in to test managing properties as a landlord.
            </span>
          </div>
          <button
            onClick={() => switchUser(demoUsers.find((u) => u.role === "LANDLORD")!)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 shadow-xs"
          >
            Switch to Landlord
          </button>
        </div>
      )}

      {/* Landlord Identity Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
              Registered Landlord Dashboard
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified with Rent Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Kwame Mensah Boakye
          </h1>
          <p className="text-xs text-gray-500">
            Plot 42, Ambassadorial Enclave, East Legon, Accra • +233 20 812 3456
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <GhanaCardBadge cardNumber="GHA-102938475-1" name="Kwame Mensah Boakye" verified={true} />
          <Link
            href="/landlord/new"
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3.5 rounded-2xl shadow-md transition-all hover:shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Property</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Total Properties</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            {properties.length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Across Accra Metropolitan</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Certified Cap Approved</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {properties.filter((p) => p.priceStatus === "APPROVED_CAPPED").length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Ready for tenants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Pending Price Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {properties.filter((p) => p.priceStatus === "PENDING_REVIEW").length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Awaiting officer assessment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold">Tenant Applications</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {applications.length}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Verified prospects</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("PROPERTIES")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "PROPERTIES"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Property Listings ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "APPLICATIONS"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Tenant Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("CONTRACTS")}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === "CONTRACTS"
              ? "border-b-2 border-emerald-700 text-emerald-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tenancy Contracts ({contracts.length})</span>
        </button>
      </div>

      {/* Tab 1: Properties List */}
      {activeTab === "PROPERTIES" && (
        <div className="space-y-4">
          {properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-500">No properties listed yet.</p>
              <Link
                href="/landlord/new"
                className="mt-3 inline-block px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {properties.map((prop) => {
                const isApproved = prop.priceStatus === "APPROVED_CAPPED";
                const isPending = prop.priceStatus === "PENDING_REVIEW";
                const isRejected = prop.priceStatus === "REJECTED";

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prop.images[0] || DEFAULT_PROPERTY_IMAGE}
                        alt=""
                        className="w-24 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE; }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {prop.propertyType.replace(/_/g, " ")}
                          </span>
                          {isApproved && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-600" />
                              <span>Price Capped & Approved</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending Rent Control Review</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-gray-900">{prop.title}</h3>
                        <p className="text-xs text-gray-500">
                          {prop.districtTown}, {prop.region} • GPS: {prop.gpsAddress}
                        </p>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          {isApproved ? "Approved Legal Rent" : "Requested Rent"}
                        </div>
                        <div className="text-lg font-black font-mono text-emerald-950">
                          {formatGHS(isApproved ? prop.allowableRentGhs || prop.requestedRentGhs : prop.requestedRentGhs)}
                          <span className="text-xs font-normal text-gray-400">/mo</span>
                        </div>
                        {isPending && prop.allowableRentGhs && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Est. Rent Control Cap: {formatGHS(prop.allowableRentGhs)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isApproved && (
                          <button
                            onClick={() => setSelectedPropertyCert(prop)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>
                        )}
                        <Link
                          href={`/properties/${prop.id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === "APPLICATIONS" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
              No applications received yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{app.tenantName}</span>
                      <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {app.tenantGhanaCard} (NIA Verified)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Property: <strong>{app.propertyTitle}</strong>
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span>Occupation: <strong>{app.employerOrOccupation}</strong></span>
                      <span>Income: <strong>{formatGHS(app.monthlyIncomeGhs)}/mo</strong></span>
                      <span>Advance: <strong>{app.proposedAdvanceMonths} Months (Legal Max 6)</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApproveApp(app)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Generate Contract</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Contracts */}
      {activeTab === "CONTRACTS" && (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {contract.contractNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {contract.status.replace("_", " ")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{contract.propertyTitle}</h4>
                <p className="text-xs text-gray-500">
                  Tenant: {contract.tenantName} • Rent: {formatGHS(contract.rentAmountGhs)}/mo (Advance: {formatGHS(contract.advanceAmountGhs)})
                </p>
              </div>

              <div>
                <Link
                  href={`/tenancy/${contract.id}`}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Contract</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedPropertyCert && (
        <PriceAssessmentCertificate
          property={selectedPropertyCert}
          onClose={() => setSelectedPropertyCert(null)}
        />
      )}
    </div>
  );
}
