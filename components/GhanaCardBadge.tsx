"use client";

import React from "react";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";

interface GhanaCardBadgeProps {
  cardNumber: string;
  verified?: boolean;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export default function GhanaCardBadge({
  cardNumber,
  verified = true,
  name,
  size = "md",
}: GhanaCardBadgeProps) {
  if (size === "sm") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span className="font-mono">{cardNumber}</span>
        {verified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
      </span>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 p-3.5 shadow-xs">
      {/* Ghana flag stripe subtle top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="bg-[#CE1126] flex-1"></div>
        <div className="bg-[#FCD116] flex-1"></div>
        <div className="bg-[#006B3F] flex-1"></div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-0.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                Republic of Ghana National ID
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                NIA Verified
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-gray-900 tracking-wide">
              {cardNumber}
            </div>
            {name && <div className="text-xs text-gray-600 font-medium">{name}</div>}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>KYC Validated</span>
          </div>
          <span className="text-[10px] text-gray-400">Rent Act Compliant</span>
        </div>
      </div>
    </div>
  );
}
