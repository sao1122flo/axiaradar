"use client";

import React, { useState } from "react";
import type { BenchmarkCell } from "@/lib/benchmarks";
import { SKILL_GROUPS } from "@/lib/benchmarks";

const TIERS = ["Junior", "Mid", "Senior"] as const;

type Step = "email" | "rate" | "done";
type Tier = "Junior" | "Mid" | "Senior";
type RateUnit = "hourly" | "daily" | "project" | "retainer";
type RateType = "current" | "last_engagement" | "aspirational";

function percentileInterpretation(p: number): string {
  if (p < 25) return "Below the entry-tier band. You may be undercharging significantly.";
  if (p < 50) return "Below the median. There's likely room to negotiate up.";
  if (p < 75) return "Mid-distribution. You're roughly where most experienced freelancers in your tier sit.";
  if (p < 90) return "Strong position. You have real pricing leverage.";
  return "Top decile. Specialist or scarcity-priced territory.";
}

export default function ContributePage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 2 fields
  const [skill, setSkill] = useState<string>("");
  const [skillCustom, setSkillCustom] = useState("");
  const [city, setCity] = useState("National");
  const [customCity, setCustomCity] = useState("");
  const [tier, setTier] = useState<Tier>("Mid");
  const [rateAmount, setRateAmount] = useState("");
  const [rateUnit, setRateUnit] = useState<RateUnit>("hourly");
  const [rateType, setRateType] = useState<RateType>("current");
  const [showMore, setShowMore] = useState(false);
  const [yearsFreelance, setYearsFreelance] = useState("");
  const [clientType, setClientType] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [notes, setNotes] = useState("");

  // Step 3 result
  const [percentile, setPercentile] = useState<number | null>(null);
  const [resultCell, setResultCell] = useState<BenchmarkCell | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setStep("rate");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRateSubmit = async () => {
    setError("");
    const skillToSend = skill === "__other__" ? skillCustom.trim() : skill;
    if (!skillToSend || skillToSend.length < 1) {
      setError("Please select or specify your skill.");
      return;
    }
    const rate = parseFloat(rateAmount);
    if (!rateAmount || isNaN(rate) || rate <= 0) {
      setError("Please enter a valid rate.");
      return;
    }
    if (rate >= 10000) {
      setError("Rate must be less than 10,000.");
      return;
    }
    setSubmitting(true);
    const resolvedCity = city === "Other" ? (customCity.trim() || "Other") : city;
    const payload = {
      email,
      skill: skillToSend,
      city: resolvedCity,
      experience_tier: tier,
      rate_amount: rate,
      rate_unit: rateUnit,
      rate_type: rateType,
      ...(yearsFreelance ? { years_freelance: parseInt(yearsFreelance, 10) } : {}),
      ...(clientType ? { client_type: clientType } : {}),
      ...(linkedin ? { linkedin_url: linkedin } : {}),
      ...(notes ? { notes } : {}),
    };
    try {
      const res = await fetch("/api/contribute/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json() as { ok: boolean; percentile: number | null; cell: BenchmarkCell | null };
        setPercentile(data.percentile);
        setResultCell(data.cell);
        setStep("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.root}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />

      <header style={styles.header}>
        <a href="/" style={styles.wordmark} className="axia-wordmark">
          Ratebench<span style={styles.wordmarkDot}>.</span>
        </a>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>

          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <div>
              <div style={styles.eyebrow}>CONTRIBUTORS · BETA</div>
              <h1 style={styles.h1}>
                Contribute your real rate.
                <br />
                Get full Pro access while you contribute.
              </h1>
              <p style={styles.lead}>
                Ratebench&apos;s data is only as good as the rates real freelancers send us.
                Drop your email — we&apos;ll show you exactly where your rate sits.
              </p>

              <ul style={styles.benefitsList}>
                {[
                  "Full Pro access while you contribute (~10 min/quarter)",
                  "See your rate vs. peers in your skill + tier",
                  "Instant insight: your percentile, emailed immediately",
                  "Help shape the categories and methodology",
                ].map((b) => (
                  <li key={b} style={styles.benefitItem}>
                    <span style={styles.benefitBullet}>—</span> {b}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleEmailSubmit} style={styles.form}>
                <div style={styles.inputRow} className="axia-waitlist-input-wrap">
                  <input
                    type="email"
                    placeholder="you@studio.com"
                    value={email}
                    disabled={submitting}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    className="axia-waitlist-input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ ...styles.btn, opacity: submitting ? 0.6 : 1 }}
                    className="axia-waitlist-btn"
                  >
                    {submitting ? "Sending…" : "Continue →"}
                  </button>
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <p style={styles.meta}>We&apos;ll invite contributors first when the full tool launches.</p>
              </form>
            </div>
          )}

          {/* ── Step 2: Rate form ── */}
          {step === "rate" && (
            <div>
              <div style={styles.eyebrow}>STEP 2 OF 2</div>
              <h1 style={styles.h1}>Drop your real rate.</h1>
              <p style={styles.lead}>
                We&apos;ll show you where it sits in the BLS-anchored distribution — instantly,
                in your inbox.
              </p>

              <div style={styles.fieldGroup}>
                <div style={styles.fieldRow}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Skill</label>
                    <select
                      value={skill}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSkill(v);
                        if (v !== "__other__") setSkillCustom("");
                      }}
                      required
                      style={styles.select}
                      className="axia-demo-select"
                    >
                      <option value="" disabled>What do you freelance as?</option>
                      {Object.entries(SKILL_GROUPS).map(([groupName, options]) => (
                        <optgroup key={groupName} label={groupName}>
                          {options.map(opt => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                          ))}
                        </optgroup>
                      ))}
                      <optgroup label="—">
                        <option value="__other__">Other (specify)</option>
                      </optgroup>
                    </select>
                    {skill === "__other__" && (
                      <input
                        type="text"
                        value={skillCustom}
                        onChange={(e) => setSkillCustom(e.target.value)}
                        placeholder="What's your freelance specialty?"
                        maxLength={80}
                        required
                        style={{ ...styles.input, marginTop: 8 }}
                        className="axia-waitlist-input"
                      />
                    )}
                  </div>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Experience tier</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as Tier)}
                      style={styles.select}
                      className="axia-demo-select"
                    >
                      {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div style={styles.fieldRow}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Market</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={styles.select}
                      className="axia-demo-select"
                    >
                      <option value="National">National (US)</option>
                      <option value="Other">Other (specify)</option>
                    </select>
                  </div>
                  {city === "Other" && (
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>City / region</label>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="e.g. Austin, TX"
                        style={styles.input}
                        className="axia-waitlist-input"
                      />
                    </div>
                  )}
                </div>

                <div style={styles.rateRow}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Rate amount</label>
                    <input
                      type="number"
                      value={rateAmount}
                      onChange={(e) => setRateAmount(e.target.value)}
                      placeholder="e.g. 120"
                      min="1"
                      step="0.01"
                      style={styles.input}
                      className="axia-waitlist-input"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Unit</label>
                    <select
                      value={rateUnit}
                      onChange={(e) => setRateUnit(e.target.value as RateUnit)}
                      style={styles.select}
                      className="axia-demo-select"
                    >
                      <option value="hourly">per hour</option>
                      <option value="daily">per day</option>
                      <option value="project">per project (~1 week)</option>
                      <option value="retainer">per month (retainer)</option>
                    </select>
                  </div>
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>This rate is…</label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    style={styles.select}
                    className="axia-demo-select"
                  >
                    <option value="current">What I&apos;m currently charging</option>
                    <option value="last_engagement">What my last engagement actually paid</option>
                    <option value="aspirational">What I&apos;d like to charge</option>
                  </select>
                </div>
              </div>

              {/* Optional fields */}
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                style={styles.toggleOptional}
                className="axia-nav-link"
              >
                {showMore ? "Hide" : "+"} optional context
              </button>

              {showMore && (
                <div style={{ ...styles.fieldGroup, marginTop: 12 }}>
                  <div style={styles.fieldRow}>
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Years freelancing</label>
                      <input
                        type="number"
                        value={yearsFreelance}
                        onChange={(e) => setYearsFreelance(e.target.value)}
                        placeholder="e.g. 5"
                        min="0"
                        style={styles.input}
                        className="axia-waitlist-input"
                      />
                    </div>
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>Client type</label>
                      <select
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        style={styles.select}
                        className="axia-demo-select"
                      >
                        <option value="">— optional —</option>
                        <option value="startup">Startup</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="agency">Agency (middleman)</option>
                        <option value="direct">Direct / SMB</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>LinkedIn URL (optional, helps verify)</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      style={styles.input}
                      className="axia-waitlist-input"
                    />
                  </div>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}>Anything else? (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Client sector, niche, context..."
                      rows={3}
                      style={{ ...styles.input, resize: "vertical", height: "auto" }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 28 }}>
                <button
                  onClick={handleRateSubmit}
                  disabled={submitting}
                  style={{ ...styles.btn, opacity: submitting ? 0.6 : 1 }}
                  className="axia-waitlist-btn"
                >
                  {submitting ? "Submitting…" : "Submit rate →"}
                </button>
                {error && <p style={styles.errorText}>{error}</p>}
              </div>

              <p style={styles.meta}>
                Your rate is stored anonymously. Only aggregate percentiles are ever published.
              </p>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === "done" && (
            <div>
              <div style={styles.eyebrow}>SUBMITTED</div>

              {percentile != null ? (
                <>
                  <div style={styles.percentileHero}>
                    <div style={styles.percentileLabel}>YOUR PERCENTILE</div>
                    <div style={styles.percentileNumber}>P{percentile}</div>
                    <div style={styles.percentileContext}>
                      for {tier} {skill}
                    </div>
                    <div style={styles.percentileInterpretation}>
                      {percentileInterpretation(percentile)}
                    </div>
                  </div>

                  {resultCell && (
                    <div style={styles.distributionBox}>
                      <div style={styles.distributionLabel}>
                        Reference distribution (BLS-anchored)
                      </div>
                      <div style={styles.distributionGrid}>
                        {([
                          ["P25", resultCell.p25, "Bottom quartile"],
                          ["P50", resultCell.p50, "Median"],
                          ["P75", resultCell.p75, "Top quartile"],
                          ["P90", resultCell.p90, "Top 10%"],
                        ] as [string, number, string][]).map(([p, val, desc]) => (
                          <div key={p} style={styles.distributionCell}>
                            <div style={styles.distP}>{p}</div>
                            <div style={styles.distVal}>${val}/hr</div>
                            <div style={styles.distDesc}>{desc}</div>
                          </div>
                        ))}
                      </div>
                      <div style={styles.distributionSource}>
                        SOURCE: BLS OEWS {resultCell.meta.soc} · {resultCell.meta.vintage} ·{" "}
                        <a href="/methodology" style={{ color: "#C26A47", textDecoration: "underline" }}>
                          methodology
                        </a>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.earlyHero}>
                  <div style={styles.percentileLabel}>EARLY CONTRIBUTOR</div>
                  <h1 style={{ ...styles.h1, color: "#F7F2EA", margin: "0 0 12px 0" }}>
                    You&apos;re early in {skill === "__other__" ? skillCustom : skill}.
                  </h1>
                  <p style={{ ...styles.lead, color: "rgba(247,242,234,0.75)", margin: 0 }}>
                    No benchmark for your category yet — once we have ≥5 submissions in your skill + tier,
                    we&apos;ll email you the distribution and your position in it.
                  </p>
                </div>
              )}

              <div style={styles.proBox}>
                <div style={styles.proTitle}>Pro access unlocked.</div>
                <p style={styles.proText}>
                  While you contribute (one update per quarter), full Pro access is yours.
                  We&apos;ll email you next quarter to update your rate.
                </p>
              </div>

              <div style={{ marginTop: 32 }}>
                <a href="/" style={styles.backLink}>← Back to ratebench.app</a>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer style={styles.footer} className="axia-footer">
        <div style={styles.footerInner}>
          <div style={styles.footerWordmark} className="axia-footer-wordmark">
            Ratebench<span style={styles.wordmarkDot}>.</span>
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
  root: { minHeight: "100vh", background: "#F7F2EA", color: "#1F1A16" },
  header: {
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(31, 26, 22, 0.08)",
  },
  wordmark: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: "#1F1A16",
    textDecoration: "none",
  },
  wordmarkDot: { color: "#C26A47", marginLeft: 2 },
  main: { padding: "48px 24px 80px", display: "flex", justifyContent: "center" },
  card: {
    width: "100%",
    maxWidth: 620,
  },
  eyebrow: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#C26A47",
    marginBottom: 16,
  },
  h1: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: "-0.025em",
    margin: "0 0 16px 0",
    color: "#1F1A16",
  },
  lead: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 16,
    lineHeight: 1.7,
    color: "#4A4339",
    margin: "0 0 24px 0",
  },
  benefitsList: {
    margin: "0 0 28px 0",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 10,
  },
  benefitItem: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#1F1A16",
    display: "flex",
    gap: 8,
  },
  benefitBullet: { color: "#C26A47", flexShrink: 0 },
  form: { display: "grid", gap: 12 },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 8,
    border: "1px solid rgba(31, 26, 22, 0.2)",
    background: "#fff",
    color: "#1F1A16",
    fontSize: 15,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    padding: "13px 20px",
    borderRadius: 8,
    border: "none",
    background: "#C26A47",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  errorText: {
    margin: "4px 0 0 0",
    fontSize: 13,
    color: "#B8513A",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  meta: {
    margin: 0,
    fontSize: 13,
    color: "#8C8473",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    lineHeight: 1.5,
  },
  fieldGroup: {
    display: "grid",
    gap: 16,
    marginBottom: 16,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  fieldWrap: {
    display: "grid",
    gap: 6,
  },
  label: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8C8473",
  },
  select: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 8,
    border: "1px solid rgba(31, 26, 22, 0.2)",
    background: "#fff",
    color: "#1F1A16",
    fontSize: 15,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    outline: "none",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238C8473' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  rateRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    alignItems: "end",
  },
  toggleOptional: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8C8473",
    padding: 0,
  },
  percentileHero: {
    background: "#1F1A16",
    color: "#F7F2EA",
    borderRadius: 12,
    padding: "32px 28px",
    marginBottom: 16,
  },
  earlyHero: {
    background: "#1F1A16",
    color: "#F7F2EA",
    borderRadius: 12,
    padding: "32px 28px",
    marginBottom: 16,
  },
  percentileLabel: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#C26A47",
    marginBottom: 8,
  },
  percentileNumber: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 72,
    fontWeight: 700,
    lineHeight: 1,
    color: "#F7F2EA",
    marginBottom: 8,
  },
  percentileContext: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 15,
    color: "rgba(247, 242, 234, 0.7)",
    marginBottom: 16,
  },
  percentileInterpretation: {
    fontFamily: "Fraunces, Georgia, serif",
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 1.5,
    color: "rgba(247, 242, 234, 0.85)",
  },
  distributionBox: {
    border: "1px solid rgba(31, 26, 22, 0.12)",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 20,
  },
  distributionLabel: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8C8473",
    marginBottom: 16,
  },
  distributionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginBottom: 14,
  },
  distributionCell: {
    background: "#F7F2EA",
    borderRadius: 6,
    padding: "10px 12px",
  },
  distP: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.06em",
    color: "#8C8473",
    marginBottom: 4,
  },
  distVal: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#1F1A16",
    marginBottom: 2,
  },
  distDesc: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 11,
    color: "#8C8473",
  },
  distributionSource: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 10,
    letterSpacing: "0.05em",
    color: "rgba(31, 26, 22, 0.4)",
  },
  proBox: {
    background: "rgba(194, 106, 71, 0.08)",
    border: "1px solid rgba(194, 106, 71, 0.2)",
    borderRadius: 10,
    padding: "20px 24px",
  },
  proTitle: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#C26A47",
    marginBottom: 8,
  },
  proText: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    lineHeight: 1.65,
    color: "#4A4339",
    margin: 0,
  },
  backLink: {
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#8C8473",
    textDecoration: "none",
  },
  footer: {
    borderTop: "1px solid rgba(31, 26, 22, 0.08)",
    padding: "24px 32px",
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  footerWordmark: {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#1F1A16",
  },
  footerColophon: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 13,
    color: "#8C8473",
  },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: #F7F2EA;
    color: #1F1A16;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  button { cursor: pointer; }
  input, select, textarea { font-family: inherit; }

  .axia-waitlist-btn:hover { background: #B8513A !important; }
  .axia-demo-select:hover, .axia-demo-select:focus { border-color: #C26A47 !important; outline: none; }
  .axia-nav-link:hover { color: #1F1A16 !important; }

  @media (max-width: 600px) {
    .axia-waitlist-input-wrap { grid-template-columns: 1fr !important; }
  }
`;
