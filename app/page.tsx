"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Building2,
  Scale,
  CreditCard,
  FileCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertOctagon,
  Users,
  Coins,
} from "lucide-react";
import { Property } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import ValuationCalculatorWidget from "@/components/ValuationCalculatorWidget";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchRegion, setSearchRegion] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.properties);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const certifiedListings = properties.filter((p) => p.priceStatus === "APPROVED_CAPPED");

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#003820] via-[#022c1b] to-[#011a10] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/50">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-[#FCD116]/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-[#006B3F]/35 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[450px] h-[260px] bg-gradient-to-t from-[#CE1126]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Architectural GIS & Land Survey Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 85%)",
          }}
        />

        {/* Decorative Golden Star & Shield Silhouette Watermark */}
        <div className="absolute right-8 top-12 opacity-5 pointer-events-none select-none hidden lg:block">
          <svg className="w-96 h-96 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6l1.76 3.57 3.94.57-2.85 2.78.67 3.93L12 16l-3.52 1.85.67-3.93-2.85-2.78 3.94-.57L12 7z" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-yellow-300 font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ghana Rent Act, 1963 (Act 220) Digital Enforcement</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Fair Rent. Protected Tenants.{" "}
                <span className="text-yellow-400 underline decoration-emerald-500 underline-offset-8">
                  Verified Landlords.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                The official portal of the <strong>Ghana Rent Control Department</strong>. Every
                property is valuation-assessed, Ghana Card verified, and strictly protected by the
                statutory <strong>6-month advance rent ceiling</strong>.
              </p>

              {/* Quick Search Box */}
              <div className="relative bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/40 text-gray-900 ring-1 ring-black/5 overflow-hidden">
                {/* Ghana Flag micro accent ribbon */}
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="bg-[#CE1126] flex-1"></div>
                  <div className="bg-[#FCD116] flex-1"></div>
                  <div className="bg-[#006B3F] flex-1"></div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = `/properties?region=${searchRegion}&districtTown=${searchQuery}&propertyType=${searchType}`;
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Region
                    </label>
                    <select
                      value={searchRegion}
                      onChange={(e) => setSearchRegion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 transition-colors"
                    >
                      <option value="ALL">All 16 Regions</option>
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti Region</option>
                      <option value="Western">Western Region</option>
                      <option value="Central">Central Region</option>
                      <option value="Eastern">Eastern Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Town / District
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g. East Legon, Ahodwo"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Property Type
                    </label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 transition-colors"
                    >
                      <option value="ALL">All Types</option>
                      <option value="SINGLE_ROOM">Single Room</option>
                      <option value="CHAMBER_AND_HALL">Chamber & Hall</option>
                      <option value="APARTMENT_1BED">1 Bed Apartment</option>
                      <option value="APARTMENT_2BED">2 Bed Apartment</option>
                      <option value="APARTMENT_3BED">3 Bed Apartment</option>
                      <option value="DETACHED_HOUSE">Detached House</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Search className="w-4 h-4 text-yellow-300" />
                      <span>Search Certified</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>Mandatory Ghana Card KYC</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>Official Assessment Certificates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span>Max 6 Months Advance Enforced</span>
                </div>
              </div>
            </div>

            {/* Right Card: Rent Act Spotlight */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-emerald-950/90 via-[#012214]/95 to-black/95 border border-emerald-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-emerald-400/20">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-emerald-200 font-bold block">
                        Act 220 Legal Safeguard
                      </span>
                      <span className="text-[10px] text-emerald-400/80">Ghana Rent Regulations</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2.5 py-1 rounded-full border border-red-500/40 shadow-xs">
                    Criminal Offence Alert
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xs font-bold text-yellow-300 uppercase tracking-wide">
                      Section 25(5) Advance Rent Ceiling
                    </h4>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      "No person shall demand or pay in advance rent exceeding a period of six months
                      in respect of any tenancy." Private demands for 1 or 2 years advance are void
                      and subject to prosecution.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      Automated Price Valuation Engine
                    </h4>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Landlords cannot arbitrarily raise rent. All listings are benchmarked against
                      district zone rates, construction age, and statutory amenities.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href="/calculator"
                      className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                    >
                      <span>Launch Public Rent Calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/disputes"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>Lodge Rent Dispute</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
          <div className="p-3 text-center border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              1,840+
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Certified Properties
            </div>
          </div>
          <div className="p-3 text-center border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              GH₵ 3.8M
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Excess Advances Intercepted
            </div>
          </div>
          <div className="p-3 text-center border-r border-gray-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              100%
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Ghana Card NIA Verified
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              42 District
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Active Valuation Zones
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Three Integrated Roles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            An End-to-End Digital Housing Ecosystem for Ghana
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Built specifically to solve rent exploitation, lack of transparency, and illegal advance demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tenants */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">For Tenants</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Find properties with government-certified fair rent rates. No extortionate 2-year
                advances. Verify landlord Ghana Cards, apply digitally, and pay via MTN MoMo / Telecel
                with official receipts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
              >
                <span>Browse Certified Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Landlords */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">For Landlords</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                List properties securely with Ghana Card authentication. Preview legal ceiling rents
                in real time. Receive your Rent Assessment Certificate and digitally sign legally
                enforceable tenancy contracts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/landlord"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Enter Landlord Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Rent Control Officers */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">For Rent Control Officers</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Review landlord listing submissions, approve or enforce statutory price caps, issue
                official gazetted Rent Assessment Certificates, and arbitrate tenancy dispute cases.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Officer Inspection Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Certified Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Gazetted & Certified
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              Featured Rent-Capped Properties
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified by Ghana Rent Control Department under Act 220
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <span>View All Properties ({properties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifiedListings.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Embedded Valuation Engine Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Live Valuation Calculator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Calculate Statutory Fair Rent for Any Location
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Test how Accra, Kumasi, and Takoradi zones influence rent ceiling limits
          </p>
        </div>
        <ValuationCalculatorWidget />
      </section>
    </div>
  );
}
