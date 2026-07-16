import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function consumeReferenceImageUploadLimit() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  const clientAddress =
    forwardedFor?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    "unknown-client";
  const fingerprint = createHash("sha256")
    .update(clientAddress)
    .digest("hex");

  const { data, error } = await createAdminClient().rpc(
    "consume_upload_rate_limit",
    {
      p_key: fingerprint,
      p_limit: 12,
      p_window_seconds: 60 * 60,
    },
  );

  if (error) {
    console.error("Nie udało się sprawdzić limitu uploadu:", error);
    return { allowed: false, unavailable: true };
  }

  return { allowed: data === true, unavailable: false };
}
