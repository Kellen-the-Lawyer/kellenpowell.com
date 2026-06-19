import React, { useState, useEffect } from 'react';
import {
  Scale, Network, BarChart3, FileSearch, BookOpen, Library, CalendarRange,
  FolderKanban, Layers, ArrowRight, Menu, X,
} from 'lucide-react';
import {
  CASEBASE_URL, STATS, FEATURES, CAPABILITIES, NAV_LINKS, CTA,
} from './content';
import { MOCKS } from './Mocks';
import { useInView, useCountUp } from './hooks';
import HeroFlow from './HeroFlow';
import { VisaBulletinCard } from './VisaBulletinCard';
import { PermComparerMock } from './PermComparerCard';
import { DolDashboardCard } from './DolDashboardCard';

/* ════════════════════════════════════════════════════════════════════
   DESIGN — "Slate"
   Minimal, trustworthy, modern-corporate. Cool neutral grays, crisp
   hairline borders, generous whitespace, a single restrained teal
   accent. Sora headings over Inter body. Linear / Stripe-docs calm.
   ════════════════════════════════════════════════════════════════════ */

const PALETTES = {
  light: {
    '--bg': '#f8fafc', '--bg2': '#ffffff', '--bg3': '#f1f5f9', '--bg4': '#e2e8f0',
    '--line': '#e2e8f0', '--line2': '#cbd5e1',
    '--fg': '#0f172a', '--fg2': '#475569', '--fg3': '#94a3b8',
    '--accent': '#0d9488', '--accent2': '#0f766e', '--accent-fg': '#ffffff',
    '--good': '#0d9488', '--bad': '#dc2626', '--warn': '#d97706', '--blue': '#2563eb', '--rose': '#db2777',
    '--radius-mock': '0.75rem', '--grid-dot': 'rgba(100,116,139,0.10)',
  },
  dark: {
    '--bg': '#0b1120', '--bg2': '#0f172a', '--bg3': '#1e293b', '--bg4': '#334155',
    '--line': '#1e293b', '--line2': '#334155',
    '--fg': '#f1f5f9', '--fg2': '#cbd5e1', '--fg3': '#64748b',
    '--accent': '#2dd4bf', '--accent2': '#5eead4', '--accent-fg': '#052e2b',
    '--good': '#2dd4bf', '--bad': '#f87171', '--warn': '#fbbf24', '--blue': '#60a5fa', '--rose': '#f472b6',
    '--radius-mock': '0.75rem', '--grid-dot': 'rgba(148,163,184,0.10)',
  },
};

function Reveal({ children, className = '', delay = 0 }) {
  const [ref] = useInView();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 select-none">
      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] flex-shrink-0">
        <Scale size={16} />
      </span>
      <span className="font-sora text-[1.15rem] font-semibold text-[var(--fg)] tracking-tight">
        Casebase
      </span>
    </span>
  );
}

function Nav({ ThemeToggle }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled ? 'bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--line)]' : 'border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top"><Logo /></a>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-inter text-[var(--fg2)]">
          {NAV_LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-[var(--fg)] transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {ThemeToggle}
          <a href={CASEBASE_URL} className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-inter font-semibold rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent2)] transition-colors">
            Open Casebase <ArrowRight size={15} />
          </a>
          <button className="md:hidden text-[var(--fg2)] p-1" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[var(--bg2)] border-b border-[var(--line)] px-5 py-4 flex flex-col gap-1 font-inter">
          {NAV_LINKS.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="py-2.5 text-[var(--fg2)] border-b border-[var(--line)]">{l}</a>
          ))}
          <a href={CASEBASE_URL} className="mt-3 text-center px-4 py-3 font-semibold rounded-lg bg-[var(--accent)] text-[var(--accent-fg)]">Open Casebase</a>
        </div>
      )}
    </nav>
  );
}

function StatsBand() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section className="px-5 md:px-8 py-10 md:py-12 border-y border-[var(--line)]">
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 md:divide-x md:divide-[var(--line)]">
        {STATS.map((s) => <StatItem key={s.label} stat={s} active={inView} />)}
      </div>
    </section>
  );
}

function StatItem({ stat, active }) {
  const val = useCountUp(stat.target, active, 1500);
  const display = stat.kind === 'm' ? `${val.toFixed(1)}M+` : Math.round(val).toLocaleString();
  return (
    <div className="md:px-8 md:first:pl-0">
      <div className="font-sora text-3xl md:text-[2.4rem] font-semibold text-[var(--accent)] leading-none tracking-tight">
        {active ? display : '0'}
      </div>
      <div className="text-[12px] font-inter text-[var(--fg3)] mt-2 leading-snug">{stat.label}</div>
    </div>
  );
}

function Feature({ f, index }) {
  const Mock = MOCKS[f.mock];
  const flip = index % 2 === 1;
  return (
    <section id={f.id} className="px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal className={flip ? 'lg:order-2' : ''}>
          <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)] mb-4">
            {f.eyebrow}
          </div>
          <h2 className="font-sora text-[1.8rem] md:text-[2.3rem] leading-[1.1] font-semibold tracking-tight text-[var(--fg)]">{f.title}</h2>
          <p className="font-inter text-[1.02rem] leading-relaxed text-[var(--fg2)] mt-4">{f.body}</p>
          <ul className="mt-6 space-y-3">
            {f.points.map((p) => (
              <li key={p} className="flex items-start gap-3 font-inter text-[14px] text-[var(--fg2)]">
                <span className="text-[var(--accent)] mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className={flip ? 'lg:order-1' : ''} delay={120}><Mock /></Reveal>
      </div>
    </section>
  );
}

const ICONS = { Scale, Network, BarChart3, FileSearch, BookOpen, Library, CalendarRange, FolderKanban, Layers };

function CapabilityGrid() {
  return (
    <section id="everything" className="px-5 md:px-8 py-16 md:py-24 border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The whole workbench</div>
            <h2 className="font-sora text-[1.9rem] md:text-[2.4rem] leading-tight font-semibold tracking-tight text-[var(--fg)] mt-3">
              Everything a practitioner reaches for, in one place.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {CAPABILITIES.map((cap, i) => {
            const Icon = ICONS[cap.icon];
            return (
              <Reveal key={cap.title} delay={(i % 3) * 60}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                  style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
                  <Icon size={18} className="text-[var(--accent)]" />
                </div>
                <h3 className="font-sora text-[1.05rem] font-semibold tracking-tight text-[var(--fg)]">{cap.title}</h3>
                <p className="font-inter text-[14px] text-[var(--fg2)] leading-relaxed mt-2">{cap.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative px-5 md:px-8 py-24 md:py-28 overflow-hidden border-t border-[var(--line)]">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <Reveal>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-sora text-[2rem] md:text-[2.8rem] leading-[1.1] font-semibold tracking-tight text-[var(--fg)]">{CTA.title}</h2>
          <p className="mt-4 font-inter text-[1.05rem] text-[var(--fg2)] max-w-lg mx-auto">{CTA.body}</p>
          <a href={CASEBASE_URL} className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] font-inter font-semibold text-base hover:bg-[var(--accent2)] transition-colors">
            {CTA.cta} <ArrowRight size={18} />
          </a>
          <div className="mt-5 font-inter text-[13px] text-[var(--fg3)]">{CTA.url}</div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg2)] py-12 px-5 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Logo />
          <p className="font-inter text-[var(--fg3)] text-[14px] mt-3">A research workbench for employment-based immigration.</p>
          <p className="text-[var(--fg3)] text-[12px] mt-1 font-inter">© {new Date().getFullYear()} Casebase. All rights reserved.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 text-[13px] font-inter">
          <a href={CASEBASE_URL} className="text-[var(--fg2)] hover:text-[var(--accent)] transition-colors">Open Casebase</a>
        </div>
      </div>
    </footer>
  );
}

function CitationGraphSection() {
  const f = FEATURES.find((x) => x.id === 'citations');
  const Graph = MOCKS.graph;
  return (
    <section id="citations" className="px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{f.eyebrow}</div>
            <h2 className="font-sora text-[1.9rem] md:text-[2.4rem] leading-tight font-semibold tracking-tight text-[var(--fg)] mt-3">{f.title}</h2>
            <p className="font-inter text-[1rem] leading-relaxed text-[var(--fg2)] mt-4">{f.body}</p>
          </div>
        </Reveal>
        <Reveal delay={120}><Graph /></Reveal>
      </div>
    </section>
  );
}

function DolDashboardSection() {
  const f = FEATURES.find((x) => x.id === 'data');
  return (
    <section id="data" className="px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{f.eyebrow}</div>
            <h2 className="font-sora text-[1.9rem] md:text-[2.4rem] leading-tight font-semibold tracking-tight text-[var(--fg)] mt-3">{f.title}</h2>
            <p className="font-inter text-[1rem] leading-relaxed text-[var(--fg2)] mt-4">{f.body}</p>
          </div>
        </Reveal>
        <Reveal delay={120}><DolDashboardCard /></Reveal>
      </div>
    </section>
  );
}

function PermComparerSection() {
  const f = FEATURES.find((x) => x.id === 'tools');
  return (
    <section id="tools" className="px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{f.eyebrow}</div>
            <h2 className="font-sora text-[1.9rem] md:text-[2.4rem] leading-tight font-semibold tracking-tight text-[var(--fg)] mt-3">{f.title}</h2>
            <p className="font-inter text-[1rem] leading-relaxed text-[var(--fg2)] mt-4">{f.body}</p>
          </div>
        </Reveal>
        <Reveal delay={120}><PermComparerMock /></Reveal>
      </div>
    </section>
  );
}

function VisaBulletinSection() {
  return (
    <section id="visa-bulletin" className="px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-inter font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Visa Bulletin</div>
            <h2 className="font-sora text-[1.9rem] md:text-[2.4rem] leading-tight font-semibold tracking-tight text-[var(--fg)] mt-3">
              Track priority-date movement across every category.
            </h2>
            <p className="font-inter text-[1rem] leading-relaxed text-[var(--fg2)] mt-4">
              Ten years of bulletins in one workbench — final action and dates for filing, employment and family, every
              chargeability area. Pick a preference and country to see the cut-off, backlog, and month-by-month movement.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}><VisaBulletinCard /></Reveal>
      </div>
    </section>
  );
}

export default function Slate({ mode, ThemeToggle, palettes = PALETTES }) {
  return (
    <div className="font-inter min-h-screen" style={{ ...palettes[mode], background: 'var(--bg)', color: 'var(--fg)' }}>
      <Nav ThemeToggle={ThemeToggle} />
      <HeroFlow mode={mode} />
      <StatsBand />
      {FEATURES.flatMap((f, i) => {
        if (f.id === 'citations') {
          return [<CitationGraphSection key="citations" />, <VisaBulletinSection key="visa-bulletin" />];
        }
        if (f.id === 'data') return []; // moved below the PERM Comparer
        if (f.id === 'tools') return [<PermComparerSection key="tools" />, <DolDashboardSection key="data" />];
        return [<Feature key={f.id} f={f} index={i} />];
      })}
      <CapabilityGrid />
      <CTASection />
      <Footer />
    </div>
  );
}

export const META = {
  key: 'slate',
  name: 'Slate',
  blurb: 'Minimal modern-corporate — cool slate grays, hairline borders, teal accent, Sora + Inter',
  swatch: { light: '#0d9488', dark: '#2dd4bf' },
};
