// =============================================================================
// Ratebench benchmarks v2 — BLS-anchored shared module
// Used by both the frontend (via import in page.jsx) and backend API routes.
// Methodology: BLS OEWS May 2024 × tier multiplier × freelance markup ladder.
// Full documentation: /methodology
// =============================================================================

export type BenchmarkCell = {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  sources: number;
  freelance: [number, number];
  meta: {
    soc: string;
    blsP50: number;
    tier: "Junior" | "Mid" | "Senior";
    vintage: string;
  };
};

export const benchmarks: Record<string, BenchmarkCell> = {
  // UX Designer (SOC 15-1255 · BLS P50 = $47.16/hr)
  "UX Designer|National|Junior": {
    p25: 46, p50: 56, p75: 69, p90: 89,
    sources: 0, freelance: [56, 69],
    meta: { soc: "15-1255", blsP50: 47.16, tier: "Junior", vintage: "May 2024 (BLS)" },
  },
  "UX Designer|National|Mid": {
    p25: 66, p50: 80, p75: 99, p90: 127,
    sources: 0, freelance: [80, 99],
    meta: { soc: "15-1255", blsP50: 47.16, tier: "Mid", vintage: "May 2024 (BLS)" },
  },
  "UX Designer|National|Senior": {
    p25: 92, p50: 112, p75: 139, p90: 178,
    sources: 0, freelance: [112, 139],
    meta: { soc: "15-1255", blsP50: 47.16, tier: "Senior", vintage: "May 2024 (BLS)" },
  },

  // React Developer (SOC 15-1252 · BLS P50 = $63.98/hr)
  "React Developer|National|Junior": {
    p25: 63, p50: 76, p75: 94, p90: 121,
    sources: 0, freelance: [76, 94],
    meta: { soc: "15-1252", blsP50: 63.98, tier: "Junior", vintage: "May 2024 (BLS)" },
  },
  "React Developer|National|Mid": {
    p25: 90, p50: 109, p75: 134, p90: 173,
    sources: 0, freelance: [109, 134],
    meta: { soc: "15-1252", blsP50: 63.98, tier: "Mid", vintage: "May 2024 (BLS)" },
  },
  "React Developer|National|Senior": {
    p25: 125, p50: 152, p75: 188, p90: 242,
    sources: 0, freelance: [152, 188],
    meta: { soc: "15-1252", blsP50: 63.98, tier: "Senior", vintage: "May 2024 (BLS)" },
  },

  // Brand Designer (SOC 27-1024 · BLS P50 = $29.47/hr)
  "Brand Designer|National|Junior": {
    p25: 29, p50: 35, p75: 43, p90: 56,
    sources: 0, freelance: [35, 43],
    meta: { soc: "27-1024", blsP50: 29.47, tier: "Junior", vintage: "May 2024 (BLS)" },
  },
  "Brand Designer|National|Mid": {
    p25: 41, p50: 50, p75: 62, p90: 80,
    sources: 0, freelance: [50, 62],
    meta: { soc: "27-1024", blsP50: 29.47, tier: "Mid", vintage: "May 2024 (BLS)" },
  },
  "Brand Designer|National|Senior": {
    p25: 58, p50: 70, p75: 87, p90: 111,
    sources: 0, freelance: [70, 87],
    meta: { soc: "27-1024", blsP50: 29.47, tier: "Senior", vintage: "May 2024 (BLS)" },
  },

  // Photographer (SOC 27-4021 · BLS P50 = $20.44/hr)
  "Photographer|National|Junior": {
    p25: 20, p50: 24, p75: 30, p90: 39,
    sources: 0, freelance: [24, 30],
    meta: { soc: "27-4021", blsP50: 20.44, tier: "Junior", vintage: "May 2024 (BLS)" },
  },
  "Photographer|National|Mid": {
    p25: 29, p50: 35, p75: 43, p90: 55,
    sources: 0, freelance: [35, 43],
    meta: { soc: "27-4021", blsP50: 20.44, tier: "Mid", vintage: "May 2024 (BLS)" },
  },
  "Photographer|National|Senior": {
    p25: 40, p50: 49, p75: 60, p90: 77,
    sources: 0, freelance: [49, 60],
    meta: { soc: "27-4021", blsP50: 20.44, tier: "Senior", vintage: "May 2024 (BLS)" },
  },

  // Copywriter (SOC 27-3043 · BLS P50 = $34.74/hr)
  "Copywriter|National|Junior": {
    p25: 34, p50: 41, p75: 51, p90: 66,
    sources: 0, freelance: [41, 51],
    meta: { soc: "27-3043", blsP50: 34.74, tier: "Junior", vintage: "May 2024 (BLS)" },
  },
  "Copywriter|National|Mid": {
    p25: 49, p50: 59, p75: 73, p90: 94,
    sources: 0, freelance: [59, 73],
    meta: { soc: "27-3043", blsP50: 34.74, tier: "Mid", vintage: "May 2024 (BLS)" },
  },
  "Copywriter|National|Senior": {
    p25: 68, p50: 83, p75: 102, p90: 131,
    sources: 0, freelance: [83, 102],
    meta: { soc: "27-3043", blsP50: 34.74, tier: "Senior", vintage: "May 2024 (BLS)" },
  },
};

export const skills = [
  "UX Designer",
  "React Developer",
  "Brand Designer",
  "Photographer",
  "Copywriter",
] as const;

export const citiesBySkill: Record<string, string[]> = {
  "UX Designer": ["National"],
  "React Developer": ["National"],
  "Brand Designer": ["National"],
  "Photographer": ["National"],
  "Copywriter": ["National"],
};

export const tiers = ["Junior", "Mid", "Senior"] as const;

/**
 * Compute approximate percentile for a given rate within a benchmark cell.
 * Linear interpolation between P25/P50/P75/P90. Returns 1–99.
 */
export function computePercentile(rate: number, cell: BenchmarkCell): number {
  const { p25, p50, p75, p90 } = cell;
  if (rate <= 0) return 1;
  if (rate <= p25) return Math.max(5, Math.round(25 * (rate / p25)));
  if (rate <= p50) return Math.round(25 + 25 * ((rate - p25) / (p50 - p25)));
  if (rate <= p75) return Math.round(50 + 25 * ((rate - p50) / (p75 - p50)));
  if (rate <= p90) return Math.round(75 + 15 * ((rate - p75) / (p90 - p75)));
  return Math.min(99, Math.round(90 + 9 * ((rate - p90) / p90)));
}

/**
 * Convert a non-hourly rate to an hourly equivalent (rough heuristic).
 * Used for percentile lookup since BLS data is hourly.
 */
export function normalizeRateToHourly(amount: number, unit: string): number {
  switch (unit) {
    case "hourly":   return amount;
    case "daily":    return amount / 8;
    case "project":  return amount / 40;
    case "retainer": return amount / 160;
    default:         return amount;
  }
}

/** Get a benchmark cell by (skill, tier). City is always "National" for v1. */
export function getBenchmark(skill: string, tier: string): BenchmarkCell | null {
  return benchmarks[`${skill}|National|${tier}`] ?? null;
}

// =============================================================================
// Full skill taxonomy — used by /contribute form and API validation.
// =============================================================================

export type SkillOption = {
  label: string;
  socCode: string;
  hasBenchmark: boolean;
};

export const SKILL_GROUPS: Record<string, SkillOption[]> = {
  "Design & Creative": [
    { label: "UX Designer",                             socCode: "15-1255", hasBenchmark: true  },
    { label: "UI Designer",                             socCode: "15-1255", hasBenchmark: false },
    { label: "Product Designer",                        socCode: "15-1255", hasBenchmark: false },
    { label: "UX Researcher",                           socCode: "15-1255", hasBenchmark: false },
    { label: "Brand Designer",                          socCode: "27-1024", hasBenchmark: true  },
    { label: "Graphic Designer",                        socCode: "27-1024", hasBenchmark: false },
    { label: "Visual Designer",                         socCode: "27-1024", hasBenchmark: false },
    { label: "Illustrator",                             socCode: "27-1013", hasBenchmark: false },
    { label: "Motion Designer / Animator",              socCode: "27-1014", hasBenchmark: false },
    { label: "Industrial / Product Designer (physical)",socCode: "27-1021", hasBenchmark: false },
    { label: "Interior Designer",                       socCode: "27-1025", hasBenchmark: false },
  ],
  "Development & Engineering": [
    { label: "React Developer",                         socCode: "15-1252", hasBenchmark: true  },
    { label: "Frontend Developer (other)",              socCode: "15-1252", hasBenchmark: false },
    { label: "Backend Developer",                       socCode: "15-1252", hasBenchmark: false },
    { label: "Full-stack Developer",                    socCode: "15-1252", hasBenchmark: false },
    { label: "Mobile Developer (iOS/Android)",          socCode: "15-1252", hasBenchmark: false },
    { label: "WordPress / Webflow / Shopify Developer", socCode: "15-1252", hasBenchmark: false },
    { label: "Data Scientist / ML Engineer",            socCode: "15-2051", hasBenchmark: false },
    { label: "Data Engineer",                           socCode: "15-2051", hasBenchmark: false },
    { label: "DevOps / SRE",                            socCode: "15-1244", hasBenchmark: false },
    { label: "QA / Test Automation",                    socCode: "15-1253", hasBenchmark: false },
    { label: "Cybersecurity / Pen Tester",              socCode: "15-1212", hasBenchmark: false },
  ],
  "Writing & Content": [
    { label: "Copywriter",                              socCode: "27-3043", hasBenchmark: true  },
    { label: "Content Writer / Blog Writer",            socCode: "27-3043", hasBenchmark: false },
    { label: "Technical Writer",                        socCode: "27-3042", hasBenchmark: false },
    { label: "Editor / Proofreader",                    socCode: "27-3041", hasBenchmark: false },
    { label: "Ghostwriter",                             socCode: "27-3043", hasBenchmark: false },
    { label: "Translator / Interpreter",                socCode: "27-3091", hasBenchmark: false },
  ],
  "Marketing & Strategy": [
    { label: "Brand Strategist",                        socCode: "13-1161", hasBenchmark: false },
    { label: "Marketing Strategist",                    socCode: "13-1161", hasBenchmark: false },
    { label: "Growth Marketer",                         socCode: "13-1161", hasBenchmark: false },
    { label: "SEO Specialist",                          socCode: "13-1161", hasBenchmark: false },
    { label: "Performance / Paid Ads",                  socCode: "13-1161", hasBenchmark: false },
    { label: "Social Media Manager",                    socCode: "13-1161", hasBenchmark: false },
    { label: "Email Marketer",                          socCode: "13-1161", hasBenchmark: false },
  ],
  "Visual & Production": [
    { label: "Photographer",                            socCode: "27-4021", hasBenchmark: true  },
    { label: "Videographer / Video Editor",             socCode: "27-4032", hasBenchmark: false },
    { label: "Cinematographer",                         socCode: "27-4031", hasBenchmark: false },
    { label: "Voice-Over Artist",                       socCode: "27-2012", hasBenchmark: false },
    { label: "Audio / Sound Engineer",                  socCode: "27-4014", hasBenchmark: false },
  ],
  "Business & Operations": [
    { label: "Business / Operations Consultant",        socCode: "13-1111", hasBenchmark: false },
    { label: "Project Manager",                         socCode: "13-1082", hasBenchmark: false },
    { label: "Product Manager",                         socCode: "11-2021", hasBenchmark: false },
    { label: "Virtual / Executive Assistant",           socCode: "43-6011", hasBenchmark: false },
  ],
};

/** Flat list of all valid skill labels (for server-side validation). */
export const ALL_SKILL_LABELS: string[] = Object.values(SKILL_GROUPS).flat().map(s => s.label);

/** Look up SOC code by skill label. Returns null for unknown or custom labels. */
export function socCodeForSkill(label: string): string | null {
  for (const group of Object.values(SKILL_GROUPS)) {
    const hit = group.find(s => s.label === label);
    if (hit) return hit.socCode;
  }
  return null;
}

/** True if this skill has a BLS-anchored benchmark cell available. */
export function hasBenchmark(label: string): boolean {
  for (const group of Object.values(SKILL_GROUPS)) {
    const hit = group.find(s => s.label === label);
    if (hit) return hit.hasBenchmark;
  }
  return false;
}
