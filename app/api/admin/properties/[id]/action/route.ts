import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, cappedPrice, rejectionReason } = body;

    if (!["APPROVE_AS_IS", "APPROVE_CAPPED", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be APPROVE_AS_IS, APPROVE_CAPPED, or REJECT." },
        { status: 400 }
      );
    }

    const updated = dbStore.adminReviewProperty(
      params.id,
      action,
      cappedPrice ? Number(cappedPrice) : undefined,
      rejectionReason
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Property ${action === "REJECT" ? "rejected" : "approved with Rent Assessment Certificate"}.`,
      property: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
