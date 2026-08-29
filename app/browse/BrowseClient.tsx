"use client";

import { useMemo, useState } from "react";
import { Listing, SpaceType } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import { cn } from "@/lib/utils";

const cities = ["All cities", "Lahore", "Karachi", "Islamabad"] as const;
const spaceTypes: { value: SpaceType | "all"; label: string }[] = [
  { value: "all", label: "Any type" },
  { value: "room", label: "Room" },
  { value: "garage", label: "Garage" },
  { value: "basement", label: "Basement" },
  { value: "shed", label: "Shed" },
  { value: "office", label: "Office space" },
  { value: "warehouse", label: "Warehouse" },
];

export default function BrowseClient({ listings }: { listings: Listing[] }) {
  const [city, setCity] = useState<(typeof cities)[number]>("All cities");
  const [spaceType, setSpaceType] = useState<SpaceType | "all">("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [businessOnly, setBusinessOnly] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (city !== "All cities" && l.city !== city) return false;
      if (spaceType !== "all" && l.spaceType !== spaceType) return false;
      if (l.pricePerMonth > maxPrice) return false;
      if (businessOnly && l.category !== "business") return false;
      return true;
    });
  }, [listings, city, spaceType, maxPrice, businessOnly]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Filters */}
      <aside className="h-fit rounded-2xl border border-blush-light bg-white p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-plum">
          Filters
        </h2>

        <div className="mt-5">
          <label className="text-xs font-medium text-plum-soft">City</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  city === c
                    ? "border-magenta bg-magenta text-white"
                    : "border-blush-light text-plum-soft hover:border-magenta hover:text-magenta-dark"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="space-type" className="text-xs font-medium text-plum-soft">
            Space type
          </label>
          <select
            id="space-type"
            value={spaceType}
            onChange={(e) => setSpaceType(e.target.value as SpaceType | "all")}
            className="mt-2 w-full rounded-lg border border-blush-light bg-white px-3 py-2 text-sm text-plum focus:border-magenta"
          >
            {spaceTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label htmlFor="max-price" className="text-xs font-medium text-plum-soft">
            Max price: <span className="font-mono-data text-plum">${maxPrice}/mo</span>
          </label>
          <input
            id="max-price"
            type="range"
            min={15}
            max={200}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-[#ff1a75]"
          />
        </div>

        <label className="mt-5 flex items-center gap-2 text-xs font-medium text-plum-soft">
          <input
            type="checkbox"
            checked={businessOnly}
            onChange={(e) => setBusinessOnly(e.target.checked)}
            className="h-4 w-4 accent-[#ff1a75]"
          />
          Business storage only
        </label>
      </aside>

      {/* Results */}
      <div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blush-light py-20 text-center">
            <p className="font-display text-lg font-semibold text-plum">
              Nothing matches those filters yet
            </p>
            <p className="mt-2 text-sm text-plum-soft">
              Try a higher price limit or a different city.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
