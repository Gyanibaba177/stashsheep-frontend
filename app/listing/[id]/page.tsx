import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { fetchListing } from "@/lib/api";
import UnitGrid from "@/components/UnitGrid";
import BookingPanel from "./BookingPanel";

// This page now reads from a real database via the API, so it can't be
// statically pre-rendered at build time the way the mock-data version was.
export const dynamic = "force-dynamic";

const spaceTypeLabel: Record<string, string> = {
  room: "Room",
  garage: "Garage",
  basement: "Basement",
  shed: "Shed",
  office: "Office space",
  warehouse: "Warehouse",
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListing(id);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-magenta-dark">
            {spaceTypeLabel[listing.spaceType]}
            {listing.category === "business" ? " · Business storage" : ""}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-plum">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-plum-soft">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.neighborhood}, {listing.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-magenta text-magenta" />
              {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
            </span>
          </div>

          {listing.images.length > 0 ? (
            <div className="mt-8">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-blush-light bg-blush-light/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {listing.images.slice(1).map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-blush-light"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${listing.title} photo ${i + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 font-mono-data text-xs text-plum-soft">
                {listing.sizeSqFt} sq ft
              </p>
            </div>
          ) : (
            <div className="unit-grid mt-8 flex items-center justify-center rounded-2xl border border-blush-light bg-blush-light/30 p-10">
              <div className="text-center">
                <UnitGrid sqFt={listing.sizeSqFt} maxCells={80} className="mx-auto max-w-xs" />
                <p className="mt-4 font-mono-data text-sm text-plum-soft">
                  {listing.sizeSqFt} sq ft, scaled
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-plum">
              About this space
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">
              {listing.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-plum">Amenities</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {listing.amenities.length === 0 ? (
                <li className="text-xs text-plum-soft">No amenities listed yet.</li>
              ) : (
                listing.amenities.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-blush-light px-3 py-1.5 text-xs text-plum-soft"
                  >
                    {a}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-blush-light p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-light font-display font-semibold text-magenta-dark">
              {listing.host.name.charAt(0)}
            </div>
            <div>
              <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-plum">
                {listing.host.name}
                {listing.host.verified && (
                  <BadgeCheck className="h-4 w-4 text-magenta" aria-label="Verified host" />
                )}
              </p>
              <p className="text-xs text-plum-soft">
                {listing.host.responseRate}% response rate · Member since{" "}
                {new Date(listing.host.memberSince).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        <BookingPanel listing={listing} />
      </div>
    </div>
  );
}