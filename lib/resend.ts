import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  cached = new Resend(key);
  return cached;
}

export function getFromAddress(): string {
  const raw = (process.env.RESEND_FROM_EMAIL ?? "Ratebench <hello@ratebench.app>").trim();
  const sanitized = raw.replace(/^['"]|['"]$/g, "").trim();

  const displayMatch = sanitized.match(/^(.+?)\s*<([^>]+)>$/);
  if (displayMatch) {
    return `${displayMatch[1].trim()} <${displayMatch[2].trim()}>`;
  }

  if (sanitized.includes("@")) {
    return sanitized;
  }

  return "Ratebench <hello@ratebench.app>";
}

/**
 * Welcome email template for new waitlist signups.
 * Plain HTML, inline styles only — most email clients strip <style> blocks.
 */
export function welcomeEmail(): { subject: string; html: string; text: string } {
  const subject = "You're on the Ratebench waitlist";

  const text = [
    "Welcome to Ratebench.",
    "",
    "You're on the list for the real market rate for independent designers,",
    "developers, photographers, and writers — by city, by skill, by experience level.",
    "",
    "We'll email you when the first quarterly Bench issue is ready, and again",
    "when you're invited to the beta.",
    "",
    "— Ratebench",
    "https://ratebench.app",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f2ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1a16;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f2ea;">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e8e0d3;border-radius:4px;">
            <tr>
              <td style="padding:40px 40px 24px 40px;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:-0.01em;color:#1f1a16;">
                  Ratebench<span style="color:#c26a47;">.</span>
                </div>
                <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#c26a47;margin-top:6px;">
                  Freelance rate intelligence
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 16px 40px;">
                <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.25;font-weight:600;color:#1f1a16;">
                  You're on the list.
                </h1>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#3a322b;">
                  Thanks for joining the Ratebench waitlist. Ratebench is freelance rate intelligence — the real market rate for
                  independent designers, developers, photographers, and writers, by
                  city, by skill, by experience level. Not a calculator. Not an
                  average. Real percentile data so you stop guessing and stop leaving
                  money behind.
                </p>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#3a322b;">
                  Two things will happen from here:
                </p>
                <ul style="margin:0 0 16px 20px;padding:0;font-size:15px;line-height:1.6;color:#3a322b;">
                  <li style="margin-bottom:8px;">You'll get the first quarterly <strong>Bench</strong> issue when it ships.</li>
                  <li>You'll get an invite when the beta opens, in roughly the order you signed up.</li>
                </ul>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#3a322b;">
                  No other emails. No spam. We hate it too.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 32px 40px;border-top:1px solid #e8e0d3;">
                <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.06em;color:#8a7f72;">
                  — The Ratebench team &middot; <a href="https://ratebench.app" style="color:#c26a47;text-decoration:none;">ratebench.app</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  return { subject, html, text };
}
