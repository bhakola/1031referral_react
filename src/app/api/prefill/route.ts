import { NextRequest, NextResponse } from "next/server";
import { lookupProspect } from "@/lib/propertybase-server";

/**
 * GET /api/prefill?id=<Property a0E...>&contactId=<003...>
 *
 * Resolves a referral link's identifier to the visitor's details for form
 * prefill. Returns a partial LeadForm ({} in dry-run mode until the Salesforce
 * lookup env vars are configured).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const propertyId = sp.get("id") ?? sp.get("propertyId") ?? "";
  const contactId = sp.get("contactId") ?? "";

  const data = await lookupProspect({ propertyId, contactId });
  return NextResponse.json(data, {
    // Short cache is safe; these lookups are keyed on an opaque id.
    headers: { "Cache-Control": "no-store" },
  });
}
