"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles, X, ImagePlus } from "lucide-react";
import Button from "@/components/Button";
import { SpaceType } from "@/lib/types";
import { createHost, createListing } from "@/lib/api";
import { uploadListingPhotos, isPhotoUploadConfigured } from "@/lib/photo-upload";

const spaceTypes: { value: SpaceType; label: string }[] = [
  { value: "room", label: "Room" },
  { value: "garage", label: "Garage" },
  { value: "basement", label: "Basement" },
  { value: "shed", label: "Shed" },
  { value: "office", label: "Office space" },
  { value: "warehouse", label: "Warehouse" },
];

const MAX_PHOTOS = 6;

export default function ListYourSpacePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [sizeSqFt, setSizeSqFt] = useState(100);
  const [spaceType, setSpaceType] = useState<SpaceType>("garage");

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const photoUploadReady = isPhotoUploadConfigured();

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const combined = [...photoFiles, ...selected].slice(0, MAX_PHOTOS);
    setPhotoFiles(combined);
    setPhotoPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  }

  function removePhoto(index: number) {
    const next = photoFiles.filter((_, i) => i !== index);
    setPhotoFiles(next);
    setPhotoPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const host = await createHost({
        name: String(data.get("hostName")),
        email: String(data.get("hostEmail")),
      });

      let imageUrls: string[] = [];
      if (photoFiles.length > 0) {
        imageUrls = await uploadListingPhotos(photoFiles);
      }

      await createListing({
        title: String(data.get("title")),
        description: String(data.get("description")),
        spaceType,
        city: String(data.get("city")),
        neighborhood: String(data.get("neighborhood")),
        sizeSqFt,
        pricePerMonth: Number(data.get("price")),
        availableFrom: String(data.get("availableFrom")),
        hostId: host.id,
        imageUrls,
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-magenta" />
        <h1 className="mt-4 font-display text-2xl font-bold text-plum">
          Listing submitted
        </h1>
        <p className="mt-2 text-sm text-plum-soft">
          It's saved and live now — check{" "}
          <a href="/browse" className="font-semibold text-magenta-dark hover:underline">
            Browse space
          </a>{" "}
          to see it.
        </p>
        <Button href="/" className="mt-8">
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-plum">List your space</h1>
      <p className="mt-2 text-sm text-plum-soft">
        Takes about five minutes. You'll set your own price and decide who
        you rent to.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="hostName" className="text-sm font-medium text-plum">
              Your name
            </label>
            <input
              id="hostName"
              name="hostName"
              required
              placeholder="e.g. Hamza Raza"
              className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
            />
          </div>
          <div>
            <label htmlFor="hostEmail" className="text-sm font-medium text-plum">
              Your email
            </label>
            <input
              id="hostEmail"
              name="hostEmail"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="text-sm font-medium text-plum">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="e.g. Clean, dry garage near city center"
            className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="space-type" className="text-sm font-medium text-plum">
              Space type
            </label>
            <select
              id="space-type"
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value as SpaceType)}
              className="mt-2 w-full rounded-lg border border-blush-light bg-white px-3 py-2.5 text-sm focus:border-magenta"
            >
              {spaceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city" className="text-sm font-medium text-plum">
              City
            </label>
            <input
              id="city"
              name="city"
              required
              placeholder="e.g. Lahore"
              className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
            />
          </div>
        </div>

        <div>
          <label htmlFor="neighborhood" className="text-sm font-medium text-plum">
            Neighborhood
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            required
            placeholder="e.g. Gulberg"
            className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-plum">
            Photos <span className="font-normal text-plum-soft">(optional, up to {MAX_PHOTOS})</span>
          </label>

          {!photoUploadReady && (
            <p className="mt-2 rounded-lg bg-blush-light/50 p-3 text-xs text-plum-soft">
              Photo upload isn't set up yet on this deployment — you can still
              submit the listing without photos.
            </p>
          )}

          {photoUploadReady && (
            <div className="mt-2 flex flex-wrap gap-3">
              {photoPreviews.map((src, i) => (
                <div
                  key={i}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-blush-light"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                                        className="absolute right-1 top-1 rounded-full bg-plum/70 p-1 text-white hover:bg-plum"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {photoFiles.length < MAX_PHOTOS && (
                <label
                  htmlFor="photos"
                  className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-blush-light text-plum-soft hover:border-magenta hover:text-magenta-dark"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px]">Add</span>
                </label>
              )}
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
          )}

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-blush-light/50 p-3 text-xs text-plum-soft">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-magenta-dark" />
            <span>
              A future version of this form will estimate the size from
              your photos — for now, set it manually below.
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="size" className="text-sm font-medium text-plum">
            Size: <span className="font-mono-data">{sizeSqFt} sq ft</span>
          </label>
          <input
            id="size"
            type="range"
            min={20}
            max={800}
            step={10}
            value={sizeSqFt}
            onChange={(e) => setSizeSqFt(Number(e.target.value))}
            className="mt-2 w-full accent-[#ff1a75]"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="text-sm font-medium text-plum">
              Price per month (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min={5}
              placeholder="e.g. 45"
              className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
            />
          </div>
          <div>
            <label htmlFor="availableFrom" className="text-sm font-medium text-plum">
              Available from
            </label>
            <input
              id="availableFrom"
              name="availableFrom"
              type="date"
              required
              className="mt-2 w-full rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-plum">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="What's the space like? Ground floor or upstairs? Easy access for drop-off?"
            className="mt-2 w-full resize-none rounded-lg border border-blush-light px-3 py-2.5 text-sm focus:border-magenta"
          />
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
              Submitting...
            </>
          ) : (
            "Submit listing"
          )}
        </Button>
      </form>
    </div>
  );
}