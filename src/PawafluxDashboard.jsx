import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea,
  Cell, LabelList, PieChart, Pie
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg:         "#040E12",
  bgDeep:     "#020B0E",
  card:       "#081419",
  card2:      "#091A20",
  border:     "rgba(39,199,199,0.08)",
  borderHi:   "rgba(39,199,199,0.18)",
  cyan:       "#27C7C7",
  cyanDim:    "rgba(39,199,199,0.12)",
  orange:     "#E66A1A",
  orangeDim:  "rgba(230,106,26,0.12)",
  orangeGlow: "rgba(230,106,26,0.3)",
  green:      "#1DB954",
  greenDim:   "rgba(29,185,84,0.1)",
  red:        "#E53935",
  redDim:     "rgba(229,57,53,0.1)",
  amber:      "#FFA726",
  amberDim:   "rgba(255,167,38,0.1)",
  purple:     "#9C6FE4",
  t1:         "#EAF4F6",
  t2:         "#7AA4AE",
  t3:         "#35606A",
  mono:       "'Courier Prime','Courier New',monospace",
  ui:         "'Trebuchet MS','Segoe UI',sans-serif",
};

/* ═══════════════════════════════════════════════════════════
   PAWAFLUX LOGO MARK — inline SVG, fully transparent background
   Hexagon circuit-node ring (teal) + lightning bolt (orange)
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   ORIGINAL PAWAFLUX LOGO — inline base64, background removed
═══════════════════════════════════════════════════════════ */
const PAWAFLUX_LOGO_B64 = "data:image/png;base64,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";

function PawafluxMark({ size = 34 }) {
  const teal = "#0F5C5E";
  const orange = "#E66A1A";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display:"block", background:"transparent" }}>
      {/* circuit ring — 6 corner nodes + branch nodes, teal solid / orange dashed alternating */}
      <g fill="none" stroke={teal} strokeWidth="3.2" strokeLinecap="round">
        {/* top node stem */}
        <line x1="60" y1="8"  x2="60" y2="24"/>
        <circle cx="60" cy="8" r="5" fill={teal}/>
        <circle cx="60" cy="26" r="4.5" fill={teal}/>
        {/* bottom node stem */}
        <line x1="60" y1="96" x2="60" y2="112"/>
        <circle cx="60" cy="112" r="5" fill={teal}/>
        <circle cx="60" cy="94" r="4.5" fill={teal}/>
        {/* upper-left branch */}
        <line x1="26" y1="45" x2="41" y2="34"/>
        <circle cx="24" cy="46" r="4.5" fill={teal}/>
        <line x1="24" y1="46" x2="14" y2="46"/>
        <circle cx="12" cy="46" r="4" fill={teal}/>
        <circle cx="41" cy="33" r="4.5" fill={teal}/>
        {/* upper-right branch */}
        <line x1="94" y1="45" x2="79" y2="34"/>
        <circle cx="96" cy="46" r="4.5" fill={teal}/>
        <line x1="96" y1="46" x2="106" y2="46"/>
        <circle cx="108" cy="46" r="4" fill={teal}/>
        <circle cx="79" cy="33" r="4.5" fill={teal}/>
        {/* lower-left branch */}
        <line x1="26" y1="75" x2="41" y2="86"/>
        <circle cx="24" cy="74" r="4.5" fill={teal}/>
        <line x1="24" y1="74" x2="14" y2="74"/>
        <circle cx="12" cy="74" r="4" fill={teal}/>
        <circle cx="41" cy="87" r="4.5" fill={teal}/>
        {/* lower-right branch */}
        <line x1="94" y1="75" x2="79" y2="86"/>
        <circle cx="96" cy="74" r="4.5" fill={teal}/>
        <line x1="96" y1="74" x2="106" y2="74"/>
        <circle cx="108" cy="74" r="4" fill={teal}/>
        <circle cx="79" cy="87" r="4.5" fill={teal}/>
      </g>
      {/* hexagon connectors — solid teal on left/right edges, dashed orange top/bottom-diagonal */}
      <g fill="none" strokeWidth="3.2" strokeLinecap="round">
        <line x1="60" y1="26" x2="79" y2="33" stroke={teal}/>
        <line x1="41" y1="33" x2="60" y2="26" stroke={orange} strokeDasharray="2 6"/>
        <line x1="60" y1="94" x2="79" y2="87" stroke={orange} strokeDasharray="2 6"/>
        <line x1="41" y1="87" x2="60" y2="94" stroke={teal}/>
      </g>
      {/* lightning bolt — centre */}
      <path d="M67 30 L46 66 L58 66 L52 92 L76 54 L62 54 Z" fill={orange}/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MASTER DATA STORE
═══════════════════════════════════════════════════════════ */

// All 11 DISCOs with full metadata
const DISCOS = {
  AEDC:  { name:"Abuja (AEDC)",   states:["FCT","Nasarawa"],                        loss:30.99, target:20.60, remit:100,  q4Loss:30.99, q3Loss:28.91, q2Loss:36.80, q1Loss:42.83, invoice:80.46,  paid:80.46,  tariffAllowed:101.9, tariffCRT:170.5, color:"#27C7C7" },
  BEDC:  { name:"Benin (BEDC)",   states:["Delta","Edo"],                            loss:44.50, target:20.76, remit:98.6, q4Loss:44.50, q3Loss:47.55, q2Loss:40.41, q1Loss:29.06, invoice:44.44,  paid:43.81,  tariffAllowed:102.5, tariffCRT:190.9, color:"#FF8A65" },
  EEDC:  { name:"Enugu (EEDC)",   states:["Anambra","Ebonyi"],                       loss:38.62, target:21.26, remit:100,  q4Loss:38.62, q3Loss:36.97, q2Loss:41.13, q1Loss:41.70, invoice:39.22,  paid:39.22,  tariffAllowed:101.0, tariffCRT:196.7, color:"#80DEEA" },
  EKEDP: { name:"Eko (EKEDP)",    states:["Lagos (Eko zone)"],                       loss:14.20, target:16.88, remit:100,  q4Loss:14.20, q3Loss:11.99, q2Loss:15.12, q1Loss:27.11, invoice:69.44,  paid:69.44,  tariffAllowed:101.4, tariffCRT:163.0, color:"#B9F6CA" },
  IBEDC: { name:"Ibadan (IBEDC)", states:["Kwara","Ogun","Osun","Oyo"],              loss:42.51, target:20.92, remit:95.4, q4Loss:42.51, q3Loss:43.54, q2Loss:42.64, q1Loss:34.14, invoice:54.93,  paid:52.42,  tariffAllowed:101.7, tariffCRT:172.2, color:"#A5D6A7" },
  IE:    { name:"Ikeja (IE)",     states:["Lagos (Ikeja zone)"],                     loss:16.33, target:15.93, remit:100,  q4Loss:16.33, q3Loss:5.88,  q2Loss:26.16, q1Loss:35.67, invoice:75.70,  paid:75.70,  tariffAllowed:98.6,  tariffCRT:160.8, color:"#1DB954" },
  JED:   { name:"Jos (JED)",      states:["Bauchi","Benue","Gombe"],                 loss:64.84, target:26.09, remit:49.9, q4Loss:64.84, q3Loss:59.60, q2Loss:61.76, q1Loss:62.13, invoice:23.41,  paid:11.67,  tariffAllowed:95.8,  tariffCRT:185.7, color:"#E66A1A" },
  KAEDC: { name:"Kaduna (KAEDC)", states:["Kaduna","Kebbi","Sokoto","Zamfara"],      loss:69.45, target:21.32, remit:41.5, q4Loss:69.45, q3Loss:71.10, q2Loss:70.98, q1Loss:68.57, invoice:24.32,  paid:10.08,  tariffAllowed:97.0,  tariffCRT:176.4, color:"#E53935" },
  KEDCO: { name:"Kano (KEDCO)",   states:["Jigawa","Kano","Katsina"],               loss:44.27, target:20.88, remit:76.2, q4Loss:44.27, q3Loss:42.12, q2Loss:43.78, q1Loss:49.40, invoice:22.05,  paid:16.79,  tariffAllowed:99.3,  tariffCRT:171.2, color:"#FFA726" },
  PHED:  { name:"Port Harcourt (PHED)", states:["Akwa Ibom","Bayelsa","Cross River","Rivers"], loss:33.01, target:20.42, remit:100, q4Loss:33.01, q3Loss:35.82, q2Loss:40.56, q1Loss:null, invoice:30.89, paid:30.89, tariffAllowed:100.1, tariffCRT:184.6, color:"#81D4FA" },
  YEDC:  { name:"Yola (YEDC)",    states:["Adamawa","Borno","Taraba","Yobe"],        loss:52.77, target:44.00, remit:99.6, q4Loss:52.77, q3Loss:56.65, q2Loss:66.30, q1Loss:null,  invoice:6.76,   paid:6.73,   tariffAllowed:96.8,  tariffCRT:266.6, color:"#E040FB" },
};

// Plants with DISCO assignment
const PLANTS_ALL = [
  { name:"Egbin",        disco:"EKEDP", fuel:"gas",   installed:1320, mw:641,  cap:1320, status:"on",  paf:42.3, region:"SW" },
  { name:"Kainji",       disco:"IE",    fuel:"hydro",  installed:760,  mw:402,  cap:760,  status:"on",  paf:52.6, region:"NW" },
  { name:"Azura-Edo",    disco:"BEDC",  fuel:"gas",   installed:461,  mw:390,  cap:461,  status:"on",  paf:93.7, region:"SS" },
  { name:"Delta",        disco:"BEDC",  fuel:"gas",   installed:900,  mw:314,  cap:900,  status:"on",  paf:39.0, region:"SS" },
  { name:"Jebba",        disco:"IBEDC", fuel:"hydro",  installed:578,  mw:339,  cap:578,  status:"on",  paf:65.4, region:"NW" },
  { name:"Zungeru",      disco:"AEDC",  fuel:"hydro",  installed:700,  mw:299,  cap:700,  status:"on",  paf:53.2, region:"NC" },
  { name:"Shiroro",      disco:"AEDC",  fuel:"hydro",  installed:600,  mw:289,  cap:600,  status:"low", paf:54.5, region:"NC" },
  { name:"Okpai",        disco:"PHED",  fuel:"gas",   installed:480,  mw:231,  cap:480,  status:"on",  paf:53.9, region:"SS" },
  { name:"Afam VI",      disco:"PHED",  fuel:"gas",   installed:650,  mw:240,  cap:650,  status:"low", paf:38.4, region:"SS" },
  { name:"Geregu",       disco:"AEDC",  fuel:"gas",   installed:435,  mw:0,    cap:435,  status:"off", paf:36.6, region:"NC" },
  { name:"Alaoji NIPP",  disco:"EEDC",  fuel:"gas",   installed:500,  mw:0,    cap:500,  status:"off", paf:0.01, region:"SE" },
  { name:"Sapele Steam", disco:"BEDC",  fuel:"gas",   installed:720,  mw:0,    cap:720,  status:"off", paf:11.0, region:"SS" },
  { name:"Sapele NIPP",  disco:"BEDC",  fuel:"gas",   installed:500,  mw:0,    cap:500,  status:"off", paf:6.2,  region:"SS" },
  { name:"MEPP",         disco:"PHED",  fuel:"gas",   installed:110,  mw:0,    cap:110,  status:"off", paf:32.7, region:"SS" },
  { name:"Ihovbor 2",    disco:"BEDC",  fuel:"gas",   installed:461,  mw:180,  cap:461,  status:"on",  paf:93.7, region:"SS" },
  { name:"Trans Amadi",  disco:"PHED",  fuel:"gas",   installed:100,  mw:0,    cap:100,  status:"off", paf:12.9, region:"SS" },
];

const STATES_ALL = [
  "FCT","Nasarawa","Delta","Edo","Anambra","Ebonyi","Lagos","Kwara","Ogun","Osun","Oyo",
  "Bauchi","Benue","Gombe","Kaduna","Kebbi","Sokoto","Zamfara","Jigawa","Kano","Katsina",
  "Akwa Ibom","Bayelsa","Cross River","Rivers","Adamawa","Borno","Taraba","Yobe"
];

const REGIONS = {
  "North West":  ["Jigawa","Kano","Katsina","Kaduna","Kebbi","Sokoto","Zamfara"],
  "North Central":["FCT","Nasarawa","Benue","Kogi","Niger","Plateau"],
  "North East":  ["Bauchi","Borno","Gombe","Adamawa","Taraba","Yobe"],
  "South West":  ["Lagos","Ogun","Oyo","Osun","Kwara"],
  "South South": ["Rivers","Delta","Edo","Akwa Ibom","Bayelsa","Cross River"],
  "South East":  ["Anambra","Ebonyi","Enugu","Imo","Abia"],
};

const quarterlyGen = [
  { q:"Q4'23", mw:4434, avail:4922, installed:12671, hydro:28, thermal:72, collapses:0 },
  { q:"Q1'24", mw:4070, avail:4249, installed:12671, hydro:25, thermal:75, collapses:2 },
  { q:"Q4'24", mw:4207, avail:5297, installed:13625, hydro:31, thermal:69, collapses:5 },
  { q:"Q1'25", mw:4771, avail:5367, installed:13625, hydro:30, thermal:70, collapses:0 },
  { q:"Q2'25", mw:4501, avail:5396, installed:13625, hydro:29, thermal:71, collapses:0 },
  { q:"Q3'25", mw:4179, avail:5430, installed:13625, hydro:32, thermal:68, collapses:1 },
  { q:"Q4'25", mw:4453, avail:5400, installed:13625, hydro:38, thermal:62, collapses:1 },
];

const gasSupply = [
  { q:"Q1'25", mmscfd:166.2, omlWest:129, sepnu:30, oso:7  },
  { q:"Q2'25", mmscfd:186.2, omlWest:140, sepnu:38, oso:8  },
  { q:"Q3'25", mmscfd:171.1, omlWest:125, sepnu:37, oso:9  },
  { q:"Q4'25", mmscfd:164.9, omlWest:118, sepnu:36, oso:11 },
];

/* ── ENERGY CAPS — Apr → May → Jun → Jul → Aug 2026 (NERC Order 307/2022) ── */
const mayCaps2026 = [
  { disco:"AEDC",  states:"FCT, Nasarawa",                           aprMed:null,mayMed:null,junMed:304, julMed:398, augMed:286, deltaMJ:-112, pctMJ:-28.1, trend:"DOWN", feeders:35, conf:"med"  },
  { disco:"BEDC",  states:"Delta, Edo",                              aprMed:350, mayMed:290, junMed:298, julMed:284, augMed:705, deltaMJ:421,  pctMJ:148.2, trend:"UP",   feeders:15, conf:"med"  },
  { disco:"IBEDC", states:"Kwara, Ogun, Osun, Oyo",                  aprMed:198, mayMed:198, junMed:183, julMed:200, augMed:208, deltaMJ:8,    pctMJ:4.0,   trend:"UP",   feeders:69, conf:"high" },
  { disco:"KAEDC", states:"Kaduna, Kebbi, Sokoto, Zamfara",          aprMed:148, mayMed:159, junMed:147, julMed:null,augMed:143, deltaMJ:-4,   pctMJ:-2.7,  trend:"DOWN", feeders:22, conf:"med"  },
  { disco:"KEDCO", states:"Jigawa, Kano, Katsina",                   aprMed:165, mayMed:168, junMed:166, julMed:200, augMed:186, deltaMJ:-14,  pctMJ:-7.0,  trend:"DOWN", feeders:32, conf:"med"  },
  { disco:"PHED",  states:"Akwa Ibom, Bayelsa, Cross River, Rivers", aprMed:430, mayMed:410, junMed:436, julMed:422, augMed:528, deltaMJ:106,  pctMJ:25.1,  trend:"UP",   feeders:51, conf:"high" },
  { disco:"YEDC",  states:"Adamawa, Borno, Taraba, Yobe",            aprMed:175, mayMed:192, junMed:203, julMed:231, augMed:265, deltaMJ:34,   pctMJ:14.7,  trend:"UP",   feeders:11, conf:"low"  },
  { disco:"JED",   states:"Bauchi, Benue, Gombe",                    aprMed:154, mayMed:123, junMed:null,julMed:142, augMed:158, deltaMJ:16,   pctMJ:11.3,  trend:"UP",   feeders:2,  conf:"none" },
  { disco:"EKEDP", states:"Lagos (Eko zone)",                        aprMed:null,mayMed:null,junMed:null,julMed:328, augMed:370, deltaMJ:42,   pctMJ:12.8,  trend:"UP",   feeders:1,  conf:"none" },
  { disco:"IE",    states:"Lagos (Ikeja zone)",                      aprMed:null,mayMed:null,junMed:null,julMed:573, augMed:529, deltaMJ:-44,  pctMJ:-7.7,  trend:"DOWN", feeders:7,  conf:"low"  },
  { disco:"EEDC",  states:"Anambra, Ebonyi",                         aprMed:null,mayMed:null,junMed:null,julMed:null,augMed:120, deltaMJ:null, pctMJ:null,  trend:"NEW",  feeders:1,  conf:"none" },
];

/* ── MONTHLY CAP TREND — grouped 3-month view (Jun / Jul / Aug 2026, most recent) ── */
const capTrend = [
  { disco:"PHED",  jun:436, jul:422, aug:528, color:"#81D4FA" },
  { disco:"BEDC",  jun:298, jul:284, aug:705, color:"#FF8A65" },
  { disco:"IBEDC", jun:183, jul:200, aug:208, color:"#A5D6A7" },
  { disco:"AEDC",  jun:304, jul:398, aug:286, color:"#27C7C7" },
  { disco:"KEDCO", jun:166, jul:200, aug:186, color:"#FFA726" },
  { disco:"YEDC",  jun:203, jul:231, aug:265, color:"#E040FB" },
  { disco:"KAEDC", jun:147, jul:null,aug:143, color:"#E53935" },
];

/* ═══ IKEJA ELECTRIC FAULT LOG — extracted from IE Network Fault Log (Dec 2021 – Aug 2026) ═══
   Source: Ikeja_electric_log_outage.docx — IE's public network fault notification log.
   1,572 dated fault/notification entries across 6 business units.
   NOTE: entries are fault/outage NOTIFICATIONS, not duration records — the source log
   has no restoration timestamps, so this cannot compute SAIDI/SAIFI (avg outage duration).
   It DOES give reliable frequency, geography, and category signal. 2021 and 2026 are
   partial years (log starts Dec 2021; current data runs through Aug 2026). IKORODU has
   zero entries before 2023 — likely a logging/reporting gap, not zero faults.
═══════════════════════════════════════════════════════════════════════════════════════ */
const ieFaultsByYear = [
  { year:"2021*", total:37,  note:"partial — Dec only" },
  { year:"2022",  total:308 },
  { year:"2023",  total:226 },
  { year:"2024",  total:120 },
  { year:"2025",  total:583 },
  { year:"2026*", total:298, note:"partial — through Aug" },
];

const ieFaultsByBU = [
  { bu:"Shomolu",     total:387, y2021:13, y2022:54, y2023:37, y2024:28, y2025:160, y2026:95 },
  { bu:"Abule-Egba",  total:372, y2021:24, y2022:95, y2023:42, y2024:30, y2025:138, y2026:43 },
  { bu:"Ikeja",       total:352, y2021:0,  y2022:61, y2023:54, y2024:23, y2025:143, y2026:71 },
  { bu:"Akowonjo",    total:258, y2021:0,  y2022:91, y2023:28, y2024:11, y2025:79,  y2026:49 },
  { bu:"Oshodi",      total:136, y2021:0,  y2022:7,  y2023:39, y2024:15, y2025:42,  y2026:33 },
  { bu:"Ikorodu",     total:67,  y2021:0,  y2022:0,  y2023:26, y2024:13, y2025:21,  y2026:7  },
];

const ieFaultCategories = [
  { cat:"CNN / Customer Notification", n:313, pct:19.9, color:"#27C7C7" },
  { cat:"Transformer Fault",           n:283, pct:18.0, color:"#E53935" },
  { cat:"Outage Notification",         n:282, pct:17.9, color:"#FFA726" },
  { cat:"Other / Unclassified",        n:369, pct:23.5, color:"#7AA4AE" },
  { cat:"TCN / Upstream Transmission", n:88,  pct:5.6,  color:"#9C6FE4" },
  { cat:"Planned Maintenance",         n:75,  pct:4.8,  color:"#1DB954" },
  { cat:"Feeder Fault",                n:52,  pct:3.3,  color:"#E66A1A" },
  { cat:"Prolonged Outage",            n:41,  pct:2.6,  color:"#FF8A65" },
  { cat:"Cable Fault",                 n:24,  pct:1.5,  color:"#5bb8d0" },
  { cat:"Vandalism / Theft",           n:24,  pct:1.5,  color:"#e040fb" },
  { cat:"Burnt Cable/Equipment",       n:18,  pct:1.1,  color:"#FF6B6B" },
  { cat:"Request/Approval (admin)",    n:3,   pct:0.2,  color:"#35606A" },
];

const ieTopUndertakings = [
  { name:"PTC",     n:134 }, { name:"Iju",     n:118 }, { name:"Oworo",   n:106 },
  { name:"Fagba",   n:70  }, { name:"Igbobi",  n:64  }, { name:"Ijaiye",  n:64  },
  { name:"Akute",   n:62  }, { name:"Magodo",  n:60  }, { name:"Ayobo",   n:57  },
  { name:"Abule",   n:53  }, { name:"Egbeda",  n:50  }, { name:"Ilupeju", n:47  },
];



const atcLossTimeline = [
  { p:"Q1'24", Abuja:36.98, Benin:35.17, Eko:22.61, Enugu:35.61, Ibadan:42.02, Ikeja:15.81, Jos:53.76, Kaduna:59.96, Kano:52.73, PH:37.39  },
  { p:"Q4'24", Abuja:40.43, Benin:29.47, Eko:19.72, Enugu:41.35, Ibadan:30.30, Ikeja:30.25, Jos:59.74, Kaduna:60.65, Kano:52.55, PH:34.58  },
  { p:"Q1'25", Abuja:42.83, Benin:29.06, Eko:27.11, Enugu:41.70, Ibadan:34.14, Ikeja:35.67, Jos:62.13, Kaduna:68.57, Kano:49.40, PH:null   },
  { p:"Q2'25", Abuja:36.80, Benin:40.41, Eko:15.12, Enugu:41.13, Ibadan:42.64, Ikeja:26.16, Jos:61.76, Kaduna:70.98, Kano:43.78, PH:40.56  },
  { p:"Q3'25", Abuja:28.91, Benin:47.55, Eko:11.99, Enugu:36.97, Ibadan:43.54, Ikeja:5.88,  Jos:59.60, Kaduna:71.10, Kano:42.12, PH:35.82  },
  { p:"Q4'25", Abuja:30.99, Benin:44.50, Eko:14.20, Enugu:38.62, Ibadan:42.51, Ikeja:16.33, Jos:64.84, Kaduna:69.45, Kano:44.27, PH:33.01  },
];

const ALERTS_ALL = [
  { id:1, type:"critical", disco:"KAEDC", state:"Kaduna",  title:"15 plants offline — gas constraint",       body:"Sapele Steam, Alaoji NIPP, Geregu offline. South-South at risk.", time:"14:32", region:"NW" },
  { id:2, type:"warning",  disco:"KAEDC", state:"Kaduna",  title:"Kaduna remittance critical — 41.5%",       body:"₦14.24B outstanding Q4 2025. Chronic defaulter pattern continues.", time:"12:15", region:"NW" },
  { id:3, type:"warning",  disco:"AEDC",  state:"FCT",     title:"Frequency deviation — 49.38 Hz",           body:"Below 49.75 Hz lower bound. Monitor Shiroro dispatch.", time:"11:04", region:"NC" },
  { id:4, type:"info",     disco:"ALL",   state:"All",     title:"Seplat ANOH Phase 1 first gas confirmed",   body:"+30% YoY supply trajectory. Oso-BRT Phase 1 Q3 2026.", time:"09:00", region:"ALL" },
  { id:5, type:"critical", disco:"JED",   state:"Bauchi",  title:"Jos DisCo remittance at 49.9%",            body:"₦11.74B unpaid to market. Enforcement action pending.", time:"08:30", region:"NE" },
  { id:6, type:"warning",  disco:"BEDC",  state:"Edo",     title:"Benin ATC&C rising — Q3 spike 47.55%",     body:"Loss rate deteriorating. Distribution infrastructure audit flagged.", time:"07:45", region:"SS" },
];

/* ═══════════════════════════════════════════════════════════
   NIGERIA SVG MAP  (simplified territorial paths)
═══════════════════════════════════════════════════════════ */
// DISCO territory outlines — approximate SVG paths scaled to 520x480 viewBox
const NIGERIA_OUTER_PATH = "M242.1,27.3 L232.8,18.2 L226.9,15.3 L220.7,14.0 L214.6,14.8 L178.4,0.2 L156.6,9.1 L131.5,7.7 L112.4,11.5 L97.5,24.1 L91.8,26.3 L90.8,38.4 L92.9,42.7 L96.2,43.0 L90.8,42.7 L89.8,51.5 L81.8,67.0 L62.4,84.9 L60.0,110.4 L61.9,119.0 L59.4,126.7 L62.9,134.2 L57.1,140.6 L52.8,157.7 L53.7,165.4 L60.5,171.2 L75.9,177.6 L65.0,173.9 L67.9,183.4 L68.2,194.6 L73.4,204.3 L70.6,215.4 L62.7,216.4 L57.5,226.1 L62.6,234.9 L72.6,235.3 L62.4,236.4 L55.9,249.6 L42.5,255.8 L42.5,262.8 L37.0,266.8 L29.1,279.9 L30.5,287.7 L28.5,294.9 L24.6,301.1 L9.8,302.9 L4.6,322.1 L6.5,334.9 L7.5,334.6 L5.4,335.9 L3.1,344.7 L2.4,350.0 L4.8,354.8 L4.7,359.9 L1.0,375.4 L5.3,397.8 L8.3,402.6 L5.3,405.9 L7.4,427.9 L3.8,431.6 L5.4,436.2 L4.7,442.0 L6.9,446.1 L3.7,461.6 L7.4,463.7 L12.6,462.6 L8.9,464.0 L3.4,463.6 L3.0,469.2 L44.6,468.5 L48.3,466.8 L73.6,465.8 L104.0,469.3 L115.9,473.2 L115.5,474.4 L131.4,487.1 L145.0,501.6 L145.5,500.4 L147.6,506.5 L161.5,499.5 L150.7,505.3 L150.6,511.8 L154.8,517.2 L161.0,516.3 L164.4,511.6 L164.0,515.5 L169.6,516.1 L167.0,519.8 L162.4,517.9 L156.4,519.1 L156.9,524.6 L162.4,528.7 L169.0,530.6 L169.6,526.8 L174.3,528.9 L177.4,522.8 L183.8,521.6 L178.9,524.2 L176.4,527.8 L180.3,531.7 L176.9,529.7 L176.0,532.3 L164.9,532.2 L167.7,545.1 L172.8,544.4 L173.0,541.9 L173.9,547.2 L184.6,552.3 L171.4,546.2 L168.3,547.7 L179.2,572.7 L187.5,583.6 L200.6,593.8 L204.5,595.3 L203.8,592.3 L206.6,597.6 L214.7,599.4 L219.4,599.0 L221.9,587.0 L222.9,591.3 L225.3,590.4 L226.6,587.1 L229.7,593.7 L250.9,579.5 L250.9,594.3 L258.1,594.5 L256.5,577.2 L253.0,566.4 L258.0,565.7 L261.0,570.2 L260.8,567.5 L269.7,571.5 L271.8,569.5 L271.9,572.5 L274.1,573.7 L291.4,581.2 L296.6,582.4 L301.3,582.3 L301.3,581.3 L302.7,584.1 L300.6,568.4 L295.5,563.5 L299.2,565.1 L298.2,562.5 L298.2,562.3 L299.2,564.8 L349.8,578.3 L350.5,573.5 L348.0,567.8 L350.6,569.6 L354.8,568.2 L356.2,571.3 L359.9,571.0 L360.1,573.9 L363.0,571.7 L363.5,568.3 L366.9,566.9 L376.5,548.8 L379.7,545.4 L385.9,517.0 L382.5,513.2 L383.8,502.3 L409.8,479.8 L414.2,471.3 L418.9,473.3 L420.9,464.0 L415.7,457.0 L420.2,462.9 L425.0,465.4 L432.7,458.7 L436.7,458.9 L442.4,444.4 L450.0,442.1 L462.9,429.4 L465.6,435.4 L473.6,437.2 L482.7,436.3 L488.4,432.3 L489.5,423.3 L491.9,426.7 L505.6,434.5 L506.1,442.6 L511.3,449.3 L519.4,448.5 L522.5,455.7 L526.9,458.6 L534.9,460.5 L542.3,459.6 L547.4,455.6 L551.3,448.2 L554.3,435.6 L559.7,429.3 L567.1,427.2 L567.1,410.4 L572.8,403.5 L571.0,399.0 L573.4,402.8 L579.5,399.1 L580.9,385.3 L589.3,373.2 L591.4,366.4 L593.6,352.5 L592.2,345.3 L596.6,340.4 L603.4,338.8 L606.9,332.4 L619.1,329.0 L622.4,323.1 L628.0,319.7 L626.9,312.8 L631.2,307.0 L633.1,300.0 L633.1,281.7 L639.0,277.4 L652.8,272.9 L656.4,260.0 L656.1,242.3 L667.0,233.7 L670.4,227.6 L674.2,213.8 L672.9,206.6 L682.6,187.2 L673.9,187.2 L681.3,186.2 L688.4,181.6 L698.3,167.0 L704.6,163.6 L712.8,165.0 L720.1,159.4 L736.1,151.3 L741.7,145.2 L736.9,138.1 L742.2,122.4 L742.4,107.0 L736.0,104.6 L733.0,98.5 L715.9,96.5 L713.0,91.0 L706.1,90.8 L694.3,82.5 L689.9,76.1 L690.2,71.1 L688.3,67.6 L689.1,56.1 L693.6,50.2 L692.3,47.7 L684.8,52.9 L684.9,49.2 L677.0,45.4 L666.0,32.4 L662.3,20.2 L662.2,11.1 L656.1,16.6 L653.0,22.0 L644.6,21.6 L631.0,26.0 L627.1,32.6 L620.8,37.3 L613.6,39.8 L611.3,46.9 L601.7,56.5 L601.1,65.6 L601.9,51.7 L589.8,48.3 L585.5,50.3 L574.1,42.5 L547.5,33.7 L526.4,32.4 L498.3,33.5 L484.9,37.6 L464.2,40.5 L452.3,47.7 L435.5,67.7 L391.7,66.3 L387.5,71.2 L385.7,72.5 L390.6,66.5 L373.3,61.3 L364.7,53.4 L354.0,50.6 L340.0,39.5 L322.7,35.1 L316.9,35.8 L296.3,48.3 L290.6,49.9 L284.6,49.3 L274.9,55.3 L271.6,62.8 L272.4,56.5 L267.1,56.7 L262.3,54.7 L255.4,45.4 L246.2,49.7 L250.6,47.2 L253.8,42.8 L242.1,27.3Z M235.1,596.9 L243.5,594.2 L246.4,595.9 L249.9,594.5 L247.5,586.0 L249.0,588.5 L249.9,583.2 L233.5,596.1 L235.1,596.9Z M254.1,570.8 L257.3,576.9 L256.9,583.0 L259.2,589.2 L264.3,592.8 L269.2,591.1 L262.2,575.6 L254.1,570.8Z M277.7,584.6 L275.9,583.6 L284.5,585.2 L278.7,580.5 L273.7,581.2 L273.8,583.2 L277.7,584.6Z M306.4,587.1 L308.9,586.2 L309.2,585.0 L304.7,585.2 L306.4,587.1Z M309.5,585.2 L332.3,582.9 L347.8,583.1 L349.5,578.7 L309.5,585.2Z";

const DISCO_PATHS = {
  AEDC: { d:"M316.9,290.3 L304.8,287.3 L303.8,285.2 L301.9,284.8 L299.1,288.5 L294.8,287.8 L287.7,288.3 L279.7,299.8 L277.8,300.6 L269.0,292.8 L257.4,292.6 L253.1,293.6 L253.2,338.1 L254.6,342.5 L256.3,343.9 L265.6,343.9 L267.9,343.3 L275.4,342.1 L266.8,344.8 L265.4,350.5 L268.2,355.9 L267.3,368.3 L264.9,373.7 L267.1,376.4 L278.2,370.9 L290.2,367.5 L296.4,366.7 L308.8,367.7 L327.2,371.5 L355.5,383.6 L356.1,378.6 L352.4,366.9 L356.0,362.1 L361.9,360.2 L379.8,365.4 L386.0,366.2 L391.5,365.7 L401.4,373.3 L406.3,371.5 L411.5,368.1 L415.1,363.9 L414.4,358.1 L411.1,353.3 L414.5,348.6 L426.0,351.4 L430.3,347.3 L426.6,342.6 L415.1,338.4 L402.9,341.0 L396.7,340.6 L391.1,338.0 L388.0,333.2 L385.6,321.7 L389.5,317.0 L394.3,313.4 L396.9,307.8 L392.3,305.6 L386.2,306.0 L380.2,304.6 L377.8,299.0 L373.7,295.8 L369.4,296.3 L366.5,301.9 L362.7,306.6 L358.1,304.1 L353.9,299.5 L348.3,297.6 L339.7,305.2 L335.2,304.3 L335.2,298.1 L333.4,292.5 L325.5,284.3 L322.0,289.2 L316.9,290.3Z", cx:327.8, cy:333.1 },
  BEDC: { d:"M247.5,459.2 L246.6,454.2 L244.4,449.7 L245.1,440.3 L247.3,435.8 L249.9,421.1 L247.5,416.9 L244.5,413.8 L240.0,415.0 L236.9,413.0 L235.0,408.7 L226.8,405.7 L223.2,402.8 L214.2,404.3 L213.9,399.8 L208.4,395.5 L201.9,402.1 L203.8,405.7 L204.4,410.3 L198.9,418.0 L195.7,427.3 L192.7,431.0 L193.4,435.6 L191.4,438.2 L190.4,443.2 L187.7,447.1 L183.5,445.8 L179.5,448.5 L176.9,445.4 L178.2,441.2 L174.2,438.8 L159.1,438.7 L156.1,441.9 L150.1,449.3 L149.2,454.0 L151.4,458.1 L151.7,462.8 L146.0,470.1 L144.1,474.5 L148.6,480.6 L155.6,487.2 L150.8,487.5 L145.5,500.4 L147.6,506.5 L158.6,500.1 L161.5,499.5 L150.7,505.3 L150.6,511.8 L154.8,517.2 L161.0,516.3 L164.4,511.6 L164.0,515.5 L169.6,516.1 L167.0,519.8 L162.4,517.9 L156.4,519.1 L156.9,524.6 L162.4,528.7 L169.0,530.6 L169.6,526.8 L174.3,528.9 L177.4,522.8 L182.1,521.1 L183.8,521.6 L178.9,524.2 L176.4,527.8 L180.3,531.7 L176.9,529.7 L176.0,532.3 L164.9,532.2 L167.7,545.1 L172.8,544.4 L173.0,541.9 L173.9,547.2 L186.0,552.9 L198.7,549.0 L203.3,544.3 L208.8,547.7 L214.6,545.5 L219.1,541.6 L224.1,539.6 L228.9,535.7 L235.5,534.6 L237.0,529.5 L240.8,524.7 L243.7,519.0 L244.8,512.4 L248.8,499.7 L251.9,493.5 L252.5,480.0 L247.3,461.1 L245.9,461.4 L247.5,459.2Z", cx:202.6, cy:480.0 },
  EEDC: { d:"M319.7,453.9 L311.6,453.8 L314.0,467.0 L311.4,474.6 L313.7,485.0 L313.4,487.6 L310.5,491.9 L311.1,497.2 L309.3,497.0 L305.2,493.6 L302.5,494.3 L301.1,501.7 L302.6,503.6 L316.2,504.5 L318.2,509.4 L322.8,512.0 L325.1,507.2 L325.3,504.6 L329.0,497.9 L328.3,495.4 L329.1,493.4 L331.7,492.6 L335.1,496.1 L341.1,492.8 L342.6,491.0 L345.1,491.8 L346.8,490.5 L348.0,485.2 L354.9,476.7 L353.2,471.9 L354.4,469.7 L357.0,468.9 L357.7,466.4 L354.1,459.9 L348.9,453.8 L348.5,451.1 L345.1,444.0 L339.1,447.0 L337.5,449.1 L329.6,450.1 L328.4,458.2 L326.9,460.4 L324.4,460.1 L320.3,456.5 L319.7,453.9Z M262.7,444.9 L257.7,449.8 L256.3,456.6 L255.0,458.6 L253.2,460.1 L248.6,459.9 L248.0,461.6 L253.5,484.2 L252.0,493.4 L244.6,510.4 L246.4,511.7 L248.7,511.6 L253.7,506.9 L260.3,508.2 L262.2,507.4 L266.3,499.2 L273.2,497.7 L277.8,498.7 L282.4,497.9 L290.3,491.5 L288.8,490.2 L286.6,490.9 L284.6,490.0 L283.2,488.3 L279.4,478.0 L277.4,478.9 L276.7,477.3 L277.2,473.5 L275.2,469.2 L273.9,467.3 L269.6,465.6 L270.1,461.2 L274.5,455.9 L275.3,453.7 L274.8,451.8 L266.1,448.8 L263.7,448.9 L262.7,444.9Z", cx:302.3, cy:478.0 },
  IBEDC: { d:"M148.2,368.0 L158.4,370.7 L166.1,371.0 L170.1,365.4 L177.9,364.6 L174.4,359.0 L168.9,353.6 L167.3,346.9 L171.9,340.4 L178.0,335.4 L183.8,340.6 L191.4,343.1 L207.0,345.2 L213.5,343.3 L217.0,327.8 L216.5,323.3 L208.6,322.3 L200.7,323.4 L192.9,322.1 L186.8,317.1 L173.2,309.4 L165.6,307.2 L158.3,306.6 L153.1,300.6 L146.1,296.7 L131.0,299.6 L128.6,292.4 L122.1,288.8 L119.9,281.7 L113.3,280.2 L108.9,275.6 L109.3,267.7 L105.9,262.6 L85.0,238.6 L78.3,235.1 L62.4,236.4 L55.9,249.6 L50.0,253.2 L42.5,255.8 L42.5,262.8 L37.0,266.8 L29.1,279.9 L30.5,287.7 L28.5,294.9 L24.6,301.1 L17.2,301.2 L9.8,302.9 L7.5,308.1 L4.6,322.1 L6.5,334.9 L7.5,334.6 L5.4,335.9 L5.1,340.5 L3.1,344.7 L2.4,350.0 L4.8,354.8 L4.7,359.9 L1.0,375.4 L4.0,385.9 L4.0,392.0 L5.3,397.8 L8.3,402.6 L5.3,405.9 L7.4,427.9 L3.8,431.6 L5.4,436.2 L4.7,442.0 L6.9,446.1 L3.7,461.6 L7.4,463.7 L16.9,460.8 L29.1,460.7 L32.7,457.1 L35.1,452.1 L39.3,449.9 L44.1,453.1 L48.1,451.0 L53.9,450.2 L84.4,450.5 L87.7,452.6 L86.4,457.8 L91.3,457.4 L96.4,458.4 L92.2,462.1 L96.5,465.4 L102.1,466.0 L104.4,469.9 L116.1,473.2 L116.4,469.7 L111.1,468.4 L116.2,465.8 L119.4,461.8 L118.8,455.8 L109.6,457.7 L104.7,454.9 L106.3,449.2 L110.2,444.6 L115.1,441.1 L117.0,435.5 L116.5,430.7 L113.2,431.2 L114.3,430.8 L117.3,430.6 L118.7,431.1 L126.1,422.3 L128.9,421.9 L134.0,425.1 L136.5,424.8 L136.6,416.0 L138.0,410.2 L143.4,408.1 L144.4,406.3 L139.4,392.3 L139.5,380.7 L142.3,375.6 L147.2,372.3 L148.2,368.0Z", cx:82.2, cy:355.7 },
  JED: { d:"M515.1,165.2 L512.5,160.7 L514.4,152.0 L513.1,143.4 L506.5,126.9 L504.1,109.4 L498.9,93.1 L491.9,87.5 L484.4,92.2 L478.7,90.6 L470.7,93.8 L465.2,110.7 L463.6,118.8 L438.8,128.2 L432.0,132.5 L435.0,137.9 L442.3,138.8 L444.5,153.3 L454.5,165.7 L471.7,169.3 L478.2,172.3 L471.1,176.8 L466.4,182.9 L461.5,184.5 L452.9,185.1 L446.0,180.8 L446.6,172.0 L441.6,165.7 L432.8,166.8 L426.2,163.0 L417.9,162.9 L409.3,160.6 L393.5,164.5 L376.0,181.9 L376.0,190.8 L380.4,198.2 L379.2,206.5 L375.7,214.2 L376.6,220.9 L384.2,223.3 L389.4,229.7 L389.9,238.6 L392.0,244.9 L400.7,243.1 L404.7,250.2 L403.0,258.7 L412.1,271.4 L429.6,273.1 L438.1,271.1 L444.0,265.4 L443.3,258.5 L448.2,255.5 L472.4,266.7 L487.9,275.3 L512.6,269.6 L521.0,269.6 L519.8,267.4 L522.6,270.7 L545.4,270.2 L556.7,268.3 L572.9,258.3 L574.4,255.0 L574.5,243.6 L573.0,240.8 L569.9,238.7 L566.0,232.2 L559.4,228.7 L555.4,222.4 L560.5,212.6 L560.2,209.0 L557.5,207.3 L553.7,207.3 L552.2,204.5 L552.5,185.6 L550.8,182.4 L548.0,180.6 L540.2,170.4 L531.1,163.4 L524.0,161.1 L520.3,161.7 L508.3,170.2 L515.1,165.2Z M311.7,379.5 L315.2,384.4 L315.7,396.7 L316.9,402.7 L322.0,404.3 L319.9,415.0 L317.0,420.2 L311.8,423.5 L305.0,430.0 L300.3,426.5 L300.5,430.6 L303.7,435.8 L308.4,439.7 L319.1,439.3 L321.6,444.7 L320.3,456.4 L324.9,460.4 L328.6,457.0 L329.5,450.9 L334.8,449.7 L344.0,443.7 L346.6,448.0 L350.9,450.7 L355.5,446.9 L361.5,447.2 L367.3,445.7 L368.6,440.7 L373.4,437.9 L379.4,438.5 L390.1,444.4 L390.7,450.1 L395.3,452.4 L407.4,450.3 L412.4,453.4 L420.2,462.9 L425.0,465.4 L432.6,459.2 L433.9,453.2 L434.0,441.2 L436.6,429.2 L439.6,423.9 L444.2,419.9 L446.6,415.0 L449.3,403.2 L448.1,397.6 L430.8,380.2 L425.1,378.3 L412.9,377.5 L406.8,378.3 L401.1,380.8 L400.4,372.5 L391.0,365.9 L379.0,365.2 L361.3,360.3 L355.6,362.3 L352.4,367.2 L356.1,378.8 L355.5,383.6 L327.7,371.6 L309.7,367.8 L309.6,373.9 L311.7,379.5Z", cx:444.0, cy:267.6 },
  KAEDC: { d:"M253.8,42.8 L246.7,31.9 L232.8,18.2 L226.9,15.3 L220.7,14.0 L214.6,14.8 L178.4,0.2 L162.5,7.7 L156.6,9.1 L143.6,9.2 L137.6,7.5 L131.5,7.7 L112.4,11.5 L97.5,24.1 L91.8,26.3 L90.8,38.4 L92.9,42.7 L96.2,43.0 L90.8,42.7 L89.8,51.5 L86.7,59.6 L81.8,67.0 L76.0,73.5 L62.4,84.9 L61.0,92.9 L61.6,101.8 L60.0,110.4 L61.9,119.0 L59.4,126.7 L62.9,134.2 L57.1,140.6 L52.8,157.7 L53.7,165.4 L60.5,171.2 L68.2,173.7 L84.0,181.4 L110.5,180.2 L126.2,187.5 L129.2,194.1 L127.3,202.7 L114.6,214.1 L113.6,222.7 L117.3,230.0 L117.6,238.0 L129.4,230.0 L137.3,226.9 L136.1,219.0 L133.3,211.2 L133.8,202.6 L142.2,201.5 L150.2,198.1 L146.7,191.4 L149.1,184.0 L144.9,177.5 L136.4,175.6 L129.5,170.7 L135.7,165.2 L152.9,161.0 L161.6,160.3 L171.6,172.8 L171.9,181.6 L178.6,184.3 L187.2,182.7 L208.2,172.9 L216.4,188.6 L219.8,189.8 L215.0,194.3 L213.9,201.8 L214.4,209.3 L212.7,216.3 L217.5,222.0 L228.6,211.6 L235.5,207.8 L241.1,211.0 L248.6,208.6 L252.5,204.9 L258.7,207.2 L266.3,217.1 L267.2,223.2 L272.7,227.4 L262.0,238.2 L268.0,242.8 L275.7,244.0 L283.7,244.0 L286.0,250.5 L286.7,258.3 L283.1,262.2 L286.7,267.0 L287.3,272.5 L282.7,278.3 L287.6,288.3 L295.5,287.8 L301.4,285.2 L306.8,287.8 L312.4,288.7 L319.5,291.4 L324.1,285.2 L329.7,288.2 L334.6,293.6 L335.2,301.4 L338.7,305.9 L344.3,300.3 L350.1,298.6 L356.5,302.3 L361.9,306.8 L367.0,301.1 L370.8,294.3 L372.8,287.0 L368.0,280.9 L364.2,274.1 L366.0,267.0 L369.4,260.5 L369.5,252.6 L372.2,245.9 L370.2,238.3 L373.2,231.2 L378.5,226.0 L375.2,220.0 L375.8,213.5 L371.9,209.6 L360.1,201.7 L364.9,196.9 L364.2,189.1 L365.6,181.4 L362.3,174.3 L356.3,169.1 L349.0,167.2 L342.7,162.8 L337.5,157.6 L337.8,151.0 L330.2,152.6 L323.8,157.2 L316.6,159.4 L310.8,164.1 L304.6,160.8 L297.1,158.5 L292.1,164.2 L286.0,165.1 L279.5,174.9 L268.1,167.0 L269.0,161.0 L261.7,160.2 L262.5,159.6 L263.3,153.9 L262.9,148.3 L261.0,143.3 L264.4,132.6 L275.0,131.2 L278.1,126.8 L282.7,125.7 L281.1,121.1 L276.3,117.9 L277.9,107.4 L276.9,101.7 L274.6,96.5 L272.0,79.5 L271.2,68.0 L272.4,56.5 L267.1,56.7 L262.3,54.7 L255.4,45.4 L246.2,49.7 L250.6,47.2 L253.8,42.8Z", cx:210.2, cy:138.0 },
  KEDCO: { d:"M385.7,72.5 L390.6,66.5 L373.3,61.3 L364.7,53.4 L354.0,50.6 L349.7,46.4 L340.0,39.5 L334.5,37.2 L322.7,35.1 L316.9,35.8 L296.3,48.3 L290.6,49.9 L284.6,49.3 L274.9,55.3 L272.0,59.5 L271.2,65.5 L274.3,95.1 L276.6,100.6 L277.6,106.5 L277.4,112.3 L276.0,117.6 L280.9,120.9 L282.7,125.7 L278.1,126.9 L274.7,131.5 L263.6,133.0 L260.8,144.6 L263.3,149.8 L262.9,155.7 L264.0,160.4 L269.7,161.4 L268.9,166.2 L270.5,169.5 L280.5,174.6 L283.2,170.3 L283.4,165.7 L289.2,165.9 L296.6,158.6 L302.4,160.0 L307.1,163.4 L312.4,163.5 L316.4,159.5 L315.0,158.1 L316.7,159.4 L321.7,158.9 L329.7,152.9 L334.4,151.6 L339.0,151.8 L337.8,156.3 L338.9,160.8 L347.5,165.5 L351.2,168.6 L356.2,169.1 L360.1,172.2 L365.5,180.5 L364.0,190.2 L364.2,199.9 L360.0,202.0 L363.1,205.2 L368.1,205.9 L371.5,209.3 L376.3,210.1 L379.4,206.3 L381.2,201.6 L379.6,197.1 L376.4,193.2 L375.8,183.3 L377.1,178.4 L384.9,174.2 L394.8,163.0 L403.8,161.4 L409.5,152.3 L406.1,158.3 L411.1,161.0 L418.0,162.9 L424.7,162.5 L429.5,166.8 L443.6,165.9 L446.7,172.3 L446.1,179.5 L449.9,184.5 L463.5,185.6 L470.0,177.1 L476.6,174.5 L476.3,169.6 L469.1,169.1 L455.2,166.2 L450.5,160.9 L447.1,154.7 L442.0,152.8 L443.5,146.4 L442.5,139.4 L437.1,136.9 L431.2,136.5 L433.7,130.0 L460.0,120.2 L464.8,116.1 L465.7,109.2 L470.1,95.6 L475.1,91.3 L480.8,93.2 L485.9,91.3 L491.9,87.4 L489.4,73.3 L484.5,69.0 L477.8,67.3 L471.2,69.7 L469.1,63.0 L465.3,57.2 L451.8,61.1 L440.9,69.1 L434.1,67.3 L427.4,68.3 L391.7,66.3 L387.5,71.2 L385.7,72.5Z", cx:365.8, cy:110.9 },
  PHED: { d:"M271.8,569.5 L272.8,571.4 L271.9,572.5 L274.1,573.7 L278.5,574.8 L291.4,581.2 L296.6,582.4 L301.3,582.3 L301.3,581.3 L302.7,584.1 L300.6,568.4 L295.4,563.5 L288.5,562.1 L281.4,563.3 L278.7,558.0 L282.6,551.9 L285.3,545.3 L280.1,543.3 L258.5,542.5 L253.5,537.7 L251.2,525.1 L245.5,523.8 L247.0,516.6 L245.6,511.6 L244.9,515.8 L241.1,521.7 L239.3,528.1 L240.9,530.8 L234.8,534.9 L225.8,536.2 L223.7,540.3 L219.4,540.3 L218.0,544.1 L210.1,547.4 L202.5,544.9 L199.8,548.5 L195.4,549.1 L187.1,553.0 L178.8,550.1 L171.4,546.2 L168.3,547.7 L173.0,560.6 L179.2,572.7 L187.5,583.6 L200.6,593.8 L204.5,595.3 L203.8,592.3 L205.8,594.2 L206.6,597.6 L211.7,597.8 L214.7,599.4 L219.4,599.0 L221.9,587.0 L222.9,591.3 L225.3,590.4 L226.6,587.1 L229.7,593.7 L250.9,579.5 L251.8,580.2 L250.4,587.1 L250.9,594.3 L258.1,594.5 L256.2,583.1 L256.5,577.2 L253.6,570.8 L253.0,566.4 L258.0,565.7 L261.0,570.2 L260.8,567.5 L269.7,571.5 L271.8,569.5Z M254.1,570.8 L257.3,576.9 L256.9,583.0 L259.2,589.2 L264.3,592.8 L269.2,591.1 L262.2,575.6 L254.1,570.8Z M273.8,583.2 L277.7,584.6 L275.9,583.6 L284.5,585.2 L278.7,580.5 L273.7,581.2 L273.8,583.2Z M235.1,596.9 L239.7,596.4 L243.5,594.2 L246.4,595.9 L249.9,594.5 L248.0,590.5 L247.5,586.0 L249.0,588.5 L249.9,583.2 L233.5,596.1 L235.1,596.9Z M356.2,571.3 L359.9,571.0 L360.1,573.9 L363.0,571.7 L363.5,568.3 L366.9,566.9 L376.5,548.8 L379.7,545.4 L383.1,526.1 L385.2,521.5 L385.9,517.0 L382.5,513.2 L382.1,510.3 L384.0,506.0 L383.8,502.3 L391.7,496.3 L405.9,482.4 L409.8,479.8 L412.7,475.7 L414.2,471.3 L418.9,473.3 L420.3,468.8 L420.9,464.0 L411.4,452.3 L406.9,450.3 L397.1,452.2 L392.1,452.1 L389.2,443.8 L380.4,438.8 L375.5,437.6 L370.6,438.7 L366.7,446.1 L361.9,447.2 L356.9,446.5 L348.5,451.1 L350.3,455.7 L353.8,459.1 L357.8,467.5 L354.0,470.2 L354.6,474.4 L353.3,478.7 L347.3,486.8 L346.2,491.6 L341.8,491.2 L338.4,494.5 L335.1,496.1 L332.1,492.6 L328.0,494.6 L328.8,499.3 L325.9,503.3 L322.9,512.2 L323.8,521.8 L327.8,530.9 L324.6,532.3 L322.5,535.2 L323.5,532.2 L322.6,530.7 L316.1,526.6 L315.2,524.1 L310.6,522.1 L308.3,522.7 L308.3,527.8 L307.4,530.2 L307.7,532.2 L309.2,532.9 L308.1,535.2 L303.0,535.2 L300.8,536.3 L301.7,538.7 L300.6,546.4 L301.1,548.9 L300.5,551.4 L297.6,555.3 L297.6,560.1 L299.2,564.8 L349.8,578.3 L350.7,576.6 L349.8,575.3 L350.5,573.5 L349.5,569.0 L348.0,567.8 L350.6,569.6 L354.8,568.2 L356.2,571.3Z M309.5,585.2 L332.3,582.9 L347.8,583.1 L349.5,578.7 L309.5,585.2Z M306.4,587.1 L308.9,586.2 L309.2,585.0 L304.7,585.2 L306.4,587.1Z", cx:309.3, cy:532.5 },
  YEDC: { d:"M601.1,65.6 L601.9,51.7 L595.6,50.6 L589.8,48.3 L585.5,50.3 L579.4,47.0 L574.1,42.5 L547.5,33.7 L533.5,32.6 L512.3,32.7 L498.3,33.5 L484.9,37.6 L464.2,40.5 L457.8,43.4 L452.3,47.7 L442.7,58.0 L435.2,68.1 L442.1,69.1 L446.7,64.2 L452.7,60.8 L459.3,58.5 L466.0,57.5 L471.6,69.6 L478.2,67.2 L484.7,69.0 L489.4,73.4 L491.9,87.3 L497.2,91.8 L500.9,97.4 L501.5,104.4 L504.6,110.5 L504.8,117.5 L506.2,124.4 L513.4,144.1 L514.4,150.9 L512.9,157.8 L514.9,163.2 L521.4,161.3 L528.3,161.9 L539.9,169.9 L547.2,180.8 L551.9,183.4 L552.7,190.3 L552.1,204.3 L556.6,207.3 L562.1,206.1 L559.9,214.1 L555.3,221.9 L560.5,229.5 L573.9,241.3 L580.4,242.1 L576.8,242.0 L574.3,247.0 L574.3,254.5 L570.3,260.1 L557.5,267.9 L550.3,269.7 L551.4,274.9 L549.7,271.8 L541.7,270.4 L523.4,270.9 L514.4,269.9 L505.8,271.1 L488.9,275.9 L491.8,293.5 L494.2,302.1 L494.7,310.7 L488.1,316.4 L479.8,319.9 L470.9,321.6 L458.6,334.0 L451.0,339.0 L444.3,345.1 L435.5,347.3 L428.1,350.5 L412.1,350.7 L414.3,358.1 L414.4,366.3 L406.7,371.2 L400.6,377.7 L404.7,379.2 L413.6,377.4 L422.7,377.8 L431.2,380.5 L449.0,400.4 L446.5,418.0 L439.6,423.8 L435.7,432.0 L434.0,440.9 L434.2,449.8 L432.7,458.7 L436.7,458.9 L439.3,450.4 L442.4,444.4 L450.0,442.1 L462.9,429.4 L465.6,435.4 L473.6,437.2 L482.7,436.3 L488.4,432.3 L489.5,423.3 L491.9,426.7 L505.6,434.5 L506.1,442.6 L511.3,449.3 L519.4,448.5 L522.5,455.7 L526.9,458.6 L534.9,460.5 L542.3,459.6 L547.4,455.6 L551.3,448.2 L552.2,441.6 L554.3,435.6 L559.7,429.3 L567.1,427.2 L566.3,419.3 L567.1,410.4 L572.8,403.5 L571.0,399.0 L573.4,402.8 L579.5,399.1 L579.3,392.3 L580.9,385.3 L584.4,378.8 L589.3,373.2 L591.4,366.4 L593.6,352.5 L592.2,345.3 L596.6,340.4 L603.4,338.8 L606.9,332.4 L612.7,331.7 L619.1,329.0 L622.4,323.1 L628.0,319.7 L626.9,312.8 L631.2,307.0 L633.1,300.0 L633.9,285.6 L633.1,281.7 L639.0,277.4 L652.8,272.9 L656.4,260.0 L655.4,254.6 L656.1,242.3 L661.2,237.3 L667.0,233.7 L670.4,227.6 L674.2,213.8 L672.9,206.6 L682.6,187.2 L673.9,187.2 L681.3,186.2 L688.4,181.6 L694.0,174.5 L698.3,167.0 L704.6,163.6 L712.8,165.0 L720.1,159.4 L736.1,151.3 L741.7,145.2 L736.9,138.1 L742.2,122.4 L742.4,107.0 L736.0,104.6 L733.0,98.5 L724.5,96.5 L715.9,96.5 L713.0,91.0 L706.1,90.8 L694.3,82.5 L689.9,76.1 L690.2,71.1 L688.3,67.6 L689.1,56.1 L693.6,50.2 L692.3,47.7 L684.8,52.9 L684.9,49.2 L677.0,45.4 L666.0,32.4 L662.3,20.2 L662.2,11.1 L656.1,16.6 L653.0,22.0 L644.6,21.6 L631.0,26.0 L627.1,32.6 L620.8,37.3 L613.6,39.8 L611.3,46.9 L601.7,56.5 L601.1,65.6Z", cx:576.5, cy:217.5 },
  IE: { d:"M47.8,452.4 L44.3,453.1 L42.8,451.6 L40.8,450.5 L38.7,449.6 L36.5,449.3 L35.4,451.3 L35.1,453.5 L32.7,457.1 L32.3,459.4 L30.6,460.7 L19.1,460.9 L14.5,460.4 L11.9,463.2 L10.0,464.5 L7.9,463.6 L3.4,463.6 L2.9,468.2 L3.8,469.6 L12.9,468.6 L33.6,467.9 L40.5,467.9 L45.1,468.6 L46.0,467.6 L47.8,466.8 L62.1,466.7 L47.8,452.4Z", cx:34.7, cy:462.1 },
  EKEDP: { d:"M62.1,466.7 L70.8,465.8 L75.4,465.9 L84.6,466.8 L102.7,469.7 L104.1,468.8 L104.1,466.6 L99.8,465.7 L97.6,466.2 L95.9,464.7 L93.7,464.1 L92.0,462.7 L93.4,461.1 L95.4,460.1 L96.4,458.2 L94.9,456.7 L92.6,457.0 L88.6,459.2 L86.6,458.2 L86.0,456.1 L86.3,454.1 L87.9,452.4 L87.9,450.7 L58.0,450.2 L48.9,450.5 L47.8,452.4 L62.1,466.7Z", cx:74.1, cy:458.8 },
};

// States not covered by any tracked DISCO in current dashboard data — rendered neutral grey
const UNMAPPED_STATES = {
  "abia": { label:"Abia", d:"M291.0,491.7 L297.9,491.7 L301.2,493.1 L302.2,503.6 L316.5,505.1 L317.6,508.5 L323.3,512.7 L324.2,523.3 L327.5,529.8 L327.2,532.9 L323.7,531.8 L317.7,527.9 L313.1,522.7 L309.5,522.2 L306.9,531.8 L309.1,533.0 L307.0,535.4 L303.4,535.3 L300.7,536.9 L301.5,540.3 L300.6,551.1 L297.3,556.9 L298.8,563.5 L298.3,565.3 L295.2,563.4 L288.2,562.0 L281.1,563.2 L278.3,561.2 L278.8,557.7 L284.6,548.4 L285.3,544.9 L284.3,541.9 L287.7,531.4 L293.3,522.2 L292.9,505.0 L291.8,501.6 L285.2,498.5 L285.0,495.7 L291.0,491.7Z", cx:300.0, cy:526.8 },
  "ekiti": { label:"Ekiti", d:"M148.7,367.1 L150.2,368.9 L155.6,368.0 L157.4,370.0 L162.7,371.0 L167.1,369.6 L167.7,367.1 L169.7,365.6 L177.7,364.7 L177.0,369.6 L184.9,367.9 L186.1,369.7 L182.4,373.7 L183.7,379.1 L193.6,383.7 L194.2,385.3 L192.2,386.5 L189.8,385.9 L184.1,391.7 L179.8,404.9 L176.9,409.6 L172.4,412.9 L170.0,413.9 L168.0,412.4 L165.1,404.7 L143.7,404.3 L139.7,393.9 L139.7,380.3 L142.4,375.5 L147.1,372.5 L148.7,367.1Z", cx:164.1, cy:387.4 },
  "enugu": { label:"Enugu", d:"M262.7,444.9 L264.4,441.7 L266.4,440.7 L267.9,443.4 L270.7,444.3 L275.6,439.0 L281.6,435.1 L286.2,429.5 L291.8,425.2 L295.1,424.1 L298.3,425.3 L302.9,434.9 L308.3,439.6 L311.5,440.9 L317.7,438.6 L320.4,440.8 L322.0,447.7 L319.2,454.1 L312.0,453.8 L314.0,467.3 L311.7,474.0 L313.6,484.1 L313.4,487.6 L311.1,490.3 L311.2,497.1 L297.2,491.6 L293.7,492.0 L284.6,490.1 L279.2,478.0 L276.4,478.2 L277.0,475.1 L275.0,468.8 L269.3,465.1 L271.7,458.7 L274.3,456.3 L275.6,452.9 L272.9,450.9 L263.2,448.3 L262.7,444.9Z", cx:294.5, cy:459.9 },
  "imo": { label:"Imo", d:"M284.0,497.5 L292.1,502.0 L293.2,511.3 L292.0,513.0 L293.3,515.0 L293.5,519.7 L291.3,526.3 L287.4,532.1 L284.5,541.2 L283.3,543.0 L281.1,543.5 L276.5,542.5 L271.8,543.3 L260.1,542.6 L255.7,541.1 L251.4,535.7 L252.6,526.5 L251.1,525.0 L246.5,525.3 L245.5,523.8 L247.9,512.2 L254.9,506.5 L259.3,508.3 L261.7,508.0 L265.6,499.6 L267.7,498.7 L272.4,497.8 L279.4,498.7 L284.0,497.5Z", cx:271.4, cy:520.7 },
  "kogi": { label:"Kogi", d:"M219.7,323.9 L226.8,328.1 L231.4,335.1 L234.6,342.6 L240.9,348.2 L246.1,354.9 L251.0,353.1 L254.7,348.2 L260.6,343.8 L266.7,345.3 L268.4,360.7 L267.3,369.1 L264.7,376.7 L279.4,370.5 L295.8,366.8 L304.2,367.4 L309.4,370.8 L311.3,378.8 L315.2,385.9 L316.9,402.7 L322.8,405.8 L320.3,413.6 L316.4,420.8 L309.0,424.8 L305.5,430.5 L299.1,426.4 L291.8,425.2 L273.0,441.8 L263.1,444.1 L257.5,450.2 L255.2,458.2 L247.8,460.3 L245.4,452.4 L245.3,444.2 L249.8,420.5 L245.5,413.7 L237.7,415.3 L234.6,408.0 L227.4,406.4 L221.2,402.8 L213.6,403.8 L211.8,398.2 L197.3,383.7 L189.2,382.2 L183.0,377.3 L185.6,370.3 L180.1,368.4 L177.0,365.0 L174.8,359.2 L168.9,353.7 L167.6,346.5 L172.5,339.7 L178.8,336.6 L185.6,341.3 L193.5,343.9 L210.2,345.7 L214.4,339.7 L216.0,331.4 L219.7,323.9Z", cx:249.7, cy:386.6 },
  "niger": { label:"Niger", d:"M65.0,173.9 L78.5,179.1 L92.9,181.0 L107.8,180.3 L121.5,185.4 L129.0,194.8 L122.9,207.9 L113.6,218.0 L117.2,231.5 L122.7,235.6 L134.1,229.2 L134.7,217.4 L133.3,202.9 L147.3,199.3 L147.5,189.0 L144.9,177.4 L130.8,172.9 L139.0,164.0 L153.6,160.9 L166.3,164.4 L171.8,177.0 L180.1,184.2 L194.3,179.8 L206.8,173.8 L215.4,185.9 L212.6,213.5 L220.7,220.2 L231.2,209.7 L243.3,210.2 L253.7,204.6 L262.7,211.4 L266.9,223.0 L268.0,231.8 L266.0,242.1 L280.6,244.0 L286.8,254.4 L286.3,274.4 L283.0,295.1 L272.7,296.1 L259.1,292.5 L252.9,302.2 L253.4,332.1 L258.1,343.8 L250.9,353.3 L241.9,349.6 L232.5,338.6 L224.7,326.2 L210.5,322.2 L195.6,323.1 L183.4,314.9 L170.3,308.1 L156.9,305.0 L145.1,296.3 L130.9,299.5 L115.1,280.0 L102.9,259.9 L83.6,237.0 L69.1,235.4 L58.8,230.5 L61.2,217.1 L70.7,213.7 L72.1,199.8 L65.0,173.9Z", cx:181.8, cy:248.6 },
  "ondo": { label:"Ondo", d:"M194.9,384.1 L201.3,383.6 L202.3,389.1 L207.0,393.7 L206.0,398.9 L201.9,402.7 L203.6,407.6 L203.0,413.5 L198.8,417.9 L193.4,429.0 L192.9,435.0 L189.5,445.2 L179.4,448.6 L176.4,443.9 L176.2,439.0 L156.9,439.5 L154.4,445.1 L150.0,449.6 L149.2,455.8 L152.2,461.0 L149.2,466.6 L145.2,470.7 L143.5,475.6 L152.2,484.1 L144.6,501.5 L131.4,487.1 L116.2,474.8 L115.5,469.2 L112.1,467.4 L117.7,465.0 L118.9,459.7 L117.6,454.2 L112.6,457.9 L106.3,456.8 L105.2,451.0 L109.0,445.8 L114.2,442.0 L122.4,425.4 L127.8,422.0 L133.5,424.7 L136.7,422.0 L136.8,415.6 L138.7,409.5 L144.8,407.6 L148.2,404.1 L161.2,404.1 L166.5,406.8 L168.2,413.0 L173.7,412.2 L178.3,407.7 L181.1,401.8 L182.4,395.4 L185.8,390.0 L190.3,385.8 L194.9,384.1Z", cx:154.4, cy:436.6 },
  "plateau": { label:"Plateau", d:"M379.0,223.5 L385.8,223.7 L389.3,229.4 L389.8,243.3 L394.7,244.3 L401.5,243.3 L404.7,249.1 L404.4,256.0 L402.6,262.3 L408.4,265.8 L412.1,271.4 L425.7,273.3 L432.7,272.9 L438.6,270.1 L443.2,265.6 L445.0,260.7 L444.1,255.3 L456.7,259.1 L475.5,268.0 L487.5,275.1 L490.6,280.9 L490.4,287.8 L494.1,301.0 L494.5,307.4 L493.0,313.9 L480.5,319.9 L467.1,323.2 L463.5,329.0 L458.7,334.0 L452.6,337.3 L442.0,346.1 L435.2,347.3 L429.4,345.3 L423.8,341.4 L417.4,338.7 L404.0,340.9 L397.1,340.7 L390.8,337.8 L385.9,326.0 L387.3,320.0 L392.2,315.7 L396.3,310.1 L393.8,304.8 L387.2,306.1 L380.4,304.8 L377.7,298.6 L372.7,295.5 L372.9,289.4 L370.2,283.5 L366.1,278.0 L365.2,271.9 L369.3,259.9 L369.5,253.0 L371.2,246.7 L370.6,240.5 L371.6,233.9 L376.5,229.7 L379.0,223.5Z", cx:426.2, cy:293.8 },
};


function NigeriaMap({ selectedDisco, onSelectDisco, filterState }) {
  const [hov, setHov] = useState(null);
  const getCol = key => {
    const d=DISCOS[key]; if(!d) return {color:T.t3,opacity:0.4};
    const base=d.loss>60?T.red:d.loss>40?T.amber:d.loss>25?T.orange:T.green;
    return { color:base, opacity:selectedDisco===key||selectedDisco==="ALL"?1:0.38 };
  };
  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:14,padding:"0 0 8px",flexWrap:"wrap"}}>
        {[{c:T.green,l:"<25% — PASS"},{c:T.orange,l:"25–40%"},{c:T.amber,l:"40–60%"},{c:T.red,l:">60% — CRITICAL"},{c:"#3a4a52",l:"Not yet tracked"}].map((x,i)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:T.t2}}>
            <span style={{width:11,height:11,borderRadius:3,background:x.c,display:"inline-block",opacity:0.85}}/>{x.l}
          </span>
        ))}
        <span style={{marginLeft:"auto",fontSize:8,color:T.t3}}>Click territory to filter · Real state boundaries</span>
      </div>
      <svg viewBox="0 0 744 600" style={{width:"100%",height:340,overflow:"visible"}}>
        {/* Real Nigeria outer border — union of all 37 states */}
        <path d={NIGERIA_OUTER_PATH} fill="rgba(39,199,199,0.02)" stroke="rgba(39,199,199,0.18)" strokeWidth={1.2}/>

        {/* States not covered by any tracked DISCO — neutral, non-interactive */}
        {Object.entries(UNMAPPED_STATES).map(([key,s])=>(
          <path key={key} d={s.d} fill="#1a2830" fillOpacity={0.5} stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>
        ))}

        {/* DISCO territories — real merged state shapes */}
        {Object.entries(DISCO_PATHS).map(([key,path])=>{
          const {color,opacity}=getCol(key); const isH=hov===key,isS=selectedDisco===key;
          return (
            <g key={key} onClick={()=>onSelectDisco(isS?"ALL":key)} onMouseEnter={()=>setHov(key)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
              <path d={path.d} fill={color} fillOpacity={isH?opacity:opacity*0.65} stroke={isS?"#fff":color} strokeWidth={isS?1.6:isH?1.2:0.7} strokeOpacity={isH||isS?1:0.6} style={{transition:"all 0.2s"}}/>
              {isS&&<path d={path.d} fill="none" stroke={color} strokeWidth={4} strokeOpacity={0.2}/>}
              <text x={path.cx} y={path.cy} textAnchor="middle" dominantBaseline="middle" style={{fontSize:9,fontWeight:isS?700:400,fill:isH||isS?"#fff":"rgba(255,255,255,0.75)",fontFamily:T.ui,pointerEvents:"none",paintOrder:"stroke",stroke:"rgba(0,0,0,0.5)",strokeWidth:2}}>{key}</text>
              <text x={path.cx} y={path.cy+11} textAnchor="middle" dominantBaseline="middle" style={{fontSize:7.5,fill:"rgba(255,255,255,0.6)",fontFamily:T.mono,pointerEvents:"none",paintOrder:"stroke",stroke:"rgba(0,0,0,0.5)",strokeWidth:1.5}}>{DISCOS[key]?.loss.toFixed(1)}%</text>
            </g>
          );
        })}

        {/* Compass */}
        <text x={710} y={40} style={{fontSize:11,fill:T.t3,fontFamily:T.ui}}>N</text>
        <line x1={715} y1={26} x2={715} y2={42} stroke={T.t3} strokeWidth={0.8}/>
      </svg>
      {hov&&DISCOS[hov]&&(
        <div style={{position:"absolute",top:30,right:0,width:180,background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:10,padding:"10px 13px",pointerEvents:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.t1,marginBottom:6}}>{DISCOS[hov].name}</div>
          {[["ATC&C Loss",`${DISCOS[hov].loss.toFixed(1)}%`],["MYTO Target",`${DISCOS[hov].target.toFixed(1)}%`],["Remittance",`${DISCOS[hov].remit}%`],["Tariff",`\u20a6${DISCOS[hov].tariffAllowed}/kWh`]].map(([l,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:9,color:T.t3}}>{l}</span>
              <span style={{fontSize:9,fontFamily:T.mono,color:T.t1,fontWeight:700}}>{v}</span>
            </div>
          ))}
          <div style={{fontSize:8,color:T.t3,marginTop:5,borderTop:`1px solid ${T.border}`,paddingTop:5}}>{DISCOS[hov].states.join(", ")}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRILL-DOWN FILTER BAR
═══════════════════════════════════════════════════════════ */
function FilterBar({ filters, setFilters, onReset, resultCount }) {
  const [regionOpen, setRegionOpen] = useState(false);

  const FUEL_TYPES = ["All","gas","hydro"];
  const PLANT_STATUS = ["All","on","low","off"];
  const QUARTERS = ["All","Q1'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25"];
  const METRICS = ["Loss Rate","Remittance","Tariff Gap","Invoice"];

  return (
    <div style={{
      background:`linear-gradient(90deg,${T.card} 0%,${T.card2} 100%)`,
      border:`1px solid ${T.borderHi}`,
      borderRadius:12,
      padding:"10px 16px",
      display:"flex",
      alignItems:"center",
      gap:10,
      flexWrap:"wrap",
    }}>
      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:7,
        background:"rgba(39,199,199,0.05)", border:`1px solid ${T.border}`,
        borderRadius:8, padding:"5px 10px", minWidth:180 }}>
        <span style={{ fontSize:12, color:T.t3 }}>🔍</span>
        <input
          placeholder="Search DISCO, state, plant..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search:e.target.value }))}
          style={{ background:"transparent", border:"none", outline:"none",
            color:T.t1, fontSize:11, fontFamily:T.ui, width:"100%" }}
        />
      </div>

      {/* DISCO selector */}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em" }}>DISCO</span>
        <select
          value={filters.disco}
          onChange={e => setFilters(f => ({ ...f, disco:e.target.value, state:"All" }))}
          style={{ background:T.card2, border:`1px solid ${T.border}`,
            borderRadius:7, color:T.t1, fontSize:10, padding:"4px 8px",
            fontFamily:T.ui, cursor:"pointer", outline:"none" }}
        >
          <option value="ALL">All DISCOs</option>
          {Object.entries(DISCOS).map(([k,v]) => (
            <option key={k} value={k}>{k} — {v.states[0]}</option>
          ))}
        </select>
      </div>

      {/* State selector — populated by disco selection */}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em" }}>STATE</span>
        <select
          value={filters.state}
          onChange={e => setFilters(f => ({ ...f, state:e.target.value }))}
          style={{ background:T.card2, border:`1px solid ${T.border}`,
            borderRadius:7, color:T.t1, fontSize:10, padding:"4px 8px",
            fontFamily:T.ui, cursor:"pointer", outline:"none" }}
        >
          <option value="All">All States</option>
          {(filters.disco !== "ALL"
            ? DISCOS[filters.disco]?.states || []
            : STATES_ALL
          ).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Fuel type */}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em" }}>FUEL</span>
        <div style={{ display:"flex", gap:3 }}>
          {FUEL_TYPES.map(f => (
            <button key={f} onClick={() => setFilters(x => ({ ...x, fuel:f }))}
              style={{ padding:"3px 9px", borderRadius:20, fontSize:9, border:`1px solid`,
                borderColor: filters.fuel===f ? T.orange : T.border,
                background: filters.fuel===f ? T.orangeDim : "transparent",
                color: filters.fuel===f ? T.orange : T.t3, cursor:"pointer",
                textTransform:"capitalize" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Plant status */}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em" }}>STATUS</span>
        <div style={{ display:"flex", gap:3 }}>
          {PLANT_STATUS.map(s => {
            const sc = s==="on"?T.green:s==="low"?T.amber:s==="off"?T.red:T.cyan;
            return (
              <button key={s} onClick={() => setFilters(x => ({ ...x, plantStatus:s }))}
                style={{ padding:"3px 9px", borderRadius:20, fontSize:9, border:`1px solid`,
                  borderColor: filters.plantStatus===s ? sc : T.border,
                  background: filters.plantStatus===s ? `${sc}22` : "transparent",
                  color: filters.plantStatus===s ? sc : T.t3, cursor:"pointer",
                  textTransform:"capitalize" }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quarter */}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em" }}>PERIOD</span>
        <select
          value={filters.quarter}
          onChange={e => setFilters(f => ({ ...f, quarter:e.target.value }))}
          style={{ background:T.card2, border:`1px solid ${T.border}`,
            borderRadius:7, color:T.t1, fontSize:10, padding:"4px 8px",
            fontFamily:T.ui, cursor:"pointer", outline:"none" }}
        >
          {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {/* Result count */}
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:9, color:T.t3 }}>
          <span style={{ color:T.cyan, fontFamily:T.mono, fontWeight:700 }}>{resultCount}</span>
          {" "}results
        </span>
        <button onClick={onReset}
          style={{ padding:"4px 12px", borderRadius:8, fontSize:9, border:`1px solid ${T.border}`,
            background:"transparent", color:T.t3, cursor:"pointer" }}>
          ✕ Reset
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRILL-DOWN DETAIL PANEL
═══════════════════════════════════════════════════════════ */
function SectionDrillDown({ disco, state, quarter, filters }) {
  const discoData = disco !== "ALL" ? DISCOS[disco] : null;
  const filteredPlants = useMemo(() => {
    return PLANTS_ALL.filter(p => {
      if (disco !== "ALL" && p.disco !== disco) return false;
      if (filters.fuel !== "All" && p.fuel !== filters.fuel) return false;
      if (filters.plantStatus !== "All" && p.status !== filters.plantStatus) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.disco.toLowerCase().includes(q);
      }
      return true;
    });
  }, [disco, filters]);

  const filteredAlerts = useMemo(() => {
    return ALERTS_ALL.filter(a => {
      if (disco !== "ALL" && a.disco !== disco && a.disco !== "ALL") return false;
      if (state !== "All" && a.state !== state && a.state !== "All") return false;
      if (filters.search) return a.title.toLowerCase().includes(filters.search.toLowerCase());
      return true;
    });
  }, [disco, state, filters]);

  // Loss data for selected quarter
  const DISCO_SHORT_NAME = {
    AEDC:"Abuja", BEDC:"Benin", EEDC:"Enugu", EKEDP:"Eko", IBEDC:"Ibadan",
    IE:"Ikeja", JED:"Jos", KAEDC:"Kaduna", KEDCO:"Kano", PHED:"PH", YEDC:null,
  };
  const getLoss = (d, key) => {
    if (quarter === "Q1'24" || quarter === "Q4'24") {
      const shortName = key ? DISCO_SHORT_NAME[key] : null;
      if (!shortName) return null; // e.g. Yola has no 2024 reading in the source data
      const row = atcLossTimeline.find(r => r.p === quarter);
      return row ? (row[shortName] ?? null) : null;
    }
    if (quarter === "All" || quarter === "Q4'25") return d.q4Loss;
    if (quarter === "Q3'25") return d.q3Loss;
    if (quarter === "Q2'25") return d.q2Loss;
    if (quarter === "Q1'25") return d.q1Loss;
    return d.q4Loss;
  };

  const filteredDiscos = useMemo(() => {
    return Object.entries(DISCOS).filter(([k, d]) => {
      if (disco !== "ALL" && k !== disco) return false;
      if (state !== "All" && !d.states.includes(state)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.states.some(s => s.toLowerCase().includes(q));
      }
      return true;
    }).map(([k, d]) => ({ key:k, ...d, activeLoss: getLoss(d, k) }));
  }, [disco, state, quarter, filters]);

  // Loss trend for selected disco
  const lossTrend = discoData ? atcLossTimeline.map(row => ({
    p: row.p,
    loss: row[discoData?.name.split(" ")[0]] ?? null,
  })) : null;

  const totalInstalled = filteredPlants.reduce((s,p) => s+p.installed, 0);
  const totalLive      = filteredPlants.reduce((s,p) => s+p.mw, 0);
  const onlineCount    = filteredPlants.filter(p => p.status==="on").length;
  const offlineCount   = filteredPlants.filter(p => p.status==="off").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>

      {/* Context banner */}
      {disco !== "ALL" && discoData && (
        <div style={{
          background:`linear-gradient(135deg,${T.card} 0%,${T.bgDeep} 100%)`,
          border:`1px solid ${discoData.color}44`,
          borderLeft:`4px solid ${discoData.color}`,
          borderRadius:12, padding:"14px 18px",
          display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16,
        }}>
          <div>
            <div style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em", marginBottom:4 }}>DISCO</div>
            <div style={{ fontSize:15, fontWeight:800, color:T.t1 }}>{disco}</div>
            <div style={{ fontSize:9, color:T.t2 }}>{discoData.states.join(" · ")}</div>
          </div>
          {[
            { l:"ATC&C Loss",    v:`${getLoss(discoData, disco)?.toFixed(1)||"—"}%`,   c: getLoss(discoData, disco)>discoData.target?T.red:T.green },
            { l:"MYTO Target",   v:`${discoData.target.toFixed(1)}%`,            c: T.cyan  },
            { l:"Remittance",    v:`${discoData.remit}%`,                        c: discoData.remit>=95?T.green:discoData.remit>=70?T.amber:T.red },
            { l:"Tariff Allowed",v:`₦${discoData.tariffAllowed}/kWh`,            c: T.t2    },
          ].map((k,i) => (
            <div key={i}>
              <div style={{ fontSize:9, color:T.t3, letterSpacing:"0.1em", marginBottom:4 }}>{k.l}</div>
              <div style={{ fontSize:18, fontWeight:800, color:k.c, fontFamily:T.mono }}>{k.v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { l:"Filtered Plants",     v:filteredPlants.length,               u:"plants",  c:T.cyan   },
          { l:"Total Installed",     v:totalInstalled.toLocaleString(),      u:"MW",      c:T.t1     },
          { l:"Live Output",         v:totalLive.toLocaleString(),           u:"MWh",     c:T.green  },
          { l:"Offline Plants",      v:offlineCount,                         u:"offline", c:T.red    },
        ].map((k,i) => (
          <div key={i} style={{
            background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:11,
            padding:"12px 15px",
          }}>
            <div style={{ fontSize:8, color:T.t3, letterSpacing:"0.12em", marginBottom:5 }}>{k.l}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.c, fontFamily:T.mono, lineHeight:1 }}>{k.v}</div>
            <div style={{ fontSize:9, color:T.t3, marginTop:3 }}>{k.u}</div>
          </div>
        ))}
      </div>

      {/* Plants table + Loss trend side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:13 }}>

        {/* Filtered plants */}
        <div style={{
          background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
        }}>
          <div style={{ padding:"11px 16px 9px", borderBottom:`1px solid ${T.border}`,
            display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:3, height:30, background:T.cyan, borderRadius:2 }}/>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Plant Status{disco!=="ALL"?` — ${disco}`:""}
              </div>
              <div style={{ fontSize:8, color:T.t3 }}>
                {filteredPlants.length} plants · {onlineCount} online · {offlineCount} offline
              </div>
            </div>
          </div>
          <div style={{ overflowY:"auto", maxHeight:260 }}>
            {filteredPlants.length === 0 ? (
              <div style={{ padding:20, textAlign:"center", color:T.t3, fontSize:11 }}>
                No plants match current filters
              </div>
            ) : filteredPlants.map((p,i) => {
              const sc = p.status==="on"?T.green:p.status==="low"?T.amber:T.red;
              const pct = Math.round((p.mw/p.cap)*100);
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"7px 14px", borderBottom:`1px solid rgba(39,199,199,0.04)` }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:sc,
                    boxShadow:`0 0 6px ${sc}`, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:p.status==="off"?T.t3:T.t1 }}>{p.name}</div>
                    <div style={{ fontSize:8, color:T.t3 }}>{p.fuel} · {p.disco}</div>
                  </div>
                  <div style={{ width:55, height:3, background:"rgba(255,255,255,0.05)", borderRadius:2 }}>
                    <div style={{ width:`${pct}%`, height:"100%", borderRadius:2,
                      background:sc, opacity:p.status==="off"?0.2:0.85 }}/>
                  </div>
                  <div style={{ fontSize:10, fontFamily:T.mono, color:p.status==="off"?T.t3:T.t1,
                    minWidth:55, textAlign:"right" }}>
                    {p.mw.toLocaleString()} <span style={{ fontSize:8, color:T.t3 }}>MWh</span>
                  </div>
                  <div style={{ fontSize:9, color:T.t3, fontFamily:T.mono, minWidth:36, textAlign:"right" }}>
                    {p.paf}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DISCO loss detail */}
        <div style={{
          background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
        }}>
          <div style={{ padding:"11px 16px 9px", borderBottom:`1px solid ${T.border}`,
            display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:3, height:30, background:T.orange, borderRadius:2 }}/>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Loss & Remittance — {quarter==="All"?"Q4 2025":quarter}
              </div>
              <div style={{ fontSize:8, color:T.t3 }}>
                {filteredDiscos.length} DISCOs · Click DISCO for detail
              </div>
            </div>
          </div>
          <div style={{ overflowY:"auto", maxHeight:260 }}>
            {filteredDiscos.length === 0 ? (
              <div style={{ padding:20, textAlign:"center", color:T.t3, fontSize:11 }}>
                No DISCOs match current filters
              </div>
            ) : filteredDiscos.map((d,i) => {
              const loss = d.activeLoss;
              const gap = loss != null ? loss - d.target : null;
              const pass = gap != null && gap <= 0;
              const lc = pass?T.green:gap>30?T.red:T.amber;
              return (
                <div key={i} style={{ padding:"8px 14px",
                  borderBottom:`1px solid rgba(39,199,199,0.04)` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:d.color, flexShrink:0 }}/>
                    <span style={{ fontSize:10, color:T.t1, flex:1, fontWeight:600 }}>{d.key}</span>
                    <span style={{ fontSize:10, fontFamily:T.mono, color:lc, fontWeight:700 }}>
                      {loss?.toFixed(1)||"—"}%
                    </span>
                    <span style={{ fontSize:8, padding:"2px 7px", borderRadius:10,
                      background:pass?T.greenDim:gap>30?T.redDim:T.amberDim,
                      color:pass?T.green:gap>30?T.red:T.amber, fontWeight:700 }}>
                      {pass?"PASS":"FAIL"}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.05)", borderRadius:2 }}>
                      <div style={{ width:`${Math.min(100,(loss||0)/80*100)}%`,
                        height:"100%", borderRadius:2, background:lc }}/>
                    </div>
                    <span style={{ fontSize:8, color:T.t3, fontFamily:T.mono, minWidth:60 }}>
                      Remit: <span style={{ color:d.remit>=95?T.green:d.remit>=70?T.amber:T.red }}>{d.remit}%</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtered alerts */}
      {filteredAlerts.length > 0 && (
        <div style={{
          background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
        }}>
          <div style={{ padding:"10px 16px 8px", borderBottom:`1px solid ${T.border}`,
            display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:3, height:24, background:T.red, borderRadius:2 }}/>
            <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
              Active Alerts{disco!=="ALL"?` — ${disco}`:""}
            </div>
            <div style={{ marginLeft:"auto", background:T.redDim, color:T.red,
              borderRadius:10, fontSize:8, fontWeight:700, padding:"2px 8px" }}>
              {filteredAlerts.length} ACTIVE
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:0 }}>
            {filteredAlerts.map((a,i) => {
              const ac = a.type==="critical"?T.red:a.type==="warning"?T.amber:T.cyan;
              const rgb = a.type==="critical"?"229,57,53":a.type==="warning"?"255,167,38":"39,199,199";
              return (
                <div key={i} style={{ padding:"10px 14px",
                  borderBottom:`1px solid rgba(39,199,199,0.04)`,
                  borderRight: i%2===0?`1px solid rgba(39,199,199,0.04)`:"none",
                  borderLeft:`3px solid ${ac}`,
                  background:`rgba(${rgb},0.04)` }}>
                  <div style={{ fontWeight:700, color:T.t1, fontSize:10, marginBottom:3 }}>{a.title}</div>
                  <div style={{ color:T.t2, fontSize:9, lineHeight:1.5 }}>{a.body}</div>
                  <div style={{ color:T.t3, fontSize:8, marginTop:4, fontFamily:T.mono }}>
                    {a.time} WAT · {a.disco} · {a.state}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS SECTION (charts)
═══════════════════════════════════════════════════════════ */
function Tip({ active, payload, label, unit="" }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:9,padding:"9px 13px",fontSize:10,minWidth:140}}>
      <div style={{color:T.t3,marginBottom:5,fontSize:9}}>{label}</div>
      {payload.map((p,i)=>p.value!=null&&(
        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:14,marginBottom:2}}>
          <span style={{color:T.t2,fontSize:9}}>{p.name}</span>
          <span style={{color:p.color||T.t1,fontFamily:T.mono,fontWeight:700}}>{typeof p.value==="number"?p.value.toFixed(1):p.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, sub, accent, children, style={} }) {
  return (
    <div style={{
      background:`linear-gradient(145deg,${T.card} 0%,${T.bgDeep} 100%)`,
      border:`1px solid ${T.borderHi}`,borderRadius:14,overflow:"hidden",
      display:"flex",flexDirection:"column",...style
    }}>
      <div style={{padding:"11px 16px 9px",borderBottom:`1px solid ${T.border}`,
        display:"flex",gap:9,alignItems:"flex-start"}}>
        <div style={{width:3,height:34,background:accent,borderRadius:2,flexShrink:0,marginTop:2}}/>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:T.t1,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:1}}>{title}</div>
          <div style={{fontSize:8,color:T.t3,lineHeight:1.4}}>{sub}</div>
        </div>
      </div>
      <div style={{flex:1}}>{children}</div>
    </div>
  );
}

function Insight({ text, color=T.cyan }) {
  const rgb = color===T.red?"229,57,53":color===T.amber?"255,167,38":color===T.green?"29,185,84":"39,199,199";
  return (
    <div style={{margin:"0 14px 12px",padding:"7px 11px",borderRadius:7,
      background:`rgba(${rgb},0.07)`,borderLeft:`2px solid ${color}`,
      fontSize:9,color:T.t2,lineHeight:1.6}}>{text}</div>
  );
}

/* ═══════════════════════════════════════════════
   MAY 2026 ENERGY CAPS SECTION
═══════════════════════════════════════════════ */
function SectionMay2026() {
  const trendColor = t => t==="UP"?T.green:t==="DOWN"?T.red:t==="NEW"?T.cyan:t==="PEND"?T.t3:T.amber;
  const trendIcon  = t => t==="UP"?"▲":t==="DOWN"?"▼":t==="NEW"?"●":t==="PEND"?"⏳":"—";
  const confColor  = c => c==="high"?T.green:c==="med"?T.amber:c==="low"?T.orange:T.t3;
  const confLabel  = c => c==="high"?"HIGH":c==="med"?"MED":c==="low"?"LOW":"—";

  const withAug = mayCaps2026.filter(d => d.augMed !== null).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:13}}>

      {/* Header banner */}
      <div style={{background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,border:`1px solid ${T.borderHi}`,borderRadius:14,padding:"16px 22px",display:"grid",gridTemplateColumns:"1fr auto",gap:20,alignItems:"center"}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:T.t1,letterSpacing:"0.04em",marginBottom:4}}>
            NERC Monthly Energy Caps — All 11 DISCOs now tracked (Apr–Aug 2026)
          </div>
          <div style={{fontSize:10,color:T.t3,lineHeight:1.6}}>
            Median feeder allocation (kWh) per DISCO · August cap based on energy consumed in July 2026 ·
            Source: NERC Order NERC/307/2022 · {withAug} of 11 DISCOs have August data · KAEDC back after missing July · every DISCO now has at least one reading
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[
            {l:"DISCOs w/ Aug",  v:`${withAug}/11`,   c:T.cyan  },
            {l:"Period",         v:"August 2026",      c:T.orange},
            {l:"Basis",          v:"Jul consume",       c:T.t2   },
          ].map((k,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"6px 13px",textAlign:"center"}}>
              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.08em"}}>{k.l}</div>
              <div style={{fontSize:12,fontWeight:700,color:k.c,fontFamily:T.mono}}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Total Feeders Analysed", v:mayCaps2026.reduce((s,d)=>s+(d.feeders||0),0).toLocaleString(), c:T.cyan,  s:`Across ${withAug} DISCOs w/ August data`},
          {l:"Highest August Cap",      v:"705 kWh",  c:T.amber, s:"BEDC — flag: n=15, jumped 148% MoM"},
          {l:"Lowest August Cap",       v:"120 kWh",  c:T.red,   s:"EEDC — first reading, n=1 only"},
          {l:"Biggest Jul→Aug Move",    v:"+148.2%",  c:T.amber, s:"BEDC — likely OCR noise, verify source"},
        ].map((k,i)=>(
          <div key={i} style={{background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,border:`1px solid ${T.borderHi}`,borderRadius:11,padding:"13px 15px"}}>
            <div style={{fontSize:8,color:T.t3,letterSpacing:"0.12em",marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:22,fontWeight:800,color:k.c,fontFamily:T.mono,lineHeight:1,marginBottom:3}}>{k.v}</div>
            <div style={{fontSize:9,color:T.t3}}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:13}}>

        {/* Grouped 3-month bar chart — most recent quarter for readability */}
        <Panel title="June · July · August 2026 — Median Feeder Cap per DISCO"
          sub="kWh per feeder · Teal=Jun · Orange=Jul · Green=Aug · Showing most recent 3 months for readability"
          accent={T.cyan}>
          <div style={{padding:"10px 16px 0",display:"flex",gap:14,flexWrap:"wrap"}}>
            {[{c:"#5bb8d0",l:"June"},{c:T.orange,l:"July"},{c:T.green,l:"August"}].map((x,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:T.t2}}>
                <span style={{width:12,height:12,borderRadius:2,background:x.c,display:"inline-block",opacity:0.85}}/>{x.l}
              </span>
            ))}
          </div>
          <div style={{padding:"8px 16px 0"}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={capTrend} margin={{top:8,right:8,bottom:0,left:-5}} barGap={3} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
                <XAxis dataKey="disco" tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}
                  tickFormatter={v=>`${v}`} width={38} label={{value:"kWh",angle:-90,position:"insideLeft",fill:T.t3,fontSize:8}}/>
                <Tooltip content={({active,payload,label})=>{
                  if(!active||!payload?.length) return null;
                  const d = mayCaps2026.find(x=>x.disco===label);
                  return (
                    <div style={{background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:9,padding:"9px 13px",fontSize:10}}>
                      <div style={{color:T.t1,fontWeight:700,marginBottom:4}}>{label}</div>
                      <div style={{color:T.t3,fontSize:8,marginBottom:5}}>{d?.states}</div>
                      {[["June","#5bb8d0",0],["July",T.orange,1],["August",T.green,2]].map(([lbl,c,idx])=>(
                        payload[idx]?.value != null && (
                          <div key={lbl} style={{display:"flex",justifyContent:"space-between",gap:14,marginBottom:2}}>
                            <span style={{color:T.t3,fontSize:9}}>{lbl}</span>
                            <span style={{color:c,fontFamily:T.mono,fontWeight:700}}>{payload[idx].value} kWh</span>
                          </div>
                        )
                      ))}
                      {d?.pctMJ !== null && (
                        <div style={{color:trendColor(d.trend),fontSize:9,marginTop:4,borderTop:`1px solid ${T.border}`,paddingTop:4}}>
                          {trendIcon(d.trend)} {d.pctMJ > 0?"+":""}{d.pctMJ}%  ·  Δ{d.deltaMJ > 0?"+":""}{d.deltaMJ} kWh
                        </div>
                      )}
                      <div style={{color:confColor(d?.conf),fontSize:8,marginTop:3}}>Confidence: {confLabel(d?.conf)} (n={d?.feeders})</div>
                    </div>
                  );
                }}/>
                <Bar dataKey="jun" name="June"   fill="#5bb8d0"  fillOpacity={0.4}  radius={[3,3,0,0]}/>
                <Bar dataKey="jul" name="July"   fill={T.orange} fillOpacity={0.65} radius={[3,3,0,0]}/>
                <Bar dataKey="aug" name="August" fill={T.green}  fillOpacity={0.9}  radius={[3,3,0,0]}>
                  <LabelList dataKey="aug" position="top" formatter={v=>v?`${v}`:""} style={{fill:T.t2,fontSize:8,fontFamily:T.mono}}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Insight color={T.amber}
            text="⚠ BEDC's +148.2% jump (284→705 kWh) is the standout anomaly this round — sample size is only 15 rows, so this is more likely an OCR misread than a genuine cap increase; verify against the source PDF before reporting it. PHED +25.1% and AEDC −28.1% are both backed by decent samples (51 and 35 rows) and look directionally real. KAEDC returned after a missing July upload. EEDC finally has its first-ever readable data point (n=1, treat as provisional only)."/>
        </Panel>

        {/* Full table */}
        <Panel title="Full DISCO Breakdown — August 2026"
          sub="All 11 DISCOs · Confidence reflects OCR sample size · Every DISCO now has ≥1 reading since April"
          accent={T.orange}>
          <div style={{overflowY:"auto",maxHeight:300}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>{["DISCO","Jul","Aug","Δ%","Conf","Status"].map((h,i)=>(
                  <th key={i} style={{fontSize:8,color:T.t3,textTransform:"uppercase",
                    padding:"8px 8px 6px",textAlign:i>0?"right":"left",
                    borderBottom:`1px solid ${T.border}`,letterSpacing:"0.08em"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {mayCaps2026.map((d,i)=>{
                  const tc  = trendColor(d.trend);
                  const ti  = trendIcon(d.trend);
                  const isNA = d.augMed === null;
                  return (
                    <tr key={i}>
                      <td style={{padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:7,height:7,borderRadius:2,
                            background:isNA?T.t3:tc,
                            flexShrink:0}}/>
                          <div>
                            <div style={{fontSize:10,color:isNA?T.t3:T.t1,fontWeight:600}}>{d.disco}</div>
                            <div style={{fontSize:7,color:T.t3,lineHeight:1.2}}>{d.states.split(",").slice(0,2).join(",")+(d.states.split(",").length>2?"…":"")}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{fontSize:10,fontFamily:T.mono,color:T.t2,textAlign:"right",
                        padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                        {d.julMed ?? "—"}
                      </td>
                      <td style={{fontSize:10,fontFamily:T.mono,
                        color:isNA?T.t3:T.t1,textAlign:"right",fontWeight:700,
                        padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                        {d.augMed ?? "N/A"}
                      </td>
                      <td style={{fontSize:10,fontFamily:T.mono,color:isNA?T.t3:tc,
                        textAlign:"right",padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                        {d.pctMJ !== null ? `${d.pctMJ>=0?"+":""}${d.pctMJ}%` : "—"}
                      </td>
                      <td style={{padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`,textAlign:"right"}}>
                        <span style={{fontSize:8,padding:"2px 6px",borderRadius:8,fontWeight:700,
                          background:`${confColor(d.conf)}22`,color:confColor(d.conf)}}>
                          {confLabel(d.conf)}
                        </span>
                      </td>
                      <td style={{padding:"7px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`,textAlign:"right"}}>
                        {isNA ? (
                          <span style={{fontSize:8,padding:"2px 7px",borderRadius:10,
                            background:"rgba(255,255,255,0.04)",color:T.t3}}>N/A</span>
                        ) : (
                          <span style={{fontSize:8,padding:"2px 8px",borderRadius:10,fontWeight:700,
                            background:d.trend==="UP"?T.greenDim:d.trend==="DOWN"?T.redDim:d.trend==="NEW"?T.cyanDim:T.amberDim,
                            color:tc}}>
                            {ti} {d.trend}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mini summary */}
          <div style={{padding:"8px 14px 10px",borderTop:`1px solid ${T.border}`,
            display:"flex",justifyContent:"space-around"}}>
            {[
              {l:"UP",    v:mayCaps2026.filter(d=>d.trend==="UP").length,   c:T.green},
              {l:"DOWN",  v:mayCaps2026.filter(d=>d.trend==="DOWN").length, c:T.red  },
              {l:"NEW",   v:mayCaps2026.filter(d=>d.trend==="NEW").length,  c:T.cyan },
              {l:"N/A",   v:mayCaps2026.filter(d=>d.trend==="N/A").length,  c:T.t3   },
            ].map((k,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:k.c,fontFamily:T.mono}}>{k.v}</div>
                <div style={{fontSize:8,color:T.t3,letterSpacing:"0.1em"}}>{k.l}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RELIABILITY SECTION — Ikeja Electric fault log
═══════════════════════════════════════════════ */
function SectionReliability() {
  const totalFaults = ieFaultsByYear.reduce((s,y)=>s+y.total,0);
  const fullYears = ieFaultsByYear.filter(y=>!y.year.includes("*"));
  const peakYear = [...ieFaultsByYear].sort((a,b)=>b.total-a.total)[0];
  const worstBU = [...ieFaultsByBU].sort((a,b)=>b.total-a.total)[0];
  const worstUndertaking = ieTopUndertakings[0];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:13}}>

      {/* Header banner */}
      <div style={{background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,border:`1px solid ${T.borderHi}`,borderRadius:14,padding:"16px 22px",display:"grid",gridTemplateColumns:"1fr auto",gap:20,alignItems:"center"}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:T.t1,letterSpacing:"0.04em",marginBottom:4}}>
            Ikeja Electric — Network Fault &amp; Reliability Log
          </div>
          <div style={{fontSize:10,color:T.t3,lineHeight:1.6}}>
            {totalFaults.toLocaleString()} dated fault/outage notifications · Dec 2021 – Aug 2026 · 6 business units ·
            Source: IE public network fault log. This is a notification log, not a duration record —
            it has no restoration timestamps, so SAIDI/SAIFI cannot be computed from it. 2021 and 2026 are partial years.
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {[
            {l:"Total Entries", v:totalFaults.toLocaleString(), c:T.cyan  },
            {l:"Period",        v:"2021–2026",                   c:T.orange},
            {l:"Coverage",      v:"IE only",                     c:T.t2   },
          ].map((k,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"6px 13px",textAlign:"center"}}>
              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.08em"}}>{k.l}</div>
              <div style={{fontSize:12,fontWeight:700,color:k.c,fontFamily:T.mono}}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Worst Full Year",       v:peakYear.year.replace("*",""), c:T.red,   s:`${peakYear.total} entries logged`},
          {l:"Worst Business Unit",   v:worstBU.bu,                    c:T.orange,s:`${worstBU.total} entries since 2022`},
          {l:"Most Fault-Prone Site", v:worstUndertaking.name,         c:T.amber, s:`${worstUndertaking.n} entries — local injection substation`},
          {l:"Avg Entries / Year",    v:Math.round(fullYears.reduce((s,y)=>s+y.total,0)/fullYears.length).toLocaleString(), c:T.cyan, s:"Based on 3 full years (2022–2024)"},
        ].map((k,i)=>(
          <div key={i} style={{background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,border:`1px solid ${T.borderHi}`,borderRadius:11,padding:"13px 15px"}}>
            <div style={{fontSize:8,color:T.t3,letterSpacing:"0.12em",marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:800,color:k.c,fontFamily:T.mono,lineHeight:1,marginBottom:3}}>{k.v}</div>
            <div style={{fontSize:9,color:T.t3}}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:13}}>

        <Panel title="Fault Log Entries by Year" sub="2021 and 2026 are partial years · 2025 is the fullest logging year on record" accent={T.red}>
          <div style={{padding:"8px 16px 0"}}>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={ieFaultsByYear} margin={{top:8,right:8,bottom:0,left:-5}}>
                <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
                <XAxis dataKey="year" tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} width={32}/>
                <Tooltip content={({active,payload,label})=>{
                  if(!active||!payload?.length) return null;
                  const d = ieFaultsByYear.find(x=>x.year===label);
                  return (
                    <div style={{background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:9,padding:"9px 13px",fontSize:10}}>
                      <div style={{color:T.t1,fontWeight:700,marginBottom:4}}>{label}</div>
                      <div style={{color:T.red,fontFamily:T.mono,fontWeight:700}}>{d.total} entries</div>
                      {d.note && <div style={{color:T.t3,fontSize:8,marginTop:3}}>{d.note}</div>}
                    </div>
                  );
                }}/>
                <Bar dataKey="total" name="Entries" radius={[3,3,0,0]}>
                  {ieFaultsByYear.map((d,i)=><Cell key={i} fill={d.year.includes("*")?"rgba(229,57,53,0.35)":T.red} fillOpacity={0.85}/>)}
                  <LabelList dataKey="total" position="top" style={{fill:T.t2,fontSize:9,fontFamily:T.mono}}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Insight color={T.amber} text="⚠ 2025 logged 583 entries — nearly double any prior full year. This could mean genuine network deterioration, or simply that IE's logging/reporting improved that year. Without duration data we can't tell if outages got worse or just better-documented — treat the year-on-year trend as a logging-volume signal, not a confirmed reliability trend, until cross-checked."/>
        </Panel>

        <Panel title="Fault Type Breakdown" sub="All 1,572 entries, categorised by keyword in the fault description" accent={T.cyan}>
          <div style={{padding:"8px 16px 0",maxHeight:230,overflowY:"auto"}}>
            {ieFaultCategories.sort((a,b)=>b.n-a.n).map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
                <span style={{width:8,height:8,borderRadius:2,background:c.color,flexShrink:0}}/>
                <span style={{fontSize:10,color:T.t2,flex:1}}>{c.cat}</span>
                <div style={{width:70,height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                  <div style={{width:`${c.pct*4}%`,height:"100%",borderRadius:3,background:c.color}}/>
                </div>
                <span style={{fontSize:9,fontFamily:T.mono,color:T.t1,minWidth:44,textAlign:"right"}}>{c.n} ({c.pct}%)</span>
              </div>
            ))}
          </div>
          <Insight color={T.cyan} text="🔌 Transformer faults (18%) and outage notifications (17.9%) dominate the confirmed-fault categories. 'CNN/Customer Notification' (19.9%) appears to be IE's internal term for planned network notices, not necessarily unplanned outages — worth confirming the exact definition with IE before treating it as a fault category in customer-facing reporting."/>
        </Panel>
      </div>

      {/* Charts row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:13}}>

        <Panel title="Fault Entries by Business Unit — Year over Year" sub="6 IE business units · 2021 log only covers Shomolu &amp; Abule-Egba (partial year) · Ikorodu shows zero entries pre-2023 (likely a logging gap, not zero faults)" accent={T.orange}>
          <div style={{overflowY:"auto",maxHeight:240}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>{["Business Unit","2021*","2022","2023","2024","2025","2026*","Total"].map((h,i)=>(
                  <th key={i} style={{fontSize:8,color:T.t3,textTransform:"uppercase",padding:"7px 8px 5px",
                    textAlign:i>0?"right":"left",borderBottom:`1px solid ${T.border}`,letterSpacing:"0.06em"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {[...ieFaultsByBU].sort((a,b)=>b.total-a.total).map((d,i)=>(
                  <tr key={i}>
                    <td style={{fontSize:10,color:T.t1,fontWeight:600,padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.bu}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:d.y2021?T.t2:T.t3,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2021||"—"}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:T.t2,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2022}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:T.t2,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2023}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:T.t2,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2024}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:T.amber,fontWeight:700,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2025}</td>
                    <td style={{fontSize:9,fontFamily:T.mono,color:T.t2,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.y2026}</td>
                    <td style={{fontSize:10,fontFamily:T.mono,color:T.red,fontWeight:800,textAlign:"right",padding:"6px 8px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Top 12 Fault-Prone Sites" sub="Local injection substations (undertakings) ranked by fault-log frequency" accent={T.red}>
          <div style={{padding:"6px 0",overflowY:"auto",maxHeight:240}}>
            {ieTopUndertakings.map((u,i)=>{
              const maxN = ieTopUndertakings[0].n;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 16px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                  <span style={{fontSize:9,color:T.t3,fontFamily:T.mono,minWidth:16}}>{i+1}</span>
                  <span style={{fontSize:10,color:T.t1,flex:1}}>{u.name}</span>
                  <div style={{width:70,height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                    <div style={{width:`${(u.n/maxN)*100}%`,height:"100%",borderRadius:3,background:T.red,opacity:0.8}}/>
                  </div>
                  <span style={{fontSize:9,fontFamily:T.mono,color:T.red,fontWeight:700,minWidth:32,textAlign:"right"}}>{u.n}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANALYTICS SECTION
═══════════════════════════════════════════════ */
function SectionAnalytics() {
  const discoColors = { Kaduna:T.red, Jos:T.orange, Yola:"#e040fb", Kano:T.amber,
    Benin:"#ff8a65", Ibadan:"#a5d6a7", Enugu:"#80deea",
    Abuja:T.cyan, Ikeja:T.green, Eko:"#b9f6ca", PH:"#81d4fa" };

  return (
    <div style={{ display:"grid", gap:13, gridTemplateColumns:"1fr 1fr" }}>

      {/* Gen trend */}
      <Panel title="Generation Dispatch · Availability · Installed"
        sub="Q4 2023 → Q4 2025 · Collapse events annotated · Hydro/thermal mix"
        accent={T.cyan} style={{ gridColumn:"1/-1" }}>
        <div style={{ padding:"10px 16px 0", display:"flex", gap:18, flexWrap:"wrap" }}>
          {[
            {c:T.cyan,    dash:false, l:"Avg Dispatched MW"},
            {c:T.green,   dash:true,  l:"Available Capacity"},
            {c:"#4a6572", dash:true,  l:"Installed Capacity"},
            {c:T.orange,  dash:false, l:"Thermal %"},
            {c:"#5bb8d0", dash:false, l:"Hydro %"},
          ].map((x,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:8,color:T.t2}}>
              <span style={{width:20,height:2,display:"inline-block",
                backgroundImage:x.dash?`repeating-linear-gradient(90deg,${x.c} 0,${x.c} 4px,transparent 4px,transparent 8px)`:"none",
                background:x.dash?"none":x.c}}/>
              {x.l}
            </span>
          ))}
          <span style={{fontSize:8,color:T.red}}>⬡ Grid collapse</span>
        </div>
        <div style={{ padding:"4px 16px 0" }}>
          <ResponsiveContainer width="100%" height={195}>
            <ComposedChart data={quarterlyGen} margin={{top:10,right:8,bottom:0,left:-8}}>
              <defs>
                <linearGradient id="gC2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.cyan} stopOpacity={0.22}/>
                  <stop offset="100%" stopColor={T.cyan} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
              <XAxis dataKey="q" tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="mw" domain={[3500,6000]} tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}k`} width={32}/>
              <YAxis yAxisId="pct" orientation="right" domain={[0,100]} tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} width={28}/>
              <Tooltip content={<Tip unit=" MW"/>}/>
              {quarterlyGen.filter(d=>d.collapses>0).map((d,i)=>(
                <ReferenceLine key={i} yAxisId="mw" x={d.q} stroke={T.red} strokeDasharray="3 3" strokeWidth={1}
                  label={{value:`${d.collapses}✕`,position:"top",fill:T.red,fontSize:8}}/>
              ))}
              <Area yAxisId="mw" type="monotone" dataKey="installed" name="Installed" stroke="#4a6572" strokeDasharray="5 3" strokeWidth={1.5} fill="none"/>
              <Area yAxisId="mw" type="monotone" dataKey="avail"     name="Available" stroke={T.green}  strokeDasharray="4 3" strokeWidth={1.5} fill="none"/>
              <Area yAxisId="mw" type="monotone" dataKey="mw"        name="Dispatched" stroke={T.cyan} strokeWidth={2.5} fill="url(#gC2)" dot={{fill:T.cyan,r:4,strokeWidth:0}} activeDot={{r:6}}/>
              <Line yAxisId="pct" type="monotone" dataKey="thermal" name="Thermal %" stroke={T.orange} strokeWidth={1.5} dot={false}/>
              <Line yAxisId="pct" type="monotone" dataKey="hydro"   name="Hydro %"   stroke="#5bb8d0"  strokeWidth={1.5} dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Insight color={T.amber}
          text="⚠ Nigeria dispatches only 31–35% of 13,625 MW installed. Q4 2024 = 5 collapses — worst quarter on record. Available-to-installed gap averages 8,200 MW. Primary constraint: gas supply + deferred maintenance."/>
      </Panel>

      {/* ATC&C Loss Timeline */}
      <Panel title="ATC&C Loss Evolution — All 11 DISCOs"
        sub="Quarterly trend Q1 2024 → Q4 2025 · Dashed = MYTO 20.54% weighted target"
        accent={T.orange}>
        <div style={{ padding:"8px 16px 0" }}>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={atcLossTimeline} margin={{top:8,right:10,bottom:0,left:-8}}>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
              <XAxis dataKey="p" tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,80]} tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} width={28}/>
              <Tooltip content={<Tip unit="%"/>}/>
              <ReferenceLine y={20.54} stroke={T.cyan} strokeDasharray="4 4" strokeWidth={1}
                label={{value:"MYTO target",position:"insideTopRight",fill:T.cyan,fontSize:8}}/>
              <ReferenceArea y1={0} y2={20.54} fill={T.cyan} fillOpacity={0.03}/>
              {Object.entries(discoColors).map(([k,c])=>(
                <Line key={k} type="monotone" dataKey={k} name={k} stroke={c}
                  strokeWidth={k==="Kaduna"||k==="Jos"?2.5:1.5}
                  dot={{fill:c,r:3,strokeWidth:0}} connectNulls={true}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Insight color={T.red}
          text="🔴 Only Eko beats MYTO consistently. Kaduna peaked 71.1% in Q3 2025 — 3.3× its target. Revenue destroyed Q4 2025: ₦139.19B."/>
      </Panel>

      {/* Gas supply */}
      <Panel title="Seplat Gas-to-Power Supply"
        sub="MMscfd quarterly 2025 · Stacked by asset · OML West · SEPNU · Oso-BRT"
        accent={T.amber}>
        <div style={{ padding:"8px 16px 0" }}>
          <ResponsiveContainer width="100%" height={210}>
            <ComposedChart data={gasSupply} margin={{top:4,right:10,bottom:0,left:-8}}>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
              <XAxis dataKey="q" tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} width={28}/>
              <Tooltip content={<Tip unit=" MMscfd"/>}/>
              <Bar dataKey="omlWest" name="OML West" stackId="g" fill={T.amber}  fillOpacity={0.8}/>
              <Bar dataKey="sepnu"   name="SEPNU"    stackId="g" fill={T.orange} fillOpacity={0.8}/>
              <Bar dataKey="oso"     name="Oso-BRT"  stackId="g" fill="#ef9f27" fillOpacity={0.8} radius={[3,3,0,0]}>
                <LabelList dataKey="mmscfd" position="top" formatter={v=>`${v}`} style={{fill:T.t2,fontSize:9,fontFamily:T.mono}}/>
              </Bar>
              <Line type="monotone" dataKey="mmscfd" name="Total" stroke={T.cyan} strokeWidth={2}
                dot={{fill:T.cyan,r:3}} strokeDasharray="4 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Insight color={T.green}
          text="🔋 Seplat FY2025: 172 MMscfd (+55% YoY). ANOH first gas Jan 2026. Oso-BRT Q3 2026. 2026 guidance: +30% YoY."/>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAP SECTION
═══════════════════════════════════════════════════════════ */
function SectionMap({ selectedDisco, setSelectedDisco, filters, setFilters }) {
  return (
    <div style={{ display:"grid", gap:13, gridTemplateColumns:"1.3fr 1fr" }}>

      {/* Map panel */}
      <div style={{
        background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
        border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
      }}>
        <div style={{ padding:"11px 16px 9px", borderBottom:`1px solid ${T.border}`,
          display:"flex", gap:9, alignItems:"center" }}>
          <div style={{ width:3, height:30, background:T.cyan, borderRadius:2 }}/>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
              DISCO Territory Map — ATC&C Loss Rate
            </div>
            <div style={{ fontSize:8, color:T.t3 }}>
              Click a territory to filter dashboard · Colour = Q4 2025 loss rate · Dots = active plants
            </div>
          </div>
          {selectedDisco !== "ALL" && (
            <button onClick={() => { setSelectedDisco("ALL"); setFilters(f=>({...f,disco:"ALL"})); }}
              style={{ marginLeft:"auto", padding:"4px 10px", borderRadius:8, fontSize:9,
                border:`1px solid ${T.border}`, background:"transparent",
                color:T.t3, cursor:"pointer" }}>
              ✕ Clear selection
            </button>
          )}
        </div>
        <div style={{ padding:"12px 16px" }}>
          <NigeriaMap
            selectedDisco={selectedDisco}
            onSelectDisco={(d) => {
              setSelectedDisco(d);
              setFilters(f => ({ ...f, disco: d, state:"All" }));
            }}
            filterState={filters.state}
          />
        </div>
      </div>

      {/* Map legend + DISCO ranking */}
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{
          background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden", flex:1,
        }}>
          <div style={{ padding:"11px 16px 9px", borderBottom:`1px solid ${T.border}`,
            display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:3, height:30, background:T.orange, borderRadius:2 }}/>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                DISCO Loss Ranking — Q4 2025
              </div>
              <div style={{ fontSize:8, color:T.t3 }}>Worst to best · Target 20.54%</div>
            </div>
          </div>
          <div style={{ padding:"6px 0", overflowY:"auto" }}>
            {Object.entries(DISCOS)
              .sort(([,a],[,b]) => b.loss - a.loss)
              .map(([key, d], i) => {
                const pass = d.loss <= d.target;
                const lc = pass?T.green:d.loss>60?T.red:d.loss>40?T.amber:T.orange;
                const barW = Math.round((d.loss / 75) * 100);
                return (
                  <div key={key}
                    onClick={() => { setSelectedDisco(selectedDisco===key?"ALL":key); setFilters(f=>({...f,disco:selectedDisco===key?"ALL":key,state:"All"})); }}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 16px",
                      borderBottom:`1px solid rgba(39,199,199,0.04)`,
                      cursor:"pointer", transition:"background 0.15s",
                      background: selectedDisco===key ? `${d.color}14` : "transparent" }}>
                    <span style={{ fontSize:10, color:T.t3, fontFamily:T.mono, minWidth:14 }}>{i+1}</span>
                    <span style={{ width:8, height:8, borderRadius:2, background:d.color, flexShrink:0 }}/>
                    <span style={{ fontSize:10, color:T.t1, flex:1 }}>{key}</span>
                    <div style={{ width:70, height:4, background:"rgba(255,255,255,0.05)", borderRadius:2 }}>
                      <div style={{ width:`${barW}%`, height:"100%", borderRadius:2, background:lc }}/>
                    </div>
                    <span style={{ fontSize:10, fontFamily:T.mono, color:lc, minWidth:40, textAlign:"right" }}>
                      {d.loss.toFixed(1)}%
                    </span>
                    <span style={{ fontSize:8, padding:"2px 6px", borderRadius:10,
                      background:pass?T.greenDim:T.redDim,
                      color:pass?T.green:T.red, fontWeight:700 }}>
                      {pass?"✓":"✗"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIVE GRID (overview)
═══════════════════════════════════════════════════════════ */
function SectionLive({ liveGW, filters }) {
  const liveHourly = useRef(Array.from({length:24},(_,i)=>({
    h:`${String(i).padStart(2,"0")}:00`,
    mw:3600+Math.round(Math.sin((i/24)*Math.PI*2)*600+(i>18?400:0)),
  }))).current;

  const discoRows = Object.entries(DISCOS).filter(([k]) => {
    if (filters.disco !== "ALL" && k !== filters.disco) return false;
    if (filters.state !== "All" && !DISCOS[k].states.includes(filters.state)) return false;
    return true;
  }).map(([k,d]) => ({key:k,...d}));

  const gridPeak = 5801.84;      // TCN record — 4 March 2025, transmission wheeling record
  const installedCap = 13625;    // NERC-published installed generation capacity (primary benchmark — see methodology note)
  const afdbDemandEst = 20000;   // AfDB estimate, cited in Federal Ministry of Power's NIRP 2024 review process — NOT a NERC figure
  const gap = installedCap - liveGW;
  const gapPct = ((gap / installedCap) * 100).toFixed(1);
  const genPct = (liveGW / installedCap) * 100;
  const peakPct = (gridPeak / installedCap) * 100;
  const afdbPct = Math.min((afdbDemandEst / installedCap) * 100, 100);

  return (
    <div style={{ display:"grid", gap:13, gridTemplateColumns:"repeat(4,1fr)" }}>

      {/* ── NIGERIA POWER GAP — supply vs NERC installed capacity ── */}
      <div style={{
        gridColumn:"1/-1",
        background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
        border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
      }}>
        <div style={{ padding:"14px 20px 10px", borderBottom:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:3, height:32, background:T.red, borderRadius:2, flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.t1, letterSpacing:"0.06em", textTransform:"uppercase" }}>
              Nigeria Power Gap
            </div>
            <div style={{ fontSize:9, color:T.t3 }}>
              Live dispatch vs NERC's installed generation capacity and the historical transmission peak
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9, color:T.t3, letterSpacing:"0.08em" }}>CAPACITY GAP</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.red, fontFamily:T.mono, lineHeight:1,
              textShadow:`0 0 16px rgba(229,57,53,0.4)` }}>
              −{gapPct}%
            </div>
          </div>
        </div>

        <div style={{ padding:"16px 20px 8px", display:"flex", flexDirection:"column", gap:14 }}>

          {/* Installed capacity bar — primary benchmark, NERC-sourced */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:10, color:T.t2 }}>Installed capacity <span style={{color:T.t3}}>(NERC, published monthly)</span></span>
              <span style={{ fontSize:11, fontFamily:T.mono, fontWeight:700, color:T.t1 }}>{installedCap.toLocaleString()} MW</span>
            </div>
            <div style={{ width:"100%", height:14, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:"100%", height:"100%",
                background:`linear-gradient(90deg, rgba(229,57,53,0.35), rgba(229,57,53,0.55))` }}/>
            </div>
          </div>

          {/* AfDB demand estimate marker — clearly separate, clearly attributed */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:10, color:T.t2 }}>Est. national demand <span style={{color:T.t3}}>(AfDB estimate, cited in FMoP's NIRP 2024)</span></span>
              <span style={{ fontSize:11, fontFamily:T.mono, fontWeight:700, color:T.purple }}>~{afdbDemandEst.toLocaleString()} MW</span>
            </div>
            <div style={{ width:"100%", height:14, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:`${afdbPct}%`, height:"100%", borderRadius:4,
                background:`linear-gradient(90deg, ${T.purple}, #7c4fd0)`,
                boxShadow:`0 0 10px rgba(156,111,228,0.35)` }}/>
            </div>
          </div>

          {/* Historical peak bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:10, color:T.t2 }}>Historical grid peak <span style={{color:T.t3}}>(4 Mar 2025, TCN record)</span></span>
              <span style={{ fontSize:11, fontFamily:T.mono, fontWeight:700, color:T.amber }}>{gridPeak.toLocaleString()} MW</span>
            </div>
            <div style={{ width:"100%", height:14, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:`${peakPct}%`, height:"100%", borderRadius:4,
                background:`linear-gradient(90deg, ${T.amber}, #d68a1a)`,
                boxShadow:`0 0 10px rgba(255,167,38,0.35)` }}/>
            </div>
          </div>

          {/* Current generation bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:10, color:T.t2 }}>Current generation <span style={{color:T.green}}>● live</span></span>
              <span style={{ fontSize:11, fontFamily:T.mono, fontWeight:700, color:T.cyan }}>{liveGW.toLocaleString()} MW</span>
            </div>
            <div style={{ width:"100%", height:14, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:`${Math.max(genPct,2)}%`, height:"100%", borderRadius:4,
                background:`linear-gradient(90deg, ${T.cyan}, #1aa8a8)`,
                boxShadow:`0 0 10px rgba(39,199,199,0.4)` }}/>
            </div>
          </div>
        </div>

        {/* Methodology footnote */}
        <div style={{ margin:"6px 20px 16px", padding:"9px 13px", borderRadius:8,
          background:"rgba(229,57,53,0.06)", borderLeft:`2px solid ${T.red}`, fontSize:9, color:T.t2, lineHeight:1.6 }}>
          <strong style={{ color:T.t1 }}>Methodology:</strong> "Installed capacity" ({installedCap.toLocaleString()} MW) is
          the Nigerian Electricity Regulatory Commission's (NERC) own published figure for total grid-connected generation
          capacity, and is the primary benchmark used for the gap calculation above (−{gapPct}%). "Est. national demand"
          (~{afdbDemandEst.toLocaleString()} MW) is <strong>not</strong> a NERC figure — it is an African Development Bank
          estimate, cited during reviews of the Federal Ministry of Power's Nigeria Integrated Resource Plan (NIRP 2024);
          it is shown for additional context, not used in the headline gap calculation. Nigeria does not currently publish
          a live, metered national demand figure. "Historical grid peak" (5,801.84 MW) is TCN's confirmed wheeling
          record, set 4 March 2025. "Current generation" is the live feed dispatch figure shown across this dashboard.
        </div>
      </div>

      {[
        { label:"Grid Output Now",  value:liveGW.toLocaleString(), unit:"MW",  delta:"+489 vs yesterday", up:true,  accent:T.cyan,   sub:"Peak 21:45 WAT",      icon:"⚡" },
        { label:"Energy Sent Out",  value:"97,131",               unit:"MWh", delta:"Tx loss 1,009 MWh", up:true,  accent:T.green,  sub:"Tx loss 1.03%",       icon:"〰" },
        { label:"Plants Offline",   value:"15",                   unit:"/33", delta:"Gas constraint",    up:false, accent:T.orange, sub:"Last: Geregu 06:20",  icon:"🔌" },
        { label:"Capacity Idle",    value:"68.2",                 unit:"%",   delta:"9,293 MW idle",     up:false, accent:T.red,    sub:"Installed 13,625 MW", icon:"📉" },
      ].map((k,i) => (
        <div key={i} style={{
          background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.borderHi}`,
          borderRadius:13, padding:"15px 17px", position:"relative", overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:k.accent}}/>
          <div style={{position:"absolute",top:-14,right:-6,fontSize:48,opacity:0.05,userSelect:"none"}}>{k.icon}</div>
          <div style={{fontSize:8,letterSpacing:"0.14em",color:T.t3,textTransform:"uppercase",marginBottom:7}}>{k.label}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:3}}>
            <span style={{fontSize:25,fontWeight:800,color:T.t1,fontFamily:T.mono,letterSpacing:"-0.02em",lineHeight:1,
              textShadow:k.accent===T.cyan?`0 0 18px ${T.cyan}45`:undefined}}>{k.value}</span>
            <span style={{fontSize:11,color:T.t2}}>{k.unit}</span>
          </div>
          <div style={{fontSize:9,color:T.t3,marginBottom:3}}>{k.sub}</div>
          <div style={{fontSize:9,color:k.up?T.green:T.red}}>{k.up?"▲":"▼"} {k.delta}</div>
        </div>
      ))}

      {/* Hourly chart */}
      <Panel title="Today's Hourly Grid Profile" sub="MW output · 21 May 2026" accent={T.orange} style={{gridColumn:"span 2"}}>
        <div style={{padding:"8px 16px 0"}}>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={liveHourly} margin={{top:8,right:8,bottom:0,left:-8}}>
              <defs>
                <linearGradient id="gO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.orange} stopOpacity={0.28}/>
                  <stop offset="100%" stopColor={T.orange} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 5" stroke="rgba(39,199,199,0.05)" vertical={false}/>
              <XAxis dataKey="h" tick={{fill:T.t3,fontSize:8}} axisLine={false} tickLine={false} interval={5}/>
              <YAxis domain={[2800,5200]} tick={{fill:T.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}k`} width={28}/>
              <Tooltip content={<Tip unit=" MW"/>}/>
              <Area type="monotone" dataKey="mw" name="MW" stroke={T.orange} strokeWidth={2} fill="url(#gO2)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* DISCO table */}
      <Panel title="DISCO Performance" sub="ATC&C loss · Remittance · Q4 2025" accent={T.orange} style={{gridColumn:"span 2"}}>
        <div style={{overflowY:"auto",maxHeight:190}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>{["DISCO","Loss","Target","Remit",""].map((h,i)=>(
                <th key={i} style={{fontSize:8,color:T.t3,textTransform:"uppercase",
                  padding:"7px 10px 5px",textAlign:i>0?"right":"left",
                  borderBottom:`1px solid ${T.border}`,letterSpacing:"0.08em"}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {discoRows.map((d,i)=>{
                const pass = d.loss<=d.target;
                const lc = pass?T.green:d.loss-d.target>30?T.red:T.amber;
                return (
                  <tr key={i}>
                    <td style={{fontSize:10,color:T.t1,padding:"6px 10px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:6,height:6,borderRadius:2,background:d.color,flexShrink:0}}/>
                        {d.key}
                      </span>
                    </td>
                    <td style={{fontSize:10,fontFamily:T.mono,color:lc,textAlign:"right",padding:"6px 10px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>{d.loss.toFixed(1)}%</td>
                    <td style={{fontSize:9,color:T.t3,textAlign:"right",padding:"6px 10px",borderBottom:`1px solid rgba(39,199,199,0.04)`,fontFamily:T.mono}}>{d.target.toFixed(1)}%</td>
                    <td style={{fontSize:9,textAlign:"right",padding:"6px 10px",borderBottom:`1px solid rgba(39,199,199,0.04)`,fontFamily:T.mono,
                      color:d.remit>=95?T.green:d.remit>=70?T.amber:T.red}}>{d.remit}%</td>
                    <td style={{padding:"6px 10px",borderBottom:`1px solid rgba(39,199,199,0.04)`}}>
                      <span style={{fontSize:8,padding:"2px 7px",borderRadius:10,fontWeight:700,
                        background:pass?T.greenDim:T.redDim,color:pass?T.green:T.red}}>{pass?"PASS":"FAIL"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
const DEFAULT_FILTERS = { search:"", disco:"ALL", state:"All", fuel:"All", plantStatus:"All", quarter:"All" };

/* ═══ EXPORT DATA BRIDGE ════════════════════════════════════════ */
const EXPORT_DATA = {
  snapshot:{ gridMW:4332,energySentMWh:97131,plantsOnline:18,plantsTotal:33,
    txLossMWh:1009.57,txLossPct:1.03,utilRate:31.8,installedMW:13625,
    peakMW:4332,peakTime:"21:45 WAT",date:"21 May 2026" },
  discos: Object.entries(DISCOS).map(([k,d])=>({
    name:d.name,loss:d.loss,target:d.target,remit:d.remit,
    invoice:d.invoice,paid:d.paid,status:d.loss<=d.target?"PASS":"FAIL" })),
  plants: PLANTS_ALL.map(p=>({
    name:p.name,fuel:p.fuel,installed:p.installed,liveOutput:p.mw,
    paf:p.paf,status:p.status==="on"?"Online":p.status==="low"?"Low":"Offline" })),
  quarterly:[
    {period:"Q4 2023",installedMW:12671,availMW:4922,dispatchMW:4434,loadFactor:35.0,collapses:0},
    {period:"Q1 2024",installedMW:12671,availMW:4249,dispatchMW:4070,loadFactor:33.5,collapses:2},
    {period:"Q4 2024",installedMW:13625,availMW:5297,dispatchMW:4207,loadFactor:30.9,collapses:5},
    {period:"Q1 2025",installedMW:13625,availMW:5367,dispatchMW:4771,loadFactor:35.0,collapses:0},
    {period:"Q2 2025",installedMW:13625,availMW:5396,dispatchMW:4501,loadFactor:33.0,collapses:0},
    {period:"Q3 2025",installedMW:13625,availMW:5430,dispatchMW:4179,loadFactor:30.7,collapses:1},
    {period:"Q4 2025",installedMW:13625,availMW:5400,dispatchMW:4453,loadFactor:32.7,collapses:1},
  ],
  gas:[
    {period:"Q1 2025",totalMMscfd:166.2,omlWest:129,sepnu:30,oso:7},
    {period:"Q2 2025",totalMMscfd:186.2,omlWest:140,sepnu:38,oso:8},
    {period:"Q3 2025",totalMMscfd:171.1,omlWest:125,sepnu:37,oso:9},
    {period:"Q4 2025",totalMMscfd:164.9,omlWest:118,sepnu:36,oso:11},
  ],
  meta:{ generatedAt:new Date().toISOString(),
    source:"Pawaflux Energy Intelligence Platform",
    dataSources:["Live Feed","NERC Q4 2025","Seplat FY2025","TCN Press"],
    period:"Q4 2025 + Live 21 May 2026" },
};
function genCSV(data, type) {
  const escape = v => {
    if (v == null) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const row = cols => cols.map(escape).join(",");

  if (type === "snapshot") {
    const s = data.snapshot;
    const lines = [
      "Pawaflux Energy Intelligence — Grid Snapshot",
      `Generated:,${new Date().toLocaleString()}`,
      `Period:,${s.date}`,
      "",
      "METRIC,VALUE,UNIT",
      `Grid Output Now,${s.gridMW},MW`,
      `Energy Sent Out,${s.energySentMWh},MWh`,
      `Plants Online,${s.plantsOnline},/${s.plantsTotal}`,
      `Transmission Loss,${s.txLossMWh},MWh`,
      `Transmission Loss %,${s.txLossPct},%`,
      `Capacity Utilisation,${s.utilRate},%`,
      `Installed Capacity,${s.installedMW},MW`,
      `Peak Today,${s.peakMW},MW`,
      `Peak Time,${s.peakTime},`,
    ];
    return lines.join("\n");
  }

  if (type === "discos") {
    const headers = row(["DISCO","ATC&C Loss (%)","MYTO Target (%)","Gap (pp)","Remittance (%)","Invoice (₦B)","Paid (₦B)","Unpaid (₦B)","Status"]);
    const rows = data.discos.map(d =>
      row([d.name, d.loss, d.target, (d.loss - d.target).toFixed(2), d.remit, d.invoice, d.paid, (d.invoice - d.paid).toFixed(2), d.status])
    );
    return ["Pawaflux — DISCO Performance Q4 2025", `Generated: ${new Date().toLocaleString()}`, "", headers, ...rows].join("\n");
  }

  if (type === "plants") {
    const headers = row(["Plant Name","Fuel Type","Installed (MW)","Live Output (MWh)","PAF (%)","Utilisation (%)","Status"]);
    const rows = data.plants.map(p =>
      row([p.name, p.fuel, p.installed, p.liveOutput, p.paf, ((p.liveOutput/p.installed)*100).toFixed(1), p.status])
    );
    return ["Pawaflux — Plant Status Report", `Generated: ${new Date().toLocaleString()}`, "", headers, ...rows].join("\n");
  }

  if (type === "quarterly") {
    const headers = row(["Period","Installed (MW)","Available (MW)","Dispatched (MW)","Load Factor (%)","Grid Collapses"]);
    const rows = data.quarterly.map(q =>
      row([q.period, q.installedMW, q.availMW, q.dispatchMW, q.loadFactor, q.collapses])
    );
    return ["Pawaflux — Quarterly Generation Trend", `Generated: ${new Date().toLocaleString()}`, "", headers, ...rows].join("\n");
  }

  if (type === "gas") {
    const headers = row(["Period","Total (MMscfd)","OML West (MMscfd)","SEPNU (MMscfd)","Oso-BRT (MMscfd)"]);
    const rows = data.gas.map(g =>
      row([g.period, g.totalMMscfd, g.omlWest, g.sepnu, g.oso])
    );
    return ["Pawaflux — Seplat Gas Supply", `Generated: ${new Date().toLocaleString()}`, "", headers, ...rows].join("\n");
  }

  if (type === "full") {
    return [
      genCSV(data, "snapshot"),
      "\n\n",
      genCSV(data, "discos"),
      "\n\n",
      genCSV(data, "plants"),
      "\n\n",
      genCSV(data, "quarterly"),
      "\n\n",
      genCSV(data, "gas"),
    ].join("\n");
  }

  return "";
}

function genJSON(data, type) {
  const payload = {
    meta: data.meta,
    generatedAt: new Date().toISOString(),
    data: type === "full" ? data : { [type]: data[type] || data.snapshot },
  };
  return JSON.stringify(payload, null, 2);
}

function genReport(data) {
  const s = data.snapshot;
  const line = (l, r) => `${l.padEnd(30)}${r}`;
  const separator = "─".repeat(60);

  return [
    "═".repeat(60),
    "  PAWAFLUX ENERGY INTELLIGENCE PLATFORM",
    "  Nigerian Grid Intelligence Report",
    "═".repeat(60),
    "",
    `  Generated:  ${new Date().toLocaleString()}`,
    `  Period:     ${s.date} · Q4 2025`,
    `  Sources:    Live Feed · NERC Q4 2025 · Seplat FY2025`,
    "",
    separator,
    "  GRID SNAPSHOT — LIVE",
    separator,
    line("  Grid Output Now:", `${s.gridMW.toLocaleString()} MW`),
    line("  Energy Sent Out:", `${s.energySentMWh.toLocaleString()} MWh`),
    line("  Plants Online:", `${s.plantsOnline} of ${s.plantsTotal}`),
    line("  Transmission Loss:", `${s.txLossMWh.toLocaleString()} MWh (${s.txLossPct}%)`),
    line("  Capacity Utilisation:", `${s.utilRate}%`),
    line("  Installed Capacity:", `${s.installedMW.toLocaleString()} MW`),
    "",
    separator,
    "  DISCO PERFORMANCE — Q4 2025",
    separator,
    `  ${"DISCO".padEnd(22)} ${"Loss%".padEnd(8)} ${"Target%".padEnd(10)} ${"Remit%".padEnd(9)} STATUS`,
    "  " + "─".repeat(56),
    ...data.discos.map(d =>
      `  ${d.name.padEnd(22)} ${String(d.loss.toFixed(1)+"%").padEnd(8)} ${String(d.target.toFixed(1)+"%").padEnd(10)} ${String(d.remit+"%").padEnd(9)} ${d.status}`
    ),
    "",
    separator,
    "  KEY INTELLIGENCE METRICS",
    separator,
    line("  FGN Subsidy Q4 2025:", "₦418.79 Billion"),
    line("  Revenue Lost ATC&C Q4:", "₦139.19 Billion"),
    line("  Total FGN Subsidy 2024:", "₦1.94 Trillion"),
    line("  Metering Rate:", "57.27%"),
    line("  Seplat Gas FY2025:", "172.0 MMscfd (+55% YoY)"),
    line("  Grid Collapses 2025:", "2 events (Sep + Dec)"),
    line("  Only DISCO passing target:", "Eko (EKEDP) — 14.20%"),
    "",
    separator,
    "  PLANT STATUS",
    separator,
    ...data.plants.map(p =>
      `  ${p.status==="Offline"?"✗":p.status==="Low"?"◐":"✓"} ${p.name.padEnd(18)} ${p.fuel.padEnd(6)} ${String(p.liveOutput+" MWh").padEnd(12)} PAF: ${p.paf}%`
    ),
    "",
    "═".repeat(60),
    "  Pawaflux Energy Intelligence Platform",
    "  Nigeria-specific energy intelligence · gridpawaflux.ng",
    "═".repeat(60),
  ].join("\n");
}

function dlFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

/* ═══════════════════════════════════════════════════════════
   EXPORT PANEL COMPONENT
═══════════════════════════════════════════════════════════ */
const EXPORT_FORMATS = [
  { id:"csv",  label:"CSV",  icon:"📋", desc:"Spreadsheet-ready · Excel / Google Sheets compatible",  color:T.green  },
  { id:"json", label:"JSON", icon:"{ }", desc:"API-ready structured data · for developers",            color:T.cyan   },
  { id:"txt",  label:"PDF*", icon:"📄", desc:"Formatted text report · paste into Word or PDF tool",   color:T.orange },
  { id:"clip", label:"Copy", icon:"📎", desc:"Copy to clipboard · paste directly into any app",        color:T.purple },
];

const EXPORT_DATASETS = [
  { id:"snapshot",  label:"Live Grid Snapshot",      desc:"Current MW, plants, Tx loss, utilisation"  },
  { id:"discos",    label:"DISCO Performance",        desc:"ATC&C loss, remittance, invoice — Q4 2025" },
  { id:"plants",    label:"Plant Status",             desc:"PAF, live output, fuel type — all plants"  },
  { id:"quarterly", label:"Quarterly Trend",          desc:"Generation history Q4 2023 – Q4 2025"      },
  { id:"gas",       label:"Gas Supply (Seplat)",      desc:"MMscfd by asset — Q1–Q4 2025"             },
  { id:"full",      label:"Full Intelligence Pack",   desc:"All datasets combined — complete export"   },
];


function SectionExport() {
  const [selectedFormat,  setSelectedFormat]  = useState("csv");
  const [selectedDataset, setSelectedDataset] = useState("full");
  const [schedule,        setSchedule]        = useState("manual");
  const [scheduleEmail,   setScheduleEmail]   = useState("");
  const [previewContent,  setPreviewContent]  = useState("");
  const [exporting,       setExporting]       = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [exportLog,       setExportLog]       = useState([]);
  const [showPreview,     setShowPreview]      = useState(false);

  const SCHEDULES = [
    { id:"manual",  label:"Manual only"    },
    { id:"daily",   label:"Daily 07:00 WAT"},
    { id:"weekly",  label:"Weekly Monday"  },
    { id:"monthly", label:"Monthly 1st"    },
  ];

  const generatePreview = useCallback(() => {
    let content = "";
    if (selectedFormat === "csv"  || selectedFormat === "clip") content = genCSV(EXPORT_DATA,  selectedDataset);
    if (selectedFormat === "json")  content = genJSON(EXPORT_DATA, selectedDataset);
    if (selectedFormat === "txt")   content = genReport(EXPORT_DATA);
    setPreviewContent(content);
    setShowPreview(true);
  }, [selectedFormat, selectedDataset]);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 600));
    const ts = new Date().toISOString().slice(0,19).replace(/[T:]/g,"-");
    const fmt = selectedFormat;
    const ds  = selectedDataset;

    try {
      if (fmt === "csv") {
        const content = genCSV(EXPORT_DATA, ds);
        dlFile(content, `pawaflux-${ds}-${ts}.csv`, "text/csv");
      } else if (fmt === "json") {
        const content = genJSON(EXPORT_DATA, ds);
        dlFile(content, `pawaflux-${ds}-${ts}.json`, "application/json");
      } else if (fmt === "txt") {
        const content = genReport(EXPORT_DATA);
        dlFile(content, `pawaflux-report-${ts}.txt`, "text/plain");
      } else if (fmt === "clip") {
        const content = genCSV(EXPORT_DATA, ds);
        await copyToClipboard(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }

      const logEntry = {
        id:      Date.now(),
        format:  fmt.toUpperCase(),
        dataset: EXPORT_DATASETS.find(d => d.id === ds)?.label || ds,
        time:    new Date().toLocaleTimeString("en-NG"),
        status:  "success",
      };
      setExportLog(prev => [logEntry, ...prev].slice(0, 8));
    } catch (e) {
      console.error("Export failed:", e);
    }

    setExporting(false);
  };

  const previewLines = previewContent.split("\n").slice(0, 30);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
        border:`1px solid ${T.borderHi}`, borderRadius:14,
        padding:"18px 22px",
        display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"start",
      }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.t1, letterSpacing:"0.04em", marginBottom:4 }}>
            Export & Report Centre
          </div>
          <div style={{ fontSize:10, color:T.t3, lineHeight:1.6 }}>
            Download live grid data, DISCO performance, plant reports, and full intelligence packs.
            Schedule automatic email delivery or copy directly to clipboard for your client reports.
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {["CSV","JSON","TXT","API"].map((f,i) => (
            <div key={i} style={{
              padding:"4px 10px", borderRadius:6, fontSize:8, fontWeight:700,
              background:`rgba(39,199,199,0.08)`, border:`1px solid ${T.border}`,
              color:T.t3, letterSpacing:"0.1em",
            }}>{f}</div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:14 }}>

        {/* LEFT — Export builder */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Format selector */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:28, background:T.cyan, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Step 1 — Choose Export Format
              </div>
            </div>
            <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              {EXPORT_FORMATS.map(f => (
                <div key={f.id} onClick={() => setSelectedFormat(f.id)}
                  style={{
                    padding:"12px 14px", borderRadius:10, cursor:"pointer",
                    border:`1px solid ${selectedFormat===f.id ? f.color : T.border}`,
                    background: selectedFormat===f.id ? `${f.color}14` : "transparent",
                    transition:"all 0.15s",
                  }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:16 }}>{f.icon}</span>
                    <span style={{ fontSize:11, fontWeight:700,
                      color: selectedFormat===f.id ? f.color : T.t2 }}>{f.label}</span>
                    {selectedFormat===f.id && (
                      <span style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%",
                        background:f.color, boxShadow:`0 0 6px ${f.color}` }}/>
                    )}
                  </div>
                  <div style={{ fontSize:9, color:T.t3, lineHeight:1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset selector */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:28, background:T.orange, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Step 2 — Select Dataset
              </div>
            </div>
            <div style={{ padding:"10px 16px", display:"flex", flexDirection:"column", gap:6 }}>
              {EXPORT_DATASETS.map(d => (
                <div key={d.id} onClick={() => setSelectedDataset(d.id)}
                  style={{
                    padding:"9px 12px", borderRadius:9, cursor:"pointer",
                    border:`1px solid ${selectedDataset===d.id ? T.orange : T.border}`,
                    background: selectedDataset===d.id ? T.orangeDim : "transparent",
                    display:"flex", alignItems:"center", gap:12, transition:"all 0.15s",
                  }}>
                  <div style={{
                    width:7, height:7, borderRadius:"50%", flexShrink:0,
                    background: selectedDataset===d.id ? T.orange : T.t3,
                    boxShadow: selectedDataset===d.id ? `0 0 8px ${T.orange}` : "none",
                  }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:600,
                      color: selectedDataset===d.id ? T.orange : T.t1 }}>{d.label}</div>
                    <div style={{ fontSize:8, color:T.t3 }}>{d.desc}</div>
                  </div>
                  {d.id === "full" && (
                    <span style={{ fontSize:8, padding:"2px 7px", borderRadius:10,
                      background:"rgba(230,106,26,0.15)", color:T.orange, fontWeight:700 }}>
                      RECOMMENDED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:28, background:T.purple, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Step 3 — Schedule (Optional)
              </div>
            </div>
            <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {SCHEDULES.map(s => (
                  <button key={s.id} onClick={() => setSchedule(s.id)}
                    style={{
                      padding:"5px 12px", borderRadius:20, fontSize:9, cursor:"pointer",
                      border:`1px solid ${schedule===s.id ? T.purple : T.border}`,
                      background: schedule===s.id ? T.purpleDim : "transparent",
                      color: schedule===s.id ? T.purple : T.t3, transition:"all 0.15s",
                    }}>{s.label}</button>
                ))}
              </div>
              {schedule !== "manual" && (
                <div style={{ display:"flex", alignItems:"center", gap:8,
                  background:"rgba(39,199,199,0.04)", border:`1px solid ${T.border}`,
                  borderRadius:8, padding:"7px 12px" }}>
                  <span style={{ fontSize:11 }}>📧</span>
                  <input
                    placeholder="Delivery email address..."
                    value={scheduleEmail}
                    onChange={e => setScheduleEmail(e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none",
                      color:T.t1, fontSize:10, fontFamily:T.ui }}
                  />
                </div>
              )}
              {schedule !== "manual" && scheduleEmail && (
                <div style={{ fontSize:9, color:T.green, padding:"5px 8px",
                  background:T.greenDim, borderRadius:6, borderLeft:`2px solid ${T.green}` }}>
                  ✓ Scheduled: {SCHEDULES.find(s=>s.id===schedule)?.label} → {scheduleEmail}
                </div>
              )}
            </div>
          </div>

          {/* Export action buttons */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleExport} disabled={exporting}
              style={{
                flex:1, padding:"13px 20px", borderRadius:11, cursor:"pointer",
                background: exporting
                  ? "rgba(39,199,199,0.1)"
                  : `linear-gradient(135deg,${T.cyan} 0%,#1aa8a8 100%)`,
                border:`1px solid ${T.cyan}`,
                color: exporting ? T.t3 : T.bg,
                fontSize:12, fontWeight:800, letterSpacing:"0.06em",
                transition:"all 0.2s",
                boxShadow: exporting ? "none" : `0 0 24px rgba(39,199,199,0.3)`,
              }}>
              {exporting ? "⏳ Generating..." : copied ? "✓ Copied!" : "⬇ Export Now"}
            </button>
            <button onClick={generatePreview}
              style={{
                padding:"13px 18px", borderRadius:11, cursor:"pointer",
                background:"transparent", border:`1px solid ${T.border}`,
                color:T.t2, fontSize:11, transition:"all 0.15s",
              }}>
              👁 Preview
            </button>
          </div>
        </div>

        {/* RIGHT — Preview + Log */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Data preview */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden", flex:1,
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:3, height:28, background:T.amber, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Data Preview
              </div>
              {showPreview && (
                <span style={{ marginLeft:"auto", fontSize:8, color:T.t3 }}>
                  First 30 lines · {EXPORT_DATASETS.find(d=>d.id===selectedDataset)?.label}
                </span>
              )}
            </div>
            <div style={{ padding:"12px 16px", overflowY:"auto", minHeight:200, maxHeight:320 }}>
              {!showPreview ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                  justifyContent:"center", height:200, gap:12, color:T.t3 }}>
                  <span style={{ fontSize:36, opacity:0.3 }}>👁</span>
                  <div style={{ fontSize:11 }}>Click Preview to see export content</div>
                  <div style={{ fontSize:9 }}>or Export Now to download directly</div>
                </div>
              ) : (
                <pre style={{
                  fontSize:8.5, fontFamily:T.mono, color:T.t2,
                  lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-all",
                  margin:0,
                }}>
                  {previewLines.map((line, i) => (
                    <div key={i} style={{
                      padding:"1px 0",
                      color: i === 0 ? T.cyan : i < 3 ? T.amber : line.startsWith("─") || line.startsWith("═") ? T.t3 : T.t2,
                      fontWeight: i < 2 ? 700 : 400,
                    }}>
                      <span style={{ color:T.t3, userSelect:"none", marginRight:8, fontSize:7.5 }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                      {line}
                    </div>
                  ))}
                  {previewContent.split("\n").length > 30 && (
                    <div style={{ color:T.t3, fontSize:8, marginTop:4, fontStyle:"italic" }}>
                      ... {previewContent.split("\n").length - 30} more lines in full export
                    </div>
                  )}
                </pre>
              )}
            </div>
          </div>

          {/* Export log */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"11px 18px 9px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:24, background:T.green, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Export History
              </div>
              {exportLog.length > 0 && (
                <span style={{ marginLeft:"auto", fontSize:8, color:T.t3 }}>
                  {exportLog.length} recent
                </span>
              )}
            </div>
            <div style={{ padding:"8px 0", minHeight:60 }}>
              {exportLog.length === 0 ? (
                <div style={{ padding:"16px 18px", fontSize:10, color:T.t3, textAlign:"center" }}>
                  No exports yet — your history will appear here
                </div>
              ) : exportLog.map(log => (
                <div key={log.id} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"7px 16px", borderBottom:`1px solid rgba(39,199,199,0.04)` }}>
                  <span style={{ width:6, height:6, borderRadius:"50%",
                    background:log.status==="success"?T.green:T.red, flexShrink:0 }}/>
                  <span style={{ fontSize:9, color:T.t2, flex:1 }}>{log.dataset}</span>
                  <span style={{ fontSize:8, padding:"2px 7px", borderRadius:8,
                    background:`rgba(39,199,199,0.08)`, color:T.cyan,
                    fontFamily:T.mono, fontWeight:700 }}>{log.format}</span>
                  <span style={{ fontSize:8, color:T.t3, fontFamily:T.mono }}>{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick export shortcuts */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              { label:"DISCO CSV",    ds:"discos",    fmt:"csv",  color:T.green  },
              { label:"Plants CSV",   ds:"plants",    fmt:"csv",  color:T.cyan   },
              { label:"Full JSON",    ds:"full",      fmt:"json", color:T.purple },
            ].map((q,i) => (
              <button key={i}
                onClick={() => {
                  const content = q.fmt==="csv"
                    ? genCSV(EXPORT_DATA, q.ds)
                    : genJSON(EXPORT_DATA, q.ds);
                  const ts = new Date().toISOString().slice(0,10);
                  dlFile(content, `pawaflux-${q.ds}-${ts}.${q.fmt}`,
                    q.fmt==="json"?"application/json":"text/csv");
                  setExportLog(prev => [{
                    id:Date.now(), format:q.fmt.toUpperCase(),
                    dataset:q.label, time:new Date().toLocaleTimeString("en-NG"),
                    status:"success",
                  }, ...prev].slice(0,8));
                }}
                style={{
                  padding:"8px 10px", borderRadius:9, cursor:"pointer",
                  border:`1px solid ${q.color}44`,
                  background:`${q.color}10`,
                  color:q.color, fontSize:9, fontWeight:600,
                  transition:"all 0.15s",
                }}>
                ⬇ {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALERT CONFIGURATION PANEL
═══════════════════════════════════════════════════════════ */

const ALERT_RULES = [
  {
    id:1, active:true, type:"critical",
    name:"Grid generation drop",
    metric:"grid_mw", operator:"below", threshold:4000, unit:"MW",
    discos:["ALL"], channels:["whatsapp","email"],
    description:"Alert when total grid output falls below threshold",
    lastTriggered:"14:32 WAT today",
  },
  {
    id:2, active:true, type:"critical",
    name:"Large plant offline",
    metric:"plant_mw", operator:"equals", threshold:0, unit:"MWh",
    discos:["ALL"], channels:["whatsapp"],
    minInstalledMW: 400,
    description:"Alert when any plant above 400 MW installed goes offline",
    lastTriggered:"06:20 WAT today (Geregu)",
  },
  {
    id:3, active:true, type:"warning",
    name:"DISCO remittance below threshold",
    metric:"disco_remittance", operator:"below", threshold:60, unit:"%",
    discos:["KAEDC","JED","KEDCO"], channels:["email"],
    description:"Alert when any selected DISCO remittance rate falls below threshold",
    lastTriggered:"12:15 WAT today (Kaduna 41.5%)",
  },
  {
    id:4, active:true, type:"warning",
    name:"ATC&C loss exceeds target",
    metric:"disco_atcc", operator:"above", threshold:60, unit:"%",
    discos:["ALL"], channels:["email"],
    description:"Alert when any DISCO ATC&C loss rate exceeds threshold",
    lastTriggered:"08:00 WAT today (Jos 64.84%)",
  },
  {
    id:5, active:false, type:"info",
    name:"Gas supply threshold",
    metric:"gas_mmscfd", operator:"above", threshold:180, unit:"MMscfd",
    discos:["ALL"], channels:["email"],
    description:"Alert when Seplat gas supply crosses threshold",
    lastTriggered:"Q2 2025 (186.2 MMscfd)",
  },
  {
    id:6, active:true, type:"warning",
    name:"Grid frequency deviation",
    metric:"frequency_hz", operator:"below", threshold:49.75, unit:"Hz",
    discos:["ALL"], channels:["whatsapp","email"],
    description:"Alert when grid frequency drops below NERC lower bound",
    lastTriggered:"11:04 WAT today (49.38 Hz)",
  },
];

const TRIGGERED_LOG = [
  { id:1, type:"critical", rule:"Grid generation drop",              value:"3,890 MW",     disco:"ALL",   time:"13:42", triggered:true  },
  { id:2, type:"critical", rule:"Large plant offline",                value:"Geregu — 0 MW", disco:"AEDC",  time:"06:20", triggered:true  },
  { id:3, type:"warning",  rule:"DISCO remittance below threshold",   value:"Kaduna — 41.5%",disco:"KAEDC", time:"12:15", triggered:true  },
  { id:4, type:"warning",  rule:"ATC&C loss exceeds target",          value:"Jos — 64.84%",  disco:"JED",   time:"08:00", triggered:true  },
  { id:5, type:"info",     rule:"Gas supply threshold",                value:"186.2 MMscfd", disco:"ALL",   time:"09:00", triggered:false },
  { id:6, type:"warning",  rule:"Grid frequency deviation",            value:"49.38 Hz",      disco:"ALL",   time:"11:04", triggered:true  },
];

const METRIC_OPTS = [
  { id:"grid_mw",         label:"Grid Output (MW)",         operators:["below","above","equals"] },
  { id:"plant_mw",        label:"Plant Output (MWh)",        operators:["below","above","equals"] },
  { id:"disco_remittance",label:"DISCO Remittance (%)",       operators:["below","above"]          },
  { id:"disco_atcc",      label:"DISCO ATC&C Loss (%)",       operators:["above","below"]          },
  { id:"gas_mmscfd",      label:"Gas Supply (MMscfd)",        operators:["below","above"]          },
  { id:"frequency_hz",    label:"Grid Frequency (Hz)",        operators:["below","above"]          },
  { id:"tx_loss_pct",     label:"Transmission Loss (%)",      operators:["above","below"]          },
  { id:"plants_offline",  label:"Plants Offline (count)",     operators:["above","equals"]         },
];

const DISCO_OPTIONS = ["ALL","AEDC","BEDC","EEDC","EKEDP","IBEDC","IE","JED","KAEDC","KEDCO","PHED","YEDC"];
const CHANNEL_OPTS = [
  { id:"whatsapp", label:"WhatsApp", icon:"💬", color:T.green  },
  { id:"email",    label:"Email",    icon:"📧", color:T.cyan   },
  { id:"sms",      label:"SMS",      icon:"📱", color:T.amber  },
  { id:"slack",    label:"Slack",    icon:"#",  color:T.purple },
];

function RuleCard({ rule, onToggle, onEdit, onDelete, onTestAlert }) {
  const typeColor = rule.type==="critical"?T.red:rule.type==="warning"?T.amber:T.cyan;
  const typeRgb   = rule.type==="critical"?"229,57,53":rule.type==="warning"?"255,167,38":"39,199,199";

  return (
    <div style={{
      background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
      border:`1px solid ${rule.active ? T.borderHi : T.border}`,
      borderLeft:`4px solid ${rule.active ? typeColor : T.t3}`,
      borderRadius:12, padding:"14px 16px",
      opacity: rule.active ? 1 : 0.6,
      transition:"all 0.2s",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
        {/* Toggle */}
        <div onClick={() => onToggle(rule.id)}
          style={{
            width:36, height:20, borderRadius:10, cursor:"pointer",
            background: rule.active ? typeColor : "rgba(255,255,255,0.1)",
            position:"relative", flexShrink:0, marginTop:2, transition:"all 0.2s",
            boxShadow: rule.active ? `0 0 10px ${typeColor}50` : "none",
          }}>
          <div style={{
            position:"absolute", top:3, left: rule.active ? 18 : 3,
            width:14, height:14, borderRadius:"50%",
            background:"white", transition:"all 0.2s",
          }}/>
        </div>

        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.t1 }}>{rule.name}</span>
            <span style={{ fontSize:8, padding:"2px 7px", borderRadius:10, fontWeight:700,
              background:`rgba(${typeRgb},0.15)`,
              color:typeColor, textTransform:"uppercase" }}>{rule.type}</span>
            {!rule.active && (
              <span style={{ fontSize:8, color:T.t3, fontStyle:"italic" }}>Paused</span>
            )}
          </div>
          <div style={{ fontSize:9, color:T.t3, marginBottom:4 }}>{rule.description}</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <span style={{ fontSize:8, fontFamily:T.mono, color:T.t2,
              background:"rgba(39,199,199,0.07)", padding:"2px 8px", borderRadius:6 }}>
              {METRIC_OPTS.find(m=>m.id===rule.metric)?.label} {rule.operator} {rule.threshold}{rule.unit}
            </span>
            {rule.discos.map(d => (
              <span key={d} style={{ fontSize:8, color:T.t3,
                background:"rgba(255,255,255,0.04)", padding:"2px 7px", borderRadius:6,
                border:`1px solid ${T.border}` }}>{d}</span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {rule.channels.map(c => {
            const ch = CHANNEL_OPTS.find(x=>x.id===c);
            return ch ? (
              <span key={c} title={ch.label} style={{
                fontSize:12, width:24, height:24, borderRadius:6,
                background:`${ch.color}14`, border:`1px solid ${ch.color}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>{ch.icon}</span>
            ) : null;
          })}
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8,
        paddingTop:8, borderTop:`1px solid rgba(39,199,199,0.06)` }}>
        <span style={{ fontSize:8, color:T.t3, flex:1 }}>
          Last triggered: <span style={{ color: rule.active ? typeColor : T.t3 }}>{rule.lastTriggered}</span>
        </span>
        <button onClick={() => onTestAlert(rule)}
          style={{ padding:"3px 10px", borderRadius:7, fontSize:8, cursor:"pointer",
            border:`1px solid ${T.border}`, background:"transparent", color:T.t2 }}>
          🧪 Test
        </button>
        <button onClick={() => onEdit(rule)}
          style={{ padding:"3px 10px", borderRadius:7, fontSize:8, cursor:"pointer",
            border:`1px solid ${T.border}`, background:"transparent", color:T.t2 }}>
          ✏ Edit
        </button>
        <button onClick={() => onDelete(rule.id)}
          style={{ padding:"3px 10px", borderRadius:7, fontSize:8, cursor:"pointer",
            border:`1px solid rgba(229,57,53,0.2)`, background:"transparent", color:T.red }}>
          ✕
        </button>
      </div>
    </div>
  );
}


function RuleEditorModal({ rule, onSave, onCancel }) {
  const [form, setForm] = useState(rule || {
    id: Date.now(), active:true, type:"warning",
    name:"", metric:"grid_mw", operator:"below", threshold:4000, unit:"MW",
    discos:["ALL"], channels:["email"], description:"",
    lastTriggered:"Never",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const toggleDisco  = d => set("discos",   form.discos.includes(d)   ? form.discos.filter(x=>x!==d)   : [...form.discos,d]);
  const toggleChannel= c => set("channels", form.channels.includes(c) ? form.channels.filter(x=>x!==c) : [...form.channels,c]);

  const metricDef = METRIC_OPTS.find(m => m.id === form.metric);
  const typeRgb = form.type==="critical"?"229,57,53":form.type==="warning"?"255,167,38":"39,199,199";
  const typeColor = form.type==="critical"?T.red:form.type==="warning"?T.amber:T.cyan;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(2,11,14,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:20,
    }}>
      <div style={{
        background:`linear-gradient(145deg,${T.card} 0%,${T.bgDeep} 100%)`,
        border:`1px solid ${T.borderHi}`,
        borderRadius:16, width:"100%", maxWidth:560, overflow:"hidden",
        boxShadow:`0 0 60px rgba(39,199,199,0.1)`,
      }}>
        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:3, height:30, background:typeColor, borderRadius:2 }}/>
          <div style={{ fontSize:13, fontWeight:800, color:T.t1 }}>
            {rule ? "Edit Alert Rule" : "Create Alert Rule"}
          </div>
          <button onClick={onCancel}
            style={{ marginLeft:"auto", padding:"4px 12px", borderRadius:8, fontSize:10,
              border:`1px solid ${T.border}`, background:"transparent", color:T.t3, cursor:"pointer" }}>
            ✕ Cancel
          </button>
        </div>

        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14, maxHeight:"75vh", overflowY:"auto" }}>
          {/* Name + Type */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10 }}>
            <div>
              <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>RULE NAME</label>
              <input value={form.name} onChange={e=>set("name",e.target.value)}
                placeholder="e.g. Grid drop below 4,000 MW"
                style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                  border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"8px 12px", color:T.t1, fontSize:11,
                  fontFamily:T.ui, outline:"none" }}/>
            </div>
            <div>
              <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>SEVERITY</label>
              <div style={{ display:"flex", gap:5 }}>
                {["critical","warning","info"].map(t => {
                  const tc = t==="critical"?T.red:t==="warning"?T.amber:T.cyan;
                  return (
                    <button key={t} onClick={()=>set("type",t)}
                      style={{ padding:"7px 11px", borderRadius:8, fontSize:9, cursor:"pointer",
                        border:`1px solid ${form.type===t?tc:T.border}`,
                        background: form.type===t?`${tc}18`:"transparent",
                        color: form.type===t?tc:T.t3, textTransform:"capitalize" }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metric */}
          <div>
            <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>METRIC TO MONITOR</label>
            <select value={form.metric} onChange={e=>set("metric",e.target.value)}
              style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                border:`1px solid ${T.border}`, borderRadius:8,
                padding:"8px 12px", color:T.t1, fontSize:11,
                fontFamily:T.ui, outline:"none", cursor:"pointer" }}>
              {METRIC_OPTS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          {/* Threshold */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>CONDITION</label>
              <select value={form.operator} onChange={e=>set("operator",e.target.value)}
                style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                  border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"8px 12px", color:T.t1, fontSize:11,
                  fontFamily:T.ui, outline:"none", cursor:"pointer" }}>
                {(metricDef?.operators||["below","above","equals"]).map(op => (
                  <option key={op} value={op}>{op === "below" ? "Falls below" : op === "above" ? "Rises above" : "Equals"}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>
                THRESHOLD VALUE ({form.unit})
              </label>
              <input type="number" value={form.threshold} onChange={e=>set("threshold",parseFloat(e.target.value))}
                style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                  border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"8px 12px", color:T.t1, fontSize:11,
                  fontFamily:T.mono, outline:"none" }}/>
            </div>
          </div>

          {/* Preview condition */}
          <div style={{ padding:"8px 12px", background:`rgba(${typeRgb},0.07)`,
            borderRadius:8, borderLeft:`2px solid ${typeColor}`, fontSize:9, color:typeColor }}>
            🔔 Trigger: Alert when <strong>{metricDef?.label}</strong> {form.operator} <strong>{form.threshold}{form.unit}</strong>
          </div>

          {/* DISCO filter */}
          <div>
            <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>
              APPLY TO DISCOs
            </label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {DISCO_OPTIONS.map(d => (
                <button key={d} onClick={() => toggleDisco(d)}
                  style={{ padding:"4px 10px", borderRadius:20, fontSize:9, cursor:"pointer",
                    border:`1px solid ${form.discos.includes(d)?T.cyan:T.border}`,
                    background: form.discos.includes(d)?T.cyanDim:"transparent",
                    color: form.discos.includes(d)?T.cyan:T.t3 }}>{d}</button>
              ))}
            </div>
          </div>

          {/* Delivery channels */}
          <div>
            <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>
              DELIVERY CHANNELS
            </label>
            <div style={{ display:"flex", gap:8 }}>
              {CHANNEL_OPTS.map(ch => (
                <div key={ch.id} onClick={() => toggleChannel(ch.id)}
                  style={{
                    flex:1, padding:"10px 14px", borderRadius:10, cursor:"pointer",
                    border:`1px solid ${form.channels.includes(ch.id)?ch.color:T.border}`,
                    background: form.channels.includes(ch.id)?`${ch.color}14`:"transparent",
                    textAlign:"center", transition:"all 0.15s",
                  }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{ch.icon}</div>
                  <div style={{ fontSize:9, fontWeight:600,
                    color: form.channels.includes(ch.id)?ch.color:T.t3 }}>{ch.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>
              DESCRIPTION (optional)
            </label>
            <textarea value={form.description} onChange={e=>set("description",e.target.value)}
              rows={2} placeholder="Describe this alert rule..."
              style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                border:`1px solid ${T.border}`, borderRadius:8,
                padding:"8px 12px", color:T.t1, fontSize:10,
                fontFamily:T.ui, outline:"none", resize:"vertical" }}/>
          </div>

          {/* Save */}
          <button onClick={() => onSave(form)}
            disabled={!form.name || !form.channels.length}
            style={{
              width:"100%", padding:"13px", borderRadius:11, cursor:"pointer",
              background:`linear-gradient(135deg,${typeColor} 0%,${typeColor}bb 100%)`,
              border:`1px solid ${typeColor}`,
              color: form.type==="critical"?"white":T.bg,
              fontSize:12, fontWeight:800, letterSpacing:"0.06em",
              opacity: (!form.name || !form.channels.length) ? 0.5 : 1,
              boxShadow:`0 0 24px ${typeColor}40`,
            }}>
            {rule ? "✓ Save Changes" : "✓ Create Alert Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}


function SectionAlerts() {
  const [rules,       setRules]       = useState(ALERT_RULES);
  const [editingRule, setEditingRule] = useState(null);
  const [creating,    setCreating]    = useState(false);
  const [testResult,  setTestResult]  = useState(null);
  const [filterType,  setFilterType]  = useState("all");
  const [globalEmail, setGlobalEmail] = useState("john@gridpawaflux.ng");
  const [globalWA,    setGlobalWA]    = useState("+234 800 000 0000");
  const [saved,       setSaved]       = useState(false);

  const toggleRule  = id => setRules(rs => rs.map(r => r.id===id ? {...r,active:!r.active} : r));
  const deleteRule  = id => setRules(rs => rs.filter(r => r.id!==id));
  const saveRule    = (form) => {
    if (editingRule) {
      setRules(rs => rs.map(r => r.id===form.id ? form : r));
      setEditingRule(null);
    } else {
      setRules(rs => [...rs, { ...form, id:Date.now() }]);
      setCreating(false);
    }
  };

  const testAlert = (rule) => {
    setTestResult({ rule, status:"sent", time: new Date().toLocaleTimeString("en-NG") });
    setTimeout(() => setTestResult(null), 4000);
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const filteredRules = rules.filter(r =>
    filterType === "all" ? true :
    filterType === "active" ? r.active :
    filterType === "paused" ? !r.active :
    r.type === filterType
  );

  const activeCount   = rules.filter(r=>r.active).length;
  const triggeredToday = TRIGGERED_LOG.filter(a=>a.triggered).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Test notification toast */}
      {testResult && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:2000,
          background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
          border:`1px solid ${T.green}`,
          borderRadius:12, padding:"12px 18px",
          boxShadow:`0 0 30px rgba(29,185,84,0.3)`,
          animation:"fadeIn 0.3s ease",
          display:"flex", alignItems:"center", gap:10, minWidth:280,
        }}>
          <span style={{ fontSize:20 }}>✅</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.green }}>Test alert sent</div>
            <div style={{ fontSize:9, color:T.t3 }}>
              "{testResult.rule.name}" → {testResult.rule.channels.join(", ")} · {testResult.time}
            </div>
          </div>
        </div>
      )}

      {/* Editor modal */}
      {(editingRule || creating) && (
        <RuleEditorModal
          rule={editingRule}
          onSave={saveRule}
          onCancel={() => { setEditingRule(null); setCreating(false); }}
        />
      )}

      {/* Summary bar */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { l:"Active Rules",      v:activeCount,              c:T.green  },
          { l:"Paused Rules",      v:rules.length-activeCount, c:T.t3     },
          { l:"Triggered Today",   v:triggeredToday,           c:T.orange },
          { l:"Total Rules",       v:rules.length,             c:T.cyan   },
        ].map((k,i) => (
          <div key={i} style={{
            background:`linear-gradient(135deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:11, padding:"12px 16px",
          }}>
            <div style={{ fontSize:8, color:T.t3, letterSpacing:"0.12em", marginBottom:5 }}>{k.l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:k.c, fontFamily:T.mono, lineHeight:1 }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:14, alignItems:"start" }}>

        {/* LEFT — Rules list */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Controls */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:5 }}>
              {["all","active","paused","critical","warning","info"].map(f => {
                const fc = f==="critical"?T.red:f==="warning"?T.amber:f==="info"?T.cyan:T.t3;
                return (
                  <button key={f} onClick={()=>setFilterType(f)}
                    style={{ padding:"4px 10px", borderRadius:20, fontSize:9, cursor:"pointer",
                      border:`1px solid ${filterType===f?fc:T.border}`,
                      background: filterType===f?`${fc}18`:"transparent",
                      color: filterType===f?fc:T.t3, textTransform:"capitalize" }}>{f}</button>
                );
              })}
            </div>
            <button onClick={() => setCreating(true)}
              style={{ marginLeft:"auto", padding:"7px 16px", borderRadius:9, cursor:"pointer",
                background:`linear-gradient(135deg,${T.orange},#c45500)`,
                border:"none", color:"white", fontSize:10, fontWeight:700,
                boxShadow:`0 0 20px ${T.orangeGlow}` }}>
              + New Rule
            </button>
          </div>

          {/* Rule cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filteredRules.length === 0 ? (
              <div style={{ padding:30, textAlign:"center", color:T.t3, fontSize:11,
                background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
                border:`1px solid ${T.border}`, borderRadius:12 }}>
                No rules match this filter
              </div>
            ) : filteredRules.map(rule => (
              <RuleCard
                key={rule.id} rule={rule}
                onToggle={toggleRule}
                onEdit={r => setEditingRule(r)}
                onDelete={deleteRule}
                onTestAlert={testAlert}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Settings + Triggered log */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Delivery settings */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:28, background:T.cyan, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Delivery Settings
              </div>
            </div>
            <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"WhatsApp Number", icon:"💬", value:globalWA,    set:setGlobalWA,    color:T.green  },
                { label:"Email Address",   icon:"📧", value:globalEmail,  set:setGlobalEmail, color:T.cyan   },
              ].map((field,i) => (
                <div key={i}>
                  <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>
                    {field.icon} {field.label}
                  </label>
                  <input value={field.value} onChange={e=>field.set(e.target.value)}
                    style={{ width:"100%", background:"rgba(39,199,199,0.05)",
                      border:`1px solid ${T.border}`, borderRadius:8,
                      padding:"7px 12px", color:T.t1, fontSize:10,
                      fontFamily:T.ui, outline:"none" }}/>
                </div>
              ))}

              {/* Quiet hours */}
              <div>
                <label style={{ fontSize:8, color:T.t3, letterSpacing:"0.1em", display:"block", marginBottom:5 }}>
                  🌙 QUIET HOURS (no alerts during)
                </label>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <input type="time" defaultValue="22:00"
                    style={{ flex:1, background:"rgba(39,199,199,0.05)",
                      border:`1px solid ${T.border}`, borderRadius:8,
                      padding:"6px 10px", color:T.t1, fontSize:10,
                      fontFamily:T.mono, outline:"none" }}/>
                  <span style={{ color:T.t3, fontSize:10 }}>to</span>
                  <input type="time" defaultValue="06:00"
                    style={{ flex:1, background:"rgba(39,199,199,0.05)",
                      border:`1px solid ${T.border}`, borderRadius:8,
                      padding:"6px 10px", color:T.t1, fontSize:10,
                      fontFamily:T.mono, outline:"none" }}/>
                </div>
              </div>

              {/* Critical override */}
              <div style={{ display:"flex", alignItems:"center", gap:10,
                padding:"8px 10px", background:"rgba(229,57,53,0.06)",
                borderRadius:8, border:`1px solid rgba(229,57,53,0.15)` }}>
                <span style={{ fontSize:10 }}>🔴</span>
                <div style={{ flex:1, fontSize:9, color:T.t2 }}>
                  Critical alerts bypass quiet hours
                </div>
                <div style={{ width:32, height:18, borderRadius:9, background:T.red,
                  position:"relative", cursor:"pointer" }}>
                  <div style={{ position:"absolute", top:2, left:16, width:14, height:14,
                    borderRadius:"50%", background:"white" }}/>
                </div>
              </div>

              <button onClick={saveSettings}
                style={{ padding:"9px", borderRadius:9, cursor:"pointer",
                  background: saved ? T.greenDim : `linear-gradient(135deg,${T.cyan},#1aa8a8)`,
                  border:`1px solid ${saved ? T.green : T.cyan}`,
                  color: saved ? T.green : T.bg,
                  fontSize:10, fontWeight:700, transition:"all 0.2s" }}>
                {saved ? "✓ Saved" : "Save Settings"}
              </button>
            </div>
          </div>

          {/* Today's trigger log */}
          <div style={{
            background:`linear-gradient(145deg,${T.card},${T.bgDeep})`,
            border:`1px solid ${T.borderHi}`, borderRadius:14, overflow:"hidden",
          }}>
            <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:3, height:28, background:T.orange, borderRadius:2 }}/>
              <div style={{ fontSize:10, fontWeight:700, color:T.t1, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                Triggered Today
              </div>
              <span style={{ marginLeft:"auto", fontSize:8, padding:"2px 8px",
                background:T.orangeDim, color:T.orange, borderRadius:10, fontWeight:700 }}>
                {triggeredToday} FIRED
              </span>
            </div>
            <div>
              {TRIGGERED_LOG.map((a,i) => {
                const ac = a.type==="critical"?T.red:a.type==="warning"?T.amber:T.cyan;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 16px",
                    borderBottom:`1px solid rgba(39,199,199,0.04)`,
                    opacity: a.triggered ? 1 : 0.4 }}>
                    <span style={{ fontSize:8, width:6, height:6, borderRadius:"50%",
                      background: a.triggered ? ac : T.t3, flexShrink:0,
                      boxShadow: a.triggered ? `0 0 6px ${ac}` : "none" }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:9, color:T.t1, fontWeight:600,
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {a.rule}
                      </div>
                      <div style={{ fontSize:8, color:T.t3 }}>
                        {a.value} · {a.disco}
                      </div>
                    </div>
                    <span style={{ fontSize:8, fontFamily:T.mono, color:T.t3, flexShrink:0 }}>
                      {a.triggered ? a.time : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { icon:"⚡", label:"Live Grid",    id:"live"        },
  { icon:"🗺",  label:"Map View",     id:"map"         },
  { icon:"🔍", label:"Drill Down",    id:"drilldown"   },
  { icon:"📊", label:"Analytics",     id:"analytics"   },
  { icon:"📅", label:"Energy Caps",   id:"may2026"     },
  { icon:"🛠",  label:"Reliability",   id:"reliability", badge:"NEW" },
  { icon:"⬇",  label:"Export",        id:"export"      },
  { icon:"🔔", label:"Alert Config",  id:"alertconfig", badge:3 },
];

export default function PawafluxDashboard() {
  const [activeNav,     setActiveNav]     = useState("live");
  const [liveGW,        setLiveGW]        = useState(4332);
  const [time,          setTime]          = useState(new Date());
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [selectedDisco, setSelectedDisco] = useState("ALL");

  useEffect(()=>{
    const t = setInterval(()=>{
      setTime(new Date());
      setLiveGW(v => Math.max(3800,Math.min(5000,v+Math.round((Math.random()-0.5)*50))));
    },3000);
    return ()=>clearInterval(t);
  },[]);

  const timeStr = time.toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  // Result count for filter bar
  const resultCount = useMemo(() => {
    const plants = PLANTS_ALL.filter(p => {
      if (filters.disco!=="ALL" && p.disco!==filters.disco) return false;
      if (filters.fuel!=="All"  && p.fuel!==filters.fuel)   return false;
      if (filters.plantStatus!=="All" && p.status!==filters.plantStatus) return false;
      if (filters.search) return p.name.toLowerCase().includes(filters.search.toLowerCase());
      return true;
    }).length;
    return plants;
  }, [filters]);

  const syncDiscoFilter = (d) => {
    setSelectedDisco(d);
    setFilters(f => ({ ...f, disco:d, state:"All" }));
  };

  const sections = {
    live:        <SectionLive      liveGW={liveGW} filters={filters}/>,
    map:         <SectionMap       selectedDisco={selectedDisco} setSelectedDisco={syncDiscoFilter} filters={filters} setFilters={setFilters}/>,
    drilldown:   <SectionDrillDown filters={filters}/>,
    analytics:   <SectionAnalytics/>,
    may2026:     <SectionMay2026/>,
    reliability: <SectionReliability/>,
    export:      <SectionExport/>,
    alertconfig: <SectionAlerts/>,
  };

  return (
    <div style={{display:"flex",height:"100vh",background:T.bg,fontFamily:T.ui,color:T.t1,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;scrollbar-color:#1a3a42 transparent}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        button,select,input{font-family:inherit}
        select option{background:#081419;color:#EAF4F6}
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <nav style={{
        width:196, minWidth:196,
        background:`linear-gradient(180deg,#061014 0%,${T.bgDeep} 100%)`,
        borderRight:`1px solid ${T.border}`,
        display:"flex", flexDirection:"column",
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(39,199,199,0.007) 2px,rgba(39,199,199,0.007) 4px)",
      }}>
        <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:3}}>
            <div style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",
              background:"transparent",filter:`drop-shadow(0 0 8px rgba(230,106,26,0.35))`}}>
              <img src={PAWAFLUX_LOGO_B64} alt="Pawaflux" style={{width:34,height:34,objectFit:"contain",display:"block",background:"transparent"}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,letterSpacing:"0.08em"}}>
                <span style={{color:"#fff"}}>PAWA</span><span style={{color:T.orange}}>FLUX</span>
              </div>
              <div style={{fontSize:7,letterSpacing:"0.18em",color:T.cyan,textTransform:"uppercase"}}>Energy Intelligence</div>
            </div>
          </div>
        </div>

        {/* Live badge */}
        <div style={{margin:"9px 11px",background:T.greenDim,border:"1px solid rgba(29,185,84,0.2)",
          borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:7}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.green,
            animation:"pulse 1.2s infinite",boxShadow:`0 0 8px ${T.green}`,display:"block",flexShrink:0}}/>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:T.green,letterSpacing:"0.1em"}}>LIVE FEED</div>
            <div style={{fontSize:7,color:T.t3,fontFamily:T.mono}}>{timeStr} WAT</div>
          </div>
        </div>

        {/* Active filter badge */}
        {(filters.disco!=="ALL"||filters.state!=="All"||filters.fuel!=="All"||filters.search) && (
          <div style={{margin:"0 11px 8px",background:T.cyanDim,border:`1px solid ${T.borderHi}`,
            borderRadius:8,padding:"5px 10px",fontSize:8,color:T.cyan}}>
            <div style={{fontWeight:700,marginBottom:2}}>ACTIVE FILTER</div>
            {filters.disco!=="ALL" && <div>DISCO: {filters.disco}</div>}
            {filters.state!=="All" && <div>State: {filters.state}</div>}
            {filters.fuel!=="All"  && <div>Fuel: {filters.fuel}</div>}
            {filters.search && <div>Search: "{filters.search}"</div>}
            <button onClick={()=>setFilters(DEFAULT_FILTERS)}
              style={{marginTop:4,fontSize:7,color:T.t3,background:"transparent",
                border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 6px",cursor:"pointer"}}>
              Reset all
            </button>
          </div>
        )}

        <div style={{flex:1,padding:"2px 0",overflowY:"auto"}}>
          {NAV.map((item,i)=>(
            <div key={i} onClick={()=>setActiveNav(item.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",
                fontSize:12,cursor:"pointer",transition:"all 0.15s",
                color:activeNav===item.id?T.cyan:T.t2,
                background:activeNav===item.id?T.cyanDim:"transparent",
                borderLeft:`2px solid ${activeNav===item.id?T.cyan:"transparent"}`}}>
              <span style={{fontSize:14,opacity:activeNav===item.id?1:0.55}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge&&(
                <span style={{
                  background: item.badge==="NEW" ? T.green : T.orange,
                  color:"white",borderRadius:10,
                  fontSize:8,fontWeight:700,padding:"2px 6px",
                  boxShadow: item.badge==="NEW" ? `0 0 8px rgba(29,185,84,0.4)` : "none",
                }}>{item.badge}</span>
              )}
            </div>
          ))}
        </div>

        <div style={{padding:"9px 13px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:7,color:T.t3,letterSpacing:"0.1em",marginBottom:4}}>DATA SOURCES</div>
          {["Live Feed","NERC Q4 2025","Seplat FY2025","TCN Press"].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:8,color:T.t3,padding:"2px 0"}}>
              <span style={{width:4,height:4,borderRadius:"50%",background:T.green,display:"inline-block"}}/>
              {s}
            </div>
          ))}
        </div>

        {/* ── PARTNERS — placeholder, populate with logos once partnerships are formally secured ── */}
        <div style={{padding:"9px 13px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:7,color:T.t3,letterSpacing:"0.1em",marginBottom:6}}>DATA PARTNERS</div>
          <div style={{fontSize:8,color:T.t3,fontStyle:"italic",lineHeight:1.5}}>
            Partner logos will appear here once formal data-sharing agreements are signed.
          </div>
        </div>
      </nav>

      {/* ── MAIN ──────────────────────────────────────────── */}
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Topbar */}
        <div style={{height:52,flexShrink:0,
          background:`linear-gradient(90deg,${T.card} 0%,${T.bgDeep} 100%)`,
          borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",padding:"0 20px",gap:12}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.t1,letterSpacing:"0.02em"}}>
              Nigerian Grid Intelligence
            </div>
            <div style={{fontSize:9,color:T.t3}}>NESI · 21 May 2026</div>
          </div>
          <div style={{flex:1}}/>
          <div style={{background:T.card,border:`1px solid ${T.borderHi}`,
            borderRadius:10,padding:"5px 13px",display:"flex",alignItems:"center",gap:9}}>
            <div style={{fontSize:8,color:T.t3,letterSpacing:"0.1em"}}>GRID NOW</div>
            <div style={{fontSize:19,fontWeight:800,color:T.cyan,fontFamily:T.mono,
              textShadow:`0 0 18px ${T.cyan}55`}}>
              {liveGW.toLocaleString()} MW
            </div>
          </div>
          {[
            {l:"Online",    v:"18/33",     c:T.amber},
            {l:"Util Rate", v:"31.8%",     c:T.red  },
            {l:"Tx Loss",   v:"1.03%",     c:T.amber},
          ].map((k,i)=>(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,
              borderRadius:8,padding:"4px 11px",textAlign:"center"}}>
              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.09em"}}>{k.l}</div>
              <div style={{fontSize:11,fontWeight:700,color:k.c,fontFamily:T.mono}}>{k.v}</div>
            </div>
          ))}
          <div style={{width:33,height:33,borderRadius:9,
            background:T.orangeDim,border:`1px solid rgba(230,106,26,0.25)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            position:"relative",cursor:"pointer",fontSize:14}}
            onClick={()=>setActiveNav("alertconfig")}>
            🔔
            <div style={{position:"absolute",top:-4,right:-4,width:15,height:15,
              borderRadius:"50%",background:T.orange,fontSize:8,fontWeight:800,
              color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>3</div>
          </div>
        </div>

        {/* Filter bar — always visible */}
        <div style={{padding:"10px 20px 0",flexShrink:0}}>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={()=>{ setFilters(DEFAULT_FILTERS); setSelectedDisco("ALL"); }}
            resultCount={resultCount}
          />
        </div>

        {/* Status strip */}
        <div style={{flexShrink:0,
          background:`linear-gradient(90deg,${T.card},rgba(15,92,94,0.1) 50%,${T.card})`,
          borderBottom:`1px solid ${T.border}`,
          padding:"6px 20px",display:"flex",alignItems:"center",gap:0,overflowX:"auto",marginTop:10}}>
          {[
            {l:"FGN Subsidy Q4'25",   v:"₦418.79B",  c:T.red   },
            {l:"Revenue Lost ATC&C",  v:"₦139.19B",  c:T.red   },
            {l:"Tx Loss Factor",      v:"7.27%",      c:T.amber },
            {l:"Metering Rate",       v:"57.3%",      c:T.cyan  },
            {l:"Grid Collapses '25",  v:"2 events",   c:T.amber },
            {l:"Seplat Gas FY25",     v:"172 MMscfd", c:T.green },
            {l:"Brent Crude",         v:"$68.07/bbl", c:T.t2    },
            {l:"Aug '26 Caps",        v:"11/11 DISCOs",c:T.green },
            {l:"BEDC Cap Δ Aug '26",  v:"+148.2%⚠",   c:T.amber },
            {l:"PHED Cap Δ Aug '26",  v:"+25.1%",     c:T.green },
          ].map((item,i)=>(
            <div key={i} style={{borderLeft:i>0?`1px solid ${T.border}`:"none",
              padding:"0 16px",whiteSpace:"nowrap"}}>
              <div style={{fontSize:7,color:T.t3,letterSpacing:"0.1em",marginBottom:1}}>{item.l}</div>
              <div style={{fontSize:10,fontWeight:700,color:item.c,fontFamily:T.mono}}>{item.v}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          {sections[activeNav] || sections.live}
        </div>
      </main>
    </div>
  );
}
