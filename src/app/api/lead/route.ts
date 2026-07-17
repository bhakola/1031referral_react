import { NextRequest, NextResponse } from "next/server";
import { emptyLeadForm } from "@/lib/propertybase";
import { submitProspect } from "@/lib/propertybase-server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/lead — receives the completed "Find An Accommodator" form and
 * forwards it to Propertybase (creating a Contact + pba__Request__c). Runs in
 * dry-run mode until PROPERTYBASE_W2P_* env vars are configured.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const form = { ...emptyLeadForm, ...body };

  // Server-side validation (mirrors the client so the API can't be bypassed).
  if (!form.firstName?.trim() || !form.lastName?.trim() || !form.phone?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }
  if (!emailRe.test(form.email ?? "")) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }

  const result = await submitProspect(form);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
