import React, { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useInView, useCountUp } from './hooks';
import { SEARCH_RESULTS, REQS, BARS } from './content';
import { CitationGraphMock } from './CitationGraphCard';

/* Palette-driven product mockups.
   Every color resolves from CSS variables set by the surrounding design
   root, so the same mockup looks correct in any palette and in light/dark.
   Variables used: --bg2 --bg3 --bg4 --line --line2 --fg --fg2 --fg3
   --accent --good --bad --warn --blue --radius-mock */

const OUTCOME = {
  Affirmed: 'var(--good)',
  Reversed: 'var(--bad)',
  Remanded: 'var(--warn)',
};

function Chrome({ label }) {
  return (
    <div className="flex items-center gap-2 px-4 h-9 border-b border-[var(--line)] bg-[var(--bg3)] flex-shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      {label && (
        <span className="ml-3 text-[11px] font-mono text-[var(--fg3)] tracking-wide truncate">
          {label}
        </span>
      )}
    </div>
  );
}

function Shell({ label, children }) {
  return (
    <div className="rounded-[var(--radius-mock)] border border-[var(--line2)] bg-[var(--bg2)] overflow-hidden shadow-2xl shadow-black/25">
      <Chrome label={label} />
      {children}
    </div>
  );
}

export function SearchMock({ compact = false }) {
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
    <div ref={ref}>
      <Shell label="casebase.kellenpowell.com">
        <div className="p-4">
          <div className="flex items-center gap-2 h-10 px-3 rounded-full border border-[var(--line2)] bg-[var(--bg3)]">
            <Search size={14} className="text-[var(--fg3)] flex-shrink-0" />
            <span className="text-[13px] text-[var(--fg2)]">
              {typed}
              {inView && typed.length < full.length && (
                <span className="caret text-[var(--accent)]">|</span>
              )}
            </span>
            <span className="ml-auto text-[10px] font-mono text-[var(--fg3)] px-2 py-0.5 rounded bg-[var(--bg4)] border border-[var(--line)]">
              Search all
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            {SEARCH_RESULTS.slice(0, compact ? 3 : 4).map((r, i) => (
              <div
                key={r.num}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-[var(--line)] bg-[var(--bg3)]/50"
                style={
                  inView
                    ? { animation: `row-in 0.5s ease forwards`, animationDelay: `${900 + i * 220}ms`, opacity: 0 }
                    : { opacity: 0 }
                }
              >
                <span className="font-mono text-[11px] text-[var(--accent)] pt-0.5 w-[120px] flex-shrink-0 truncate">
                  {r.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-[var(--fg)] leading-snug truncate">{r.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--fg3)] px-1.5 py-0.5 rounded bg-[var(--bg4)]">
                      {r.corpus}
                    </span>
                    {r.outcome && (
                      <span className="text-[10px] flex items-center gap-1" style={{ color: OUTCOME[r.outcome] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: OUTCOME[r.outcome] }} />
                        {r.outcome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </div>
  );
}


export function DashboardMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const perm = useCountUp(486231, inView);
  const lca = useCountUp(912004, inView);
  const cert = useCountUp(94.2, inView, 1600);
  const R = 26;
  const CIRC = 2 * Math.PI * R;

  return (
    <div ref={ref}>
      <Shell label="Dashboards — DOL Performance Data">
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'PERM Filings', val: Math.round(perm).toLocaleString(), c: 'var(--accent)' },
              { label: 'LCA Filings', val: Math.round(lca).toLocaleString(), c: 'var(--blue)' },
              { label: 'PERM Cert Rate', val: `${cert.toFixed(1)}%`, c: 'var(--good)' },
            ].map((k) => (
              <div key={k.label} className="rounded-lg border border-[var(--line)] bg-[var(--bg3)] px-3 py-3">
                <div className="font-mono text-base font-medium" style={{ color: k.c }}>{k.val}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--fg3)] mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-5 items-end">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--fg3)] mb-2">Filings by FY</div>
              <div className="flex items-end gap-2 h-28">
                {BARS.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${h}%`,
                        background: 'linear-gradient(to top, color-mix(in srgb, var(--accent) 40%, transparent), var(--accent))',
                        transformOrigin: 'bottom',
                        animation: inView ? `grow-bar 0.7s cubic-bezier(.22,1,.36,1) forwards` : 'none',
                        animationDelay: `${i * 80}ms`,
                        transform: inView ? undefined : 'scaleY(0)',
                      }}
                    />
                    <span className="text-[8px] font-mono text-[var(--fg3)]">{2020 + i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle cx="39" cy="39" r={R} fill="none" stroke="var(--line)" strokeWidth="7" />
                <circle cx="39" cy="39" r={R} fill="none" stroke="var(--good)" strokeWidth="7" strokeLinecap="round"
                  transform="rotate(-90 39 39)" strokeDasharray={CIRC}
                  style={{ strokeDashoffset: inView ? CIRC * (1 - 0.942) : CIRC, transition: 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)' }} />
                <text x="39" y="43" textAnchor="middle" fill="var(--fg)" className="font-mono" fontSize="13">94%</text>
              </svg>
              <span className="text-[9px] uppercase tracking-wider text-[var(--fg3)] mt-1">Cert rate</span>
            </div>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export function ComparerMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const months = useCountUp(44, inView, 1200);

  return (
    <div ref={ref}>
      <Shell label="PERM Comparer — Verify Experience">
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg3)] p-3">
              <div className="text-[9px] uppercase tracking-wider text-[var(--fg3)] mb-2">PWD Minimum Requirements</div>
              <p className="text-[11px] leading-relaxed text-[var(--fg2)]">
                Employer requires a{' '}
                <mark className="rounded px-0.5" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>Master’s degree</mark> plus{' '}
                <mark className="rounded px-0.5" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>36 months</mark> of experience using{' '}
                <mark className="rounded px-0.5" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>Python</mark>,{' '}
                <mark className="rounded px-0.5" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>machine learning</mark>, and{' '}
                <mark className="rounded px-0.5" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)' }}>Apache Spark</mark>.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg3)] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] uppercase tracking-wider text-[var(--fg3)]">Experience Letter</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
                  {Math.round(months)} mo
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--fg2)]">
                Acme Corp. — Senior Data Scientist, Jan 2021 – Aug 2024. Built ML pipelines in Python; led model development and deployment.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[9px] uppercase tracking-wider text-[var(--fg3)] mb-2">
              Requirement keywords — 4 of 5 found in letter
            </div>
            <div className="flex flex-wrap gap-2">
              {REQS.map((r, i) => (
                <span
                  key={r.kw}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium"
                  style={{
                    color: r.ok ? 'var(--good)' : 'var(--bad)',
                    borderColor: r.ok ? 'color-mix(in srgb, var(--good) 40%, transparent)' : 'color-mix(in srgb, var(--bad) 40%, transparent)',
                    background: r.ok ? 'color-mix(in srgb, var(--good) 10%, transparent)' : 'color-mix(in srgb, var(--bad) 10%, transparent)',
                    ...(inView ? { animation: `pill-flip 0.4s ease forwards`, animationDelay: `${700 + i * 160}ms`, opacity: 0 } : { opacity: 0 }),
                  }}
                >
                  {r.ok ? <Check size={12} /> : <X size={12} />}
                  {r.kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export const MOCKS = {
  search: SearchMock,
  graph: CitationGraphMock,
  dashboard: DashboardMock,
  comparer: ComparerMock,
};
