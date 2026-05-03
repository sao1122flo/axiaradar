import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend, getFromAddress, contributorWelcomeEmail, contributorWelcomeEmailNoBenchmark } from "@/lib/resend";
import { ALL_SKILL_LABELS, hasBenchmark, socCodeForSkill, getBenchmark, computePercentile, normalizeRateToHourly } from "@/lib/benchmarks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const ALLOWED_TIERS = new Set(["Junior", "Mid", "Senior"]);
const ALLOWED_UNITS = new Set(["hourly", "daily", "project", "retainer"]);
const ALLOWED_TYPES = new Set(["current", "last_engagement", "aspirational"]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Validate required fields
  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!emailRaw || emailRaw.length < 5 || emailRaw.length > 254 || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const skill = typeof body.skill === "string" ? body.skill.trim() : "";
  const isKnownSkill = ALL_SKILL_LABELS.includes(skill);
  const isValidCustomSkill = !isKnownSkill && skill.length >= 3 && skill.length <= 80 && /^[A-Za-z0-9 \-/&.,()]+$/.test(skill);
  if (!isKnownSkill && !isValidCustomSkill) {
    return NextResponse.json({ error: "Skill must be from the list or a valid free-text specialty (3-80 chars)." }, { status: 400 });
  }

  const tier = typeof body.experience_tier === "string" ? body.experience_tier : "";
  if (!ALLOWED_TIERS.has(tier)) {
    return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
  }

  const city = typeof body.city === "string" ? body.city.slice(0, 100) : "National";

  const rateAmount = Number(body.rate_amount);
  if (!Number.isFinite(rateAmount) || rateAmount <= 0 || rateAmount >= 10000) {
    return NextResponse.json({ error: "Rate must be between 0 and 10,000." }, { status: 400 });
  }

  const rateUnit = typeof body.rate_unit === "string" ? body.rate_unit : "";
  if (!ALLOWED_UNITS.has(rateUnit)) {
    return NextResponse.json({ error: "Invalid rate unit." }, { status: 400 });
  }

  const rateType = typeof body.rate_type === "string" ? body.rate_type : "";
  if (!ALLOWED_TYPES.has(rateType)) {
    return NextResponse.json({ error: "Invalid rate type." }, { status: 400 });
  }

  // Optional fields
  const yearsFreelanceRaw = body.years_freelance != null ? Number(body.years_freelance) : null;
  const yearsFreelance = yearsFreelanceRaw != null && Number.isFinite(yearsFreelanceRaw) ? yearsFreelanceRaw : null;
  const clientType = typeof body.client_type === "string" ? body.client_type.slice(0, 50) : null;
  const linkedinUrl = typeof body.linkedin_url === "string" ? body.linkedin_url.slice(0, 500) : null;
  const notes = typeof body.notes === "string" ? body.notes.slice(0, 1000) : null;

  // Compute percentile — only for skills with a BLS-anchored benchmark
  let percentile: number | null = null;
  let cell = null;
  if (hasBenchmark(skill)) {
    cell = getBenchmark(skill, tier);
    if (cell) {
      const hourlyEquivalent = normalizeRateToHourly(rateAmount, rateUnit);
      percentile = computePercentile(hourlyEquivalent, cell);
    }
  }

  // Persist to Supabase
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("rate_submissions").insert({
      contributor_email: emailRaw,
      skill,
      bls_soc_code: socCodeForSkill(skill),
      city,
      experience_tier: tier,
      rate_amount: rateAmount,
      rate_unit: rateUnit,
      rate_currency: "USD",
      rate_type: rateType,
      computed_percentile: percentile,
      years_freelance: yearsFreelance,
      client_type: clientType || null,
      linkedin_url: linkedinUrl || null,
      notes: notes || null,
    });
    if (error) {
      console.error("[contribute/submit] insert failed:", error);
      return NextResponse.json({ error: "Could not save. Try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("[contribute/submit] supabase error:", err);
    return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  }

  // Send insight email (non-blocking — don't fail the response on email errors)
  try {
    const resend = getResend();
    if (cell && percentile != null) {
      const hourlyEquivalent = normalizeRateToHourly(rateAmount, rateUnit);
      const { subject, html, text } = contributorWelcomeEmail({
        skill,
        tier,
        city,
        rate: rateAmount,
        rateUnit,
        hourlyEquivalent,
        percentile,
        cell,
      });
      await resend.emails.send({ from: getFromAddress(), to: emailRaw, subject, html, text });
    } else {
      const { subject, html, text } = contributorWelcomeEmailNoBenchmark({
        skill,
        tier,
        rate: rateAmount,
        rateUnit,
      });
      await resend.emails.send({ from: getFromAddress(), to: emailRaw, subject, html, text });
    }
  } catch (err) {
    console.error("[contribute/submit] email failed:", err);
  }

  return NextResponse.json({ ok: true, percentile, cell, hasBenchmark: percentile != null });
}
