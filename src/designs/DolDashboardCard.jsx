import React, { useState } from 'react';
import { DOL_PROGRAMS, FISCAL_YEARS } from './dolDashboardData';

/* Mirror of Casebase's OFLC Dashboard (DOL Performance Data): program toggle
   (PERM / LCA / Prevailing Wage) + fiscal-year filter, KPI cards, and pie/bar
   widgets. Themed to the site palette; data from dolDashboardData. */

const T = 'var(--fg)', T2 = 'var(--fg2)', T3 = 'var(--fg3)';
const BG2 = 'var(--bg2)', BG3 = 'var(--bg3)', BG4 = 'var(--bg4)';
const BD = 'var(--line)';
const MONO = "'DM Mono', monospace";

const STATUS_COLORS = {
  Certified: '#22c55e', 'Certified - Expired': '#86efac', 'Certified - Withdrawn': '#fbbf24',
  Withdrawn: '#f59e0b', Denied: '#ef4444',
  'Level I': '#60a5fa', 'Level II': '#6366f1', 'Level III': '#8b5cf6', 'Level IV': '#a78bfa',
  OES: '#22c55e',
};
const FALLBACK = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#60a5fa', '#34d399'];
const colorFor = (label, i) => STATUS_COLORS[label] || FALLBACK[i % FALLBACK.length];

function KPI({ label, value, color, sub }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 8, padding: '16px 18px', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: MONO, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: T3, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: T3, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Widget({ title, subtitle, children }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: T3, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 80, cy = 80, r = 68, ri = 40;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const xi1 = cx + ri * Math.cos(angle - sweep), yi1 = cy + ri * Math.sin(angle - sweep);
    const xi2 = cx + ri * Math.cos(angle), yi2 = cy + ri * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`;
    return { ...d, path, color: colorFor(d.label, i), pct: ((d.value / total) * 100).toFixed(1) };
  });
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <svg width="150" height="150" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke={BG2} strokeWidth="1.5" />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center', minWidth: 150 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: T, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ fontSize: 11, fontFamily: MONO, color: T, fontWeight: 600 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBar({ data, color, horizontal = true, maxRows = 12 }) {
  const rows = [...data].sort((a, b) => b.value - a.value).slice(0, maxRows);
  const max = Math.max(...rows.map((d) => d.value), 1);
  const fmt = (v) => (v > 999 ? v.toLocaleString() : String(v));
  if (!horizontal) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 130, paddingBottom: 26, overflowX: 'auto' }}>
        {rows.map((d, i) => (
          <div key={i} title={`${d.label}: ${d.value.toLocaleString()}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: '0 0 auto', minWidth: 30 }}>
            <span style={{ fontSize: 8, color: T3, fontFamily: MONO }}>{d.value > 999 ? (d.value / 1000).toFixed(0) + 'k' : d.value}</span>
            <div style={{ width: 26, background: color, borderRadius: '2px 2px 0 0', height: `${Math.max(3, (d.value / max) * 90)}px`, opacity: 0.9 }} />
            <span style={{ fontSize: 8, color: T2, writingMode: 'vertical-lr', transform: 'rotate(180deg)', maxHeight: 44, overflow: 'hidden', fontFamily: MONO }}>{d.label}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {rows.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: T, flex: '0 0 150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', fontFamily: MONO }}>{d.label}</span>
          <div style={{ flex: 1, height: 16, background: BG4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(d.value / max) * 100}%`, background: color, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10, color, fontFamily: MONO, flex: '0 0 56px', textAlign: 'right' }}>{fmt(d.value)}</span>
        </div>
      ))}
    </div>
  );
}

function renderWidget(w, color) {
  if (w.type === 'pie') return <Widget title={w.title} subtitle={w.subtitle}><PieChart data={w.data} /></Widget>;
  if (w.type === 'vbar') return <Widget title={w.title} subtitle={w.subtitle}><MiniBar data={w.data} color={color} horizontal={false} maxRows={20} /></Widget>;
  return <Widget title={w.title} subtitle={w.subtitle}><MiniBar data={w.data} color={color} /></Widget>;
}

export function DolDashboardCard() {
  const [programId, setProgramId] = useState('perm');
  const [fy, setFy] = useState('All');
  const program = DOL_PROGRAMS.find((p) => p.id === programId);
  const color = program.color;

  const tabBtn = (active, c) => ({
    padding: '4px 12px', fontSize: 12, borderRadius: 4, cursor: 'pointer',
    background: active ? `color-mix(in srgb, ${c} 16%, transparent)` : BG3,
    color: active ? c : T3, border: `1px solid ${active ? `color-mix(in srgb, ${c} 40%, transparent)` : BD}`,
    fontWeight: active ? 600 : 400,
  });

  return (
    <div className="rounded-xl border border-[var(--line)] overflow-hidden" style={{ background: 'var(--bg)', color: T }}>
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap" style={{ padding: '10px 18px', borderBottom: `1px solid ${BD}`, background: BG2 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dashboard</span>
        <div className="flex gap-1.5">
          {DOL_PROGRAMS.map((p) => (
            <button key={p.id} onClick={() => setProgramId(p.id)} style={tabBtn(programId === p.id, p.color)}>{p.label}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-1.5 ml-auto">
          <span style={{ fontSize: 11, color: T3 }}>Fiscal Year:</span>
          {FISCAL_YEARS.map((f) => (
            <button key={f} onClick={() => setFy(f)} style={{ padding: '3px 8px', fontSize: 11, borderRadius: 3, cursor: 'pointer', ...tabBtn(fy === f, color) }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div style={{ padding: '18px 18px' }}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {program.kpis.map((k) => <KPI key={k.label} {...k} color={color} />)}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {program.row.map((w, i) => <React.Fragment key={i}>{renderWidget(w, color)}</React.Fragment>)}
          </div>
          {renderWidget(program.full, color)}
        </div>
      </div>
    </div>
  );
}
