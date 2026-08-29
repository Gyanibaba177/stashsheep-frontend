import { BadgeCheck, MessageCircle, PackageCheck, Search } from "lucide-react";
import Button from "@/components/Button";

const steps = [
  {
    icon: Search,
    title: "Search by size and location",
    body: "Tell us roughly how much you need to store and where. We'll show listings within your radius, sorted by distance.",
  },
  {
    icon: MessageCircle,
    title: "Message the host",
    body: "Ask questions, confirm access hours, and agree on a move-in date before you commit to anything.",
  },
  {
    icon: BadgeCheck,
    title: "Book with confidence",
    body: "Every host completes identity verification before their listing goes live. Ratings and reviews are visible on every profile.",
  },
  {
    icon: PackageCheck,
    title: "Move in, pay monthly",
    body: "No long leases. Pay for the months you actually need, and give notice whenever you're ready to move out.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-plum">How Stashly works</h1>
      <p className="mt-3 text-sm leading-relaxed text-plum-soft">
        Stashly connects people with unused space — a garage, a spare room,
        a storeroom — to renters nearby who need somewhere to put their
        things. No warehouses, no long leases.
      </p>

      <div className="mt-10 space-y-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-light text-magenta-dark">
              <step.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono-data text-xs text-plum-soft">
                Step {i + 1}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-plum">
                {step.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-plum-soft">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-blush-light bg-white p-6 text-center">
        <p className="font-display text-lg font-semibold text-plum">
          Ready to find space, or list your own?
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button href="/browse">Browse space</Button>
          <Button href="/list-your-space" variant="secondary">
            List your space
          </Button>
        </div>
      </div>
    </div>
  );
}
