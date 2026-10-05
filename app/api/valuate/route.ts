import { NextRequest, NextResponse } from "next/server";
import { calculateRentValuation } from "@/lib/valuationEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      propertyType,
      region,
      districtTown,
      bedrooms,
      bathrooms,
      sizeSqm,
      housingAgeYears,
      amenities,
      requestedRentGhs,
    } = body;

    const result = calculateRentValuation({
      propertyType,
      region,
      districtTown,
      bedrooms: Number(bedrooms || 1),
      bathrooms: Number(bathrooms || 1),
      sizeSqm: Number(sizeSqm || 50),
      housingAgeYears: Number(housingAgeYears || 2),
      amenities: Array.isArray(amenities) ? amenities : [],
      requestedRentGhs: Number(requestedRentGhs || 1000),
    });

    return NextResponse.json({ success: true, valuation: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
