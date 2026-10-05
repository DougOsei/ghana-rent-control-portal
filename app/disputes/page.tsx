"use client";

import React, { useState, useEffect } from "react";
import { Dispute, DisputeCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Scale,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLodgeModal, setShowLodgeModal] = useState(false);

  // Form state
  const [complainantName, setComplainantName] = useState("Abena Serwaa Osei");
  const [respondentName, setRespondentName] = useState("Kwame Mensah Boakye");
  const [propertyTitle, setPropertyTitle] = useState("Spacious 3-Bedroom Duplex - Spintex");
  const [category, setCategory] = useState<DisputeCategory>("EXCESSIVE_ADVANCE_DEMAND");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = () => {
    setLoading(true);
    fetch("/api/disputes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDisputes(data.disputes);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleLodgeDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: "prop-2",
          propertyTitle,
          complainantId: "user-tenant-1",
          complainantName,
          complainantRole: "TENANT",
          respondentId: "user-landlord-1",
          respondentName,
          category,
          title: title || `${category.replace(/_/g, " ")} Issue`,
          description,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        alert(`Dispute ${data.dispute.caseNumber} lodged successfully with Ghana Rent Control.`);
        setShowLodgeModal(false);
        fetchDisputes();
      }
    } catch {
      setIsSubmitting(false);
      alert("Lodge simulation complete.");
      setShowLodgeModal(false);
      fetchDisputes();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gray-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300 bg-white/10 px-3 py-1 rounded-full">
              Legal Arbitration Center
            </span>
            <span className="text-xs text-emerald-200">Rent Act, 1963 (Act 220)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rent Disputes & Grievance Resolution Module
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
            Tenants and Landlords may lodge formal grievances regarding unlawful rent increases,
            illegal advance rent demands exceeding 6 months, or eviction without notice.
          </p>
        </div>

        <button
          onClick={() => setShowLodgeModal(true)}
          className="px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Scale className="w-4 h-4" />
          <span>Lodge Formal Dispute</span>
        </button>
      </div>

      {/* Case Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Active Tenancy Cases ({disputes.length})</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {disputes.map((disp) => (
              <div
                key={disp.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {disp.caseNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      {disp.category.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        disp.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-900"
                          : disp.status === "HEARING_SCHEDULED"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {disp.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Lodged: {formatDate(disp.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">{disp.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{disp.description}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs flex flex-wrap items-center justify-between gap-4 font-medium text-gray-700">
                  <div>
                    Complainant: <strong>{disp.complainantName}</strong> ({disp.complainantRole})
                  </div>
                  <div>
                    Respondent: <strong>{disp.respondentName}</strong>
                  </div>
                  {disp.hearingDate && (
                    <div className="text-emerald-800 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Tribunal Hearing Date: {formatDate(disp.hearingDate)}
                    </div>
                  )}
                </div>

                {disp.resolutionDetails && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <strong>Official Tribunal Ruling:</strong> {disp.resolutionDetails}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lodge Dispute Modal */}
      {showLodgeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-sm">Lodge Case with Rent Control Department</h3>
              </div>
              <button
                onClick={() => setShowLodgeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLodgeDispute} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Violation Category (Rent Act 1963)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DisputeCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium bg-white"
                >
                  <option value="EXCESSIVE_ADVANCE_DEMAND">
                    Excessive Advance Rent Demand (Exceeding 6 Months)
                  </option>
                  <option value="UNLAWFUL_RENT_INCREASE">
                    Unlawful Rent Increase (Above Rent Control Rate)
                  </option>
                  <option value="EVICTION_WITHOUT_NOTICE">
                    Eviction Without Statutory 6-Month Notice
                  </option>
                  <option value="MAINTENANCE_NEGLECT">
                    Maintenance Neglect & Utilities Disruption
                  </option>
                  <option value="SECURITY_DEPOSIT_BREACH">
                    Security Deposit Withholding
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Case Heading / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Landlord insisting on 2-year advance payment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Complainant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Respondent Landlord / Tenant
                  </label>
                  <input
                    type="text"
                    required
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Grievance Statement
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail dates, requested sums, and witness evidence..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 leading-relaxed border border-amber-200">
                Notice: A formal summons will be issued by the Rent Control Officer to both parties
                to appear at the District Rent Office for conciliation.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLodgeModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs"
                >
                  {isSubmitting ? "Filing..." : "Submit Grievance to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
