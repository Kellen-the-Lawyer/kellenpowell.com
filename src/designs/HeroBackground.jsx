import React, { useMemo } from 'react';

/* Bolder, concept-driven hero backgrounds for the Slate/Teal layout.
   Each ties to what Casebase is — case law, unified corpora, global
   immigration. All vector/CSS, theme-aware (read --accent / --blue / --bg),
   so they stay crisp and adapt to light/dark. Swap with the `variant` prop. */

export const HERO_BG_OPTIONS = [
  ['grid', 'Grid (current)'],
  ['casewall', 'Living case wall'],
  ['globe', 'Wireframe globe'],
  ['ribbons', 'Data ribbons'],
];

/* ── Grid (the current faint dotted grid) ──────────────────────────── */
function Grid() {
  return <div className="absolute inset-0 grid-bg opacity-60" />;
}

/* ── Living case wall — scrolling columns of case citations ─────────── */
const CASE_POOL = [
  ['2023-PER-00148', 'BALCA', 'Affirmed'],
  ['JAN032024_01B5203', 'AAO', 'Reversed'],
  ['20 CFR § 656.17', 'CFR', null],
  ['2022-PER-00091', 'BALCA', 'Remanded'],
  ['MAR152023_02A2041', 'AAO', 'Affirmed'],
  ['2024-PER-00337', 'BALCA', 'Reversed'],
  ['8 CFR § 204.5', 'CFR', null],
  ['2021-PER-01180', 'BALCA', 'Affirmed'],
  ['FEB092024_03B7711', 'AAO', 'Remanded'],
  ['2023-PER-00742', 'BALCA', 'Affirmed'],
  ['20 CFR § 656.40', 'CFR', null],
  ['DEC012022_01C9033', 'AAO', 'Reversed'],
  ['2022-PER-00514', 'BALCA', 'Affirmed'],
  ['AUG222023_04A1567', 'AAO', 'Affirmed'],
  ['2024-PER-00088', 'BALCA', 'Remanded'],
  ['USCIS PM-602-0122', 'Policy', null],
  ['2023-PER-01045', 'BALCA', 'Reversed'],
  ['MAY182023_02B3390', 'AAO', 'Affirmed'],
  ['2021-PER-00659', 'BALCA', 'Affirmed'],
  ['20 CFR § 656.24', 'CFR', null],
];
const OUT_COLOR = { Affirmed: 'var(--good)', Reversed: 'var(--bad)', Remanded: 'var(--warn)' };

function renderChip([id, corpus, outcome], key) {
  return (
    <div key={key} className="rounded-md border border-[var(--line)] bg-[var(--bg2)] px-2.5 py-1.5 flex items-center gap-1.5 whitespace-nowrap shadow-sm">
      <span className="text-[10px] font-mono text-[var(--accent)]">{id}</span>
      <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--fg3)]">{corpus}</span>
      {outcome && <span className="w-1.5 h-1.5 rounded-full" style={{ background: OUT_COLOR[outcome] }} />}
    </div>
  );
}

function CaseWall() {
  const columns = useMemo(
    () => Array.from({ length: 6 }, (_, c) =>
      Array.from({ length: 7 }, (_, r) => CASE_POOL[(c * 5 + r * 3) % CASE_POOL.length])
    ),
    []
  );
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.45,
        maskImage: 'radial-gradient(ellipse 80% 75% at 88% 45%, #000 22%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 88% 45%, #000 22%, transparent 72%)',
      }}
    >
      <div className="flex gap-3 h-full w-full justify-end pr-[2%] -rotate-6 scale-125 origin-right">
        {columns.map((col, ci) => (
          <div key={ci} className="w-[150px] overflow-hidden flex-shrink-0">
            <div
              className="flex flex-col gap-3"
              style={{ animation: `marquee-up ${34 + ci * 7}s linear infinite`, animationDelay: `${ci * -6}s` }}
            >
              {[...col, ...col].map((it, i) => renderChip(it, i))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Wireframe globe with glowing arcs (global immigration) ─────────── */
function GlobeBg() {
  const R = 250;
  const cx = 0;
  const cy = 0;
  const meridians = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const t = (i / 6) * Math.PI; // 0..π
      return Math.abs(R * Math.cos(t));
    }),
    []
  );
  const parallels = useMemo(
    () => Array.from({ length: 5 }, (_, i) => {
      const off = ((i - 2) / 3) * R; // -R..R-ish
      const rx = Math.sqrt(Math.max(0, R * R - off * off));
      return { off, rx };
    }),
    []
  );
  // surface points for arcs (lon, lat) -> projected to the visible hemisphere
  const pts = useMemo(() => {
    const P = (lon, lat) => [R * Math.cos(lat) * Math.sin(lon), -R * Math.sin(lat)];
    const a = P(-0.7, 0.5), b = P(0.6, 0.1), c = P(0.1, -0.6), d = P(-0.4, -0.2), e = P(0.9, 0.55);
    return { a, b, c, d, e };
  }, [R]);
  const arc = (p, q) => {
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const lift = 1.35; // bow outward from center
    return `M ${p[0]} ${p[1]} Q ${mx * lift} ${my * lift} ${q[0]} ${q[1]}`;
  };
  const arcs = [
    [pts.a, pts.b], [pts.b, pts.c], [pts.d, pts.e], [pts.a, pts.c],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 right-[-12%] md:right-[2%] w-[36rem] h-[36rem] animate-float-slow">
        <svg viewBox="-300 -300 600 600" className="w-full h-full">
          <defs>
            <clipPath id="globe-clip"><circle cx={cx} cy={cy} r={R} /></clipPath>
            <radialGradient id="globe-fade" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R} fill="url(#globe-fade)" />
          <g clipPath="url(#globe-clip)" stroke="var(--accent)" fill="none">
            {meridians.map((rx, i) => (
              <ellipse key={`m${i}`} cx={cx} cy={cy} rx={rx} ry={R} strokeOpacity="0.16" strokeWidth="1" />
            ))}
            {parallels.map((p, i) => (
              <ellipse key={`p${i}`} cx={cx} cy={cy + p.off} rx={p.rx} ry={R * 0.16} strokeOpacity="0.16" strokeWidth="1" />
            ))}
          </g>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1.2" />
          {arcs.map(([p, q], i) => (
            <path key={`a${i}`} d={arc(p, q)} fill="none" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
          ))}
          {Object.values(pts).map((p, i) => (
            <circle key={`pt${i}`} cx={p[0]} cy={p[1]} r="3.5" fill="var(--accent)" opacity="0.85" />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ── Data ribbons — flowing translucent teal streams ───────────────── */
function wavePath(yBase, amp, phase, width = 1200, seg = 7) {
  const step = width / seg;
  const pts = [];
  for (let i = 0; i <= seg; i++) pts.push([i * step, yBase + Math.sin(i * 0.8 + phase) * amp]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

const RIBBONS = [
  { y: 150, a: 70, p: 0.0, o: 0.55, w: 3 },
  { y: 230, a: 100, p: 1.1, o: 0.4, w: 2.2 },
  { y: 300, a: 60, p: 2.2, o: 0.5, w: 4 },
  { y: 380, a: 120, p: 0.6, o: 0.3, w: 2 },
  { y: 200, a: 150, p: 3.0, o: 0.22, w: 6 },
];

function Ribbons() {
  return (
    <div
      className="absolute inset-0"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <svg viewBox="0 0 1200 540" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="ribbon-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="70%" stopColor="var(--blue)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {RIBBONS.map((r, i) => (
          <path
            key={i}
            d={wavePath(r.y, r.a, r.p)}
            fill="none"
            stroke="url(#ribbon-grad)"
            strokeWidth={r.w}
            strokeOpacity={r.o}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

const VARIANTS = { grid: Grid, casewall: CaseWall, globe: GlobeBg, ribbons: Ribbons };

export default function HeroBackground({ variant = 'casewall' }) {
  const V = VARIANTS[variant] || Grid;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <V />
    </div>
  );
}
