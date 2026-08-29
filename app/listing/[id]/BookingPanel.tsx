"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Listing } from "@/lib/types";
import { createBooking } from "@/lib/api";
import Button from "@/components/Button";

export default function BookingPanel({ listing }: { listing: Listing }) {
  const [duration, setDuration] = useState(listing.minDurationMonths);
  const [renterName, setRenterName] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [itemsDescription, setItemsDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const total = listing.pricePerMonth * duration;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await createBooking({
        listingId: listing.id,
        renterName,
        renterEmail,
        itemsDescription,
        durationMonths: duration,
        startDate,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="h-fit rounded-2xl border border-blush-light bg-white p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-magenta" />
        <h3 className="mt-3 font-display text-lg font-semibold text-plum">
          Request sent
        </h3>
        <p className="mt-2 text-sm text-plum-soft">
          This booking request is saved. {listing.host.name} typically
          responds within a day, at {renterEmail}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit space-y-5 rounded-2xl border border-blush-light bg-white p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold text-plum">
          ${listing.pricePerMonth}
          <span className="text-sm font-medium text-plum-soft">/mo</span>
        </span>
        <span className="text-xs text-plum-soft">
          Min. {listing.minDurationMonths} mo
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="renter-name" className="text-xs font-medium text-plum-soft">
            Your name
          </label>
          <input
            id="renter-name"
            required
            value={renterName}
            onChange={(e) => setRenterName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2 text-sm focus:border-magenta"
          />
        </div>
        <div>
          <label htmlFor="renter-email" className="text-xs font-medium text-plum-soft">
            Email
          </label>
          <input
            id="renter-email"
            type="email"
            required
            value={renterEmail}
            onChange={(e) => setRenterEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2 text-sm focus:border-magenta"
          />
        </div>
      </div>

      <div>
        <label htmlFor="start-date" className="text-xs font-medium text-plum-soft">
          Move-in date
        </label>
        <input
          id="start-date"
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2 text-sm focus:border-magenta"
        />
      </div>

      <div>
        <label htmlFor="duration" className="text-xs font-medium text-plum-soft">
          Duration (months)
        </label>
        <input
          id="duration"
          type="number"
          min={listing.minDurationMonths}
          value={duration}
          onChange={(e) =>
            setDuration(Math.max(listing.minDurationMonths, Number(e.target.value)))
          }
          className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2 text-sm focus:border-magenta"
        />
      </div>

      <div>
        <label htmlFor="items" className="text-xs font-medium text-plum-soft">
          What do you need this space for?
        </label>
        <textarea
          id="items"
          required
          value={itemsDescription}
          onChange={(e) => setItemsDescription(e.target.value)}
          rows={3}
          placeholder="e.g. storing 6 boxes and a sofa, or tell the host what you have in mind"
          className="mt-2 w-full resize-none rounded-lg border border-blush-light px-3 py-2 text-sm focus:border-magenta"
        />
      </div>

      <div className="flex items-center justify-between border-t border-blush-light pt-4 text-sm">
        <span className="text-plum-soft">Estimated total</span>
        <span className="font-mono-data font-semibold text-plum">${total}</span>
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {errorMessage}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Request to book"
        )}
      </Button>
      <p className="text-center text-[11px] text-plum-soft">
        You won't be charged yet. This sends a request to the host.
      </p>
    </form>
  );
}
