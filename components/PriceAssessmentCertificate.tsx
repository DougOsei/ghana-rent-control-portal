"use client";

import React, { useRef } from "react";
import { Property } from "@/lib/types";
import { formatGHS, formatDate } from "@/lib/utils";
import { Shield, Printer, CheckCircle2, QrCode, Download, X } from "lucide-react";

interface PriceAssessmentCertificateProps {
  property: Property;
  onClose?: () => void;
}

export default function PriceAssessmentCertificate({
  property,
  onClose,
}: PriceAssessmentCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const val = property.valuation;
  const certifiedDate = property.certifiedAt
    ? formatDate(property.certifiedAt)
    : formatDate(new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">
              Official Rent Control Assessment Certificate (Act 220)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div
          ref={certRef}
          className="p-8 sm:p-12 bg-radial from-amber-50/20 via-white to-white border-8 border-double border-emerald-950/20 m-4 rounded-xl relative"
        >
          {/* Ghana Flag Ribbon Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="bg-[#CE1126] flex-1"></div>
            <div className="bg-[#FCD116] flex-1"></div>
            <div className="bg-[#006B3F] flex-1"></div>
          </div>

          {/* Certificate Header */}
          <div className="text-center mt-3 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-900 text-yellow-400 shadow-md mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-900">
              REPUBLIC OF GHANA • MINISTRY OF WORKS AND HOUSING
            </h1>
            <h2 className="text-lg sm:text-2xl font-serif font-black text-gray-900 mt-1 uppercase tracking-tight">
              RENT CONTROL DEPARTMENT
            </h2>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
              Statutory Rent Assessment & Valuation Certificate
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="text-xs font-bold text-emerald-900 font-mono">
                CERTIFICATE NO: {property.certNumber || "GRC-ACC-2026-00412"}
              </span>
            </div>
          </div>

          {/* Legal Declaration */}
          <p className="text-xs text-gray-600 text-justify leading-relaxed mb-6 italic">
            THIS IS TO CERTIFY that in accordance with Section 10 and Section 19 of the Rent Act,
            1963 (Act 220) and the Rent (Amendment) Regulations of the Republic of Ghana, the
            premises specified herein have been officially assessed, inspected, and valuation-graded
            by the Rent Control Department.
          </p>

          {/* Property & Landlord Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200 mb-6 text-xs">
            <div>
              <span className="text-gray-500 font-medium block">Property Subject:</span>
              <span className="font-bold text-gray-900 text-sm">{property.title}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Premises Type:</span>
              <span className="font-semibold text-gray-900">{property.propertyType.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Location / District:</span>
              <span className="font-semibold text-gray-900">
                {property.districtTown}, {property.region} Region
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">GhanaPost GPS Digital Address:</span>
              <span className="font-mono font-bold text-emerald-800">
                {property.gpsAddress || "GA-183-9022"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Registered Landlord:</span>
              <span className="font-semibold text-gray-900">{property.landlordName}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Landlord Ghana Card ID:</span>
              <span className="font-mono font-bold text-gray-900">
                {property.landlordGhanaCard} (NIA Verified)
              </span>
            </div>
          </div>

          {/* Valuation Assessment Metrics */}
          <div className="border border-emerald-900/20 rounded-xl overflow-hidden mb-6">
            <div className="bg-emerald-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between">
              <span>Valuation Criteria Breakdown</span>
              <span>Regulatory Standard</span>
            </div>
            <div className="p-4 space-y-2 text-xs bg-white">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-600">Base Structural Rent ({property.bedrooms} Bed, {property.sizeSqm}m²):</span>
                <span className="font-mono font-semibold">
                  {val ? formatGHS(val.baseRateGhs) : "GH₵ 2,100"} / mo
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-600">Geographic Zone Weight ({property.districtTown}):</span>
                <span className="font-mono font-semibold">
                  x {val ? val.zoneWeight : "1.65"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-600">Housing Age / Depreciation Factor ({property.housingAgeYears} yrs):</span>
                <span className="font-mono font-semibold">
                  x {val ? val.ageDepreciationFactor : "1.00"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-600">Recognized Statutory Amenities ({property.amenities.length} items):</span>
                <span className="font-mono font-semibold text-emerald-700">
                  + {val ? formatGHS(val.amenitiesBonusGhs) : "GH₵ 580"} / mo
                </span>
              </div>
            </div>
            <div className="bg-emerald-50 px-4 py-3 flex items-center justify-between border-t border-emerald-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                  STATUTORY MAXIMUM ASSESSED RENT (CEILING)
                </span>
                <span className="text-xs text-gray-600">Legally enforceable under Act 220</span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-900">
                  {formatGHS(property.allowableRentGhs || property.requestedRentGhs)}
                </span>
                <span className="text-xs font-semibold text-gray-500"> / month</span>
              </div>
            </div>
          </div>

          {/* Statutory Warnings & Advance Rent Cap */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 mb-6 flex gap-3 items-start">
            <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-amber-900">
                CRITICAL NOTICE - ADVANCE RENT LIMITATION:
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Under Section 25(5) of the Rent Act (Act 220), it is an offence punishable by fine
                or imprisonment for any landlord or agent to demand or receive rent in advance
                exceeding <strong>SIX (6) MONTHS</strong> for residential tenancy. Any clause in a
                private agreement demanding 1 or 2 years advance is null, void, and illegal.
              </p>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-4 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-emerald-900/30 rounded-lg p-1 bg-white flex items-center justify-center">
                <QrCode className="w-12 h-12 text-emerald-950" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Digital Seal & Verification</div>
                <div className="text-xs font-mono font-bold text-emerald-900">
                  VERIFIED: {certifiedDate}
                </div>
                <div className="text-[10px] text-gray-500">Rent Control Registry Accra HQ</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-b-2 border-gray-800 pb-1 px-6">
                <span className="font-serif italic font-bold text-sm text-gray-800">
                  Chief Insp. Sampson Abbey
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase text-gray-600 mt-1">
                Chief Rent Control Officer
              </div>
              <div className="text-[9px] text-gray-400">
                Ministry of Works & Housing, Accra
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
