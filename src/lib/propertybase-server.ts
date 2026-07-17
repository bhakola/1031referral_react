/**
 * SERVER-ONLY Propertybase helpers. Imported only by Route Handlers under
 * src/app/api/**. Never import this from a client component — it reads secrets
 * from environment variables.
 *
 * Two operations mirror the legacy ffd-web2prospect plugin:
 *   - submitProspect(): POST a lead to the Web2Prospect endpoint (creates a
 *     Contact + pba__Request__c; Salesforce assignment rules then round-robin
 *     the Request to the next QI).
 *   - lookupProspect(): given a Property/Listing id (SF keyprefix `a0E`) or a
 *     Contact id (`003`), fetch the visitor's details to prefill the form.
 *
 * Both DEGRADE GRACEFULLY: if the relevant env vars are not set, they run in
 * "dry-run" mode so the wireframe keeps working without live credentials.
 */

import {
  type LeadForm,
  buildProspectPayload,
} from "@/lib/propertybase";

export type SubmitResult =
  | { ok: true; dryRun?: boolean; contactId?: string; requestId?: string }
  | { ok: false; error: string };

/**
 * Forwards a completed lead to the Propertybase Web2Prospect endpoint.
 * Env vars (set in Vercel / .env.local — see .env.example):
 *   PROPERTYBASE_W2P_BASE_URL  e.g. https://<org>.my.salesforce-sites.com/services/apexrest/pba/webtoprospect/v1/
 *   PROPERTYBASE_W2P_TOKEN     the Web2Prospect token (rotate the one leaked in the old DB dump)
 */
export async function submitProspect(form: LeadForm): Promise<SubmitResult> {
  const baseUrl = process.env.PROPERTYBASE_W2P_BASE_URL;
  const token = process.env.PROPERTYBASE_W2P_TOKEN;

  // Not configured yet — accept the lead locally so the flow still completes.
  if (!baseUrl || !token) {
    console.info("[propertybase] submitProspect dry-run (no credentials set)");
    return { ok: true, dryRun: true };
  }

  const payload = buildProspectPayload(form, token);

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: `Propertybase responded ${res.status}` };
    }

    // The Web2Prospect response echoes the created records; shape varies by org.
    const data = (await res.json().catch(() => null)) as
      | { result?: { contact?: { Id?: string }; request?: { Id?: string } } }
      | null;

    return {
      ok: true,
      contactId: data?.result?.contact?.Id,
      requestId: data?.result?.request?.Id,
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Looks up a visitor's details from Propertybase for form prefill.
 *
 * The legacy plugin resolved a referral link's `?id=<Property a0E...>` to the
 * associated seller Contact and prefilled the form. That read call is the one
 * piece NOT recoverable from the backup (the plugin binary wasn't included), so
 * the exact SOQL/relationship must be confirmed against the client's org.
 *
 * Env vars for the Salesforce REST lookup (separate from the W2P token):
 *   SALESFORCE_INSTANCE_URL    e.g. https://<org>.my.salesforce.com
 *   SALESFORCE_ACCESS_TOKEN    a valid OAuth access token (or wire a client-credentials flow)
 */
export async function lookupProspect(params: {
  propertyId?: string;
  contactId?: string;
}): Promise<Partial<LeadForm>> {
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;

  if (!instanceUrl || !accessToken || (!params.propertyId && !params.contactId)) {
    return {}; // dry-run: nothing to prefill beyond what the URL already carried
  }

  // TODO(propertybase-lookup): replace with the real query once the schema is
  // confirmed. Illustrative shape only:
  //
  //   const soql = params.contactId
  //     ? `SELECT FirstName, LastName, Email, MobilePhone FROM Contact WHERE Id = '${params.contactId}'`
  //     : `SELECT pba__Contact_pb__r.FirstName, pba__Contact_pb__r.LastName,
  //               pba__Contact_pb__r.Email, pba__Contact_pb__r.MobilePhone,
  //               pba__Address_pb__c
  //          FROM <PropertyObject> WHERE Id = '${params.propertyId}'`;
  //   const res = await fetch(
  //     `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`,
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   );
  //   const row = (await res.json()).records?.[0];
  //   return { firstName: row.FirstName, lastName: row.LastName, ... };

  return {};
}
