import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const payments = dbStore.getPayments(userId);
    return NextResponse.json({ success: true, count: payments.length, payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contractId,
      tenantId,
      tenantName,
      amountGhs,
      momoNetwork,
      momoNumber,
      billingPeriodMonth,
    } = body;

    const payment = dbStore.createPayment({
      contractId,
      tenantId,
      tenantName,
      amountGhs: Number(amountGhs),
      momoNetwork,
      momoNumber,
      billingPeriodMonth: billingPeriodMonth || "Current Month",
    });

    return NextResponse.json({
      success: true,
      message: "Mobile Money transaction completed successfully.",
      payment,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
