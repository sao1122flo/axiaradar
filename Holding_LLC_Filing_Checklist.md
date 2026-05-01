# Cordillera Ventures LLC — Filing Checklist (Delaware)
**Owner:** Sergio Ordonez (sole member, non-US resident)
**Entity:** Cordillera Ventures LLC — Delaware single-member LLC
**Portfolio:** Flo (miflo.co), Axia Radar (axiaradar.com)
**Banking target:** Mercury
**Last updated:** 2026-05-01

> **Not legal or tax advice.** For a non-US founder, the Form 5472 / 1120 obligation alone makes it worth a one-time consult with a CPA familiar with foreign-owned US LLCs (typical fee: $300–$800/yr to file).

---

## Where you are now

| Decision | Status |
|---|---|
| State of formation | ✅ Delaware |
| Entity name | ✅ Cordillera Ventures LLC (confirmed available) |
| Member structure | ✅ Single-member, owned by Sergio Ordonez |
| Tax classification | ✅ Disregarded entity (default) |
| Filing path | ⏳ Atlas vs DIY — pending |
| Registered agent | ⏳ Pending |
| US business address | ⏳ Florida virtual mailbox — provider TBD |
| US phone (optional) | ⏳ Pending |

---

## Phase 1 — Pre-filing decisions still open

- [ ] **Choose filing path.** Atlas (~$500, bundled) or DIY ($90 state fee + your own registered agent + your own Mercury application). Both end in the same place.
- [ ] **Pick a Delaware registered agent.** Required. If using Atlas, it provides one for the first year. If DIY, common choices:
  - Northwest Registered Agent — ~$125/yr, includes scanned mail forwarding
  - Harbor Compliance — ~$99/yr
  - Registered Agents Inc. — ~$50/yr (cheapest, fewer perks)
- [ ] **Pick a Florida virtual mailing address.** Used for Mercury, IRS, vendors. Avoid PO boxes, UPS Store, and the registered agent's address.
  - iPostal1 — $9.99–$19.99/mo, Miami / Tampa / Orlando options
  - Anytime Mailbox — $9.99–$29.99/mo, large FL network
  - Earth Class Mail — $19/mo+, better mail OCR
  - Stable (Atlas partner) — ~$25/mo, bundled if you stay in Atlas
- [ ] **(Optional) US phone number.** Not required by Mercury, but smooths form-filling.
  - Google Voice — free if you can verify with any US number once
  - OpenPhone — ~$15/mo, real US number for the business

## Phase 2 — Form the Delaware LLC

- [ ] **File Certificate of Formation** with the Delaware Division of Corporations
  - Online: <https://corp.delaware.gov> → Document Upload Service
  - Filing fee: **$90**
  - Processing: same-day or 1–2 business days online
  - Required fields: entity name, registered agent name + DE street address (your agent provides this)
  - Note: Delaware does NOT require listing the member's name on the Certificate. Privacy preserved.
- [ ] **Save the filed Certificate of Formation PDF** — needed for EIN, banking, and partner onboarding
- [ ] **Sign your Operating Agreement.** Even single-member LLCs need one. Mercury and most banks ask for it. (I can draft this — Delaware single-member version with your name and the portfolio language already keyed in.)

## Phase 3 — Get the EIN (the slow step for non-US founders)

You don't have a US SSN, so the online IRS portal is unavailable. Two paths:

- [ ] **Path A — Fax SS-4 to the IRS** (most predictable)
  - Download Form SS-4: <https://www.irs.gov/forms-pubs/about-form-ss-4>
  - Box 7b ("SSN, ITIN, or EIN of responsible party"): write **"Foreign"**
  - Box 4 (mailing): your Florida virtual address
  - Box 6 (county and state): the FL county for your virtual mailbox + "FL"
  - Sign it. Fax to: **+1-855-215-1627**
  - Turnaround: **4–10 business days**, sometimes longer in tax season
- [ ] **Path B — Phone the IRS** (faster when it works)
  - Call **+1-267-941-1099** (international EIN line, not toll-free; Mon–Fri 6am–11pm ET)
  - Have your filed Certificate of Formation in front of you
  - They issue the EIN on the call
- [ ] **Save the CP575 confirmation letter** that arrives by mail (or request a 147c if you ever lose it). Mercury and Stripe both want this.

## Phase 4 — Open a US business bank account (Mercury)

- [ ] **Apply at <https://mercury.com>** — fully remote, no US visit needed
- [ ] **Documents you'll upload:**
  - Filed Delaware Certificate of Formation
  - EIN confirmation (CP575 / 147c / signed SS-4)
  - Your passport
  - Operating Agreement
  - Florida virtual business address (with suite number)
  - Your foreign residential address (for KYC)
  - Email + phone (foreign phone is fine)
- [ ] **Country eligibility:** confirm you're not on the [Mercury blocked-country list](https://support.mercury.com/hc/en-us/articles/28770467511060-Eligibility) before applying
- [ ] **Typical decision:** 1–3 business days
- [ ] **Backup options if Mercury declines:**
  - Relay (<https://relayfi.com>)
  - Wise Business (<https://wise.com/business>) — strong for multi-currency / LatAm transactions, useful for Flo
  - Brex — usually requires funded startup status; skip

## Phase 5 — Move Flo and Axia Radar into the LLC

The LLC only protects assets it actually owns. For each business:

- [ ] **Transfer the domain registrant.** In your registrar (likely Namecheap / GoDaddy / Cloudflare), change the owner field to "Cordillera Ventures LLC" with the EIN. Keep yourself as admin contact.
- [ ] **Move payment processing.** Either open new Stripe accounts under Cordillera Ventures LLC + EIN, or update existing accounts' legal entity through Stripe support. Stripe accepts the change with the filed Certificate of Formation.
- [ ] **Update customer-facing terms / privacy policies** to reference Cordillera Ventures LLC.
- [ ] **Sign an IP assignment** transferring all trademarks, copyrights, codebases, branding, and customer data from Sergio Ordonez (individual) to Cordillera Ventures LLC. (I can draft this — single page, covers both brands.)
- [ ] **Reassign material contracts.** Hosting, contractor agreements, vendor agreements — re-signed by Cordillera Ventures LLC or assigned via a one-page assignment.
- [ ] **(Optional) File DBAs.** Delaware DBAs are filed at the county level (not state level); fee ~$25 per county. Lets each brand sign contracts and accept payments under its trade name. Less critical if Stripe accounts are set up under each brand name already.

## Phase 6 — Ongoing compliance (the items with $25K penalties)

- [ ] **Federal: Form 5472 + pro-forma Form 1120**, every year. Required for any foreign-owned single-member US LLC. Even with **$0 revenue**. Penalty for non-filing or late filing: **$25,000 per occurrence**. Due **April 15** (or with extension). This is the single best reason to hire a CPA familiar with foreign-owned LLCs.
- [ ] **Delaware franchise tax:** **$300 flat, due June 1 every year.** Paid online at <https://corp.delaware.gov/paytaxes/>. Late penalty: $200 + 1.5% interest per month.
- [ ] **No Delaware annual report for LLCs** (this is corporations only — your LLC is exempt).
- [ ] **FinCEN BOI reporting:** As of March 2025, US-formed LLCs (including foreign-owned ones) are **exempt** from BOI reporting. No action required. Reconfirm before each year-end in case rules change.
- [ ] **Registered agent renewal.** Your agent will email ~30 days before. Failure to maintain causes administrative dissolution.
- [ ] **State nexus check.** Florida virtual mailbox alone typically does NOT trigger Florida foreign-qualification, but if you ever take on a real Florida presence (employees, office, FL-based contractors), revisit with a CPA.

---

## Cost summary (Delaware-only, locked in)

| Item | One-time | Recurring |
|---|---|---|
| Delaware filing fee | $90 | — |
| Delaware franchise tax | — | $300/yr (June 1) |
| Registered agent | — | $100–$125/yr |
| Florida virtual mailing address | — | $120–$300/yr |
| EIN application | $0 | — |
| Mercury bank account | $0 | $0 |
| CPA — Form 5472/1120 | — | $300–$800/yr |
| **Year 1 total** | | **~$910–$1,440** |
| **Recurring annual** | | **~$820–$1,425** |

Cost arithmetic vs Atlas:
- DIY: state fee $90 + reg agent $125 + mailbox $200/yr ≈ **$415 first year**, then ~$325/yr
- Atlas: ~$500 (includes formation + 1 yr reg agent) + your own mailbox + ~$125/yr reg agent from year 2 onward ≈ **$525 first year**, then ~$325/yr
- The premium for Atlas is roughly **$110 net** in year 1 and **identical from year 2 onward**. Atlas saves time, not money.

---

## What I can draft next

Just say the word:

1. **Single-member Operating Agreement (Delaware version)** — preamble already drafted; I'll produce the full ~10-page agreement
2. **IP & asset assignment** transferring Flo and Axia Radar from Sergio Ordonez to Cordillera Ventures LLC (one page, signed by you in both capacities)
3. **Form SS-4 pre-filled** for fax to the IRS — ready to print, sign, fax
4. **Mercury application packet** — list of every doc you'll need to upload with notes on each
5. **Realistic timeline** — week-by-week sequence from "click File" to "Mercury account live and Flo + Axia transferred"

---

## Sources
- [FinCEN — BOI exemption for US companies](https://www.fincen.gov/news/news-releases/fincen-removes-beneficial-ownership-reporting-requirements-us-companies-and-us)
- [Delaware LLC franchise tax](https://corp.delaware.gov/paytaxes/)
- [Mercury eligibility](https://support.mercury.com/hc/en-us/articles/28770467511060-Eligibility)
- [IRS Form SS-4](https://www.irs.gov/forms-pubs/about-form-ss-4)
