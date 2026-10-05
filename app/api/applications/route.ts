import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const role = searchParams.get("role") || undefined;

    const apps = dbStore.getApplications(userId, role);
    return NextResponse.json({ success: true, applications: apps });
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
      tenantId,
      tenantName,
      tenantPhone,
      tenantGhanaCard,
      monthlyIncomeGhs,
      employerOrOccupation,
      proposedMoveInDate,
      proposedAdvanceMonths,
      notes,
    } = body;

    // Enforce Ghana Rent Act 1963 Section 25(5)
    if (Number(proposedAdvanceMonths) > 6) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Statutory Violation: Under Section 25(5) of the Ghana Rent Act, 1963 (Act 220), advance rent cannot exceed 6 months.",
        },
        { status: 400 }
      );
    }

    const application = dbStore.createApplication({
      propertyId,
      propertyTitle,
      tenantId,
      tenantName,
      tenantPhone,
      tenantGhanaCard,
      monthlyIncomeGhs: Number(monthlyIncomeGhs),
      employerOrOccupation,
      proposedMoveInDate,
      proposedAdvanceMonths: Number(proposedAdvanceMonths || 6),
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Tenancy application submitted successfully.",
      application,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = dbStore.updateApplicationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
