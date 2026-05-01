"use client";

import React, { useState, useEffect } from "react";

// ============================================================
// AXIA — Freelance rate intelligence
// Direction 2: New Elegant (terracotta + cream + editorial)
// Single-file artifact. Self-contained.
// ============================================================

export default function AxiaLanding() {
  const [page, setPage] = useState("home"); // home | about | pricing
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [skill, setSkill] = useState("UX Designer");
  const [city, setCity] = useState("Austin, TX");
  const [tier, setTier] = useState("Mid");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sample benchmark data (illustrative)
  const benchmarks = {
    "UX Designer|Austin, TX|Mid": { p25: 68, p50: 88, p75: 115, p90: 145, sources: 23, freelance: [98, 130] },
    "UX Designer|Austin, TX|Senior": { p25: 95, p50: 125, p75: 160, p90: 195, sources: 23, freelance: [135, 175] },
    "UX Designer|Austin, TX|Junior": { p25: 42, p50: 58, p75: 72, p90: 88, sources: 23, freelance: [62, 80] },
    "React Developer|San Francisco, CA|Mid": { p25: 95, p50: 125, p75: 165, p90: 210, sources: 41, freelance: [140, 185] },
    "React Developer|San Francisco, CA|Senior": { p25: 130, p50: 175, p75: 230, p90: 290, sources: 41, freelance: [195, 260] },
    "React Developer|San Francisco, CA|Junior": { p25: 65, p50: 85, p75: 110, p90: 140, sources: 41, freelance: [95, 125] },
    "Brand Designer|New York, NY|Mid": { p25: 75, p50: 105, p75: 140, p90: 180, sources: 31, freelance: [115, 155] },
    "Brand Designer|New York, NY|Senior": { p25: 110, p50: 150, p75: 195, p90: 250, sources: 31, freelance: [165, 220] },
    "Brand Designer|New York, NY|Junior": { p25: 48, p50: 65, p75: 85, p90: 110, sources: 31, freelance: [72, 95] },
    "Photographer|Los Angeles, CA|Mid": { p25: 85, p50: 120, p75: 165, p90: 220, sources: 18, freelance: [130, 180] },
    "Photographer|Los Angeles, CA|Senior": { p25: 130, p50: 185, p75: 250, p90: 340, sources: 18, freelance: [200, 280] },
    "Photographer|Los Angeles, CA|Junior": { p25: 55, p50: 75, p75: 100, p90: 130, sources: 18, freelance: [82, 110] },
    "Copywriter|Brooklyn, NY|Mid": { p25: 65, p50: 90, p75: 120, p90: 155, sources: 27, freelance: [100, 135] },
    "Copywriter|Brooklyn, NY|Senior": { p25: 95, p50: 130, p75: 170, p90: 215, sources: 27, freelance: [145, 190] },
    "Copywriter|Brooklyn, NY|Junior": { p25: 40, p50: 55, p75: 72, p90: 92, sources: 27, freelance: [62, 82] },
  };

  const skills = ["UX Designer", "React Developer", "Brand Designer", "Photographer", "Copywriter"];
  const citiesBySkill = {
    "UX Designer": ["Austin, TX"],
    "React Developer": ["San Francisco, CA"],
    "Brand Designer": ["New York, NY"],
    "Photographer": ["Los Angeles, CA"],
    "Copywriter": ["Brooklyn, NY"],
  };
  const tiers = ["Junior", "Mid", "Senior"];

  const currentKey = `${skill}|${city}|${tier}`;
  const data = benchmarks[currentKey] || benchmarks["UX Designer|Austin, TX|Mid"];

  // When skill changes, reset city to first available
  useEffect(() => {
    const available = citiesBySkill[skill];
    if (available && !available.includes(city)) {
      setCity(available[0]);
    }
  }, [skill]);

  const handleSubmit = async (source = "hero") => {
    setError("");
    if (!email || !email.includes("@") || email.length < 5) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      // Try to hit the real API endpoint (when deployed to Vercel).
      // If it doesn't exist (artifact preview / static demo), fall through
      // to the local-only success state so the UI still works for demos.
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setSubmittedMessage(
          data.alreadyOnList
            ? "You're already on the waitlist. No new email was sent."
            : "Check your inbox. You should receive a welcome email soon.",
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
      {/* === Inline font + global styles === */}
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />

      {/* === Top nav === */}
      <Nav page={page} setPage={setPage} />

      {/* === Pages === */}
      {page === "home" && (
        <Home
          skill={skill}
          setSkill={setSkill}
          city={city}
          setCity={setCity}
          tier={tier}
          setTier={setTier}
          skills={skills}
          citiesBySkill={citiesBySkill}
          tiers={tiers}
          data={data}
          email={email}
          setEmail={setEmail}
          submitted={submitted}
          submittedMessage={submittedMessage}
          submitting={submitting}
          error={error}
          handleSubmit={handleSubmit}
        />
      )}
      {page === "about" && <About />}
      {page === "pricing" && <Pricing setPage={setPage} />}

      {/* === Footer === */}
      <Footer
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        submittedMessage={submittedMessage}
        submitting={submitting}
        error={error}
        handleSubmit={handleSubmit}
        setPage={setPage}
      />
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav({ page, setPage }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.navInner} className="axia-nav-inner">
        <button
          onClick={() => setPage("home")}
          style={styles.wordmark}
          className="axia-wordmark"
          aria-label="Axia home"
        >
          Axia
          <span style={styles.wordmarkDot}>.</span>
        </button>
        <div style={styles.navLinks} className="axia-nav-links">
          <span className="axia-nav-links-extra" style={{ display: "contents" }}>
            <NavLink active={page === "home"} onClick={() => setPage("home")}>
              Index
            </NavLink>
            <NavLink active={page === "about"} onClick={() => setPage("about")}>
              About
            </NavLink>
            <NavLink active={page === "pricing"} onClick={() => setPage("pricing")}>
              Pricing
            </NavLink>
            <a href="/contribute" className="axia-nav-link" style={styles.navLink}>
              Contribute
            </a>
          </span>
          <button
            style={styles.navCTA}
            className="axia-nav-cta"
            onClick={() => {
              if (page !== "home") setPage("home");
              setTimeout(() => {
                const el = document.getElementById("waitlist");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Join waitlist
            <span style={{ marginLeft: 6, opacity: 0.7 }}>→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="axia-nav-link"
      style={{
        ...styles.navLink,
        color: active ? "var(--ink)" : "var(--stone-700)",
        borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

// ============================================================
// HOME
// ============================================================
function Home(props) {
  return (
    <main>
      <Hero {...props} />
      <BenchmarkPreview {...props} />
      <Methodology />
      <HowItWorks />
      <SocialProof />
      <FinalCTA {...props} />
    </main>
  );
}

function Hero(props) {
  const { email, setEmail, submitted, submitting, error, handleSubmit } = props;
  const submittedMessage = props.submittedMessage;
  return (
    <section style={styles.hero} className="axia-hero">
      <div style={styles.heroGrain} />
      <div style={styles.heroInner}>
        <div style={styles.eyebrow} className="axia-eyebrow">
          <span style={styles.eyebrowDot} />
          Issue 001 — Private beta opening Q3 2026
        </div>

        <h1 style={styles.h1}>
          What your work is
          <br />
          <span style={styles.h1Italic}>actually </span>
          worth.
        </h1>

        <p style={styles.heroLead}>
          Axia is freelance rate intelligence — real market data on what clients
          pay independent designers, developers, photographers, and writers, by
          city, by skill, by experience level. Not a calculator. Not an average.
          The actual percentiles.
        </p>

        <div id="waitlist" style={styles.waitlistRow}>
          <div style={styles.waitlistInputWrap} className="axia-waitlist-input-wrap">
            <input
              type="email"
              placeholder="you@studio.com"
              value={email}
              disabled={submitting}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit("hero")}
              style={styles.waitlistInput}
              className="axia-waitlist-input"
            />
            <button
              onClick={() => handleSubmit("hero")}
              disabled={submitting}
              style={{
                ...styles.waitlistBtn,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
              className="axia-waitlist-btn"
            >
              {submitting ? "Sending..." : "Request access"}
            </button>
          </div>
          <p style={styles.waitlistMeta}>
            {submitted
              ? submittedMessage || "✓ You're on the list. Check your inbox."
              : error
              ? error
              : "Free during beta. No card required."}
          </p>
        </div>

        <div style={styles.heroFooter} className="axia-hero-footer">
          <Stat n="830" label="Skills covered" />
          <StatDivider />
          <Stat n="600+" label="US metro areas" />
          <StatDivider />
          <Stat n="P25–P90" label="Percentile granularity" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div style={styles.stat} className="axia-stat">
      <div style={styles.statN} className="axia-stat-n">{n}</div>
      <div style={styles.statLabel} className="axia-stat-label">{label}</div>
    </div>
  );
}

function StatDivider() {
  return <div style={styles.statDivider} className="axia-stat-divider" />;
}

// ============================================================
// BENCHMARK PREVIEW (live demo with sample data)
// ============================================================
function BenchmarkPreview({
  skill,
  setSkill,
  city,
  setCity,
  tier,
  setTier,
  skills,
  citiesBySkill,
  tiers,
  data,
}) {
  const positionPercent = ((data.p50 - data.p25) / (data.p90 - data.p25)) * 100;
  const recommendedPercent = (((data.freelance[0] + data.freelance[1]) / 2 - data.p25) / (data.p90 - data.p25)) * 100;

  return (
    <section style={styles.section} className="axia-section">
      <div style={styles.sectionInner}>
        <SectionLabel num="01">Live benchmark</SectionLabel>
        <h2 style={styles.h2}>
          Try it. <span style={styles.h2Italic}>This is real data.</span>
        </h2>
        <p style={styles.sectionLead}>
          Below is a working demonstration with sample percentiles drawn from
          BLS OEWS and platform data. The product covers 830 occupations across
          600+ US metropolitan areas.
        </p>

        <div style={styles.demoCard}>
          <div style={styles.demoHeader} className="axia-demo-header">
            <span style={styles.demoLabel}>QUERY</span>
          </div>

          <div style={styles.demoControls} className="axia-demo-controls">
            <DemoSelect
              label="Skill"
              value={skill}
              options={skills}
              onChange={setSkill}
            />
            <DemoSelect
              label="Location"
              value={city}
              options={citiesBySkill[skill] || []}
              onChange={setCity}
            />
            <DemoSelect
              label="Experience"
              value={tier}
              options={tiers}
              onChange={setTier}
            />
          </div>

          <div style={styles.demoDivider} />

          <div style={styles.demoResults} className="axia-demo-results">
            <div style={styles.demoSourcesRow}>
              <span style={styles.demoSourcesLabel}>SOURCES</span>
              <span style={styles.demoSourcesValue}>
                BLS OEWS · LinkedIn ranges · {data.sources} verified reports
              </span>
            </div>

            {/* Percentile bar visualization */}
            <PercentileBar data={data} />

            <div style={styles.percentileGrid} className="axia-grid-4-percentile">
              <PercentileCell
                p="P25"
                value={data.p25}
                desc="Bottom quartile"
              />
              <PercentileCell
                p="P50"
                value={data.p50}
                desc="Market median"
                highlight
              />
              <PercentileCell
                p="P75"
                value={data.p75}
                desc="Top quartile"
              />
              <PercentileCell
                p="P90"
                value={data.p90}
                desc="Top 10% of market"
              />
            </div>

            <div style={styles.recommendation} className="axia-recommendation">
              <div style={styles.recoLabel}>
                <span style={styles.recoBullet} />
                FREELANCE RECOMMENDATION
              </div>
              <div style={styles.recoValue} className="axia-reco-value">
                ${data.freelance[0]}–${data.freelance[1]}/hr
              </div>
              <div style={styles.recoExplain}>
                Adjusted for self-employment tax, overhead, and 70% billable
                utilization. Your rate should land in the P55–P75 of market
                for similar quality.
              </div>
            </div>
          </div>

          <div style={styles.demoFooter} className="axia-demo-footer">
            <span>
              <span style={{ opacity: 0.5 }}>Last updated</span> May 2024 (BLS) ·{" "}
              <span style={{ opacity: 0.5 }}>Updated quarterly</span>
            </span>
            <a style={styles.demoMethodologyLink}>Methodology →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoSelect({ label, value, options, onChange }) {
  return (
    <div style={styles.demoSelectWrap}>
      <label style={styles.demoSelectLabel}>{label}</label>
      <div style={styles.demoSelectInner}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.demoSelect}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span style={styles.demoSelectChevron}>↓</span>
      </div>
    </div>
  );
}

function PercentileBar({ data }) {
  const range = data.p90 - data.p25;
  const p50pos = ((data.p50 - data.p25) / range) * 100;
  const p75pos = ((data.p75 - data.p25) / range) * 100;
  const recoStart = ((data.freelance[0] - data.p25) / range) * 100;
  const recoEnd = ((data.freelance[1] - data.p25) / range) * 100;

  return (
    <div style={styles.percentileBarWrap}>
      <div style={styles.percentileBarTrack}>
        {/* Recommended band */}
        <div
          style={{
            ...styles.percentileBarRecoBand,
            left: `${recoStart}%`,
            width: `${recoEnd - recoStart}%`,
          }}
        />
        {/* P50 marker */}
        <div
          style={{ ...styles.percentileBarMarker, left: `${p50pos}%` }}
        >
          <div style={styles.percentileBarMarkerLine} />
          <div style={styles.percentileBarMarkerLabel}>P50</div>
        </div>
        {/* P75 marker */}
        <div
          style={{ ...styles.percentileBarMarker, left: `${p75pos}%` }}
        >
          <div style={styles.percentileBarMarkerLine} />
          <div style={styles.percentileBarMarkerLabel}>P75</div>
        </div>
      </div>
      <div style={styles.percentileBarAxis}>
        <span>${data.p25}</span>
        <span style={{ marginLeft: "auto" }}>${data.p90}</span>
      </div>
    </div>
  );
}

function PercentileCell({ p, value, desc, highlight }) {
  return (
    <div
      style={{
        ...styles.percentileCell,
        ...(highlight ? styles.percentileCellHighlight : {}),
      }}
    >
      <div style={styles.percentileP}>{p}</div>
      <div style={styles.percentileValue} className="axia-percentile-value">${value}</div>
      <div style={styles.percentileDesc}>{desc}</div>
    </div>
  );
}

// ============================================================
// METHODOLOGY (sources)
// ============================================================
function Methodology() {
  return (
    <section style={{ ...styles.section, background: "var(--stone-100)" }} className="axia-section">
      <div style={styles.sectionInner}>
        <SectionLabel num="02">Sources</SectionLabel>
        <h2 style={styles.h2}>
          Three layers of evidence.
          <br />
          <span style={styles.h2Italic}>Cross-checked, not crowdsourced.</span>
        </h2>

        <div style={styles.methodGrid} className="axia-grid-3">
          <MethodCard
            tag="Layer I"
            title="BLS Occupational Wage Statistics"
            desc="The U.S. Bureau of Labor Statistics publishes percentile wages for 830 occupations across 600+ metropolitan areas, refreshed annually. This is the statistical anchor. We adjust for self-employment using transparent multipliers."
            meta="Updated May 2024 · 830 occupations · 600+ MSAs"
          />
          <MethodCard
            tag="Layer II"
            title="Live platform signal"
            desc="Salary range data from job listings (mandated in 12 US states) and freelance platform rate ranges. Refreshed monthly. Used as a market floor and ceiling — not as truth."
            meta="LinkedIn · Indeed · platform listings"
          />
          <MethodCard
            tag="Layer III"
            title="Verified contributor reports"
            desc="Freelancers report their own rates with required context: years, city, client type, scope. No anonymous numbers. Sample sizes are always shown so you can judge confidence."
            meta="Honest sample sizes · context required"
          />
        </div>
      </div>
    </section>
  );
}

function MethodCard({ tag, title, desc, meta }) {
  return (
    <div style={styles.methodCard} className="axia-method-card">
      <div style={styles.methodTag}>{tag}</div>
      <h3 style={styles.methodTitle} className="axia-method-title">{title}</h3>
      <p style={styles.methodDesc}>{desc}</p>
      <div style={styles.methodMeta}>{meta}</div>
    </div>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
function HowItWorks() {
  const steps = [
    {
      n: "I",
      title: "Tell us your skill and city",
      desc: "Pick from 830 occupations and 600+ US metros. Specify your experience tier — junior, mid, senior — and we calibrate the percentiles to your level.",
    },
    {
      n: "II",
      title: "See the actual market",
      desc: "Real percentile data from BLS, cross-checked against current job listings and verified freelancer reports. We show you the sample size every time.",
    },
    {
      n: "III",
      title: "Set a defensible rate",
      desc: "Get a recommended freelance range adjusted for overhead, taxes, and billable utilization. Track how the market shifts in your city, quarter over quarter.",
    },
  ];
  return (
    <section style={styles.section} className="axia-section">
      <div style={styles.sectionInner}>
        <SectionLabel num="03">Process</SectionLabel>
        <h2 style={styles.h2}>
          Three steps. <span style={styles.h2Italic}>No fluff.</span>
        </h2>
        <div style={styles.stepsGrid} className="axia-grid-3-steps">
          {steps.map((s) => (
            <div key={s.n} style={styles.step}>
              <div style={styles.stepN} className="axia-step-n">{s.n}</div>
              <h3 style={styles.stepTitle} className="axia-step-title">{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SOCIAL PROOF / TESTIMONIAL-STYLE PULLQUOTES
// ============================================================
function SocialProof() {
  return (
    <section style={{ ...styles.section, paddingTop: 0 }} className="axia-section">
      <div style={styles.sectionInner}>
        <div style={styles.pullQuoteWrap} className="axia-pull-quote-wrap">
          <div style={styles.pullQuoteMark} className="axia-pull-quote-mark">"</div>
          <p style={styles.pullQuote} className="axia-pull-quote">
            Most freelance rate calculators ask{" "}
            <span style={styles.pullQuoteEm}>what you want to earn</span>. Axia
            asks{" "}
            <span style={styles.pullQuoteEm}>what the market actually pays</span>
            . That's the difference between hoping and knowing.
          </p>
          <div style={styles.pullQuoteAttr}>
            <div style={styles.pullQuoteName}>Editorial note</div>
            <div style={styles.pullQuoteRole}>From the Axia methodology</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA
// ============================================================
function FinalCTA({ email, setEmail, submitted, submittedMessage, submitting, error, handleSubmit }) {
  return (
    <section style={styles.finalCTA} className="axia-final-cta">
      <div style={styles.sectionInner}>
        <SectionLabel num="04" light>
          Access
        </SectionLabel>
        <h2 style={{ ...styles.h2, color: "var(--bone)" }}>
          Private beta opening{" "}
          <span style={styles.h2Italic}>this quarter.</span>
        </h2>
        <p style={{ ...styles.sectionLead, color: "rgba(247,242,234,0.7)" }}>
          The first 200 contributors get lifetime Pro access in exchange for one
          verified rate report. Everyone else joins the waitlist.
        </p>
        <div style={styles.waitlistRow}>
          <div style={{ ...styles.waitlistInputWrap, ...styles.waitlistInputWrapDark }} className="axia-waitlist-input-wrap">
            <input
              type="email"
              placeholder="you@studio.com"
              value={email}
              disabled={submitting}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit("final-cta")}
              style={{ ...styles.waitlistInput, ...styles.waitlistInputDark }}
              className="axia-waitlist-input"
            />
            <button
              onClick={() => handleSubmit("final-cta")}
              disabled={submitting}
              style={{
                ...styles.waitlistBtn,
                ...styles.waitlistBtnDark,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
              className="axia-waitlist-btn"
            >
              {submitting ? "Sending..." : "Request access"}
            </button>
          </div>
          <p style={{ ...styles.waitlistMeta, color: "rgba(247,242,234,0.5)" }}>
            {submitted
              ? submittedMessage || "✓ You're on the list. Check your inbox."
              : error
              ? error
              : "Free during beta. No card required."}
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function About() {
  return (
    <main style={styles.aboutMain} className="axia-about-main">
      <article style={styles.aboutInner}>
        <SectionLabel num="—">About</SectionLabel>
        <h1 style={styles.aboutH1} className="axia-about-h1">
          We built Axia because{" "}
          <span style={styles.h1Italic}>the freelance rate question never had a real answer.</span>
        </h1>

        <div style={styles.aboutDivider} />

        <div style={styles.proseBlock}>
          <p style={styles.aboutLead} className="axia-about-lead">
            Every working freelancer has had this moment: a client asks for your
            rate, and the only honest answer is "I don't actually know what
            people pay for this."
          </p>
          <p style={styles.aboutP} className="axia-about-p">
            The existing tools all share the same flaw — they ask{" "}
            <em>you</em> what you want to earn, run some math, and call it a
            rate. That's not a benchmark. That's a budget calculation in a
            different t-shirt.
          </p>
          <p style={styles.aboutP} className="axia-about-p">
            We started Axia to answer the harder question: what are clients
            actually paying for design, development, photography, and writing
            work — in your city, at your level, this quarter?
          </p>
        </div>

        <h2 style={styles.aboutH2} className="axia-about-h2">The methodology, briefly.</h2>

        <div style={styles.proseBlock}>
          <p style={styles.aboutP} className="axia-about-p">
            We start from the U.S. Bureau of Labor Statistics' Occupational
            Employment and Wage Statistics — the only nationally-representative
            wage dataset with city-level granularity. It covers 830 occupations
            across 600+ metropolitan areas. It's the closest thing to ground
            truth that exists for compensation in the United States.
          </p>
          <p style={styles.aboutP} className="axia-about-p">
            BLS data describes employees, not freelancers. So we apply
            transparent multipliers — published openly, not hidden — to convert
            employee wages into defensible freelance rates. Then we cross-check
            those numbers against live signal from job listings (where salary
            ranges are now mandated in twelve states) and verified reports from
            freelancers who use the product.
          </p>
          <p style={styles.aboutP} className="axia-about-p">
            Sample sizes are always visible. When a city + skill combination
            only has nine reports, you'll see the nine. When it has six hundred,
            you'll see the six hundred. We'd rather show you a small sample
            honestly than a large sample we can't defend.
          </p>
        </div>

        <h2 style={styles.aboutH2} className="axia-about-h2">The bias we're aware of.</h2>

        <div style={styles.proseBlock}>
          <p style={styles.aboutP} className="axia-about-p">
            BLS data lags by twelve to eighteen months. Freelance rates can move
            faster than that, especially in fast-shifting categories like AI
            engineering or motion design. We compensate by weighting recent
            platform signal more heavily for those categories, and we tell you
            when we're doing it.
          </p>
          <p style={styles.aboutP} className="axia-about-p">
            We don't claim to be perfect. We claim to be transparent, honest
            about confidence levels, and the most rigorous freelance rate tool
            you can find today.
          </p>
        </div>

        <div style={styles.aboutSig}>
          <div style={styles.aboutSigName}>The Axia team</div>
          <div style={styles.aboutSigMeta}>April 2026 · Issue 001</div>
        </div>
      </article>
    </main>
  );
}

// ============================================================
// PRICING PAGE
// ============================================================
function Pricing({ setPage }) {
  return (
    <main style={styles.pricingMain} className="axia-pricing-main">
      <div style={styles.sectionInner}>
        <SectionLabel num="—">Pricing</SectionLabel>
        <h1 style={styles.aboutH1} className="axia-about-h1">
          Three tiers. <span style={styles.h1Italic}>Honest economics.</span>
        </h1>
        <p style={{ ...styles.sectionLead, marginBottom: 56 }}>
          Free during beta. Below is the plan structure for general
          availability.
        </p>

        <div style={styles.pricingGrid} className="axia-grid-pricing">
          <PriceTier
            name="Reader"
            tagline="See the median."
            price="$0"
            period="forever"
            features={[
              "10 searches per month",
              "Median (P50) percentile only",
              "Single-source view (BLS)",
              "No saved searches",
              "No alerts",
            ]}
            cta="Start free"
            onCTA={() => {
              setPage("home");
              setTimeout(() => {
                const el = document.getElementById("waitlist");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          />
          <PriceTier
            name="Pro"
            tagline="See the full distribution."
            price="$9"
            period="per month, billed monthly"
            secondary="$79 / year"
            badge="Save $29 · 2 months free"
            features={[
              "Unlimited benchmark queries",
              "Full P25 / P50 / P75 / P90 percentiles",
              "All three data layers",
              "Saved benchmarks (revisit your skill + city)",
              "Quarterly trend alerts via email",
              "Hybrid rate calculator (overhead-adjusted)",
              "PDF benchmark reports",
            ]}
            cta="Join Pro waitlist"
            onCTA={() => {
              setPage("home");
              setTimeout(() => {
                const el = document.getElementById("waitlist");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          />
          <PriceTier
            name="Contributor"
            tagline="Submit your rate quarterly. Get full Pro access while you contribute."
            price="$0"
            period="if you report your verified rate"
            features={[
              "Full Pro access while you contribute",
              "See your rate vs. peers in real time",
              "Early access to the Radar",
              "Help shape categories and methodology",
            ]}
            cta="Apply"
            featured
            onCTA={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/contribute";
              }
            }}
          />
        </div>

        <div style={styles.pricingFooterNote}>
          Beta tester pricing is locked for life. Pro will be $14/month at
          general availability.
        </div>
      </div>
    </main>
  );
}

function PriceTier({ name, tagline, price, period, secondary, badge, features, cta, featured, onCTA }) {
  return (
    <div style={{ ...styles.priceTier, ...(featured ? styles.priceTierFeatured : {}) }} className="axia-price-tier">
      {featured && <div style={styles.priceTierBadge}>Recommended</div>}
      <div style={styles.priceTierHeader}>
        <h3 style={styles.priceTierName} className="axia-price-tier-name">{name}</h3>
        <p style={styles.priceTierTagline}>{tagline}</p>
      </div>
      <div style={styles.priceTierPriceRow}>
        <span style={styles.priceTierPrice} className="axia-price-tier-price">{price}</span>
        <span style={styles.priceTierPeriod}>{period}</span>
      </div>
      {badge && <div style={styles.priceTierAnnualBadge}>{badge}</div>}
      {secondary && <div style={styles.priceTierSecondary}>{secondary}</div>}
      <div style={styles.priceTierDivider} />
      <ul style={styles.priceTierFeatures}>
        {features.map((f, i) => (
          <li key={i} style={styles.priceTierFeature}>
            <span style={styles.priceTierBullet}>+</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onCTA}
        className={featured ? "axia-price-cta-featured" : "axia-price-cta"}
        style={{ ...styles.priceTierCTA, ...(featured ? styles.priceTierCTAFeatured : {}) }}
      >
        {cta} →
      </button>
    </div>
  );
}

// ============================================================
// REUSABLE BITS
// ============================================================
function SectionLabel({ num, children, light }) {
  return (
    <div style={{ ...styles.sectionLabel, color: light ? "var(--clay)" : "var(--rust)" }} className="axia-section-label">
      <span style={styles.sectionLabelNum}>{num}</span>
      <span style={styles.sectionLabelLine} className="axia-section-label-line" />
      <span style={styles.sectionLabelText}>{children}</span>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer(props) {
  const { email, setEmail, submitted, submittedMessage, submitting, error, handleSubmit, setPage } = props;
  return (
    <footer style={styles.footer} className="axia-footer">
      <div style={styles.footerInner}>
        <div style={styles.footerTopRow} className="axia-footer-top-row">
          <div style={styles.footerWordmark} className="axia-footer-wordmark">
            Axia<span style={styles.wordmarkDot}>.</span>
          </div>
          <div style={styles.footerColophon} className="axia-footer-colophon">
            Freelance rate intelligence
            <br />
            Issue 001 · 2026
          </div>
        </div>

        <div style={styles.footerDivider} />

        <div style={styles.footerColumns} className="axia-grid-footer">
          <FooterCol title="Product">
            <FooterLink onClick={() => setPage("home")}>Index</FooterLink>
            <FooterLink onClick={() => setPage("pricing")}>Pricing</FooterLink>
            <FooterLink onClick={() => setPage("about")}>Methodology</FooterLink>
          </FooterCol>
          <FooterCol title="Company">
            <FooterLink onClick={() => setPage("about")}>About</FooterLink>
            <FooterLink>Contact</FooterLink>
            <FooterLink>Privacy</FooterLink>
          </FooterCol>
          <FooterCol title="Connect">
            <FooterLink>Twitter / X</FooterLink>
            <FooterLink>LinkedIn</FooterLink>
            <FooterLink>RSS</FooterLink>
          </FooterCol>
          <FooterCol title="Stay informed" wide>
            <p style={styles.footerNewsletterDesc}>
              Quarterly issue with rate trends, methodology updates, and one
              long-form note on the freelance economy.
            </p>
            <div style={styles.footerInputWrap}>
              <input
                type="email"
                placeholder="you@studio.com"
                value={email}
                disabled={submitting}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit("footer")}
                style={styles.footerInput}
              />
              <button
                onClick={() => handleSubmit("footer")}
                disabled={submitting}
                style={{
                  ...styles.footerInputBtn,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                →
              </button>
            </div>
            {submitted && (
              <div style={styles.footerSubmitted}>
                {submittedMessage || "✓ Subscribed."}
              </div>
            )}
            {error && !submitted && (
              <div style={{ ...styles.footerSubmitted, color: "var(--clay)" }}>{error}</div>
            )}
          </FooterCol>
        </div>

        <div style={styles.footerBottom} className="axia-footer-bottom">
          <span>© 2026 Axia · Made for independent professionals.</span>
          <span style={styles.footerBottomMeta}>v0.1 · Private beta</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, wide }) {
  return (
    <div
      style={{ ...styles.footerCol, gridColumn: wide ? "span 2" : "span 1" }}
      className={wide ? "axia-footer-newsletter-col" : ""}
    >
      <div style={styles.footerColTitle}>{title}</div>
      <div style={styles.footerColLinks}>{children}</div>
    </div>
  );
}

function FooterLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={styles.footerLink} className="axia-footer-link">
      {children}
    </button>
  );
}

// ============================================================
// CSS-IN-JS STYLES
// ============================================================
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink: #1A1614;
    --bone: #F7F2EA;
    --bone-deep: #F0E9DD;
    --stone-100: #EBE5DA;
    --stone-200: #DBD3C4;
    --stone-300: #BFB7A6;
    --stone-500: #8C8473;
    --stone-700: #4A4339;
    --rust: #B8513A;
    --rust-deep: #963F2D;
    --clay: #D88A6E;
    --cocoa: #4A3328;
    --green-data: #5A7355;
    --red-data: #B8513A;
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
  button {
    font-family: inherit;
    cursor: pointer;
  }
  input, select {
    font-family: inherit;
  }

  /* hide native select arrow */
  select {
    -webkit-appearance: none;
    appearance: none;
    background-image: none;
  }

  /* hover states */
  .axia-nav-link:hover { color: var(--ink) !important; }
  .axia-nav-cta:hover { background: var(--rust) !important; }
  .axia-waitlist-btn:hover { background: var(--rust) !important; }
  .axia-method-card:hover { transform: translateY(-2px); border-color: var(--stone-300) !important; }
  .axia-price-cta:hover { background: var(--rust) !important; }
  .axia-price-cta-featured:hover { background: var(--rust-deep) !important; }
  .axia-footer-link:hover { opacity: 1 !important; color: var(--clay) !important; }
  .axia-demo-select:hover, .axia-demo-select:focus { border-color: var(--rust) !important; outline: none; }

  /* responsive grids */
  .axia-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .axia-grid-3-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 60px;
    margin-top: 32px;
  }
  .axia-grid-4-percentile {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--stone-200);
    border: 1px solid var(--stone-200);
    border-radius: 6px;
    overflow: hidden;
    margin-top: 24px;
  }
  .axia-grid-footer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
    margin-bottom: 56px;
  }
  .axia-grid-pricing {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 48px;
  }

  /* === TABLET: 880px and below === */
  @media (max-width: 880px) {
    .axia-grid-3 {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .axia-grid-3-steps {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .axia-grid-pricing {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .axia-grid-footer {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }
    .axia-footer-newsletter-col {
      grid-column: span 2 !important;
    }
    .axia-section {
      padding: 80px 24px !important;
    }
    .axia-hero {
      padding: 64px 24px 56px !important;
    }
    .axia-final-cta {
      padding: 80px 24px !important;
    }
    .axia-about-main {
      padding: 64px 24px 80px !important;
    }
    .axia-pricing-main {
      padding: 64px 24px 80px !important;
    }
    .axia-nav-inner {
      padding: 14px 20px !important;
    }
    .axia-nav-links-extra {
      display: none !important;
    }
    .axia-demo-controls {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
      padding: 22px !important;
    }
    .axia-demo-results {
      padding: 22px !important;
    }
    .axia-demo-header {
      padding: 14px 22px !important;
    }
    .axia-demo-footer {
      padding: 12px 22px !important;
      flex-direction: column;
      align-items: flex-start !important;
      gap: 6px;
    }
    .axia-hero-footer {
      gap: 20px !important;
    }
    .axia-hero-footer .axia-stat-divider {
      display: none;
    }
    .axia-stat {
      flex: 1 1 calc(50% - 10px);
      min-width: 130px;
    }
    .axia-method-card {
      padding: 24px 22px !important;
    }
    .axia-footer {
      padding: 56px 24px 32px !important;
    }
    .axia-footer-wordmark {
      font-size: 40px !important;
    }
    .axia-footer-bottom {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .axia-pull-quote-wrap {
      padding: 32px 0 !important;
    }
    .axia-pull-quote-mark {
      font-size: 80px !important;
      height: 40px !important;
    }
    .axia-reco-value {
      font-size: 30px !important;
    }
    .axia-percentile-value {
      font-size: 22px !important;
    }
    .axia-step-n {
      font-size: 44px !important;
    }
    .axia-price-tier {
      padding: 28px 24px !important;
    }
    .axia-waitlist-input-wrap {
      flex-wrap: wrap;
    }
    .axia-waitlist-input {
      width: 100%;
      padding: 14px 18px !important;
    }
    .axia-waitlist-btn {
      width: 100%;
      padding: 14px 22px !important;
      margin-top: 4px;
    }
  }

  /* === MOBILE: 560px and below === */
  @media (max-width: 560px) {
    .axia-grid-4-percentile {
      grid-template-columns: repeat(2, 1fr);
    }
    .axia-grid-footer {
      grid-template-columns: 1fr;
    }
    .axia-footer-newsletter-col {
      grid-column: span 1 !important;
    }
    .axia-hero h1 {
      font-size: 44px !important;
    }
    .axia-hero p {
      font-size: 16px !important;
    }
    .axia-eyebrow {
      font-size: 10px !important;
      padding: 6px 12px !important;
    }
    .axia-stat-n {
      font-size: 26px !important;
    }
    .axia-stat-label {
      font-size: 10px !important;
    }
    .axia-section h2 {
      font-size: 32px !important;
    }
    .axia-about-h1 {
      font-size: 32px !important;
    }
    .axia-pull-quote {
      font-size: 22px !important;
    }
    .axia-method-title {
      font-size: 19px !important;
    }
    .axia-step-title {
      font-size: 19px !important;
    }
    .axia-wordmark {
      font-size: 24px !important;
    }
    .axia-nav-cta {
      padding: 8px 16px !important;
      font-size: 11px !important;
    }
    .axia-nav-links {
      gap: 12px !important;
    }
    .axia-footer-top-row {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .axia-footer-colophon {
      text-align: left !important;
    }
    .axia-section-label {
      font-size: 10px !important;
      gap: 8px !important;
    }
    .axia-section-label-line {
      width: 18px !important;
    }
    .axia-recommendation {
      padding: 20px !important;
    }
    .axia-reco-value {
      font-size: 26px !important;
    }
    .axia-about-p, .axia-about-lead {
      font-size: 16px !important;
    }
    .axia-about-h2 {
      font-size: 22px !important;
      margin-top: 40px !important;
    }
    .axia-price-tier-name {
      font-size: 22px !important;
    }
    .axia-price-tier-price {
      font-size: 40px !important;
    }
  }

  /* === Animation === */
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styles = {
  root: {
    background: "var(--bone)",
    color: "var(--ink)",
    fontFamily: "'Fraunces', Georgia, serif",
    minHeight: "100vh",
    overflow: "hidden",
  },

  // ========== NAV ==========
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(247, 242, 234, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--stone-200)",
  },
  navInner: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    background: "transparent",
    border: "none",
    padding: 0,
    fontFamily: "'Fraunces', serif",
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: "-0.04em",
    color: "var(--ink)",
    lineHeight: 1,
    cursor: "pointer",
  },
  wordmarkDot: {
    color: "var(--rust)",
    fontFamily: "'Fraunces', serif",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  navLink: {
    background: "transparent",
    border: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "4px 0",
    transition: "all 0.2s",
  },
  navCTA: {
    background: "var(--ink)",
    color: "var(--bone)",
    border: "none",
    padding: "10px 20px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderRadius: 999,
    transition: "all 0.2s",
  },

  // ========== HERO ==========
  hero: {
    position: "relative",
    padding: "100px 32px 80px",
    overflow: "hidden",
  },
  heroGrain: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.5,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.07 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
  },
  heroInner: {
    maxWidth: 980,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--stone-700)",
    padding: "8px 14px",
    background: "var(--stone-100)",
    borderRadius: 999,
    marginBottom: 32,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--rust)",
    animation: "pulse 2s infinite",
  },
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(48px, 9vw, 112px)",
    fontWeight: 500,
    lineHeight: 0.96,
    letterSpacing: "-0.035em",
    color: "var(--ink)",
    margin: 0,
    marginBottom: 32,
  },
  h1Italic: {
    fontFamily: "'Instrument Serif', 'Fraunces', serif",
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--rust)",
  },
  heroLead: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(18px, 2.2vw, 22px)",
    lineHeight: 1.5,
    fontWeight: 400,
    color: "var(--stone-700)",
    maxWidth: 680,
    margin: "0 0 40px 0",
  },

  waitlistRow: {
    marginBottom: 64,
  },
  waitlistInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "var(--bone-deep)",
    border: "1px solid var(--stone-300)",
    borderRadius: 999,
    padding: 4,
    maxWidth: 480,
  },
  waitlistInputWrapDark: {
    background: "rgba(247,242,234,0.05)",
    border: "1px solid rgba(247,242,234,0.2)",
  },
  waitlistInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    padding: "12px 18px",
    fontSize: 15,
    fontFamily: "'Fraunces', serif",
    color: "var(--ink)",
  },
  waitlistInputDark: {
    color: "var(--bone)",
  },
  waitlistBtn: {
    background: "var(--ink)",
    color: "var(--bone)",
    border: "none",
    padding: "12px 22px",
    borderRadius: 999,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  waitlistBtnDark: {
    background: "var(--rust)",
    color: "var(--bone)",
  },
  waitlistMeta: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.06em",
    color: "var(--stone-500)",
    marginTop: 14,
    marginLeft: 4,
  },

  heroFooter: {
    display: "flex",
    alignItems: "center",
    gap: 32,
    paddingTop: 32,
    borderTop: "1px solid var(--stone-200)",
    flexWrap: "wrap",
  },
  stat: {},
  statN: {
    fontFamily: "'Fraunces', serif",
    fontSize: 32,
    fontWeight: 500,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--stone-500)",
  },
  statDivider: {
    width: 1,
    height: 36,
    background: "var(--stone-300)",
  },

  // ========== SECTIONS ==========
  section: {
    padding: "120px 32px",
  },
  sectionInner: {
    maxWidth: 1240,
    margin: "0 auto",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--rust)",
    marginBottom: 20,
  },
  sectionLabelNum: {
    fontWeight: 500,
  },
  sectionLabelLine: {
    width: 28,
    height: 1,
    background: "currentColor",
    opacity: 0.5,
  },
  sectionLabelText: {},
  h2: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(36px, 5.5vw, 64px)",
    fontWeight: 500,
    lineHeight: 1.04,
    letterSpacing: "-0.025em",
    color: "var(--ink)",
    margin: "0 0 24px 0",
    maxWidth: 880,
  },
  h2Italic: {
    fontFamily: "'Instrument Serif', 'Fraunces', serif",
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--rust)",
  },
  sectionLead: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(16px, 1.8vw, 19px)",
    lineHeight: 1.55,
    color: "var(--stone-700)",
    maxWidth: 680,
    margin: "0 0 48px 0",
  },

  // ========== DEMO CARD ==========
  demoCard: {
    marginTop: 16,
    background: "var(--bone)",
    border: "1px solid var(--stone-300)",
    borderRadius: 8,
    padding: 0,
    overflow: "hidden",
    boxShadow: "0 1px 0 var(--stone-200), 0 24px 60px -32px rgba(74, 51, 40, 0.18)",
  },
  demoHeader: {
    padding: "16px 28px",
    borderBottom: "1px solid var(--stone-200)",
    background: "var(--bone-deep)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  demoLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--stone-500)",
  },
  demoControls: {
    padding: "28px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
  },
  demoSelectWrap: {},
  demoSelectLabel: {
    display: "block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--stone-500)",
    marginBottom: 8,
  },
  demoSelectInner: {
    position: "relative",
  },
  demoSelect: {
    width: "100%",
    padding: "12px 36px 12px 14px",
    fontSize: 15,
    fontFamily: "'Fraunces', serif",
    color: "var(--ink)",
    background: "var(--bone)",
    border: "1px solid var(--stone-300)",
    borderRadius: 6,
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  demoSelectChevron: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "var(--stone-500)",
    fontSize: 12,
  },
  demoDivider: {
    height: 1,
    background: "var(--stone-200)",
    margin: 0,
  },
  demoResults: {
    padding: 28,
  },
  demoSourcesRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 14,
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: "1px dashed var(--stone-200)",
  },
  demoSourcesLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--stone-500)",
  },
  demoSourcesValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: "var(--stone-700)",
    letterSpacing: "0.02em",
  },

  // Percentile bar
  percentileBarWrap: {
    margin: "32px 0 40px",
  },
  percentileBarTrack: {
    position: "relative",
    height: 8,
    background: "linear-gradient(to right, var(--stone-200), var(--stone-300), var(--stone-200))",
    borderRadius: 999,
  },
  percentileBarRecoBand: {
    position: "absolute",
    top: 0,
    height: "100%",
    background: "var(--rust)",
    opacity: 0.85,
    borderRadius: 999,
  },
  percentileBarMarker: {
    position: "absolute",
    top: -6,
    transform: "translateX(-50%)",
  },
  percentileBarMarkerLine: {
    width: 2,
    height: 20,
    background: "var(--ink)",
    margin: "0 auto",
  },
  percentileBarMarkerLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "var(--ink)",
    marginTop: 4,
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  percentileBarAxis: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 30,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "var(--stone-500)",
  },

  percentileGrid: {},
  percentileCell: {
    background: "var(--bone)",
    padding: "20px 18px",
  },
  percentileCellHighlight: {
    background: "var(--bone-deep)",
  },
  percentileP: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--rust)",
    marginBottom: 6,
  },
  percentileValue: {
    fontFamily: "'Fraunces', serif",
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    lineHeight: 1.1,
    marginBottom: 4,
  },
  percentileDesc: {
    fontFamily: "'Fraunces', serif",
    fontSize: 12,
    color: "var(--stone-500)",
    fontStyle: "italic",
  },

  recommendation: {
    marginTop: 32,
    padding: 24,
    background: "var(--ink)",
    color: "var(--bone)",
    borderRadius: 6,
  },
  recoLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--clay)",
    marginBottom: 12,
  },
  recoBullet: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--rust)",
  },
  recoValue: {
    fontFamily: "'Fraunces', serif",
    fontSize: 38,
    fontWeight: 500,
    letterSpacing: "-0.02em",
    marginBottom: 8,
    color: "var(--bone)",
  },
  recoExplain: {
    fontFamily: "'Fraunces', serif",
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(247,242,234,0.7)",
    maxWidth: 560,
  },

  demoFooter: {
    padding: "14px 28px",
    borderTop: "1px solid var(--stone-200)",
    background: "var(--bone-deep)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "var(--stone-500)",
  },
  demoMethodologyLink: {
    color: "var(--rust)",
    textDecoration: "none",
    cursor: "pointer",
  },

  // ========== METHODOLOGY ==========
  methodGrid: {
    marginTop: 24,
  },
  methodCard: {
    background: "var(--bone)",
    border: "1px solid var(--stone-200)",
    borderRadius: 6,
    padding: "32px 28px",
    transition: "transform 0.3s, border-color 0.3s",
  },
  methodTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--rust)",
    marginBottom: 16,
  },
  methodTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    color: "var(--ink)",
    margin: "0 0 14px 0",
    lineHeight: 1.2,
  },
  methodDesc: {
    fontFamily: "'Fraunces', serif",
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--stone-700)",
    margin: "0 0 24px 0",
  },
  methodMeta: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "var(--stone-500)",
    paddingTop: 14,
    borderTop: "1px dashed var(--stone-300)",
  },

  // ========== STEPS ==========
  stepsGrid: {},
  step: {},
  stepN: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 56,
    fontWeight: 400,
    color: "var(--rust)",
    lineHeight: 1,
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    color: "var(--ink)",
    margin: "0 0 12px 0",
  },
  stepDesc: {
    fontFamily: "'Fraunces', serif",
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--stone-700)",
    margin: 0,
  },

  // ========== PULL QUOTE ==========
  pullQuoteWrap: {
    maxWidth: 880,
    margin: "0 auto",
    padding: "60px 0",
    position: "relative",
  },
  pullQuoteMark: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 120,
    color: "var(--rust)",
    lineHeight: 1,
    height: 60,
    marginBottom: 8,
  },
  pullQuote: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(24px, 3.4vw, 38px)",
    fontWeight: 400,
    lineHeight: 1.32,
    letterSpacing: "-0.015em",
    color: "var(--ink)",
    margin: "0 0 32px 0",
  },
  pullQuoteEm: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    color: "var(--rust)",
  },
  pullQuoteAttr: {
    paddingLeft: 4,
    borderLeft: "2px solid var(--rust)",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
  },
  pullQuoteName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--ink)",
    marginBottom: 4,
  },
  pullQuoteRole: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--stone-500)",
  },

  // ========== FINAL CTA ==========
  finalCTA: {
    padding: "120px 32px",
    background: "var(--ink)",
    color: "var(--bone)",
    position: "relative",
  },

  // ========== ABOUT ==========
  aboutMain: {
    padding: "100px 32px 120px",
  },
  aboutInner: {
    maxWidth: 760,
    margin: "0 auto",
  },
  aboutH1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(36px, 5.5vw, 56px)",
    fontWeight: 500,
    lineHeight: 1.08,
    letterSpacing: "-0.025em",
    color: "var(--ink)",
    margin: "20px 0 0 0",
  },
  aboutDivider: {
    height: 1,
    background: "var(--stone-300)",
    margin: "48px 0",
  },
  aboutLead: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    lineHeight: 1.55,
    color: "var(--ink)",
    marginBottom: 24,
  },
  aboutP: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    lineHeight: 1.65,
    color: "var(--stone-700)",
    marginBottom: 20,
  },
  aboutH2: {
    fontFamily: "'Fraunces', serif",
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    color: "var(--ink)",
    margin: "56px 0 24px 0",
  },
  proseBlock: {
    marginBottom: 8,
  },
  aboutSig: {
    marginTop: 64,
    paddingTop: 32,
    borderTop: "1px solid var(--stone-300)",
  },
  aboutSigName: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--rust)",
    marginBottom: 4,
  },
  aboutSigMeta: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--stone-500)",
  },

  // ========== PRICING ==========
  pricingMain: {
    padding: "100px 32px 120px",
  },
  pricingGrid: {},
  priceTier: {
    background: "var(--bone)",
    border: "1px solid var(--stone-300)",
    borderRadius: 8,
    padding: 32,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  priceTierFeatured: {
    background: "var(--ink)",
    border: "1px solid var(--ink)",
    color: "var(--bone)",
  },
  priceTierBadge: {
    position: "absolute",
    top: -12,
    left: 32,
    background: "var(--rust)",
    color: "var(--bone)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 500,
  },
  priceTierHeader: {
    marginBottom: 24,
  },
  priceTierName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 24,
    fontWeight: 500,
    margin: "0 0 6px 0",
    color: "inherit",
  },
  priceTierTagline: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 16,
    color: "inherit",
    opacity: 0.7,
    margin: 0,
  },
  priceTierPriceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    flexWrap: "wrap",
  },
  priceTierAnnualBadge: {
    marginTop: 8,
    background: "var(--clay)",
    color: "var(--bone)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    padding: "6px 10px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
  },
  priceTierPrice: {
    fontFamily: "'Fraunces', serif",
    fontSize: 48,
    fontWeight: 500,
    letterSpacing: "-0.03em",
    color: "inherit",
    lineHeight: 1,
  },
  priceTierPeriod: {
    fontFamily: "'Fraunces', serif",
    fontSize: 13,
    color: "inherit",
    opacity: 0.6,
  },
  priceTierSecondary: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "inherit",
    opacity: 0.5,
    marginTop: 6,
    letterSpacing: "0.04em",
  },
  priceTierDivider: {
    height: 1,
    background: "currentColor",
    opacity: 0.15,
    margin: "28px 0 24px",
  },
  priceTierFeatures: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 32px 0",
    flex: 1,
  },
  priceTierFeature: {
    display: "flex",
    gap: 10,
    fontFamily: "'Fraunces', serif",
    fontSize: 14.5,
    lineHeight: 1.5,
    color: "inherit",
    opacity: 0.85,
    marginBottom: 12,
    alignItems: "baseline",
  },
  priceTierBullet: {
    fontFamily: "'JetBrains Mono', monospace",
    color: "var(--rust)",
    fontSize: 14,
    flexShrink: 0,
  },
  priceTierCTA: {
    background: "var(--ink)",
    color: "var(--bone)",
    border: "none",
    padding: "14px 18px",
    borderRadius: 999,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 500,
    width: "100%",
    transition: "all 0.2s",
  },
  priceTierCTAFeatured: {
    background: "var(--rust)",
    color: "var(--bone)",
  },
  pricingFooterNote: {
    marginTop: 32,
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--stone-500)",
    textAlign: "center",
  },

  // ========== FOOTER ==========
  footer: {
    background: "var(--cocoa)",
    color: "var(--bone)",
    padding: "80px 32px 40px",
  },
  footerInner: {
    maxWidth: 1240,
    margin: "0 auto",
  },
  footerTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 48,
    flexWrap: "wrap",
    gap: 24,
  },
  footerWordmark: {
    fontFamily: "'Fraunces', serif",
    fontSize: 56,
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    color: "var(--bone)",
  },
  footerColophon: {
    fontFamily: "'Instrument Serif', serif",
    fontStyle: "italic",
    fontSize: 16,
    color: "var(--clay)",
    textAlign: "right",
    lineHeight: 1.5,
  },
  footerDivider: {
    height: 1,
    background: "rgba(247,242,234,0.15)",
    marginBottom: 48,
  },
  footerColumns: {},
  footerCol: {},
  footerColTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--clay)",
    marginBottom: 16,
  },
  footerColLinks: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  footerLink: {
    background: "transparent",
    border: "none",
    padding: 0,
    textAlign: "left",
    fontFamily: "'Fraunces', serif",
    fontSize: 15,
    color: "var(--bone)",
    opacity: 0.85,
    transition: "opacity 0.2s",
    cursor: "pointer",
  },
  footerNewsletterDesc: {
    fontFamily: "'Fraunces', serif",
    fontSize: 14,
    lineHeight: 1.5,
    color: "var(--bone)",
    opacity: 0.7,
    marginBottom: 16,
    marginTop: 0,
  },
  footerInputWrap: {
    display: "flex",
    background: "rgba(247,242,234,0.05)",
    border: "1px solid rgba(247,242,234,0.2)",
    borderRadius: 999,
    padding: 4,
    maxWidth: 320,
  },
  footerInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "'Fraunces', serif",
    color: "var(--bone)",
  },
  footerInputBtn: {
    background: "var(--rust)",
    color: "var(--bone)",
    border: "none",
    width: 36,
    height: 36,
    borderRadius: "50%",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    cursor: "pointer",
  },
  footerSubmitted: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "var(--clay)",
    marginTop: 8,
  },
  footerBottom: {
    paddingTop: 32,
    borderTop: "1px solid rgba(247,242,234,0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.06em",
    color: "rgba(247,242,234,0.5)",
    flexWrap: "wrap",
    gap: 12,
  },
  footerBottomMeta: {
    color: "var(--clay)",
  },
};

// Add a small CSS keyframes injection for the pulse animation
const keyframesCSS = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  /* Mobile responsive */
  @media (max-width: 880px) {
    .axia-mobile-stack { grid-template-columns: 1fr !important; }
  }
`;

// Inject keyframes once on module load (no-op SSR safe)
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = keyframesCSS;
  document.head.appendChild(styleEl);
}
