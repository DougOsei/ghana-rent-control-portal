"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Application, TenancyContract, RentPayment, Property } from "@/lib/types";
import { formatGHS, formatDate, DEFAULT_PROPERTY_IMAGE } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";
import {
  ClipboardList,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  ArrowRight,
  Building2,
  CalendarDays,
  Banknote,
  ShieldCheck,
  BadgeCheck,
  Smartphone,
  Search,
  UserCircle,
} from "lucide-react";
import MobileMoneyModal from "@/components/MobileMoneyModal";

type Tab = "applications" | "tenancies";

// ── Status helpers ─────────────────────────────────────────────────────────────

const APP_STATUS_CONFIG: Record<
  Application["status"],
  { label: string; color: string; icon: React.ElementType; bg: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: AlertCircle,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

const CONTRACT_STATUS_CONFIG: Record<
  TenancyContract["status"],
  { label: string; color: string; bg: string; dot: string }
> = {
  DRAFT: {
    label: "Draft — Awaiting Signatures",
    color: "text-gray-700",
    bg: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
  },
  SIGNED_ACTIVE: {
    label: "Active Tenancy",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  EXPIRED: {
    label: "Expired",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    dot: "bg-orange-400",
  },
  TERMINATED: {
    label: "Terminated",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

export default function TenantDashboardPage() {
  const { currentUser, isSignedIn, hydrated } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<Tab>("tenancies");
  const [applications, setApplications] = useState<Application[]>([]);
  const [contracts, setContracts] = useState<TenancyContract[]>([]);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [paymentContract, setPaymentContract] = useState<TenancyContract | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (isSignedIn && currentUser?.role === "TENANT") {
      fetchAll();
    }
  }, [hydrated, isSignedIn, currentUser]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const uid = currentUser!.id;
      const [appsRes, contractsRes, paymentsRes, propsRes] = await Promise.all([
        fetch(`/api/applications?userId=${uid}&role=TENANT`),
        fetch(`/api/contracts?userId=${uid}`),
        fetch(`/api/payments?userId=${uid}`),
        fetch("/api/properties"),
      ]);

      const [appsData, contractsData, paymentsData, propsData] =
        await Promise.all([
          appsRes.json(),
          contractsRes.json(),
          paymentsRes.json(),
          propsRes.json(),
        ]);

      if (appsData.success) setApplications(appsData.applications || []);
      if (contractsData.success) setContracts(contractsData.contracts || []);
      if (paymentsData.success) setPayments(paymentsData.payments || []);
      if (propsData.success) {
        const map: Record<string, Property> = {};
        (propsData.properties as Property[]).forEach((p) => {
          map[p.id] = p;
        });
        setPropertyMap(map);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  // ── Auth / Role Guards ───────────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!isSignedIn || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 gap-4">
        <UserCircle className="w-14 h-14 text-gray-300" />
        <p className="text-gray-600 font-medium">Sign in as a Tenant to view your dashboard.</p>
        <Link
          href="/properties"
          className="text-blue-600 text-sm underline underline-offset-2"
        >
          Browse available properties
        </Link>
      </div>
    );
  }

  if (currentUser.role !== "TENANT") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 gap-4">
        <AlertCircle className="w-12 h-12 text-amber-400" />
        <p className="text-gray-700 font-semibold text-center">
          This dashboard is for Tenants only.
        </p>
        {currentUser.role === "LANDLORD" && (
          <Link href="/landlord" className="text-blue-600 text-sm underline">
            Go to Landlord Dashboard →
          </Link>
        )}
        {currentUser.role === "ADMIN_OFFICER" && (
          <Link href="/admin" className="text-blue-600 text-sm underline">
            Go to Admin Console →
          </Link>
        )}
      </div>
    );
  }

  // ── Summaries ────────────────────────────────────────────────────────────────

  const activeContracts = contracts.filter((c) => c.status === "SIGNED_ACTIVE");
  const pendingApps = applications.filter(
    (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW"
  );
  const acceptedApps = applications.filter((a) => a.status === "ACCEPTED");
  const totalPaid = payments
    .filter((p) => p.status === "CONFIRMED")
    .reduce((s, p) => s + p.amountGhs, 0);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-0.5">Tenant Portal</p>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome, {currentUser.fullName.split(" ")[0]}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Ghana Card:{" "}
                <span className="font-mono font-semibold text-white">
                  {currentUser.ghanaCardNumber}
                </span>
                {currentUser.ghanaCardVerified && (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-300 text-xs font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
            {[
              {
                label: "Active Tenancies",
                value: activeContracts.length,
                icon: ShieldCheck,
                accent: "text-emerald-300",
              },
              {
                label: "Pending Applications",
                value: pendingApps.length,
                icon: Clock,
                accent: "text-amber-300",
              },
              {
                label: "Accepted Applications",
                value: acceptedApps.length,
                icon: CheckCircle2,
                accent: "text-blue-200",
              },
              {
                label: "Total Rent Paid",
                value: formatGHS(totalPaid),
                icon: Banknote,
                accent: "text-purple-300",
              },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/20"
              >
                <Icon className={`w-5 h-5 mb-1.5 ${accent}`} />
                <p className="text-white/70 text-xs">{label}</p>
                <p className="text-white font-bold text-lg leading-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="sticky top-[57px] z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {(
            [
              { key: "tenancies", label: "My Tenancies & Contracts", icon: Home, count: contracts.length },
              { key: "applications", label: "Rent Applications", icon: ClipboardList, count: applications.length },
            ] as { key: Tab; label: string; icon: React.ElementType; count: number }[]
          ).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === key
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{key === "tenancies" ? "Tenancies" : "Applications"}</span>
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === key
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-36 bg-white rounded-2xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* ════════════════════════════════════════
                TAB: MY TENANCIES & CONTRACTS
            ════════════════════════════════════════ */}
            {activeTab === "tenancies" && (
              <section className="space-y-6">
                {contracts.length === 0 ? (
                  <EmptyState
                    icon={Home}
                    title="No active tenancies yet"
                    body="Once a landlord accepts your application and a contract is issued, it will appear here."
                    cta={{ label: "Browse Properties", href: "/properties" }}
                  />
                ) : (
                  contracts.map((contract) => {
                    const prop = propertyMap[contract.propertyId];
                    const cfg = CONTRACT_STATUS_CONFIG[contract.status];
                    const contractPayments = payments.filter(
                      (p) => p.contractId === contract.id
                    );
                    const totalForContract = contractPayments
                      .filter((p) => p.status === "CONFIRMED")
                      .reduce((s, p) => s + p.amountGhs, 0);

                    const startDate = new Date(contract.startDate);
                    const endDate = new Date(contract.endDate);
                    const today = new Date();
                    const totalDays =
                      (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24);
                    const elapsedDays = Math.max(
                      0,
                      (today.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const progress = Math.min(
                      100,
                      Math.round((elapsedDays / totalDays) * 100)
                    );

                    return (
                      <div
                        key={contract.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden"
                      >
                        {/* Property image strip */}
                        <div className="relative h-36 bg-gray-100">
                          <img
                            src={
                              prop?.images?.[0] || DEFAULT_PROPERTY_IMAGE
                            }
                            alt={contract.propertyTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                DEFAULT_PROPERTY_IMAGE;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                            <div>
                              <p className="text-white font-bold text-base leading-snug drop-shadow">
                                {contract.propertyTitle}
                              </p>
                              <p className="text-white/80 text-xs mt-0.5">
                                {contract.propertyAddress}
                              </p>
                            </div>
                            <span
                              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                              />
                              {cfg.label}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-5">
                          {/* Key details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            {[
                              {
                                icon: FileText,
                                label: "Contract No.",
                                value: contract.contractNumber,
                                mono: true,
                              },
                              {
                                icon: Banknote,
                                label: "Monthly Rent",
                                value: formatGHS(contract.rentAmountGhs),
                              },
                              {
                                icon: CalendarDays,
                                label: "Tenancy Period",
                                value: `${formatDate(contract.startDate)} – ${formatDate(contract.endDate)}`,
                              },
                              {
                                icon: CreditCard,
                                label: "Advance Paid",
                                value: `${formatGHS(contract.advanceAmountGhs)} (${contract.advanceMonths} mo.)`,
                              },
                            ].map(({ icon: Icon, label, value, mono }) => (
                              <div
                                key={label}
                                className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                              >
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                  <Icon className="w-3.5 h-3.5" />
                                  <span>{label}</span>
                                </div>
                                <p
                                  className={`text-gray-900 font-semibold text-[13px] ${mono ? "font-mono" : ""}`}
                                >
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Progress bar */}
                          {contract.status === "SIGNED_ACTIVE" && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>Tenancy Progress</span>
                                <span className="font-semibold text-gray-700">
                                  {progress}% elapsed
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                                <span>{formatDate(contract.startDate)}</span>
                                <span>{formatDate(contract.endDate)}</span>
                              </div>
                            </div>
                          )}

                          {/* Signatures */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {[
                              {
                                label: "Landlord Signed",
                                date: contract.landlordSignedAt,
                              },
                              {
                                label: "Tenant Signed",
                                date: contract.tenantSignedAt,
                              },
                              {
                                label: "Rent Control Approved",
                                date: contract.officerApprovedAt,
                              },
                            ].map(({ label, date }) => (
                              <span
                                key={label}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-medium ${
                                  date
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-gray-50 border-gray-200 text-gray-400"
                                }`}
                              >
                                {date ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5" />
                                )}
                                {label}
                                {date && (
                                  <span className="text-emerald-600 font-normal ml-0.5">
                                    {formatDate(date)}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>

                          {/* Payment history mini */}
                          {contractPayments.length > 0 && (
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                              <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                  <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                                  Payment History
                                </span>
                                <span className="text-xs text-gray-500">
                                  Total:{" "}
                                  <span className="font-bold text-gray-800">
                                    {formatGHS(totalForContract)}
                                  </span>
                                </span>
                              </div>
                              {contractPayments.slice(0, 3).map((pmt) => (
                                <div
                                  key={pmt.id}
                                  className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 border-gray-100 text-xs"
                                >
                                  <div>
                                    <span className="font-semibold text-gray-800">
                                      {pmt.billingPeriodMonth}
                                    </span>
                                    <span className="text-gray-400 ml-2 font-mono">
                                      {pmt.transactionRef}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900">
                                      {formatGHS(pmt.amountGhs)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full font-semibold ${
                                        pmt.status === "CONFIRMED"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {pmt.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 pt-1">
                            <Link
                              href={`/tenancy/${contract.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              View Full Contract
                            </Link>
                            {contract.status === "SIGNED_ACTIVE" && (
                              <button
                                onClick={() => setPaymentContract(contract)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
                              >
                                <Smartphone className="w-4 h-4" />
                                Pay Rent (MoMo)
                              </button>
                            )}
                            {prop && (
                              <Link
                                href={`/properties/${prop.id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                              >
                                <Building2 className="w-4 h-4" />
                                View Property
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            )}

            {/* ════════════════════════════════════════
                TAB: RENT APPLICATIONS
            ════════════════════════════════════════ */}
            {activeTab === "applications" && (
              <section className="space-y-4">
                {/* CTA to browse */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {applications.length === 0
                      ? "You haven't applied to any properties yet."
                      : `${applications.length} application${applications.length > 1 ? "s" : ""} submitted`}
                  </p>
                  <Link
                    href="/properties"
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Browse Properties
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <EmptyState
                    icon={ClipboardList}
                    title="No applications yet"
                    body="Find a Rent Control–certified property and submit your first application."
                    cta={{ label: "Find Fair-Rent Homes", href: "/properties" }}
                  />
                ) : (
                  applications.map((app) => {
                    const prop = propertyMap[app.propertyId];
                    const cfg = APP_STATUS_CONFIG[app.status];
                    const StatusIcon = cfg.icon;

                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col sm:flex-row"
                      >
                        {/* Property thumbnail */}
                        <div className="sm:w-44 h-36 sm:h-auto shrink-0 bg-gray-100 relative">
                          <img
                            src={prop?.images?.[0] || DEFAULT_PROPERTY_IMAGE}
                            alt={app.propertyTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                DEFAULT_PROPERTY_IMAGE;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r" />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col gap-3 flex-1 min-w-0">
                          {/* Title + status */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-gray-900 font-bold text-base leading-snug truncate">
                                {app.propertyTitle}
                              </h3>
                              {prop && (
                                <p className="text-gray-400 text-xs mt-0.5">
                                  {prop.districtTown}, {prop.region}
                                </p>
                              )}
                            </div>
                            <span
                              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {cfg.label}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            {[
                              {
                                label: "Monthly Income",
                                value: formatGHS(app.monthlyIncomeGhs),
                              },
                              {
                                label: "Proposed Move-in",
                                value: formatDate(app.proposedMoveInDate),
                              },
                              {
                                label: "Advance Months",
                                value: `${app.proposedAdvanceMonths} months`,
                              },
                              {
                                label: "Occupation",
                                value: app.employerOrOccupation,
                              },
                              {
                                label: "Applied On",
                                value: formatDate(app.createdAt),
                              },
                              prop
                                ? {
                                    label: "Rent (Capped)",
                                    value: formatGHS(
                                      prop.allowableRentGhs ||
                                        prop.requestedRentGhs
                                    ),
                                  }
                                : null,
                            ]
                              .filter((x): x is { label: string; value: string } => x !== null)
                              .map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                                  <p className="text-gray-400 mb-0.5">{label}</p>
                                  <p className="text-gray-800 font-semibold truncate">
                                    {value}
                                  </p>
                                </div>
                              ))}
                          </div>

                          {/* Notes */}
                          {app.notes && (
                            <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                              "{app.notes}"
                            </p>
                          )}

                          {/* Accepted CTA */}
                          {app.status === "ACCEPTED" && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              Application accepted! Check the Tenancies tab for your contract.
                            </div>
                          )}

                          {/* Action */}
                          {prop && (
                            <div className="mt-auto pt-1">
                              <Link
                                href={`/properties/${prop.id}`}
                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors"
                              >
                                View Property Listing
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            )}
          </>
        )}
      </div>

      {/* Mobile Money Payment Modal */}
      {paymentContract && (
        <MobileMoneyModal
          contractId={paymentContract.id}
          contractNumber={paymentContract.contractNumber}
          tenantId={paymentContract.tenantId}
          tenantName={paymentContract.tenantName}
          amountGhs={paymentContract.rentAmountGhs}
          onClose={() => setPaymentContract(null)}
          onSuccess={() => {
            setPaymentContract(null);
            fetchAll();
          }}
        />
      )}
    </main>
  );
}

// ── Shared Empty State ─────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-gray-800 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {cta.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
