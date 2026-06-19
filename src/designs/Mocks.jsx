import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useInView } from './hooks';
import { SEARCH_RESULTS } from './content';
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


export const MOCKS = {
  search: SearchMock,
  graph: CitationGraphMock,
};
