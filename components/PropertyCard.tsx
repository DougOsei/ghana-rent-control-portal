"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatGHS, DEFAULT_PROPERTY_IMAGE } from "@/lib/utils";
import {
  ShieldCheck,
  AlertTriangle,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PriceAssessmentCertificate from "./PriceAssessmentCertificate";

interface PropertyCardProps {
  property: Property;
  onApply?: (property: Property) => void;
}

export default function PropertyCard({ property, onApply }: PropertyCardProps) {
  const [showCertificate, setShowCertificate] = useState(false);

  const isApproved = property.priceStatus === "APPROVED_CAPPED";
  const isPending = property.priceStatus === "PENDING_REVIEW";
  const isRejected = property.priceStatus === "REJECTED";

  const requested = property.requestedRentGhs;
  const allowable = property.allowableRentGhs || requested;
  const isOverpriced = requested > allowable;
  const variance = allowable > 0 ? Math.round(((requested - allowable) / allowable) * 100) : 0;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
        {/* Image & Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
          <img
            src={property.images[0] || DEFAULT_PROPERTY_IMAGE}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE; }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Region Tag Top Left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{property.districtTown}</span>
          </div>

          {/* Rent Control Status Badge Top Right */}
          <div className="absolute top-3 right-3">
            {isApproved && (
              <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-emerald-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                <span>Certified Fair Rent</span>
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1 bg-amber-500/95 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Rent Review Pending</span>
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 bg-red-600/95 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Price Non-Compliant</span>
              </span>
            )}
          </div>

          {/* Price Capping Callout Bottom of Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                {isApproved ? "Rent Control Capped Price" : "Landlord Asked Price"}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black font-mono">
                  {formatGHS(isApproved ? allowable : requested)}
                </span>
                <span className="text-xs text-gray-200">/mo</span>
              </div>
            </div>

            {/* Overpricing Flag Warning */}
            {isOverpriced && isPending && (
              <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-red-300/40">
                +{variance}% Over Cap
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {property.propertyType.replace(/_/g, " ")}
              </span>
              <span className="font-mono text-gray-400">
                GPS: {property.gpsAddress || "GA-Regional"}
              </span>
            </div>

            <Link href={`/properties/${property.id}`}>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {property.description}
            </p>

            {/* Property Key Specs */}
            <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-gray-800">{property.bedrooms}</span> Bed
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-gray-800">{property.bathrooms}</span> Bath
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-gray-800">{property.sizeSqm}</span> m²
              </div>
            </div>

            {/* Top Amenities Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {property.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="pt-2 flex items-center gap-2 border-t border-gray-100">
            {isApproved && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="View Official Rent Assessment Certificate"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Certificate</span>
              </button>
            )}

            <Link
              href={`/properties/${property.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <span>View Property</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Render Certificate Modal if toggled */}
      {showCertificate && (
        <PriceAssessmentCertificate
          property={property}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
}
