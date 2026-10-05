import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/store";
import { PriceStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || undefined;
    const districtTown = searchParams.get("districtTown") || undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const propertyType = searchParams.get("propertyType") || undefined;
    const bedrooms = searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined;
    const status = (searchParams.get("status") as PriceStatus) || undefined;

    const properties = dbStore.getProperties({
      region,
      districtTown,
      maxPrice,
      propertyType,
      bedrooms,
      status,
    });

    return NextResponse.json({ success: true, count: properties.length, properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields check
    const required = [
      "landlordId",
      "landlordName",
      "landlordPhone",
      "landlordGhanaCard",
      "title",
      "description",
      "propertyType",
      "address",
      "region",
      "districtTown",
      "bedrooms",
      "bathrooms",
      "sizeSqm",
      "housingAgeYears",
      "amenities",
      "requestedRentGhs",
    ];

    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const images = body.images && body.images.length > 0 ? body.images : [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ];

    const newProperty = dbStore.createProperty({
      landlordId: body.landlordId,
      landlordName: body.landlordName,
      landlordPhone: body.landlordPhone,
      landlordGhanaCard: body.landlordGhanaCard,
      title: body.title,
      description: body.description,
      propertyType: body.propertyType,
      address: body.address,
      region: body.region,
      districtTown: body.districtTown,
      gpsAddress: body.gpsAddress || "GA-190-0021",
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      sizeSqm: Number(body.sizeSqm),
      housingAgeYears: Number(body.housingAgeYears),
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      images,
      requestedRentGhs: Number(body.requestedRentGhs),
      isAvailable: true,
    });

    return NextResponse.json({
      success: true,
      message: "Property listing submitted to Ghana Rent Control Department for price review.",
      property: newProperty,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
