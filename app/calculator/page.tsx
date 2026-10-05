import React from "react";
import ValuationCalculatorWidget from "@/components/ValuationCalculatorWidget";
import { Shield, Scale, Info, CheckCircle2, AlertOctagon } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Official Government Valuation Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Ghana Rent Control Assessment Calculator
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Simulate the statutory maximum allowable rent for residential and commercial premises in
          compliance with the Rent Act, 1963 (Act 220) and Rent Amendment Regulations.
        </p>
      </div>

      {/* Interactive Engine */}
      <ValuationCalculatorWidget />

      {/* Explanatory Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-sm font-bold text-gray-900">Geographic Zone Weighting</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Greater Accra Prime (Airport, Cantonments, East Legon), Kumasi Urban (Ahodwo, KNUST),
            and Takoradi coastal enclaves receive localized index multipliers reflecting municipal
            infrastructure.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-sm font-bold text-gray-900">Statutory Amenities Gazette</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Piped Ghana Water (GWCL), dedicated ECG prepaid meters, backup generator systems, and
            perimeter security walls are valued using predefined statutory monthly premiums.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-sm font-bold text-gray-900">Structural Age Depreciation</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Modern newly built structures receive a contemporary finish premium, while properties
            exceeding 15 to 30 years undergo statutory depreciation adjustments.
          </p>
        </div>
      </div>
    </div>
  );
}
