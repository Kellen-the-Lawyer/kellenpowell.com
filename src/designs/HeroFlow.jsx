import React from 'react';
import { ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { HERO } from './content';
import FlowCanvas from './FlowCanvas';

/* ════════════════════════════════════════════════════════════════════
   Immersive "Flow" hero — visualizes the tagline: streams of case data
   converge into a single glowing search box, drawn by FlowCanvas behind
   the copy.
   ════════════════════════════════════════════════════════════════════ */

export default function HeroFlow({ mode }) {
  return (
    <header id="top" className="relative overflow-hidden px-5 md:px-8 min-h-[90vh] flex items-center justify-center">
      <FlowCanvas mode={mode} />
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center py-24">
        <div className="inline-flex items-center gap-2 text-[12px] font-inter font-medium px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--bg2)]/70 backdrop-blur text-[var(--fg2)] mb-7">
          <Sparkles size={13} className="text-[var(--accent)]" />
          {HERO.badge}
        </div>
        <h1 className="font-sora text-[2.4rem] leading-[1.06] md:text-[4rem] md:leading-[1.04] md:whitespace-nowrap font-semibold tracking-tight text-[var(--fg)]">
          {HERO.titleLead}<br />
          <span className="text-[var(--accent)]">{HERO.titleAccent}</span>
        </h1>
        <p className="mt-6 text-[1.05rem] md:text-[1.18rem] font-inter leading-relaxed text-[var(--fg2)] max-w-2xl mx-auto">
          {HERO.body}
        </p>

        <p className="mt-7 text-[13px] font-inter text-[var(--fg3)] flex items-center gap-1.5 justify-center">
          <ShieldCheck size={14} className="text-[var(--accent)]" /> {HERO.reassurance}
        </p>

        <a href="#research" className="group mt-14 inline-flex flex-col items-center gap-3" aria-label="Explore the workbench">
          <span className="text-[12px] font-inter font-medium uppercase tracking-[0.22em] text-[var(--fg3)] group-hover:text-[var(--fg)] transition-colors">Explore the workbench</span>
          <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--line2)] bg-[var(--bg2)]/60 backdrop-blur text-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors animate-bounce">
            <ChevronDown size={20} />
          </span>
        </a>
      </div>
    </header>
  );
}
