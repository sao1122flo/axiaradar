import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Freelance Rate Benchmarks | Axia",
  description:
    "Common questions about freelance pricing methodology, percentile data, and how Axia rate benchmarks are built from BLS OEWS and contributor submissions.",
};

const faqs = [
  {
    question: "How much should a freelance UX designer charge in 2026?",
    answer:
      "Median rates for a mid-level UX designer in major US metros range from $80 to $130 per hour, with senior practitioners commanding $130–$200+. Axia data shows the Austin TX market at $88/hr P50 for mid-level and $125/hr P50 for senior. San Francisco runs 20–30% above Austin for equivalent roles. Rates vary most by city and client type — startup budgets, agency middleman cuts, and enterprise procurement processes each pull the effective rate in different directions.",
  },
  {
    question: "What's the typical rate range for a senior React developer in the US?",
    answer:
      "Senior React developers in San Francisco land between $175–$230/hr at the P50–P75 range based on Axia benchmark data (41 verified reports). The P25 floor is $130/hr and the P90 ceiling is $290/hr. Remote work has compressed some geographic premiums, but San Francisco, New York, and Seattle still command 15–25% above mid-tier markets. Freelance rates for developers should account for self-employment tax (15.3%), benefits overhead, and ~70% billable utilization — which is why the freelance P50 sits 35–45% above equivalent W-2 wages.",
  },
  {
    question: "Are BLS occupational wage statistics useful for freelancers?",
    answer:
      "Yes, but only as a floor. The Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS) program publishes percentile wages for 830 occupations across 600+ metropolitan areas — it is the most granular, nationally representative labor market dataset that exists. The limitation is that BLS measures W-2 employees, not independent contractors. Axia applies transparent multipliers to convert BLS wages into defensible freelance equivalents: self-employment tax (15.3%), benefits gap (typically 20–30% of comp), and a utilization discount for non-billable hours (assuming 70% billable). The result is a statistical anchor, not a ceiling.",
  },
  {
    question: "What's the difference between P25, P50, P75, and P90 freelance rates?",
    answer:
      "Percentiles describe the distribution of rates across the market, not averages. P25 means 25% of the market charges below that number — it is the bottom quartile, typically newer practitioners or under-priced markets. P50 is the median: half the market is above, half below. P75 is the top quartile, where experienced practitioners with strong portfolios tend to land. P90 is the top 10% — specialized experts, niche skills, or premium positioning. Axia always shows all four so you can see the full shape of the market rather than a single misleading average.",
  },
  {
    question:
      "How is Axia data different from rate calculators like SoloGig or Freelancer rate guides?",
    answer:
      "Most freelance rate calculators ask what you want to earn, apply a utilization formula, and output a 'recommended' rate. That is not market data — it is a budget calculation. Axia starts from what clients actually pay: BLS OEWS for the statistical anchor, public job listing salary ranges (mandatory in 12 states) for live market signal, and contributor-submitted real rates for ground-truth fidelity. Sample sizes are always shown. Confidence intervals are explicit. When a cell has only 7 reports, you see 7, not a smoothed number pretending to be more certain than it is.",
  },
  {
    question: "What's a fair freelance markup over employee salary?",
    answer:
      "A common rule of thumb is 1.5–2.5x your target equivalent W-2 salary, converted to an hourly rate. The math: a $120,000/yr salary is roughly $58/hr at 2,080 hours/year. A freelancer targeting the same take-home needs to cover self-employment tax (~15.3%), health insurance ($300–600/mo), retirement contributions (20% of net if maxing a SEP-IRA), and non-billable overhead (business development, admin, downtime between projects). At 70% billable utilization, the actual working hours drop to ~1,450/year, pushing the required rate to $120–$140/hr for equivalent net income. Axia's freelance recommendation range is calculated using these transparent multipliers.",
  },
  {
    question: "Should I price hourly, daily, or by project?",
    answer:
      "Each model optimizes for different things. Hourly protects you from scope creep but caps upside and signals commodity work. Daily rates (common in Europe and with agency clients) smooth out the hourly tracking overhead while preserving flexibility. Project pricing rewards efficiency — if you can deliver in 20 hours what others take 40, you capture that margin. Senior practitioners typically move toward project or retainer pricing to decouple income from time. Axia publishes hourly benchmarks because they are the most comparable across markets, but the methodology page notes how to translate to daily and project equivalents.",
  },
  {
    question: "How often should I raise my freelance rates?",
    answer:
      "At minimum, annually — US inflation averaged 3–4% in 2023–2025, which means a flat rate is a real pay cut every year. A stronger signal for a rate increase: your close rate is above 70% (demand exceeds supply at your current price), you have a waitlist, or you have significantly upgraded your skill set or portfolio tier. Axia tracks quarterly rate trends by market — in fast-moving categories like AI engineering and motion design, market rates have shifted 10–20% within a single year. The practical floor for most established freelancers is an annual CPI adjustment plus a skills premium review every 18 months.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={styles.root}>
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <a href="/" style={styles.wordmark}>
              Axia<span style={styles.wordmarkDot}>.</span>
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
              FAQ
            </div>
            <h1 style={styles.h1}>
              Common questions about{" "}
              <span style={styles.h1Italic}>freelance pricing.</span>
            </h1>
            <p style={styles.lead}>
              Methodology, benchmarks, and how to use market data to set a
              defensible rate.
            </p>

            <div style={styles.divider} />

            <div style={styles.faqList}>
              {faqs.map((faq, i) => (
                <div key={i} style={styles.faqItem}>
                  <h2 style={styles.question}>{faq.question}</h2>
                  <p style={styles.answer}>{faq.answer}</p>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Data sourced from BLS OEWS, public job listings, and
                contributor-submitted rates.{" "}
                <a href="/" style={styles.footerLink}>
                  Explore the rate benchmark →
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "#F7F2EA",
    color: "#1A1614",
    minHeight: "100vh",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  nav: {
    borderBottom: "1px solid #DBD3C4",
    background: "rgba(247, 242, 234, 0.9)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  },
  navInner: {
    maxWidth: 760,
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
    color: "#1A1614",
    textDecoration: "none",
  },
  wordmarkDot: {
    color: "#B8513A",
  },
  backLink: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#8C8473",
    textDecoration: "none",
  },
  main: {
    padding: "72px 24px 120px",
  },
  inner: {
    maxWidth: 760,
    margin: "0 auto",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#B8513A",
    marginBottom: 20,
  },
  eyebrowLine: {
    display: "inline-block",
    width: 28,
    height: 1,
    background: "#B8513A",
    opacity: 0.5,
  },
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: 500,
    lineHeight: 1.06,
    letterSpacing: "-0.025em",
    color: "#1A1614",
    margin: "0 0 20px 0",
  },
  h1Italic: {
    fontStyle: "italic",
    fontWeight: 400,
    color: "#B8513A",
  },
  lead: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    lineHeight: 1.55,
    color: "#4A4339",
    margin: 0,
  },
  divider: {
    height: 1,
    background: "#DBD3C4",
    margin: "48px 0",
  },
  faqList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  },
  faqItem: {
    borderBottom: "1px solid #EBE5DA",
    paddingBottom: 40,
    marginBottom: 40,
  },
  question: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(20px, 3vw, 26px)",
    fontWeight: 500,
    letterSpacing: "-0.015em",
    lineHeight: 1.2,
    color: "#1A1614",
    margin: "0 0 16px 0",
  },
  answer: {
    fontFamily: "'Fraunces', serif",
    fontSize: 17,
    lineHeight: 1.7,
    color: "#4A4339",
    margin: 0,
  },
  footer: {
    marginTop: 24,
    paddingTop: 40,
    borderTop: "1px solid #DBD3C4",
  },
  footerText: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontSize: 15,
    color: "#8C8473",
    margin: 0,
  },
  footerLink: {
    color: "#B8513A",
    textDecoration: "none",
  },
};
