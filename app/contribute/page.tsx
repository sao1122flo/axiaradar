"use client";

import React, { useState } from "react";

export default function ContributePage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !email.includes("@") || email.length < 5) {
      setError("Please enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "contribute" }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setSubmittedMessage(
          data.alreadyOnList
            ? "You're already on the contributors list. No new email was sent."
            : "You're on the contributors list. We'll email you first.",
        );
        setEmail("");
        setTimeout(() => {
          setSubmitted(false);
          setSubmittedMessage("");
        }, 6000);
      } else if (res.status === 404) {
        setError(
          "Waitlist API not found. Make sure your local dev server is running and /api/waitlist exists.",
        );
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("Network error. Make sure the app is running and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.root}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <header style={styles.header}>
        <a href="/" style={styles.wordmark} className="axia-wordmark">
          Axia
          <span style={styles.wordmarkDot}>.</span>
        </a>
      </header>

      <main style={styles.main}>
        <section style={styles.hero} className="axia-hero">
          <div style={styles.heroContent}>
            <div style={styles.eyebrow}>CONTRIBUTORS · BETA</div>
            <h1 style={styles.h1}>
              Contribute your real rate. Get full Pro access while you contribute.
            </h1>
            <p style={styles.lead}>
              Axia's data is only as good as the rates real freelancers send us.
              The contribution tool launches with the beta — drop your email below
              and we'll invite contributors first.
            </p>

            <ul style={styles.benefitsList}>
              <li style={styles.benefitItem}>
                Full Pro access while you contribute (~10 min/quarter)
              </li>
              <li style={styles.benefitItem}>
                See your rate vs. peers in your skill + city + tier
              </li>
              <li style={styles.benefitItem}>
                Early access to the quarterly Radar
              </li>
              <li style={styles.benefitItem}>
                Help shape the categories and methodology
              </li>
            </ul>

            <div style={styles.waitlistRow} className="axia-waitlist-row">
              <div style={styles.waitlistInputWrap} className="axia-waitlist-input-wrap">
                <input
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  disabled={submitting}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
                  style={styles.waitlistInput}
                  className="axia-waitlist-input"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    ...styles.waitlistBtn,
                    opacity: submitting ? 0.6 : 1,
                    cursor: submitting ? "wait" : "pointer",
                  }}
                  className="axia-waitlist-btn"
                >
                  {submitting ? "Sending..." : "Join contributors"}
                </button>
              </div>
              <p style={styles.waitlistMeta}>
                {submitted
                  ? submittedMessage
                  : error
                  ? error
                  : "We’ll invite contributors first when the tool launches."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer} className="axia-footer">
        <div style={styles.footerInner}>
          <div style={styles.footerWordmark} className="axia-footer-wordmark">
            Axia<span style={styles.wordmarkDot}>.</span>
          </div>
          <div style={styles.footerColophon} className="axia-footer-colophon">
            Freelance rate intelligence · Issue 001 · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "var(--bone)", color: "var(--ink)" },
  header: {
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordmark: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: "var(--ink)",
    textDecoration: "none",
  },
  wordmarkDot: { color: "var(--clay)", marginLeft: 4 },
  main: { padding: "0 32px 64px" },
  hero: { maxWidth: 840, margin: "0 auto", padding: "24px 0 48px" },
  heroContent: { display: "grid", gap: 24 },
  eyebrow: {
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "var(--clay)",
  },
  h1: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 54,
    lineHeight: 1.04,
    maxWidth: 680,
    margin: 0,
  },
  lead: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 18,
    lineHeight: 1.75,
    maxWidth: 620,
    margin: 0,
    color: "var(--stone-700)",
  },
  benefitsList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 12,
  },
  benefitItem: {
    paddingLeft: 28,
    position: "relative",
    fontSize: 16,
    lineHeight: 1.7,
    color: "var(--ink)",
  },
  waitlistRow: {
    marginTop: 28,
    display: "grid",
    gap: 14,
  },
  waitlistInputWrap: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    alignItems: "center",
  },
  waitlistInput: {
    minWidth: 0,
    padding: "16px 18px",
    borderRadius: 8,
    border: "1px solid rgba(26,22,20,0.15)",
    background: "white",
    color: "var(--ink)",
    fontSize: 16,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    outline: "none",
  },
  waitlistBtn: {
    padding: "16px 20px",
    borderRadius: 8,
    border: "none",
    background: "var(--clay)",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    minWidth: 170,
  },
  waitlistMeta: {
    margin: 0,
    color: "var(--stone-700)",
    fontSize: 15,
    lineHeight: 1.6,
  },
  footer: {
    borderTop: "1px solid rgba(26,22,20,0.08)",
    padding: "28px 32px",
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  footerWordmark: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: "var(--ink)",
  },
  footerColophon: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    color: "var(--stone-700)",
  },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink: #1A1614;
    --bone: #F7F2EA;
    --stone-700: #4A4339;
    --clay: #D88A6E;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bone);
    color: var(--ink);
    font-family: 'Fraunces', Georgia, serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  button { font-family: inherit; cursor: pointer; }
  input, select { font-family: inherit; }

  .axia-nav-link:hover { color: var(--ink) !important; }
  .axia-waitlist-btn:hover { background: rgb(184, 81, 58) !important; }
`;
