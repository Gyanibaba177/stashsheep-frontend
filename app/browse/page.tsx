import BrowseClient from "./BrowseClient";
import { fetchListings } from "@/lib/api";

export default async function BrowsePage() {
  const listings = await fetchListings();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-plum">Browse space</h1>
      <p className="mt-2 text-sm text-plum-soft">
        {listings.length} listing{listings.length === 1 ? "" : "s"} across Lahore,
        Karachi, and Islamabad.
      </p>
      <BrowseClient listings={listings} />
    </div>
  );
}
