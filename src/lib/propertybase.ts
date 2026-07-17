/**
 * Propertybase / Web2Prospect integration spec.
 *
 * The legacy site used the custom `ffd-web2prospect` WordPress plugin to:
 *   1. PREFILL the "Find An Accommodator" form when a visitor arrived via a
 *      provided link carrying a Propertybase record id (e.g. `?id=<contactId>`).
 *      The plugin looked the record up in Propertybase and populated the fields.
 *   2. SUBMIT the completed form to Propertybase, creating a Contact +
 *      pba__Request__c record.
 *
 * This module centralizes the field model, the query-param prefill parsing, and
 * the shape of the Propertybase payload so the real integration can be wired up
 * (server-side, once the client provides API credentials) without touching UI.
 *
 * Endpoints observed in the original install (do NOT hardcode secrets — read the
 * token/base URL from environment variables in the Route Handler that calls PB):
 *   Prod:    https://<org>.my.salesforce-sites.com/services/apexrest/pba/webtoprospect/v1/
 *   Sandbox: https://<org>--dev.sandbox.my.salesforce-sites.com/services/apexrest/pba/webtoprospect/v1/
 */

/** The lead form's field model (mirrors the original Ninja Forms fields). */
export type LeadForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // -> Propertybase Contact.MobilePhone
  cellPhone: string; // -> secondary phone
  propertyAddress: string; // -> pba__Address_pb__c
  closingDate: string; // -> Estimated_Sale_Close_date__c (ISO yyyy-mm-dd)
  salePrice: string; // -> Sale_Price__c
  // Identifiers carried from the referral link (hidden). Used to link the
  // submission back to the right Propertybase records.
  propertyId: string; // the property / listing the referral is about
  customerId: string; // from ?id= (legacy hidden "Customer ID")
  contactId: string; // existing Propertybase Contact, if known
  requestId: string; // existing pba__Request__c, if known
};

export const emptyLeadForm: LeadForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cellPhone: "",
  propertyAddress: "",
  closingDate: "",
  salePrice: "",
  propertyId: "",
  customerId: "",
  contactId: "",
  requestId: "",
};

/** Constants that were fixed values on every submission. */
export const PB_LEAD_SOURCE = "Website";
export const PB_ROUTING_SOURCE = "Web Leads";

/**
 * Accepted query-string aliases for each field, so a "provided link" can prefill
 * the form directly (wireframe-friendly, no API needed), e.g.:
 *   /?firstName=Jane&lastName=Doe&email=jane@x.com&phone=4155551212&propertyId=a0Q04...
 */
const PREFILL_ALIASES: Record<keyof LeadForm, string[]> = {
  firstName: ["firstName", "first_name", "fname", "FirstName"],
  lastName: ["lastName", "last_name", "lname", "LastName"],
  email: ["email", "Email"],
  phone: ["phone", "mobile", "MobilePhone"],
  cellPhone: ["cell", "cellPhone", "cell_phone"],
  propertyAddress: ["address", "propertyAddress", "pba__Address_pb__c"],
  closingDate: ["closeDate", "closingDate", "Estimated_Sale_Close_date__c"],
  salePrice: ["salePrice", "price", "Sale_Price__c"],
  // The legacy referral link used `?id=` (stored in a hidden field mislabeled
  // "Customer ID"). Historical submissions prove that value was a Propertybase
  // *Property/Listing* record id (Salesforce keyprefix `a0E`), so `id` -> propertyId.
  propertyId: ["propertyId", "property_id", "pid", "listingId", "id"],
  customerId: ["customerId", "customer_id"],
  contactId: ["contactId", "contact_id"], // Salesforce Contact (keyprefix `003`)
  requestId: ["requestId", "request_id", "pba__Request__c"],
};

/**
 * Reads known params out of a URLSearchParams into a partial LeadForm.
 * Only returns keys that were actually present in the URL.
 */
export function parsePrefillParams(
  params: URLSearchParams
): Partial<LeadForm> {
  const out: Partial<LeadForm> = {};
  (Object.keys(PREFILL_ALIASES) as (keyof LeadForm)[]).forEach((key) => {
    for (const alias of PREFILL_ALIASES[key]) {
      const v = params.get(alias);
      if (v != null && v !== "") {
        out[key] = v;
        if (key === "propertyId" && alias === "id" && !out.customerId) {
          out.customerId = v;
        }
        break;
      }
    }
  });
  return out;
}

/**
 * Is there any identifier that would (in production) trigger a Propertybase
 * lookup to fetch the rest of the visitor's details?
 */
export function hasReferralId(f: Pick<LeadForm, "customerId" | "contactId" | "propertyId">) {
  return Boolean(f.customerId || f.contactId || f.propertyId);
}

/**
 * Builds the Propertybase Web2Prospect payload from the form. This mirrors the
 * exact JSON shape the legacy plugin POSTed. Call this from a SERVER-side Route
 * Handler (`/api/lead`) that injects the token from an env var and forwards it.
 */
export function buildProspectPayload(f: LeadForm, token: string) {
  const contact: Record<string, string> = {
    FirstName: f.firstName,
    LastName: f.lastName,
    Email: f.email,
    MobilePhone: f.phone,
    LeadSource: PB_LEAD_SOURCE,
  };
  if (f.propertyAddress) contact.pba__Address_pb__c = f.propertyAddress;
  if (f.closingDate) contact.Estimated_Sale_Close_date__c = f.closingDate;
  if (f.salePrice) contact.Sale_Price__c = f.salePrice;

  return {
    prospect: {
      contact,
      request: { Routing_Source__c: PB_ROUTING_SOURCE },
      token,
      contactFields: ["Email", "LastName", "Phone"],
    },
  };
}
