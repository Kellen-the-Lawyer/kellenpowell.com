import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Scale,
  Network,
  BarChart3,
  FileSearch,
  BookOpen,
  Library,
  CalendarRange,
  FolderKanban,
  Layers,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Gavel,
  Database,
  Menu,
  ShieldCheck,
} from 'lucide-react';

const CASEBASE_URL = 'https://casebase.kellenpowell.com';

/* ─────────────────────────────────────────────────────────────────────────
   Hooks
   ───────────────────────────────────────────────────────────────────────── */

// Adds `.in` to the element (and reports state) the first time it scrolls in.
function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          setInView(true);
          obs.unobserve(el);
        }
      },
      options
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView];
}

// Counts up to `target` once `active` is true.
function useCountUp(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref] = useInView();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared chrome
   ───────────────────────────────────────────────────────────────────────── */

function Logo({ size = 'base' }) {
  const text = size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className="flex items-center gap-2.5 select-none">
      <span className="w-2 h-2 rounded-full bg-amber animate-pulse-dot" />
      <span className={`${text} font-serif text-fg tracking-tight`}>Casebase</span>
    </div>
  );
}

function WindowChrome({ label }) {
  return (
    <div className="flex items-center gap-2 px-4 h-9 border-b border-line bg-ink-2/80 flex-shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
      {label && (
        <span className="ml-3 text-[11px] font-mono text-fg-3 tracking-wide truncate">{label}</span>
      )}
    </div>
  );
}

const OUTCOME = {
  Affirmed: { dot: '#34d399', text: 'text-brand-green' },
  Reversed: { dot: '#f87171', text: 'text-brand-red' },
  Remanded: { dot: '#fbbf24', text: 'text-amber-2' },
};

/* ─────────────────────────────────────────────────────────────────────────
   Mockup: cross-corpus "Search All"
   ───────────────────────────────────────────────────────────────────────── */

const SEARCH_RESULTS = [
  { num: '2023-PER-00148', corpus: 'BALCA', accent: 'text-amber', title: 'Specialty occupation degree requirement', outcome: 'Affirmed' },
  { num: 'JAN032024_01B5203', corpus: 'AAO', accent: 'text-brand-blue', title: 'EB-1A extraordinary ability — final merits', outcome: 'Reversed' },
  { num: '20 CFR § 656.17', corpus: 'CFR', accent: 'text-brand-green', title: 'Recruitment & filing requirements', outcome: null },
  { num: '2022-PER-00091', corpus: 'BALCA', accent: 'text-amber', title: 'Business necessity for foreign language', outcome: 'Remanded' },
];

function SearchMock({ compact = false }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const full = 'specialty occupation degree';
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-line-2 bg-ink-2 overflow-hidden shadow-2xl shadow-black/60"
    >
      <WindowChrome label="casebase.kellenpowell.com" />
      <div className="p-4">
        {/* search field */}
        <div className="flex items-center gap-2 h-10 px-3 rounded-full border border-line-2 bg-ink-3">
          <Search size={14} className="text-fg-3 flex-shrink-0" />
          <span className="text-[13px] text-fg-2 font-sans">
            {typed}
            {inView && typed.length < full.length && <span className="caret text-amber">|</span>}
          </span>
          <span className="ml-auto text-[10px] font-mono text-fg-3 px-2 py-0.5 rounded bg-ink-4 border border-line">
            Search all
          </span>
        </div>

        {/* results */}
        <div className="mt-3 space-y-1.5">
          {SEARCH_RESULTS.slice(0, compact ? 3 : 4).map((r, i) => (
            <div
              key={r.num}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-line bg-ink-3/40"
              style={
                inView
                  ? { animation: `row-in 0.5s ease forwards`, animationDelay: `${900 + i * 220}ms`, opacity: 0 }
                  : { opacity: 0 }
              }
            >
              <span className={`font-mono text-[11px] ${r.accent} pt-0.5 w-[120px] flex-shrink-0 truncate`}>
                {r.num}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-fg leading-snug truncate">{r.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-fg-3 px-1.5 py-0.5 rounded bg-ink-4">
                    {r.corpus}
                  </span>
                  {r.outcome && (
                    <span className={`text-[10px] flex items-center gap-1 ${OUTCOME[r.outcome].text}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: OUTCOME[r.outcome].dot }} />
                      {r.outcome}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Mockup: citation graph
   ───────────────────────────────────────────────────────────────────────── */

const G_NODES = [
  { id: 0, x: 200, y: 150, r: 17, c: '#f59e0b', primary: true },
  { id: 1, x: 95, y: 80, r: 11, c: '#34d399' },
  { id: 2, x: 320, y: 90, r: 13, c: '#f87171' },
  { id: 3, x: 110, y: 220, r: 10, c: '#fbbf24' },
  { id: 4, x: 305, y: 215, r: 12, c: '#34d399' },
  { id: 5, x: 40, y: 150, r: 8, c: '#5a5a68' },
  { id: 6, x: 360, y: 155, r: 8, c: '#5a5a68' },
  { id: 7, x: 200, y: 40, r: 9, c: '#60a5fa' },
  { id: 8, x: 205, y: 262, r: 8, c: '#5a5a68' },
];
const G_EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [1, 5], [2, 6], [3, 8], [4, 6], [2, 7],
];

function CitationGraphMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const len = (a, b) => Math.hypot(G_NODES[a].x - G_NODES[b].x, G_NODES[a].y - G_NODES[b].y);

  return (
    <div ref={ref} className="rounded-xl border border-line-2 bg-ink-2 overflow-hidden shadow-2xl shadow-black/60">
      <WindowChrome label="Citation Graph — 'ability to pay'" />
      <div className="relative">
        <svg viewBox="0 0 400 300" className="w-full h-auto block">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#3a3a3f" />
            </marker>
          </defs>
          {G_EDGES.map(([a, b], i) => {
            const l = len(a, b);
            return (
              <line
                key={i}
                x1={G_NODES[a].x}
                y1={G_NODES[a].y}
                x2={G_NODES[b].x}
                y2={G_NODES[b].y}
                stroke="#3a3a3f"
                strokeWidth="1.2"
                markerEnd="url(#arrow)"
                style={
                  inView
                    ? {
                        strokeDasharray: l,
                        '--len': l,
                        animation: `draw-edge 0.8s ease forwards`,
                        animationDelay: `${400 + i * 90}ms`,
                        strokeDashoffset: l,
                      }
                    : { strokeDasharray: l, strokeDashoffset: l }
                }
              />
            );
          })}
          {G_NODES.map((n, i) => (
            <g
              key={n.id}
              style={
                inView
                  ? { transformOrigin: `${n.x}px ${n.y}px`, animation: `node-pop 0.5s cubic-bezier(.34,1.56,.64,1) forwards`, animationDelay: `${i * 110}ms`, opacity: 0 }
                  : { opacity: 0 }
              }
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.primary ? n.c : `${n.c}cc`}
                stroke={n.primary ? '#fff' : n.c}
                strokeWidth={n.primary ? 2 : 1}
              />
              {n.primary && <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={n.c} strokeWidth="1" opacity="0.4" />}
            </g>
          ))}
        </svg>
        {/* legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-mono text-fg-3">
          {[['#34d399', 'Affirmed'], ['#f87171', 'Reversed'], ['#fbbf24', 'Remanded']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Mockup: DOL data dashboard
   ───────────────────────────────────────────────────────────────────────── */

const BARS = [42, 61, 55, 78, 70, 88, 95];

function DashboardMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const perm = useCountUp(486231, inView);
  const lca = useCountUp(912004, inView);
  const cert = useCountUp(94.2, inView, 1600);

  // donut
  const R = 26;
  const CIRC = 2 * Math.PI * R;

  return (
    <div ref={ref} className="rounded-xl border border-line-2 bg-ink-2 overflow-hidden shadow-2xl shadow-black/60">
      <WindowChrome label="Dashboards — DOL Performance Data" />
      <div className="p-5">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'PERM Filings', val: Math.round(perm).toLocaleString(), c: 'text-amber' },
            { label: 'LCA Filings', val: Math.round(lca).toLocaleString(), c: 'text-brand-blue' },
            { label: 'PERM Cert Rate', val: `${cert.toFixed(1)}%`, c: 'text-brand-green' },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-line bg-ink-3 px-3 py-3">
              <div className={`font-mono text-base font-medium ${k.c}`}>{k.val}</div>
              <div className="text-[9px] uppercase tracking-wider text-fg-3 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-5 items-end">
          {/* bar chart */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-fg-3 mb-2">Filings by FY</div>
            <div className="flex items-end gap-2 h-28">
              {BARS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-amber/40 to-amber"
                    style={{
                      height: `${h}%`,
                      transformOrigin: 'bottom',
                      animation: inView ? `grow-bar 0.7s cubic-bezier(.22,1,.36,1) forwards` : 'none',
                      animationDelay: `${i * 80}ms`,
                      transform: inView ? undefined : 'scaleY(0)',
                    }}
                  />
                  <span className="text-[8px] font-mono text-fg-3">{2020 + i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* donut */}
          <div className="flex flex-col items-center">
            <svg width="78" height="78" viewBox="0 0 78 78">
              <circle cx="39" cy="39" r={R} fill="none" stroke="#2a2a2e" strokeWidth="7" />
              <circle
                cx="39"
                cy="39"
                r={R}
                fill="none"
                stroke="#34d399"
                strokeWidth="7"
                strokeLinecap="round"
                transform="rotate(-90 39 39)"
                strokeDasharray={CIRC}
                style={{
                  strokeDashoffset: inView ? CIRC * (1 - 0.942) : CIRC,
                  transition: 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)',
                }}
              />
              <text x="39" y="43" textAnchor="middle" className="fill-fg font-mono" fontSize="13">
                94%
              </text>
            </svg>
            <span className="text-[9px] uppercase tracking-wider text-fg-3 mt-1">Cert rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Mockup: PERM Comparer (PWD vs experience letter)
   ───────────────────────────────────────────────────────────────────────── */

const REQS = [
  { kw: 'Master’s degree', ok: true },
  { kw: 'Python', ok: true },
  { kw: 'Machine learning', ok: true },
  { kw: 'Apache Spark', ok: false },
  { kw: '36 months exp.', ok: true },
];

function ComparerMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const months = useCountUp(44, inView, 1200);

  return (
    <div ref={ref} className="rounded-xl border border-line-2 bg-ink-2 overflow-hidden shadow-2xl shadow-black/60">
      <WindowChrome label="PERM Comparer — Verify Experience" />
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* PWD requirements */}
          <div className="rounded-lg border border-line bg-ink-3 p-3">
            <div className="text-[9px] uppercase tracking-wider text-fg-3 mb-2">PWD Minimum Requirements</div>
            <p className="text-[11px] leading-relaxed text-fg-2">
              Employer requires a{' '}
              <mark className="bg-amber/20 text-amber-2 rounded px-0.5">Master’s degree</mark> plus{' '}
              <mark className="bg-amber/20 text-amber-2 rounded px-0.5">36 months</mark> of experience using{' '}
              <mark className="bg-amber/20 text-amber-2 rounded px-0.5">Python</mark>,{' '}
              <mark className="bg-amber/20 text-amber-2 rounded px-0.5">machine learning</mark>, and{' '}
              <mark className="bg-amber/20 text-amber-2 rounded px-0.5">Apache Spark</mark>.
            </p>
          </div>
          {/* Letter */}
          <div className="rounded-lg border border-line bg-ink-3 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] uppercase tracking-wider text-fg-3">Experience Letter</div>
              <span className="text-[10px] font-mono text-amber px-2 py-0.5 rounded-full bg-amber/15 border border-amber/30">
                {Math.round(months)} mo
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-fg-2">
              Acme Corp. — Senior Data Scientist, Jan 2021 – Aug 2024. Built ML pipelines in Python; led model
              development and deployment.
            </p>
          </div>
        </div>

        {/* keyword pills */}
        <div className="mt-4">
          <div className="text-[9px] uppercase tracking-wider text-fg-3 mb-2">
            Requirement keywords — 4 of 5 found in letter
          </div>
          <div className="flex flex-wrap gap-2">
            {REQS.map((r, i) => (
              <span
                key={r.kw}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium ${
                  r.ok
                    ? 'text-brand-green border-brand-green/40 bg-brand-green/10'
                    : 'text-brand-red border-brand-red/40 bg-brand-red/10'
                }`}
                style={
                  inView
                    ? { animation: `pill-flip 0.4s ease forwards`, animationDelay: `${700 + i * 160}ms`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                {r.ok ? <Check size={12} /> : <X size={12} />}
                {r.kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Page sections
   ───────────────────────────────────────────────────────────────────────── */

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['Research', '#research'],
    ['Data', '#data'],
    ['Tools', '#tools'],
    ['Everything', '#everything'],
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top"><Logo /></a>
        <div className="hidden md:flex items-center gap-8 text-[13px] text-fg-3">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-fg transition-colors">{l}</a>
          ))}
        </div>
        <a
          href={CASEBASE_URL}
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-md bg-amber text-ink hover:bg-amber-2 transition-colors"
        >
          Open Casebase <ArrowRight size={15} />
        </a>
        <button className="md:hidden text-fg-2 p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-ink-2 border-b border-line px-5 py-4 flex flex-col gap-1">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="py-2.5 text-fg-2 border-b border-line/60">
              {l}
            </a>
          ))}
          <a
            href={CASEBASE_URL}
            className="mt-3 text-center px-4 py-3 font-semibold rounded-md bg-amber text-ink"
          >
            Open Casebase
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-5 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-amber/10 rounded-full blur-[140px] animate-glow pointer-events-none" />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-ink-2 text-[11px] text-fg-2 mb-7">
            <Sparkles size={13} className="text-amber" />
            Immigration research, reimagined
          </div>
          <h1 className="font-serif text-[2.7rem] leading-[1.05] md:text-6xl md:leading-[1.04] text-fg tracking-tight">
            Every PERM decision,
            <br />
            <span className="text-amber">one search box.</span>
          </h1>
          <p className="mt-6 text-lg text-fg-2 leading-relaxed max-w-xl">
            Casebase is a research and analytics workbench for employment-based immigration. Search BALCA and AAO
            case law, the CFR, and USCIS policy together — then back it with 1.4M+ records of DOL outcome data.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href={CASEBASE_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-amber text-ink font-semibold hover:bg-amber-2 transition-colors"
            >
              Open Casebase <ArrowRight size={18} />
            </a>
            <a
              href="#research"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-line-2 bg-ink-2 text-fg-2 font-medium hover:border-fg-3 hover:text-fg transition-colors"
            >
              See it in action
            </a>
          </div>
          <p className="mt-4 text-[13px] text-fg-3 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-brand-green" />
            Free to use — no account, no sign-up.
          </p>
        </div>

        <div className="relative animate-float-slow">
          <SearchMock />
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { target: 1.4, suffix: 'M+', label: 'DOL disclosure records', mono: '1.4M+' },
  { target: 7334, suffix: '', label: 'BALCA decisions indexed', mono: '7,334' },
  { target: 6, suffix: '', label: 'searchable corpora', mono: '6' },
  { target: 21, suffix: '', label: 'pre-built report templates', mono: '21' },
];

function StatsBand() {
  const [ref, inView] = useInView({ threshold: 0.5 });
  return (
    <section className="border-y border-line bg-ink-2/50">
      <div ref={ref} className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} active={inView} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, active }) {
  const val = useCountUp(stat.target, active, 1500);
  const display =
    stat.suffix === 'M+'
      ? `${val.toFixed(1)}M+`
      : `${Math.round(val).toLocaleString()}${stat.suffix}`;
  return (
    <div className="text-center md:text-left">
      <div className="font-mono text-3xl md:text-4xl text-amber">{active ? display : '0'}</div>
      <div className="text-[13px] text-fg-3 mt-2">{stat.label}</div>
    </div>
  );
}

// One alternating feature row: copy on one side, mockup on the other.
function Feature({ id, eyebrow, eyebrowColor, title, body, points, mock, flip }) {
  return (
    <section id={id} className="py-20 md:py-28 px-5">
      <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
        <Reveal className={flip ? 'lg:order-2' : ''}>
          <div className={`text-[12px] font-mono uppercase tracking-[0.15em] ${eyebrowColor}`}>{eyebrow}</div>
          <h2 className="font-serif text-3xl md:text-4xl text-fg mt-3 leading-tight">{title}</h2>
          <p className="text-fg-2 leading-relaxed mt-5 text-[15px]">{body}</p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[14px] text-fg-2">
                <Check size={17} className="text-amber mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className={flip ? 'lg:order-1' : ''} delay={120}>
          {mock}
        </Reveal>
      </div>
    </section>
  );
}

const CAPABILITIES = [
  { icon: Scale, c: 'text-amber', title: 'BALCA & AAO decisions', desc: 'Full-text search across thousands of administrative appeals with outcome filters and judge/panel lookup.' },
  { icon: Network, c: 'text-brand-green', title: 'Citation graphs', desc: 'See how decisions cite each other in an interactive force-directed map, color-coded by outcome.' },
  { icon: BookOpen, c: 'text-brand-blue', title: 'Regulations (CFR)', desc: 'The immigration CFR, cross-linked from the cases that interpret it.' },
  { icon: Library, c: 'text-brand-blue', title: 'Policy manuals', desc: 'USCIS policy and precedent decisions, searchable alongside everything else.' },
  { icon: BarChart3, c: 'text-brand-green', title: 'DOL dashboards', desc: 'PERM, LCA, and Prevailing Wage KPIs — cert rates, top firms, wage trends, SOC breakdowns.' },
  { icon: Layers, c: 'text-amber', title: 'Pivot builder', desc: 'Build any custom report: drag fields, set filters, pivot by any dimension, export to CSV.' },
  { icon: FileSearch, c: 'text-amber', title: 'PERM Comparer', desc: 'Drag in a PWD and experience letters; auto-extract fields and check requirement coverage.' },
  { icon: CalendarRange, c: 'text-brand-rose', title: 'Visa Bulletin', desc: 'Track priority-date movement across categories and chargeability areas.' },
  { icon: FolderKanban, c: 'text-brand-blue', title: 'Projects & Read Later', desc: 'Save cases into projects, drop notes, and stash citations while you read.' },
];

function CapabilityGrid() {
  return (
    <section id="everything" className="py-20 md:py-28 px-5 border-t border-line bg-ink-2/40">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-[12px] font-mono uppercase tracking-[0.15em] text-amber">The whole workbench</div>
            <h2 className="font-serif text-3xl md:text-4xl text-fg mt-3 leading-tight">
              Everything an immigration practitioner reaches for — in one place.
            </h2>
            <p className="text-fg-2 leading-relaxed mt-5 text-[15px]">
              Case law, statutes, policy, and government data stop living in a dozen browser tabs. Casebase keeps
              them under a single search box, cross-linked and ready to cite.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={(i % 3) * 90}>
              <div className="h-full rounded-xl border border-line bg-ink-2 p-6 hover:border-line-2 hover:bg-ink-3 transition-colors group">
                <div className="w-11 h-11 rounded-lg bg-ink-3 border border-line flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <cap.icon size={20} className={cap.c} />
                </div>
                <h3 className="text-fg font-semibold text-[15px] mb-2">{cap.title}</h3>
                <p className="text-fg-3 text-[13px] leading-relaxed">{cap.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section className="py-20 md:py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="rounded-2xl border border-line bg-gradient-to-br from-ink-2 to-ink-3 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              <img
                src="/images/Best_NoBackground_Headshot.png"
                alt="Kellen Powell"
                className="w-28 h-28 rounded-2xl object-cover bg-ink-4 border border-line flex-shrink-0 mx-auto md:mx-0"
              />
              <div>
                <div className="text-[12px] font-mono uppercase tracking-[0.15em] text-amber">Built by a practitioner</div>
                <h2 className="font-serif text-2xl md:text-3xl text-fg mt-3 leading-tight">
                  Made by Kellen Powell, an immigration attorney.
                </h2>
                <p className="text-fg-2 leading-relaxed mt-4 text-[15px]">
                  Casebase started as a tool I built for my own employment-based immigration practice — a faster way
                  to research BALCA and AAO decisions and make sense of DOL outcome data. A decade of practice and ten
                  years in the Army taught me to value tools that are direct, data-driven, and built for the actual work.
                  Now it’s open for anyone to use.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber/10 rounded-full blur-[120px] animate-glow pointer-events-none" />
      <Reveal>
        <div className="relative max-w-3xl mx-auto text-center">
          <Gavel size={32} className="text-amber mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl text-fg leading-[1.08]">
            Open Casebase and start searching.
          </h2>
          <p className="mt-5 text-lg text-fg-2 max-w-xl mx-auto">
            It’s free to use right now — no account, no paywall. Just open it and run a query.
          </p>
          <a
            href={CASEBASE_URL}
            className="mt-9 inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-amber text-ink font-semibold text-lg hover:bg-amber-2 transition-colors"
          >
            Open Casebase <ArrowRight size={20} />
          </a>
          <div className="mt-5 font-mono text-[13px] text-fg-3">casebase.kellenpowell.com</div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2/60 py-12 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Logo />
          <p className="text-fg-3 text-[13px] mt-3">
            A research workbench for employment-based immigration.
          </p>
          <p className="text-fg-3 text-[12px] mt-1">
            © {new Date().getFullYear()} Kellen Powell. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 text-[13px]">
          <a href={CASEBASE_URL} className="text-fg-2 hover:text-amber transition-colors flex items-center gap-1.5">
            <Database size={15} /> Open Casebase
          </a>
          <a href="https://www.linkedin.com/in/kellen-powell-immigration" target="_blank" rel="noreferrer" className="text-fg-3 hover:text-fg transition-colors">
            LinkedIn
          </a>
          <a href="mailto:kellen@kellenpowell.com" className="text-fg-3 hover:text-fg transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   App
   ───────────────────────────────────────────────────────────────────────── */

function App() {
  return (
    <div className="min-h-screen bg-ink text-fg">
      <Nav />
      <Hero />
      <StatsBand />

      <Feature
        id="research"
        eyebrow="Cross-corpus search"
        eyebrowColor="text-brand-rose"
        title="One query across every source that matters."
        body="Type once and search BALCA decisions, AAO decisions, the CFR, and USCIS policy at the same time. Results are ranked by relevance and citation authority, with full operator support for exact phrases, exclusions, and OR."
        points={[
          'BALCA & AAO full-text search with outcome filters',
          'Inline citation hyperlinks jump straight to the cited case',
          'Operators: "exact phrase", -exclude, term OR term',
        ]}
        mock={<SearchMock />}
      />

      <Feature
        id="citations"
        eyebrow="Citation graph"
        eyebrowColor="text-brand-green"
        title="See how the case law connects."
        body="Every decision sits in a web of citations. Casebase draws that web as an interactive graph so you can spot the authorities that anchor a line of reasoning — sized by influence, colored by outcome."
        points={[
          'Force-directed graph of citing and cited decisions',
          'Nodes colored by outcome: affirmed, reversed, remanded',
          'Click any node to open the full decision',
        ]}
        mock={<CitationGraphMock />}
        flip
      />

      <Feature
        id="data"
        eyebrow="DOL performance data"
        eyebrowColor="text-brand-green"
        title="1.4M+ records of what actually happened."
        body="Go beyond the opinions. Explore PERM, LCA, and Prevailing Wage disclosure data from FY2020–FY2026 with live dashboards, 21 pre-built report templates, and a pivot builder for anything custom."
        points={[
          'KPI dashboards: cert rates, top firms, wage trends, SOC drift',
          '21 template reports across outcomes and cross-program trends',
          'Pivot builder with CSV export for your own cuts',
        ]}
        mock={<DashboardMock />}
      />

      <Feature
        id="tools"
        eyebrow="PERM Comparer"
        eyebrowColor="text-amber"
        title="Check experience against the PWD in seconds."
        body="Drag in a Prevailing Wage Determination and your experience verification letters. Casebase extracts the fields, computes total months, and checks each requirement keyword against the letters — flagging what’s covered and what’s missing."
        points={[
          'Auto-extract fields from ETA-9141 PWDs and experience letters',
          'Requirement keyword coverage, found vs. missing',
          'Equal-pay-transparency checks by jurisdiction',
        ]}
        mock={<ComparerMock />}
        flip
      />

      <CapabilityGrid />
      <Founder />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
