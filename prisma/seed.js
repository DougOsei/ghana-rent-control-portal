// Database Seed Script for Ghana Rent Control Property Portal
// Populates initial realistic data for Ghana Card KYC, certified properties, tenancy contracts, and disputes

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Ghana Rent Control database...");

  // 1. Create Users
  const adminOfficer = await prisma.user.upsert({
    where: { email: "officer.sampson@rentcontrol.gov.gh" },
    update: {},
    create: {
      id: "user-admin-1",
      email: "officer.sampson@rentcontrol.gov.gh",
      passwordHash: "hashed_pwd_officer",
      role: "ADMIN_OFFICER",
      fullName: "Chief Insp. Sampson Abbey",
      phone: "+233 24 492 8190",
      ghanaCardNumber: "GHA-849302194-9",
      ghanaCardVerified: true,
      address: "Rent Control Department H/Q, Ministries, Accra",
    },
  });

  const landlord1 = await prisma.user.upsert({
    where: { email: "kwame.mensah@gmail.com" },
    update: {},
    create: {
      id: "user-landlord-1",
      email: "kwame.mensah@gmail.com",
      passwordHash: "hashed_pwd_landlord",
      role: "LANDLORD",
      fullName: "Kwame Mensah Boakye",
      phone: "+233 20 812 3456",
      ghanaCardNumber: "GHA-102938475-1",
      ghanaCardVerified: true,
      address: "Plot 42, Ambassadorial Enclave, East Legon, Accra",
    },
  });

  const tenant1 = await prisma.user.upsert({
    where: { email: "abena.serwaa@gmail.com" },
    update: {},
    create: {
      id: "user-tenant-1",
      email: "abena.serwaa@gmail.com",
      passwordHash: "hashed_pwd_tenant",
      role: "TENANT",
      fullName: "Abena Serwaa Osei",
      phone: "+233 55 311 9876",
      ghanaCardNumber: "GHA-594837261-4",
      ghanaCardVerified: true,
      address: "Achimota Forest Link, Accra",
    },
  });

  // 2. Create Certified Property
  const prop1 = await prisma.property.upsert({
    where: { id: "prop-1" },
    update: {},
    create: {
      id: "prop-1",
      landlordId: landlord1.id,
      title: "Executive 2-Bedroom Apartment at East Legon",
      description: "Modern luxury apartment with fitted kitchen, standby generator, 24/7 security guard, and dedicated ECG prepaid meter.",
      propertyType: "APARTMENT_2BED",
      address: "Boundary Road, near A&C Mall",
      region: "Greater Accra",
      districtTown: "East Legon",
      gpsAddress: "GA-392-8104",
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 90,
      housingAgeYears: 2,
      amenities: JSON.stringify([
        "Self-Contained Bathroom",
        "Dedicated ECG Prepaid Meter",
        "Ghana Water (GWCL) Piped",
        "Standby Generator / Solar",
        "Walled & Gated Compound",
        "Air Conditioning",
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
      ]),
      requestedRentGhs: 4200,
      allowableRentGhs: 4200,
      priceStatus: "APPROVED_CAPPED",
      certNumber: "GRC-ACC-2026-00412",
      certifiedAt: new Date("2026-02-10T12:00:00Z"),
      isAvailable: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
