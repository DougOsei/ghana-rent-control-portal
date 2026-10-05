import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function GET() {
  try {
    const disputes = dbStore.getDisputes();
    return NextResponse.json({ success: true, count: disputes.length, disputes });
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
      complainantId,
      complainantName,
      complainantRole,
      respondentId,
      respondentName,
      category,
      title,
      description,
    } = body;

    const dispute = dbStore.createDispute({
      propertyId,
      propertyTitle,
      complainantId,
      complainantName,
      complainantRole,
      respondentId,
      respondentName,
      category,
      title,
      description,
    });

    return NextResponse.json({
      success: true,
      message: `Dispute case ${dispute.caseNumber} lodged with Ghana Rent Control Department.`,
      dispute,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, hearingDate, resolutionDetails } = body;

    const updated = dbStore.updateDisputeStatus(id, status, hearingDate, resolutionDetails);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Dispute not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Dispute status updated.",
      dispute: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
