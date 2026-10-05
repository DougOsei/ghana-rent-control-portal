import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = dbStore.getPropertyById(params.id);
    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
