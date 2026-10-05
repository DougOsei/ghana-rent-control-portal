import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin, Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 print:hidden mt-20">
      {/* Ghana Flag stripe */}
      <div className="h-1.5 flex">
        <div className="bg-[#CE1126] flex-1"></div>
        <div className="bg-[#FCD116] flex-1"></div>
        <div className="bg-[#006B3F] flex-1"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-yellow-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-tight block">
                  GHANA RENT CONTROL
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                  Department of Republic of Ghana
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering fair housing, curbing arbitrary rent increments, and enforcing the statutory
              6-month advance ceiling under the Rent Act, 1963 (Act 220).
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties" className="hover:text-emerald-400 transition-colors">
                  Certified Property Search
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                  Rent Assessment Calculator
                </Link>
              </li>
              <li>
                <Link href="/landlord" className="hover:text-emerald-400 transition-colors">
                  Landlord Property Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Rent Control Officer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Legal Regulations
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Rent Act 1963 (Act 220)</li>
              <li>• Section 25(5): 6-Month Advance Cap</li>
              <li>• Rent Assessment Certificate Validation</li>
              <li>• National Identification Authority (NIA) KYC</li>
              <li>• Digital Dispute Arbitration Module</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Rent Control H/Q Contact
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Rent Control Department, Ministries Enclave, P.O. Box M.123, Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+233 (0) 30 266 4321 / Toll Free: 0800-RENT</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>info@rentcontrol.gov.gh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Republic of Ghana Rent Control Department. All rights reserved.</p>
          <p className="text-emerald-400 font-medium">Digital Housing & Valuation Infrastructure</p>
        </div>
      </div>
    </footer>
  );
}
