import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Methodology — How Ratebench Benchmarks Are Built | Ratebench",
  description:
    "Every number on Ratebench is derived from public BLS OEWS data through a documented freelance markup ladder. Full methodology, tier mapping, worked examples, and roadmap.",
};

export default function MethodologyPage() {
  return (
    <>
      <div style={styles.root}>
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <a href="/" style={styles.wordmark}>
              Ratebench<span style={styles.wordmarkDot}>.</span>
            </a>
            <a href="/" style={styles.backLink}>
              ← Back to index
            </a>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.inner}>
            <div style={styles.eyebrow}>
              <span style={styles.eyebrowLine} />
              METHODOLOGY
            </div>

            <h1 style={styles.h1}>Data Methodology</h1>

            <p style={styles.intro}>
              This document is the source-of-truth for how every number on
              ratebench.app is computed. None of the v1 numbers are from real
              freelancer submissions yet — that&apos;s what the contributor
              flywheel is being built to fill in. Every claim on this site
              should be reproducible from a public source via the formula
              documented below.
            </p>

            <div style={styles.divider} />

            {/* ── 1. Sources ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>1. Sources</h2>

              <h3 style={styles.h3}>1.1 BLS OEWS (Occupational Employment and Wage Statistics)</h3>
              <p style={styles.p}>
                The base layer is the U.S. Bureau of Labor Statistics OEWS
                program,{" "}
                <strong>May 2024 reference period</strong>. BLS publishes P10,
                P25, P50, P75, and P90 percentile wages for hundreds of
                occupations across 600+ metropolitan areas.
              </p>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>SOC code</th>
                      <th style={styles.th}>BLS occupation</th>
                      <th style={styles.th}>Ratebench label</th>
                      <th style={styles.th}>National P50 (hourly)</th>
                      <th style={styles.th}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["15-1252", "Software Developers", "React Developer", "$63.98", "https://www.bls.gov/oes/current/oes151252.htm"],
                      ["15-1255", "Web and Digital Interface Designers", "UX Designer", "$47.16", "https://www.bls.gov/oes/current/oes151255.htm"],
                      ["27-1024", "Graphic Designers", "Brand Designer", "$29.47", "https://www.bls.gov/oes/current/oes271024.htm"],
                      ["27-3043", "Writers and Authors", "Copywriter", "$34.74", "https://www.bls.gov/oes/current/oes273043.htm"],
                      ["27-4021", "Photographers", "Photographer", "$20.44", "https://www.bls.gov/oes/current/oes274021.htm"],
                    ].map(([soc, bls, rb, p50, url]) => (
                      <tr key={soc} style={styles.tr}>
                        <td style={styles.td}><code style={styles.code}>{soc}</code></td>
                        <td style={styles.td}>{bls}</td>
                        <td style={styles.td}>{rb}</td>
                        <td style={styles.td}>{p50}</td>
                        <td style={styles.td}>
                          <a href={url as string} style={styles.link} target="_blank" rel="noopener noreferrer">
                            bls.gov ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.callout}>
                <strong>BLS limitation (called out explicitly):</strong> BLS OEWS
                surveys employed wage and salary workers only. It explicitly
                excludes self-employed workers and most independent contractors.
                This is exactly the gap Ratebench&apos;s contributor data is
                being built to fill.
              </div>

              <h3 style={styles.h3}>1.2 What&apos;s NOT in v1</h3>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  <strong>MSA × occupation data.</strong> BLS publishes city-level
                  breakouts, but v1 uses national figures only. City-level
                  adjustment is on the roadmap.
                </li>
                <li style={styles.li}>
                  <strong>Real freelance submissions.</strong> Contributor count
                  is N=0 at launch. This will populate as freelancers submit
                  real rates via{" "}
                  <a href="/contribute" style={styles.link}>/contribute</a>.
                </li>
                <li style={styles.li}>
                  <strong>Vertical-specific data</strong> (e.g., "UX in fintech
                  vs. UX in e-commerce"). Coming with N&gt;500 contributors.
                </li>
              </ul>
            </section>

            {/* ── 2. Markup ladder ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>2. Freelance markup ladder</h2>
              <p style={styles.p}>
                BLS gives W-2 employee hourly wages. Freelancers must charge
                more to cover benefits, employer contributions, business
                overhead, profit, and risk premium. The{" "}
                <strong>Ratebench markup ladder</strong> translates BLS
                percentiles to estimated freelance rates:
              </p>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Percentile</th>
                      <th style={styles.th}>Multiplier over BLS</th>
                      <th style={styles.th}>Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["P25 (entry / discount work)", "× 1.4", "Entry-level freelance, low leverage, often agency-mediated"],
                      ["P50 (median freelance)", "× 1.7", "Standard markup: ~30% benefits + ~8% employer payroll tax + ~25% overhead + modest profit"],
                      ["P75 (proven freelancers)", "× 2.1", "Established freelancers with reputation, repeat clients, niche expertise"],
                      ["P90 (specialists with leverage)", "× 2.7", "Top-tier specialists, sole-source contracts, scarcity premium"],
                    ].map(([p, m, r]) => (
                      <tr key={p} style={styles.tr}>
                        <td style={styles.td}>{p}</td>
                        <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{m}</td>
                        <td style={styles.td}>{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={styles.p}>
                The ladder increases with percentile because pricing power
                scales with experience, reputation, and specialization. Industry
                guidelines from Robert Half, Toptal, and Codementor consistently
                put freelance markup between 1.5x (junior) and 3x (specialist).
                Our ladder sits inside that range and is conservative on both
                ends.
              </p>
            </section>

            {/* ── 3. Tier mapping ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>3. Tier mapping (Junior / Mid / Senior)</h2>
              <p style={styles.p}>
                BLS doesn&apos;t publish wages by experience level. Ratebench&apos;s
                tier mapping is a <strong>heuristic</strong> that adjusts the
                base BLS median by an experience multiplier:
              </p>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Tier</th>
                      <th style={styles.th}>Base = BLS P50 ×</th>
                      <th style={styles.th}>Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Junior", "0.7", "Roughly the BLS P15–P25 slice — early-career workers"],
                      ["Mid", "1.0", "The BLS median — workers in their 5–10 year band"],
                      ["Senior", "1.4", "Roughly the BLS P75–P85 slice — experienced practitioners"],
                    ].map(([t, m, r]) => (
                      <tr key={t} style={styles.tr}>
                        <td style={styles.td}>{t}</td>
                        <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{m}</td>
                        <td style={styles.td}>{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={styles.p}>
                Once contributor submissions reach N≥30 per (skill × tier),
                tier-specific medians from real reports will replace the
                heuristic.
              </p>
            </section>

            {/* ── 4. Worked example ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>4. Worked example: UX Designer, Mid tier</h2>

              <div style={styles.exampleBox}>
                <p style={styles.exampleLine}>
                  <strong>BLS OEWS 15-1255</strong> (Web and Digital Interface Designers)
                </p>
                <p style={styles.exampleLine}>National median hourly wage, May 2024: <strong>$47.16</strong></p>
                <br />
                <p style={styles.exampleLine}>Step 1 — tier-adjusted base:</p>
                <p style={styles.exampleIndent}>Mid tier multiplier = 1.0</p>
                <p style={styles.exampleIndent}>Base = $47.16 × 1.0 = $47.16</p>
                <br />
                <p style={styles.exampleLine}>Step 2 — freelance markup at P50:</p>
                <p style={styles.exampleIndent}>P50 markup = 1.7</p>
                <p style={styles.exampleIndent}>Freelance P50 = $47.16 × 1.7 = <strong>$80.17/hr</strong></p>
                <br />
                <p style={styles.exampleLine}>
                  Ratebench shows: <strong>Mid UX Designer, freelance median = $80/hr</strong>
                </p>
              </div>
            </section>

            {/* ── 5. What's NOT in v1 ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>5. Honest limitations of v1</h2>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  No real freelancer submissions yet. N=0 for every cell at
                  launch. The contributor flywheel is the product.
                </li>
                <li style={styles.li}>
                  National figures only. City premiums (SF, NYC) are real — but
                  not modeled until MSA × occupation data lands.
                </li>
                <li style={styles.li}>
                  Tier mapping is heuristic, not measured. Junior/Mid/Senior
                  cutoffs will be revised once real data arrives.
                </li>
                <li style={styles.li}>
                  BLS data excludes self-employed workers by design. The markup
                  ladder compensates, but it&apos;s an estimate, not a measurement.
                </li>
              </ul>
            </section>

            {/* ── 6. Roadmap ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>6. Roadmap to better data</h2>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Milestone</th>
                      <th style={styles.th}>What it unlocks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["First 50 contributors", "First real-data sanity check; methodology validation; tier definitions get refined"],
                      ["200 contributors", "Tier-specific medians replace heuristic for biggest skill + tier cells"],
                      ["500 contributors", "First MSA × occupation breakouts (top 10 cities)"],
                      ["1,000 contributors", "Quarterly Bench issue with trendlines; Pro tier data integrity"],
                    ].map(([m, u]) => (
                      <tr key={m} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{m}</td>
                        <td style={styles.td}>{u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── CTA ── */}
            <div style={styles.cta}>
              <p style={styles.ctaText}>
                Help us replace BLS-anchored estimates with real data.
              </p>
              <a href="/contribute" style={styles.ctaBtn}>
                Contribute your rate →
              </a>
            </div>

            {/* ── Citations ── */}
            <section style={styles.section}>
              <h2 style={styles.h2}>Citations</h2>
              <p style={styles.p}>
                All BLS data: U.S. Bureau of Labor Statistics, Occupational
                Employment and Wage Statistics, May 2024 estimates.
              </p>
              <ul style={{ ...styles.ul, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                {[
                  ["Software Developers (15-1252)", "https://www.bls.gov/oes/current/oes151252.htm"],
                  ["Web and Digital Interface Designers (15-1255)", "https://www.bls.gov/oes/current/oes151255.htm"],
                  ["Graphic Designers (27-1024)", "https://www.bls.gov/oes/current/oes271024.htm"],
                  ["Writers and Authors (27-3043)", "https://www.bls.gov/oes/current/oes273043.htm"],
                  ["Photographers (27-4021)", "https://www.bls.gov/oes/current/oes274021.htm"],
                  ["OEWS methodology", "https://www.bls.gov/oes/methods_24.pdf"],
                ].map(([label, url]) => (
                  <li key={url} style={{ ...styles.li, marginBottom: 6 }}>
                    <a href={url as string} style={styles.link} target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "#F7F2EA",
    color: "#1F1A16",
    minHeight: "100vh",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  nav: {
    borderBottom: "1px solid rgba(31, 26, 22, 0.1)",
    background: "rgba(247, 242, 234, 0.95)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navInner: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "-0.04em",
    color: "#1F1A16",
    textDecoration: "none",
  },
  wordmarkDot: { color: "#C26A47" },
  backLink: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6B6258",
    textDecoration: "none",
  },
  main: { padding: "64px 24px 120px" },
  inner: { maxWidth: 800, margin: "0 auto" },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#C26A47",
    marginBottom: 20,
  },
  eyebrowLine: {
    display: "inline-block",
    width: 28,
    height: 1,
    background: "#C26A47",
    opacity: 0.5,
  },
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(36px, 5vw, 52px)",
    fontWeight: 500,
    lineHeight: 1.06,
    letterSpacing: "-0.025em",
    color: "#1F1A16",
    margin: "0 0 24px 0",
  },
  intro: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    lineHeight: 1.65,
    color: "#4A4339",
    margin: "0 0 0 0",
    maxWidth: 680,
  },
  divider: {
    height: 1,
    background: "rgba(31, 26, 22, 0.1)",
    margin: "48px 0",
  },
  section: {
    marginBottom: 56,
  },
  h2: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(22px, 3vw, 30px)",
    fontWeight: 500,
    letterSpacing: "-0.015em",
    color: "#1F1A16",
    margin: "0 0 16px 0",
    paddingTop: 8,
  },
  h3: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
    color: "#1F1A16",
    margin: "32px 0 12px 0",
  },
  p: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 16,
    lineHeight: 1.75,
    color: "#4A4339",
    margin: "0 0 16px 0",
  },
  tableWrap: {
    overflowX: "auto",
    margin: "20px 0",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: 14,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  thead: {
    borderBottom: "2px solid rgba(31, 26, 22, 0.15)",
  },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#6B6258",
  },
  tr: {
    borderBottom: "1px solid rgba(31, 26, 22, 0.08)",
  },
  td: {
    padding: "10px 14px",
    color: "#1F1A16",
    verticalAlign: "top",
    lineHeight: 1.5,
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    background: "rgba(31, 26, 22, 0.06)",
    padding: "2px 6px",
    borderRadius: 3,
  },
  link: {
    color: "#C26A47",
    textDecoration: "underline",
  },
  callout: {
    background: "rgba(194, 106, 71, 0.07)",
    border: "1px solid rgba(194, 106, 71, 0.2)",
    borderRadius: 8,
    padding: "16px 20px",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    lineHeight: 1.65,
    color: "#4A4339",
    margin: "20px 0",
  },
  ul: {
    margin: "12px 0",
    paddingLeft: 20,
  },
  li: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4A4339",
    marginBottom: 10,
  },
  exampleBox: {
    background: "#1F1A16",
    color: "#F7F2EA",
    borderRadius: 10,
    padding: "24px 28px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 1.6,
    margin: "20px 0",
  },
  exampleLine: {
    margin: "0 0 4px 0",
    color: "#F7F2EA",
  },
  exampleIndent: {
    margin: "0 0 4px 0",
    paddingLeft: 20,
    color: "rgba(247, 242, 234, 0.7)",
  },
  cta: {
    background: "#C26A47",
    borderRadius: 10,
    padding: "32px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    margin: "48px 0",
    flexWrap: "wrap",
  },
  ctaText: {
    fontFamily: "'Fraunces', serif",
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
    margin: 0,
  },
  ctaBtn: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 6,
    padding: "12px 20px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
};
