# Ghana Rent Control Property Portal

> **Official National Portal connecting Landlords, Tenants, and the Ghana Rent Control Department under the Rent Act, 1963 (Act 220)**

---

## 🌟 Overview & Regulatory Compliance

In Ghana, arbitrary rent increments, unlawful evictions, and demanding excessive rent advance payments (often 1 to 2 years) have long impacted tenants and distorted the housing market. 

The **Ghana Rent Control Property Portal** implements a full-stack digital solution in direct compliance with:
1. **Section 25(5) of the Rent Act (Act 220):** Enforces the statutory **maximum 6-month advance rent ceiling** across all tenancy agreements.
2. **Section 10 & 19 (Fair Rent Valuation):** Automated Valuation Engine calculating maximum allowable rent based on municipal zones, housing age, and statutory amenities.
3. **National Identification Authority (NIA) Integration:** Mandatory **Ghana Card (`GHA-XXXXXXXXX-X`)** verification for both landlords and tenants.
4. **Official Rent Assessment Certificates:** Issued with official government seals, digital verification QR codes, and certificate reference numbers (e.g. `GRC-ACC-2026-00412`).

---

## 🏗️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend / APIs:** Next.js API Routes (Node.js)
- **Database & ORM:** PostgreSQL with Prisma ORM (and pure SQL DDL included)
- **Authentication & Roles:** Role-based access control (`ADMIN_OFFICER`, `LANDLORD`, `TENANT`)
- **Payments Integration:** Mobile Money escrow simulation (MTN MoMo, Telecel / Vodafone Cash, AirtelTigo Money)

---

## 👥 Key Roles & Modules

### 1. ADMIN / GHANA RENT CONTROL DEPARTMENT (`ADMIN_OFFICER`)
- **Inspection Console & Queue:** Review landlord property submissions with automated comparison between requested rent and the statutory valuation ceiling.
- **Price Capping & Certification:** One-click "Approve with Legal Price Cap", "Approve As Requested", or "Reject Non-Compliant" with gazette notes.
- **Official Certificate Generator:** Printable and PDF-ready Rent Assessment Certificate with coat of arms and legal warnings.
- **Disputes & Arbitration Module:** Manage grievances lodged by citizens, schedule tribunal hearing dates, and record binding conciliation rulings.
- **Regional Price Index:** Real-time analytics on average rent, advance limits, and compliance rates across Accra, Kumasi, Takoradi, and regional districts.

### 2. LANDLORD (`LANDLORD`)
- **Ghana Card KYC:** Mandatory national ID validation (`GHA-XXXXXXXXX-X`) with real-time format checking.
- **Property Listing Submission:** Location, room counts, utilities, photos, GhanaPost GPS address.
- **Live Valuation Estimator:** Real-time pricing check that alerts landlords before submission if their proposed price exceeds the legal Rent Control ceiling.
- **Price Review Status:** Tracks listings as "Pending Rent Control Review", "Price Capped/Approved", or "Rejected".
- **Tenant Management & Contracts:** Accept tenant applications and execute digital tenancy contracts.

### 3. TENANT (`TENANT`)
- **Verified Property Search:** Search by Region, Town, Bedroom count, Maximum Budget slider, and Certified Fair Rent status.
- **Official Certificate Viewer:** View the government rent assessment certificate on every approved property.
- **Tenancy Application:** Submit verified Ghana Card, occupation, monthly income, and proposed advance months (statutorily capped at 6 months).
- **Mobile Money Payment Gateway:** Pay advance or monthly rent via MTN MoMo, Telecel, or AT Money with instant digital receipts.

---

## 📐 Database Schema Models

The system includes both `prisma/schema.prisma` and raw SQL DDL `prisma/schema.sql` with:
- **`User`**: Role (`LANDLORD`, `TENANT`, `ADMIN_OFFICER`), Ghana Card ID, verification status, contact info.
- **`Property`**: Location (Region, District, GhanaPost GPS), size, age, amenities, requested vs allowable rent, price status (`PENDING_REVIEW`, `APPROVED_CAPPED`, `REJECTED`), certificate number.
- **`PriceValuation`**: Base structural rate, zone multiplier, age depreciation factor, statutory amenities bonus, legal ceiling rent.
- **`Application`**: Tenant details, income, proposed advance months (enforced $\le 6$).
- **`TenancyContract`**: Digital agreement under Act 220, advance rent amount, digital signatures of landlord, tenant, and officer.
- **`Dispute`**: Case category (`UNLAWFUL_RENT_INCREASE`, `EXCESSIVE_ADVANCE_DEMAND`, `EVICTION_WITHOUT_NOTICE`, `MAINTENANCE_NEGLECT`), tribunal status, hearing date, resolution.
- **`RentPayment`**: Mobile Money transaction reference, network (`MTN_MOMO`, `VODAFONE_CASH`, `AIRTELTIGO_MONEY`), billing period, receipt number.

---

## 🔑 Demo Personas & Credentials

The portal includes built-in credentials for testing each distinct user role:

| Role | Email | Password | Details |
|---|---|---|---|
| **Rent Control Officer** | `officer.sampson@rentcontrol.gov.gh` | `admin123` | HQ Inspection Console, Certificate Approval & Disputes |
| **Landlord** | `kwame.mensah@gmail.com` | `landlord123` | Listing Submissions, Price Valuation Pre-checks, Lease Contracts |
| **Tenant** | `abena.serwaa@gmail.com` | `tenant123` | Verified Property Search, My Tenancy Dashboard, MoMo Payments |

---

## ⚙️ Quick Start & Setup Instructions

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd ghana-rent-control-portal
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Database (Optional for External PostgreSQL)
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# (Optional) Seed initial data
npm run prisma:seed
```
*Note: The application includes a self-contained in-memory / persistent store (`lib/store.ts`) with pre-seeded properties, contracts, and disputes so it runs out of the box even before configuring a remote database.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🏛️ Ghana Rent Control Valuation Algorithm

The statutory ceiling formula implemented in `lib/valuationEngine.ts` calculates:
$$\text{Structural Rent} = \text{BaseRate} \times \text{ZoneWeight} \times \text{SizeAdjustment} \times \text{AgeDepreciation}$$
$$\text{Ceiling Rent} = \text{Structural Rent} + \text{Statutory Amenities Bonus}$$

- **Zone Weights:**
  - Greater Accra Prime (East Legon, Cantonments, Airport, Ridge): **1.60 – 1.80**
  - Greater Accra Urban (Osu, Dzorwulu, Spintex, Achimota): **1.25 – 1.45**
  - Kumasi Prime (Ahodwo, Nhyiaeso, Asokwa): **1.20 – 1.30**
  - Takoradi Prime: **1.15 – 1.25**
- **Depreciation:**
  - $\le 3$ years: **1.08** (new build premium)
  - $4 - 10$ years: **1.00** (standard)
  - $11 - 20$ years: **0.94**
  - $> 30$ years: **0.75**
- **Statutory Amenities Additions:**
  - ECG Prepaid Meter: +GH₵ 120/mo
  - Ghana Water (GWCL) Piped: +GH₵ 130/mo
  - Standby Power Generator / Solar: +GH₵ 260/mo
  - Walled & Gated Security: +GH₵ 150/mo
  - Air Conditioning: +GH₵ 180/mo

