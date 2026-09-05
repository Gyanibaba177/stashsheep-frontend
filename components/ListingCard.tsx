import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Listing } from "@/lib/types";
import UnitGrid from "./UnitGrid";

const spaceTypeLabel: Record<Listing["spaceType"], string> = {
  room: "Room",
  garage: "Garage",
  basement: "Basement",
  shed: "Shed",
  office: "Office space",
  warehouse: "Warehouse",
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-blush-light bg-white transition-shadow hover:shadow-lg hover:shadow-blush-light/60"
    >
      <div className="unit-grid relative flex h-40 items-center justify-center overflow-hidden bg-blush-light/40 p-6">
        {listing.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <UnitGrid sqFt={listing.sizeSqFt} maxCells={48} className="w-full max-w-[160px]" />
        )}
        {listing.category === "business" && (
          <span className="absolute left-3 top-3 rounded-full bg-plum px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Business
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-plum">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-sm text-plum-soft">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>
            {listing.neighborhood}, {listing.city}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-plum-soft">
          <span className="font-mono-data">{listing.sizeSqFt} sq ft</span>
          <span aria-hidden="true">·</span>
          <span>{spaceTypeLabel[listing.spaceType]}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-mono-data text-lg font-semibold text-plum">
              ${listing.pricePerMonth}
            </span>
            <span className="text-xs text-plum-soft">/mo</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-plum-soft">
              <Star className="h-3.5 w-3.5 fill-magenta text-magenta" />
              {listing.rating.toFixed(1)}
            </span>
            {listing.host.verified && (
              <BadgeCheck className="h-4 w-4 text-magenta" aria-label="Verified host" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
