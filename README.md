# Pawaflux — Nigeria Energy Intelligence Dashboard

Real-time and historical intelligence platform tracking Nigeria's power grid,
gas supply, DISCO performance, and monthly energy caps.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
npm run build
npm run preview
```

Output goes to `dist/` — deployable to Vercel, Netlify, GitHub Pages, or any static host.

## Stack

- React 18 + Vite
- Recharts (all charts)
- No CSS framework — all styling is inline JS objects (single-file component)
- No backend — all data is currently hardcoded from manually-extracted NERC/NISO/Seplat sources (see below)

## Project structure

```
pawaflux-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx                 # React entry point
    └── PawafluxDashboard.jsx    # entire app — sidebar, all 7 sections, all data
```

## Dashboard sections (sidebar nav)

| Section | id | What it shows |
|---|---|---|
| Live Grid | `live` | Real-time NISO-style snapshot, generation trend, plant status, DISCO table, alerts |
| Map View | `map` | Nigeria SVG map, DISCO territories colour-coded by ATC&C loss, ranked list |
| Drill Down | `drilldown` | Filtered plant/DISCO/alert detail based on active filter bar selection |
| Analytics | `analytics` | ATC&C loss timeline, gas supply breakdown, remittance vs invoice charts |
| Energy Caps | `may2026` | NERC monthly energy cap tracker, April–August 2026, all 11 DISCOs |
| Reliability | `reliability` | Ikeja Electric fault log — 1,572 entries, Dec 2021–Aug 2026, by year/BU/category |
| Export | `export` | CSV / JSON / text report generation, scheduling UI, export history |
| Alert Config | `alertconfig` | Configurable threshold-based alert rules, delivery channels, quiet hours |

## Data provenance — IMPORTANT, read before adding new data

All data in this dashboard was manually extracted from uploaded NERC, NISO,
and Seplat source documents (PDFs and OCR'd markdown). None of it is live —
there is no backend or scraper wired up yet. Every figure traces back to a
specific uploaded file. This section is the source of truth for what has
been extracted so far, to avoid re-deriving or contradicting prior numbers.

### 0. Nigeria Power Gap panel (Live Grid section, top banner)

Lives in: inline constants `installedCap` (13,625 MW), `gridPeak` (5,801.84 MW),
and `afdbDemandEst` (20,000 MW) inside `SectionLive()`.

- **Current generation** — live dispatch figure, same number used everywhere
  else in the dashboard.
- **Installed capacity** — 13,625 MW. This is **NERC's own published figure**
  for total grid-connected generation capacity (published monthly) — this is
  the primary, fully government-sourced benchmark used for the headline gap
  calculation, `(installedCap - liveGW) / installedCap`.
- **Historical grid peak** — 5,801.84 MW, TCN's confirmed wheeling record set
  4 March 2025. A real, sourced figure.
- **Est. national demand** — ~20,000 MW. This is **not** a NERC figure —
  it is an African Development Bank (AfDB) estimate, cited during reviews of
  the Federal Ministry of Power's Nigeria Integrated Resource Plan (NIRP
  2024). It is shown on the panel for context only and is explicitly
  attributed to AfDB, not folded into the headline gap number. Nigeria does
  not currently publish a live, metered national demand figure from any
  government agency.
- The dashboard displays a methodology footnote directly under the chart
  stating all of the above — do not remove or blur that attribution if you
  edit this panel. If a genuine NERC/FMoP demand forecast number becomes
  available (e.g. a specific figure from the NIRP document itself, which
  contains demand-forecast charts but no single headline number found
  during research), swap `afdbDemandEst` for it and update the citation.

### 1. NERC Monthly Energy Caps (feeder-level, Order NERC/307/2022)

Tracks median feeder-level kWh cap per DISCO, month over month. Data lives in
`mayCaps2026` and `capTrend` arrays near the top of `PawafluxDashboard.jsx`.

| Month uploaded | Based on consumption in | DISCOs covered | Notes |
|---|---|---|---|
| April 2026 | March 2026 | 11/11 | Full baseline, all DISCOs |
| May 2026 | April 2026 | 7/11 | JED, EEDC, EKEDP, IE missing/unreadable |
| June 2026 | May 2026 | 8/11 | AEDC extracted for first time (high confidence, n=570); EEDC still unreadable |
| July 2026 | June 2026 | 9/11 | KAEDC not uploaded this round (marked "PEND", June value carried forward) |
| August 2026 | July 2026 | 11/11 | **First month all 11 DISCOs have a reading.** KAEDC returned. BEDC shows a +148.2% anomaly (n=15, flagged as likely OCR noise — verify before reporting) |

Each DISCO entry carries a `conf` field (`high`/`med`/`low`/`none`) based on
OCR sample size (row count extracted from the source file):
- `high` = 50+ rows extracted
- `med` = 15–49 rows
- `low` = 5–14 rows
- `none` = under 5 rows — treat as provisional/unreliable

**When adding a new month:** extend each object in `mayCaps2026` with the new
month's median + confidence, and update `capTrend` (currently shows most
recent 3 months only, to keep the bar chart readable). Do not overwrite prior
months' values — the whole point of this array is the historical trend.

### 2. NERC Quarterly Reports (Q1 2024 – Q4 2025)

Source: NERC quarterly performance reports (Excel extracts).
Lives in: `quarterlyGen`, `atcLossTimeline` arrays.

- Generation performance (installed/available/dispatched MW, load factor) — Q4'23 through Q4'25
- System collapse log — 2 events in 2025 (Sept + Dec), 5 events in Q4 2024, 2 events Q1 2024
- ATC&C losses per DISCO — full quarterly timeline Q1'24–Q4'25 (Port Harcourt/Yola missing Q1'25)
- DISCO remittance — Q4'25 has full per-DISCO breakdown; other quarters aggregate only

### 3. NERC Annual Report 2024

- Plant Availability Factor (PAF) — all 28 grid-connected plants, full year 2024
- Tariff table — cost-reflective vs allowed tariff, all 11 DISCOs, FGN subsidy ₦1.94 trillion total

### 4. Seplat Energy FY2025 Results

- Gas production by asset (OML West, SEPNU Offshore, Oso-BRT) — quarterly 2025
- 172 MMscfd total FY2025, +55% YoY
- 2026 guidance: +30% YoY, ANOH first gas Jan 2026, Oso-BRT Phase 1 target Q3 2026

### 5. Ikeja Electric Network Fault Log (Dec 2021 – Aug 2026)

Source: `Ikeja_electric_log_outage.docx` — IE's internal/public network fault
notification log. Lives in: `ieFaultsByYear`, `ieFaultsByBU`,
`ieFaultCategories`, `ieTopUndertakings` arrays. Dashboard section: **Reliability**.

- 1,572 dated fault/outage notification entries, all verified to sum
  consistently across three independent breakdowns (by year, by business
  unit, by category) — each totals exactly 1,572.
- Covers 6 IE business units: Shomolu, Abule-Egba, Ikeja, Akowonjo, Oshodi, Ikorodu
- **Important limitation:** this is a notification log, not a duration
  record. It has no restoration timestamps, so it cannot produce SAIDI/SAIFI
  (industry-standard average outage duration/frequency indices). It's good
  for frequency, geography, and category signal — not for "how long was the
  power off" style metrics.
- 2021 data is partial (log starts Dec 2021, and only Shomolu/Abule-Egba have
  any 2021 entries — 13 and 24 respectively). 2026 is partial (through Aug).
- Ikorodu shows zero logged entries before 2023 — read as a likely
  logging/reporting gap for that business unit, not literally zero faults.
- Fault categories were assigned by this project via keyword-matching on the
  fault description text (e.g. "TRANSFORMER" → Transformer Fault, "TCN" →
  TCN/Upstream Transmission). "CNN / Customer Notification" (19.9% of
  entries) is IE's own internal term seen in the log — its exact definition
  (planned notice vs. fault) was not confirmed against IE documentation, so
  it's presented as-is rather than reclassified.
- This module is **Ikeja Electric only** — it does not extend to the other
  10 DISCOs, which have no equivalent fault log uploaded.

### 6. NERC Factsheet (November 2023, image)

- One-time snapshot: metering rate 44.23%, complaint categories (62.23% load shedding)
- Not part of an ongoing series — no comparable later data uploaded

### What is NOT in this dataset

No fault/outage logs (beyond the system collapse log above), no customer
payment records, no customer satisfaction/complaint feed beyond the single
Nov 2023 snapshot. If these become available, they'd be genuinely new
modules, not extensions of existing arrays.

## Branding

- Name: **Pawaflux** (formerly "Wattlens" during early development — fully renamed)
- Colours: Deep Teal `#0F5C5E`, Burnt Orange `#E66A1A`, Aqua Cyan `#27C7C7`,
  background `#040E12` (dashboard is dark-mode by design)
- Logo: embedded as a base64 PNG (`PAWAFLUX_LOGO_B64` constant near the top
  of `PawafluxDashboard.jsx`) — this is the actual uploaded logo artwork with
  its white background stripped to transparent, not a recreation.

## Known limitations / next steps

- All data is static/hardcoded — no live scraper or backend yet (see project
  chat history for the NISO live-feed scraper architecture plan: Railway +
  Supabase)
- EEDC, EKEDP, IE, JED energy cap readings remain low/no-confidence due to
  poor source OCR quality — re-upload cleaner files when available
- Export functions generate real downloadable files (CSV/JSON/TXT) client-side
- Alert rules in the Alert Config section are UI-only — no actual delivery
  wiring (WhatsApp/email/SMS) yet
