import { Listing, Host } from "./types";

// In the browser this must be NEXT_PUBLIC_ so it's available client-side
// (booking form, list-your-space form). Server components can read it too.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Shapes returned by the FastAPI backend (snake_case, as FastAPI sends it) ---

interface ApiHost {
  id: number;
  name: string;
  verified: boolean;
  response_rate: number;
  created_at: string;
}

interface ApiListing {
  id: number;
  title: string;
  description: string;
  space_type: string;
  category: string;
  city: string;
  neighborhood: string;
  size_sqft: number;
  price_per_month: number;
  currency: string;
  amenities: string[];
  images: string[];
  available_from: string;
  min_duration_months: number;
  is_active: boolean;
  rating: number;
  review_count: number;
  host: ApiHost;
}

export interface ApiBooking {
  id: number;
  listing_id: number;
  renter_name: string;
  renter_email: string;
  items_description: string;
  duration_months: number;
  start_date: string;
  status: string;
  total_price: number;
  created_at: string;
}

// --- Mappers: backend shape -> the Listing type every component already uses ---

function mapHost(h: ApiHost): Host {
  return {
    id: String(h.id),
    name: h.name,
    verified: h.verified,
    responseRate: h.response_rate,
    memberSince: h.created_at,
  };
}

function mapListing(l: ApiListing): Listing {
  return {
    id: String(l.id),
    title: l.title,
    description: l.description,
    spaceType: l.space_type as Listing["spaceType"],
    category: l.category as Listing["category"],
    city: l.city,
    neighborhood: l.neighborhood,
    sizeSqFt: l.size_sqft,
    pricePerMonth: l.price_per_month,
    currency: l.currency as Listing["currency"],
    images: l.images,
    amenities: l.amenities,
    host: mapHost(l.host),
    availableFrom: l.available_from,
    minDurationMonths: l.min_duration_months,
    rating: l.rating,
    reviewCount: l.review_count,
  };
}

// --- API calls ---

export async function fetchListings(filters?: {
  city?: string;
  spaceType?: string;
  category?: string;
  maxPrice?: number;
}): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  if (filters?.spaceType) params.set("space_type", filters.spaceType);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.maxPrice) params.set("max_price", String(filters.maxPrice));

  const res = await fetch(`${API_URL}/api/listings?${params.toString()}`, {
    cache: "no-store", // always show current data, never a stale build-time snapshot
  });
  if (!res.ok) throw new Error(`Failed to fetch listings: ${res.status}`);
  const data: ApiListing[] = await res.json();
  return data.map(mapListing);
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const res = await fetch(`${API_URL}/api/listings/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch listing: ${res.status}`);
  const data: ApiListing = await res.json();
  return mapListing(data);
}

export async function createBooking(payload: {
  listingId: string;
  renterName: string;
  renterEmail: string;
  itemsDescription: string;
  durationMonths: number;
  startDate: string;
}): Promise<ApiBooking> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listing_id: Number(payload.listingId),
      renter_name: payload.renterName,
      renter_email: payload.renterEmail,
      items_description: payload.itemsDescription,
      duration_months: payload.durationMonths,
      start_date: payload.startDate,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Booking failed: ${res.status}`);
  }
  return res.json();
}

export async function createHost(payload: {
  name: string;
  email: string;
}): Promise<{ id: number }> {
  const res = await fetch(`${API_URL}/api/hosts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) {
    // Host with this email already exists — that's fine for this MVP,
    // a real app would look them up by email instead. For now we surface
    // a clear error so the person knows to use a different email.
    throw new Error(
      "An account with this email already exists. (This MVP doesn't have login yet — use a different email for now.)"
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Could not create host: ${res.status}`);
  }
  return res.json();
}

export async function createListing(payload: {
  title: string;
  description: string;
  spaceType: string;
  city: string;
  neighborhood: string;
  sizeSqFt: number;
  pricePerMonth: number;
  availableFrom: string;
  hostId: number;
  imageUrls?: string[];
}): Promise<ApiListing> {
  const res = await fetch(`${API_URL}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      space_type: payload.spaceType,
      city: payload.city,
      neighborhood: payload.neighborhood,
      size_sqft: payload.sizeSqFt,
      price_per_month: payload.pricePerMonth,
      available_from: payload.availableFrom,
      host_id: payload.hostId,
      amenities: [],
      image_urls: payload.imageUrls || [],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Could not create listing: ${res.status}`);
  }
  return res.json();
}
