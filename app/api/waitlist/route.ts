import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend, getFromAddress, welcomeEmail } from "@/lib/resend";

// Run on the Node.js runtime (we use `node:crypto` and the Resend SDK).
export const runtime = "nodejs";

// Don't cache anything.
export const dynamic = "force-dynamic";

// --- helpers --------------------------------------------------------------

const ALLOWED_SOURCES = new Set([
  "hero",
  "footer",
  "finalcta",
  "pricing",
  "landing",
  "contribute",
]);

const EMAIL_RE =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length < 5 || trimmed.length > 254) return null;
  if (!EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

function normalizeSource(raw: unknown): string {
  if (typeof raw !== "string") return "landing";
  const v = raw.trim().toLowerCase();
  return ALLOWED_SOURCES.has(v) ? v : "landing";
}

function clientIp(req: Request): string {
  // Vercel sets x-forwarded-for; first entry is the original client.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function hashIp(ip: string): string | null {
  const secret = process.env.AXIA_WAITLIST_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

function stringifyError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
  } catch {
    return String(err);
  }
}

// --- handler --------------------------------------------------------------

export async function POST(req: Request) {
  // 1. Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { email: emailRaw, source: sourceRaw, ref: refRaw } =
    (body ?? {}) as { email?: unknown; source?: unknown; ref?: unknown };

  const email = normalizeEmail(emailRaw);
  if (!email) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const source = normalizeSource(sourceRaw);
  const ref =
    typeof refRaw === "string" && refRaw.length > 0 && refRaw.length <= 200
      ? refRaw.trim()
      : null;

  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  const ipHash = hashIp(clientIp(req));

  // 2. Insert into Supabase. Email is UNIQUE — handle that gracefully.
  let isNew = true;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("waitlist").insert({
      email,
      source,
      ref,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    if (error) {
      // 23505 = unique_violation (Postgres). Treat as "already on list" — succeed,
      // but skip the welcome email so we don't spam them again.
      if (error.code === "23505") {
        isNew = false;
      } else {
        console.error("[waitlist] supabase insert failed:", error);
        return NextResponse.json(
          { error: "Could not save. Try again." },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    console.error("[waitlist] supabase client error:", err);
    return NextResponse.json(
      { error: "Service unavailable. Try again." },
      { status: 500 },
    );
  }

  // 3. Send welcome email — only on first signup. Failures here don't block
  //    the user's success response: they're on the list either way.
  let welcomeEmailSent = false;
  let welcomeEmailError: string | null = null;

  if (isNew) {
    try {
      const resend = getResend();
      const { subject, html, text } = welcomeEmail();
      const { error: sendError } = await resend.emails.send({
        from: getFromAddress(),
        to: email,
        subject,
        html,
        text,
      });

      if (sendError) {
        welcomeEmailError = stringifyError(sendError);
        console.error("[waitlist] resend send failed:", welcomeEmailError);
      } else {
        welcomeEmailSent = true;
      }
    } catch (err) {
      welcomeEmailError = stringifyError(err);
      console.error("[waitlist] resend client error:", welcomeEmailError);
    }
  }

  return NextResponse.json({
    ok: true,
    alreadyOnList: !isNew,
    welcomeEmailSent,
    welcomeEmailError,
  });
}
