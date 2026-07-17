"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { site } from "@/content/site";
import {
  type LeadForm,
  emptyLeadForm,
  parsePrefillParams,
} from "@/lib/propertybase";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[\d\s()+.-]{7,}$/;

const inputBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20";

export default function FindAccommodator() {
  const { findAccommodator: fa } = site;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPrefill = useMemo(() => parsePrefillParams(searchParams), [searchParams]);

  const [values, setValues] = useState<LeadForm>(() => ({ ...emptyLeadForm, ...queryPrefill }));
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prefilled = Object.keys(queryPrefill).length > 0;
  const needsLookup =
    prefilled &&
    !queryPrefill.firstName &&
    !queryPrefill.email &&
    (queryPrefill.propertyId || queryPrefill.contactId);

  // Prefill from the referral link's query string on load.
  useEffect(() => {
    if (!needsLookup) return;

    // If the link carries an id but not the visitor's details, ask the server
    // to resolve them from Propertybase. No-ops (returns {}) in dry-run mode.
    const qs = new URLSearchParams();
    if (queryPrefill.propertyId) qs.set("id", queryPrefill.propertyId);
    if (queryPrefill.contactId) qs.set("contactId", queryPrefill.contactId);
    fetch(`/api/prefill?${qs.toString()}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d: Partial<LeadForm>) => {
        if (d && Object.keys(d).length > 0) {
          setValues((prev) => ({ ...prev, ...d }));
        }
      })
      .catch(() => {});
  }, [
    needsLookup,
    queryPrefill.propertyId,
    queryPrefill.contactId,
  ]);

  function validate(v: LeadForm) {
    const e: Partial<Record<keyof LeadForm, string>> = {};
    if (!v.firstName.trim()) e.firstName = "First name is required.";
    if (!v.lastName.trim()) e.lastName = "Last name is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!emailRe.test(v.email)) e.email = "Enter a valid email address.";
    if (v.phone.trim() && !phoneRe.test(v.phone)) e.phone = "Enter a valid phone number.";
    if (!v.cellPhone.trim()) e.cellPhone = "Cell phone is required.";
    else if (!phoneRe.test(v.cellPhone)) e.cellPhone = "Enter a valid cell phone number.";
    if (!v.propertyAddress.trim()) e.propertyAddress = "Sale property address is required.";
    return e;
  }

  function update(key: keyof LeadForm, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate(values);
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    // Submit to the Node route handler, which forwards to Propertybase
    // (dry-run until PROPERTYBASE_W2P_* env vars are configured).
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setSubmitError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/thank-you");
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section id={fa.id} className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-gold">
            {fa.eyebrow}
          </p>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">{fa.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{fa.body}</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-10 rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-black/5 sm:p-8"
        >
          {prefilled && (
            <div className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
              We&rsquo;ve pre-filled your details from your referral link. Please review
              and update anything as needed.
            </div>
          )}

          <input type="hidden" name="customerId" value={values.customerId || values.propertyId} />
          <input type="hidden" name="propertyId" value={values.propertyId} />
          <input type="hidden" name="contactId" value={values.contactId} />
          <input type="hidden" name="requestId" value={values.requestId} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-ink">
                First Name<span className="ml-0.5 text-gold">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
                className={`${inputBase} ${errors.firstName ? "border-red-400" : "border-black/15"}`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-ink">
                Last Name<span className="ml-0.5 text-gold">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
                className={`${inputBase} ${errors.lastName ? "border-red-400" : "border-black/15"}`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                className={`${inputBase} ${errors.phone ? "border-red-400" : "border-black/15"}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="cellPhone" className="mb-1.5 block text-sm font-semibold text-ink">
                Cell Phone<span className="ml-0.5 text-gold">*</span>
              </label>
              <input
                id="cellPhone"
                type="tel"
                autoComplete="tel"
                value={values.cellPhone}
                onChange={(e) => update("cellPhone", e.target.value)}
                aria-invalid={!!errors.cellPhone}
                className={`${inputBase} ${errors.cellPhone ? "border-red-400" : "border-black/15"}`}
              />
              {errors.cellPhone && <p className="mt-1 text-sm text-red-600">{errors.cellPhone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email<span className="ml-0.5 text-gold">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={`${inputBase} ${errors.email ? "border-red-400" : "border-black/15"}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="propertyAddress" className="mb-1.5 block text-sm font-semibold text-ink">
                Sale Property Address<span className="ml-0.5 text-gold">*</span>
              </label>
              <input
                id="propertyAddress"
                type="text"
                autoComplete="street-address"
                value={values.propertyAddress}
                onChange={(e) => update("propertyAddress", e.target.value)}
                aria-invalid={!!errors.propertyAddress}
                className={`${inputBase} ${errors.propertyAddress ? "border-red-400" : "border-black/15"}`}
              />
              {errors.propertyAddress && <p className="mt-1 text-sm text-red-600">{errors.propertyAddress}</p>}
            </div>

            <div>
              <label htmlFor="closingDate" className="mb-1.5 block text-sm font-semibold text-ink">
                Anticipated Closing Date
              </label>
              <input
                id="closingDate"
                type="date"
                value={values.closingDate}
                onChange={(e) => update("closingDate", e.target.value)}
                className={`${inputBase} border-black/15`}
              />
            </div>

            <div>
              <label htmlFor="salePrice" className="mb-1.5 block text-sm font-semibold text-ink">
                Anticipated Sales Price
              </label>
              <input
                id="salePrice"
                type="text"
                inputMode="numeric"
                value={values.salePrice}
                onChange={(e) => update("salePrice", e.target.value)}
                placeholder="$"
                className={`${inputBase} border-black/15`}
              />
            </div>
          </div>

          {submitError && (
            <p className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-gold px-8 py-4 text-base font-bold tracking-wide text-ink shadow-md transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting…" : "Submit & Get Matched"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            By submitting, an accommodator (QI) will be assigned to you. We never charge a
            fee or share your information for compensation.
          </p>
        </form>
      </div>
    </section>
  );
}
