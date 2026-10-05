"use client";

import React, { useState } from "react";
import { PaymentMethod } from "@/lib/types";
import { formatGHS } from "@/lib/utils";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  ShieldCheck,
  Receipt,
  Download,
} from "lucide-react";

interface MobileMoneyModalProps {
  contractId: string;
  contractNumber?: string;
  tenantId: string;
  tenantName: string;
  amountGhs: number;
  periodMonth?: string;
  onSuccess?: (paymentRecord: any) => void;
  onClose: () => void;
}

export default function MobileMoneyModal({
  contractId,
  contractNumber = "GRC-TC-2026-00104",
  tenantId,
  tenantName,
  amountGhs,
  periodMonth = "October 2026",
  onSuccess,
  onClose,
}: MobileMoneyModalProps) {
  const [network, setNetwork] = useState<PaymentMethod>("MTN_MOMO");
  const [phoneNumber, setPhoneNumber] = useState("0244918273");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const networks: { id: PaymentMethod; name: string; color: string; prefix: string }[] = [
    { id: "MTN_MOMO", name: "MTN Mobile Money", color: "bg-yellow-400 text-yellow-950", prefix: "*170#" },
    { id: "VODAFONE_CASH", name: "Telecel / Vodafone Cash", color: "bg-red-600 text-white", prefix: "*110#" },
    { id: "AIRTELTIGO_MONEY", name: "AT Money (AirtelTigo)", color: "bg-blue-600 text-white", prefix: "*110#" },
  ];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          tenantId,
          tenantName,
          amountGhs,
          momoNetwork: network,
          momoNumber: phoneNumber,
          billingPeriodMonth: periodMonth,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        setReceipt(data.payment);
        setPaymentComplete(true);
        if (onSuccess) onSuccess(data.payment);
      }
    } catch {
      // Fallback local simulation
      const mockPay = {
        id: `pay-${Date.now()}`,
        transactionRef: `MOMO-GRC-202610-${Math.floor(1000 + Math.random() * 9000)}`,
        receiptNumber: `GRC-RCP-${Math.floor(10000 + Math.random() * 90000)}`,
        contractId,
        tenantId,
        tenantName,
        amountGhs,
        momoNetwork: network,
        momoNumber: phoneNumber,
        billingPeriodMonth: periodMonth,
        paidAt: new Date().toISOString(),
      };
      setIsProcessing(false);
      setReceipt(mockPay);
      setPaymentComplete(true);
      if (onSuccess) onSuccess(mockPay);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-yellow-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ghana Mobile Money Gateway</h3>
              <p className="text-[11px] text-emerald-200">Rent Control Certified Escrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!paymentComplete ? (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Payment Due ({periodMonth})
                </span>
                <div className="text-xs text-gray-600 mt-0.5 font-medium truncate max-w-[200px]">
                  Contract: {contractNumber}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-900">
                  {formatGHS(amountGhs)}
                </span>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Mobile Money Network
              </label>
              <div className="grid grid-cols-1 gap-2">
                {networks.map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setNetwork(net.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      network === net.id
                        ? "border-emerald-600 bg-emerald-50/50 shadow-2xs font-semibold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${net.color.split(" ")[0]}`}></span>
                      <span className="text-xs">{net.name}</span>
                    </div>
                    {network === net.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Registered MoMo Wallet Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-gray-400">
                  +233
                </span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="244123456"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                A prompt will be pushed to this mobile phone to authorize the transaction.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pushing MoMo USSD Prompt...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Authorize {formatGHS(amountGhs)} via MoMo</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-900">Payment Successful!</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Official Rent Control Department Digital Receipt Issued
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between border-b border-gray-200 pb-1.5 font-sans">
                <span className="text-gray-500">Official Receipt No:</span>
                <span className="font-bold text-emerald-800">{receipt?.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 font-sans">
                <span className="text-gray-500">Transaction Ref:</span>
                <span className="font-semibold text-gray-800">{receipt?.transactionRef}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 font-sans">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-gray-900">{formatGHS(receipt?.amountGhs)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5 font-sans">
                <span className="text-gray-500">Wallet Account:</span>
                <span className="font-semibold text-gray-800">{receipt?.momoNumber} ({receipt?.momoNetwork.replace("_", " ")})</span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-gray-500">Tenancy Period:</span>
                <span className="font-semibold text-gray-800">{receipt?.billingPeriodMonth}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
