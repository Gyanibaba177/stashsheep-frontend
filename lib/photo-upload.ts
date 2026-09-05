/**
 * Uploads listing photos directly from the browser to Supabase Storage,
 * and returns their public URLs to save on the listing.
 *
 * Needs two env vars (safe to expose to the browser — the anon key is
 * designed for this, security comes from the storage bucket's policies,
 * not from hiding this key):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Uses the Supabase Storage REST API directly (no extra SDK dependency).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "listing-photos";

export function isPhotoUploadConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function uploadListingPhotos(files: File[]): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Photo upload isn't configured yet (missing Supabase Storage env vars)."
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      }
    );

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Photo upload failed for "${file.name}": ${err || res.status}`);
    }

    urls.push(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`);
  }

  return urls;
}