export type SpaceType = "room" | "garage" | "basement" | "shed" | "office" | "warehouse";

export type ListingCategory = "personal" | "business";

export interface Host {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
  responseRate: number; // 0-100
  memberSince: string; // ISO date
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  spaceType: SpaceType;
  category: ListingCategory;
  city: string;
  neighborhood: string;
  sizeSqFt: number;
  pricePerMonth: number;
  currency: "USD" | "PKR";
  images: string[];
  amenities: string[]; // e.g. "24/7 access", "CCTV", "climate controlled"
  host: Host;
  availableFrom: string; // ISO date
  minDurationMonths: number;
  rating: number; // 0-5
  reviewCount: number;
}

export interface BookingRequest {
  listingId: string;
  startDate: string;
  durationMonths: number;
  itemsDescription: string;
}

// Placeholder shape for a future AI-estimation feature (photo -> required sq ft).
// Left unimplemented intentionally — wiring this up needs your own OpenAI API key
// and should live behind an API route, never called client-side.
export interface AiSpaceEstimateRequest {
  imageUrls: string[];
  itemsDescription?: string;
}

export interface AiSpaceEstimateResult {
  estimatedSqFt: number;
  confidence: "low" | "medium" | "high";
  suggestedSpaceTypes: SpaceType[];
}
