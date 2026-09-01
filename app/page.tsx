import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, Zap } from "lucide-react";
import Button from "@/components/Button";
import ListingCard from "@/components/ListingCard";
import UnitGrid from "@/components/UnitGrid";
import { fetchListings } from "@/lib/api";

export default async function Home() {
  const listings = await fetchListings();
  const featured = listings.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="unit-grid relative overflow-hidden border-b border-blush-light">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blush-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-magenta-dark">
              Now live in Lahore, Karachi &amp; Islamabad
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-plum md:text-5xl">
              Your unused space is worth more than you think.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-plum-soft">
              stashsheep connects people with unused space — a garage, a
              storeroom, a spare room — to people nearby who need it.
              Starting with storage, because that's the easiest way to put
              idle space to work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/browse">
                Find storage
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/list-your-space" variant="secondary">
                List your space
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-blush-light bg-white p-8 shadow-xl shadow-blush-light/50">
              <p className="font-mono-data text-xs uppercase tracking-wide text-plum-soft">
                180 sq ft available
              </p>
              <UnitGrid sqFt={180} maxCells={60} className="mt-4" />
              <div className="mt-6 flex items-center justify-between border-t border-blush-light pt-4">
                <span className="font-display text-2xl font-bold text-plum">
                  $45<span className="text-sm font-medium text-plum-soft">/mo</span>
                </span>
                <span className="text-xs text-plum-soft">Gulberg, Lahore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-bold text-plum">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <Zap className="h-6 w-6 text-magenta" />
            <h3 className="mt-4 font-display text-lg font-semibold text-plum">
              Search nearby
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">
              Filter by size, price, and distance to find space that
              actually fits what you're storing.
            </p>
          </div>
          <div>
            <ShieldCheck className="h-6 w-6 text-magenta" />
            <h3 className="mt-4 font-display text-lg font-semibold text-plum">
              Book with a verified host
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">
              Every host is identity-checked before their listing goes
              live. Message directly to confirm details.
            </p>
          </div>
          <div>
            <Wallet className="h-6 w-6 text-magenta" />
            <h3 className="mt-4 font-display text-lg font-semibold text-plum">
              Pay monthly, cancel anytime
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">
              No long leases. Pay for the months you need and move your
              things out whenever you're done.
            </p>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="border-t border-blush-light bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-plum">
              Available near you
            </h2>
            <Link
              href="/browse"
              className="flex items-center gap-1 text-sm font-semibold text-magenta-dark hover:text-magenta"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="unit-grid-dense rounded-3xl bg-plum px-8 py-14 text-center">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Got space you're not using?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            List it in under five minutes. You set the price, the
            availability, and who you rent to.
          </p>
          <Button href="/list-your-space" className="mt-7">
            List your space
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
