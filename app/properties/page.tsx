"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Property, PropertyType, PriceStatus } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import { GHANA_ZONES } from "@/lib/valuationEngine";
import {
  Search,
  Filter,
  ShieldCheck,
  Building,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { formatGHS } from "@/lib/utils";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [region, setRegion] = useState("ALL");
  const [districtTown, setDistrictTown] = useState("");
  const [propertyType, setPropertyType] = useState<string>("ALL");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    // Check URL search parameters if loaded from home search bar
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRegion = params.get("region");
      const urlTown = params.get("districtTown");
      const urlType = params.get("propertyType");
      if (urlRegion) setRegion(urlRegion);
      if (urlTown) setDistrictTown(urlTown);
      if (urlType) setPropertyType(urlType);
    }

    fetchProperties();
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.properties);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setRegion("ALL");
    setDistrictTown("");
    setPropertyType("ALL");
    setMaxPrice(10000);
    setBedrooms(0);
    setStatusFilter("ALL");
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (region !== "ALL" && p.region.toLowerCase() !== region.toLowerCase()) {
        return false;
      }
      if (
        districtTown.trim() !== "" &&
        !p.districtTown.toLowerCase().includes(districtTown.toLowerCase())
      ) {
        return false;
      }
      if (propertyType !== "ALL" && p.propertyType !== propertyType) {
        return false;
      }
      const rent = p.allowableRentGhs || p.requestedRentGhs;
      if (rent > maxPrice) {
        return false;
      }
      if (bedrooms > 0 && p.bedrooms < bedrooms) {
        return false;
      }
      if (statusFilter !== "ALL" && p.priceStatus !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [properties, region, districtTown, propertyType, maxPrice, bedrooms, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Tenant Property Search
            </span>
            <span className="text-xs font-medium text-gray-500">
              Rent Act (Act 220) Certified Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Certified Rent-Capped Properties in Ghana
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Every property listed here includes an official price ceiling and a maximum 6-month advance cap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{properties.filter((p) => p.priceStatus === "APPROVED_CAPPED").length} Certified Properties</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Properties List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (4 cols) */}
        <aside className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Search Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-emerald-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Regions</option>
              {GHANA_ZONES.map((z) => (
                <option key={z.region} value={z.region}>
                  {z.region} Region
                </option>
              ))}
            </select>
          </div>

          {/* District / Town Search */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Town or Neighborhood
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={districtTown}
                onChange={(e) => setDistrictTown(e.target.value)}
                placeholder="e.g. East Legon, Spintex, Ahodwo"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Property Category
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Property Categories</option>
              <option value="SINGLE_ROOM">Single Room</option>
              <option value="CHAMBER_AND_HALL">Chamber & Hall</option>
              <option value="APARTMENT_1BED">1-Bedroom Flat</option>
              <option value="APARTMENT_2BED">2-Bedroom Apartment</option>
              <option value="APARTMENT_3BED">3-Bedroom Apartment</option>
              <option value="DETACHED_HOUSE">Detached House</option>
              <option value="COMMERCIAL_SHOP">Commercial Shop</option>
            </select>
          </div>

          {/* Minimum Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Bedrooms (Minimum)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBedrooms(num)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    bedrooms === num
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {num === 0 ? "Any" : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Maximum Price Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Max Monthly Rent
              </label>
              <span className="font-mono text-xs font-bold text-emerald-800">
                {formatGHS(maxPrice)}/mo
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="15000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>GH₵ 300</span>
              <span>GH₵ 15,000+</span>
            </div>
          </div>

          {/* Rent Control Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Rent Control Price Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED_CAPPED">Certified Fair Rent Only</option>
              <option value="PENDING_REVIEW">Pending Rent Control Review</option>
            </select>
          </div>
        </aside>

        {/* Results Grid (8 cols) */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>
              Showing <strong>{filteredProperties.length}</strong> matching verified listings
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                No listings matched your criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range, clearing your neighborhood search, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
