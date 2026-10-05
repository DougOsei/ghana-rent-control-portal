import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const contracts = dbStore.getContracts(userId);
    return NextResponse.json({ success: true, contracts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      propertyTitle,
      propertyAddress,
      landlordId,
      landlordName,
      tenantId,
      tenantName,
      rentAmountGhs,
      advanceMonths,
      startDate,
      endDate,
      termsNotes,
    } = body;

    // Ghana Rent Act 1963 validation: max 6 months advance
    const months = Math.min(Number(advanceMonths || 6), 6);
    const advanceAmountGhs = Number(rentAmountGhs) * months;

    const contract = dbStore.createContract({
      propertyId,
      propertyTitle,
      propertyAddress,
      landlordId,
      landlordName,
      tenantId,
      tenantName,
      rentAmountGhs: Number(rentAmountGhs),
      advanceMonths: months,
      advanceAmountGhs,
      startDate,
      endDate,
      termsNotes,
    });

    return NextResponse.json({
      success: true,
      message: "Digital tenancy contract created under Ghana Rent Act compliance rules.",
      contract,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, role } = body;

    const updated = dbStore.signContract(id, role);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Contract signed digitally by ${role}.`,
      contract: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
