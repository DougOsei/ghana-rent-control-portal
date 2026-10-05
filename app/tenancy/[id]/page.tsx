"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TenancyContract } from "@/lib/types";
import { formatGHS, formatDate } from "@/lib/utils";
import MobileMoneyModal from "@/components/MobileMoneyModal";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Printer,
  ArrowLeft,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";

export default function TenancyContractPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<TenancyContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts");
      const data = await res.json();
      if (data.success) {
        const found = data.contracts.find((c: TenancyContract) => c.id === id);
        setContract(found || data.contracts[0]);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleSign = async (role: "LANDLORD" | "TENANT") => {
    if (!contract) return;
    setIsSigning(true);

    try {
      const res = await fetch("/api/contracts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: contract.id,
          role,
        }),
      });

      const data = await res.json();
      setIsSigning(false);
      if (data.success) {
        alert(`Signed contract as ${role}!`);
        fetchContract();
      }
    } catch {
      setIsSigning(false);
      alert("Signed simulation complete.");
      fetchContract();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading tenancy agreement...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900">Contract Not Found</h2>
        <Link href="/landlord" className="text-xs text-emerald-700 font-bold mt-2 inline-block">
          ← Return to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/landlord"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-yellow-300" />
            <span>Pay Rent via Mobile Money</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Contract</span>
          </button>
        </div>
      </div>

      {/* Official Tenancy Contract Document */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xl space-y-8 relative overflow-hidden">
        {/* Top Flag Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="bg-[#CE1126] flex-1"></div>
          <div className="bg-[#FCD116] flex-1"></div>
          <div className="bg-[#006B3F] flex-1"></div>
        </div>

        {/* Contract Header */}
        <div className="text-center space-y-1 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-900 text-yellow-400 mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-900">
            REPUBLIC OF GHANA • STANDARD STATUTORY TENANCY CONTRACT
          </h2>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900 uppercase">
            RESIDENTIAL TENANCY AGREEMENT
          </h1>
          <div className="pt-2">
            <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              AGREEMENT REF: {contract.contractNumber}
            </span>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="text-xs text-gray-700 space-y-4 leading-relaxed text-justify">
          <p>
            THIS AGREEMENT is entered into this{" "}
            <strong>{formatDate(contract.startDate)}</strong> under the jurisdiction of the Ghana
            Rent Act, 1963 (Act 220) and Rent Amendment Regulations:
          </p>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div>
              <strong>1. THE LANDLORD:</strong> {contract.landlordName} (National ID: GHA-102938475-1)
            </div>
            <div>
              <strong>2. THE TENANT:</strong> {contract.tenantName} (National ID: GHA-594837261-4)
            </div>
            <div>
              <strong>3. PREMISES:</strong> {contract.propertyTitle}, situated at {contract.propertyAddress}
            </div>
            <div>
              <strong>4. COMMENCEMENT & TERM:</strong> From {formatDate(contract.startDate)} to{" "}
              {formatDate(contract.endDate)} (One Year Renewable)
            </div>
          </div>

          <h3 className="font-bold text-gray-900 uppercase tracking-wide text-xs pt-2">
            Statutory Covenants & Mandatory Rent Control Terms:
          </h3>

          <ol className="list-decimal pl-5 space-y-2 text-xs">
            <li>
              <strong>Capped Rent Amount:</strong> The legally assessed and gazetted monthly rent is{" "}
              <strong className="text-emerald-900 font-mono">
                {formatGHS(contract.rentAmountGhs)}
              </strong>{" "}
              per calendar month. Under Section 19 of Act 220, the Landlord shall NOT increase the
              rent during the tenancy period without prior assessment and certification from the Rent
              Control Department.
            </li>
            <li>
              <strong>Statutory Advance Rent Limitation:</strong> In strict compliance with Section
              25(5) of the Rent Act (Act 220), the Landlord confirms receipt of{" "}
              <strong>{contract.advanceMonths} months advance rent</strong> totalling{" "}
              <strong className="text-emerald-900 font-mono">
                {formatGHS(contract.advanceAmountGhs)}
              </strong>
              . Any demand for advance rent exceeding 6 months is an unlawful criminal offence.
            </li>
            <li>
              <strong>Quiet Enjoyment & Utilities:</strong> The Tenant shall have peaceable and quiet
              enjoyment of the premises without unlawful disturbance. Landlord agrees not to
              disconnect electricity meters (ECG) or piped water (GWCL).
            </li>
            <li>
              <strong>Arbitration & Dispute Resolution:</strong> Any dispute arising from this
              contract shall be submitted to the District Rent Office under the Rent Control
              Department prior to any civil court action.
            </li>
          </ol>
        </div>

        {/* Digital Signatures Grid */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Landlord signature box */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="font-bold uppercase text-gray-500 block">Landlord Signature</span>
            {contract.landlordSignedAt ? (
              <div className="space-y-1">
                <div className="font-serif italic text-base font-bold text-emerald-900">
                  {contract.landlordName}
                </div>
                <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Signed: {formatDate(contract.landlordSignedAt)}</span>
                </div>
              </div>
            ) : (
              <button
                disabled={isSigning}
                onClick={() => handleSign("LANDLORD")}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs"
              >
                Sign as Landlord (Kwame Mensah)
              </button>
            )}
          </div>

          {/* Tenant signature box */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="font-bold uppercase text-gray-500 block">Tenant Signature</span>
            {contract.tenantSignedAt ? (
              <div className="space-y-1">
                <div className="font-serif italic text-base font-bold text-emerald-900">
                  {contract.tenantName}
                </div>
                <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Signed: {formatDate(contract.tenantSignedAt)}</span>
                </div>
              </div>
            ) : (
              <button
                disabled={isSigning}
                onClick={() => handleSign("TENANT")}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl font-bold text-xs"
              >
                Sign as Tenant (Abena Serwaa)
              </button>
            )}
          </div>
        </div>

        {/* Official Officer Endorsement */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>Endorsed by: <strong>Rent Control Department (Act 220)</strong></span>
          </div>
          <div className="font-mono text-emerald-800 font-bold">
            Status: {contract.status}
          </div>
        </div>
      </div>

      {/* Mobile Money Payment Modal */}
      {showPaymentModal && (
        <MobileMoneyModal
          contractId={contract.id}
          contractNumber={contract.contractNumber}
          tenantId={contract.tenantId}
          tenantName={contract.tenantName}
          amountGhs={contract.rentAmountGhs}
          periodMonth="Next Tenancy Billing"
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
