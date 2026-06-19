import React, { useState, useEffect } from 'react';
import { useInView } from './hooks';

/* Faithful mirror of Casebase's VisaBulletinView — the three-pane bulletin
   workbench (top bar · sidebar · priority-date table / chart / compare ·
   backlog panel) — driven by a baked snapshot of the June 2026 bulletin and
   the real history/backlog for every preference × country × date-type combo.
   Themed to the marketing palette; data lazy-loads on scroll. */

// palette aliases (product used --amber/--text*/--border*; map to site vars)
const A = 'var(--accent)';
const A_DIM = 'color-mix(in srgb, var(--accent) 15%, transparent)';
const GREEN = 'var(--good)', RED = 'var(--bad)';
const G_DIM = 'color-mix(in srgb, var(--good) 16%, transparent)';
const R_DIM = 'color-mix(in srgb, var(--bad) 16%, transparent)';
const T = 'var(--fg)', T2 = 'var(--fg2)', T3 = 'var(--fg3)';
const BG = 'var(--bg)', BG2 = 'var(--bg2)', BG3 = 'var(--bg3)', BG4 = 'var(--bg4)';
const BD = 'var(--line)', BD2 = 'var(--line2)';
const MONO = "'DM Mono', monospace", SERIF = "'DM Serif Display', serif";

const COUNTRIES = ['ALL', 'CHINA', 'INDIA', 'MEXICO', 'PHILIPPINES'];
const COUNTRY_LABELS = { ALL: 'All Chargeability', CHINA: 'China', INDIA: 'India', MEXICO: 'Mexico', PHILIPPINES: 'Philippines' };
const EB_PREFS = ['EB1', 'EB2', 'EB3', 'EB3W', 'EB4', 'EB5'];
const FAM_PREFS = ['F1', 'F2A', 'F2B', 'F3', 'F4'];
const PREF_LABELS = {
  EB1: 'Priority Workers', EB2: 'Adv. Degree / Exc. Ability', EB3: 'Skilled Workers',
  EB3W: 'Other Workers', EB4: 'Special Immigrants', EB5: 'Investors',
  F1: 'Unmarried Sons/Daughters of USC', F2A: 'Spouses & Children of LPR',
  F2B: 'Unmarried Sons/Daughters of LPR', F3: 'Married Sons/Daughters of USC', F4: 'Siblings of Adult USC',
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d) {
  if (!d) return null;
  const [y, m, day] = d.split('-').map(Number);
  return `${MONTHS[m - 1]} ${String(day).padStart(2, '0')}, ${y}`;
}
function dateToMs(d) { if (!d) return null; const [y, m, day] = d.split('-').map(Number); return Date.UTC(y, m - 1, day); }
function daysBetween(d1, d2) { return Math.floor((dateToMs(d2) - dateToMs(d1)) / 86400000); }
const TODAY = new Date().toISOString().slice(0, 10);

function SparkLine({ history }) {
  if (!history || history.length < 2) return null;
  const dated = history.filter((h) => h.priority_date && !h.is_current && !h.is_unavailable);
  if (dated.length < 2) return <div style={{ padding: '8px 0', color: T3, fontSize: 11 }}>Not enough data to chart</div>;
  const vals = dated.map((h) => dateToMs(h.priority_date));
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const W = 260, H = 72;
  const pts = dated.map((h, i) => `${(i / (dated.length - 1)) * W},${H - ((dateToMs(h.priority_date) - min) / range) * (H - 8)}`).join(' ');
  const lastY = H - ((vals[vals.length - 1] - min) / range) * (H - 8);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 72, display: 'block' }} preserveAspectRatio="none">
      <polyline fill="none" stroke={A} strokeWidth="1.5" points={pts} />
      <circle cx={W} cy={lastY} r="3" fill={A} />
      <line x1="0" y1={H} x2={W} y2={H} stroke={BD} strokeWidth="0.5" />
    </svg>
  );
}

export function VisaBulletinCard() {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [data, setData] = useState(null);
  const [category, setCategory] = useState('employment');
  const [dateType, setDateType] = useState('final_action');
  const [selCountry, setSelCountry] = useState('INDIA');
  const [selPref, setSelPref] = useState('EB2');
  const [sideTab, setSideTab] = useState('table');
  const [centerTab, setCenterTab] = useState('dates');

  // lazy-load the (large) baked snapshot once the section scrolls into view
  useEffect(() => {
    if (!inView || data) return;
    import('./visaBulletinData').then((m) => setData(m.VISA_BULLETIN));
  }, [inView, data]);

  useEffect(() => {
    if (category === 'employment') { if (!selPref.startsWith('E')) setSelPref('EB2'); }
    else if (selPref.startsWith('E')) setSelPref('F1');
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const prefs = category === 'employment' ? EB_PREFS : FAM_PREFS;

  const lookup = {};
  if (data) {
    data.bulletin.filter((r) => r.category_type === category && r.date_type === dateType).forEach((r) => {
      if (!lookup[r.preference]) lookup[r.preference] = {};
      lookup[r.preference][r.chargeability] = r;
    });
  }
  const detail = data?.detail[`${selPref}|${selCountry}|${dateType}`];
  const history = detail?.history;
  const backlog = detail?.backlog;
  const recentHistory = (history || []).slice(-24).reverse();

  const btn = (active) => ({
    padding: '5px 12px', fontSize: 11, border: 'none', borderRadius: 0, cursor: 'pointer',
    background: active ? A_DIM : 'transparent', color: active ? A : T3, fontWeight: active ? 500 : 400,
  });

  return (
    <div ref={ref} style={{ height: 560, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: BG, border: `1px solid ${BD}`, borderRadius: 14, color: T }}>

      {/* ── Top bar ── */}
      <div style={{ padding: '11px 18px', borderBottom: `1px solid ${BD}`, background: BG2, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 16 }}>Visa Bulletin — {data?.monthLabel || 'June 2026'}</div>
          <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>{data ? `${data.indexCount} bulletins · FY2016–FY2026 · showing currently active bulletin` : 'Loading…'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          {['←', 'Current', '→'].map((l, i) => (
            <span key={i} style={{ fontSize: l === 'Current' ? 11 : 13, padding: l === 'Current' ? '4px 10px' : 0, width: l === 'Current' ? 'auto' : 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: T3, background: l === 'Current' ? BG3 : 'transparent', border: l === 'Current' ? `1px solid ${BD}` : 'none', opacity: l === 'Current' ? 1 : 0.3 }}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', background: BG3, border: `1px solid ${BD}`, borderRadius: 6, overflow: 'hidden' }}>
          {[['employment', 'Employment-Based'], ['family', 'Family-Sponsored']].map(([v, l]) => (
            <button key={v} onClick={() => setCategory(v)} style={btn(category === v)}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', background: BG3, border: `1px solid ${BD}`, borderRadius: 6, overflow: 'hidden' }}>
          {[['final_action', 'Final Action'], ['dates_for_filing', 'Dates for Filing']].map(([v, l]) => (
            <button key={v} onClick={() => setDateType(v)} style={btn(dateType === v)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left sidebar ── */}
        <div className="hidden lg:flex" style={{ width: 210, borderRight: `1px solid ${BD}`, flexDirection: 'column', flexShrink: 0, background: BG2 }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${BD}` }}>
            {[['table', 'Bulletin'], ['backlog', 'Backlog']].map(([v, l]) => (
              <button key={v} onClick={() => setSideTab(v)} style={{ flex: 1, padding: '9px 6px', fontSize: 12, background: 'none', border: 'none', borderRadius: 0, cursor: 'pointer', borderBottom: sideTab === v ? `2px solid ${A}` : '2px solid transparent', color: sideTab === v ? A : T3, fontWeight: sideTab === v ? 500 : 400 }}>{l}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
            {sideTab === 'table' ? (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Country / Chargeability</div>
                {COUNTRIES.map((c) => (
                  <button key={c} onClick={() => setSelCountry(c)} style={{ width: '100%', textAlign: 'left', marginBottom: 4, padding: '7px 10px', fontSize: 11, cursor: 'pointer', background: selCountry === c ? A_DIM : BG3, color: selCountry === c ? A : T2, border: `1px solid ${selCountry === c ? A : BD}`, borderRadius: 6, fontWeight: selCountry === c ? 500 : 400 }}>
                    {COUNTRY_LABELS[c]}
                    {lookup[selPref]?.[c] && (
                      <span style={{ float: 'right', fontFamily: MONO, fontSize: 10, color: selCountry === c ? A : T3 }}>
                        {lookup[selPref][c].is_current ? 'C' : lookup[selPref][c].is_unavailable ? 'U' : (lookup[selPref][c].priority_date ? lookup[selPref][c].priority_date.slice(0, 4) : '—')}
                      </span>
                    )}
                  </button>
                ))}
                <div style={{ fontSize: 10, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Preference</div>
                {prefs.map((p) => (
                  <button key={p} onClick={() => setSelPref(p)} style={{ width: '100%', textAlign: 'left', marginBottom: 4, padding: '7px 10px', fontSize: 11, cursor: 'pointer', background: selPref === p ? A_DIM : BG3, color: selPref === p ? A : T2, border: `1px solid ${selPref === p ? A : BD}`, borderRadius: 6 }}>
                    <span style={{ fontFamily: MONO, fontWeight: 600, marginRight: 6 }}>{p}</span>
                    <span style={{ color: selPref === p ? A : T3, fontSize: 10 }}>{PREF_LABELS[p]?.split(' ').slice(0, 2).join(' ')}</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Backlog by Preference</div>
                {prefs.map((p) => {
                  const row = lookup[p]?.[selCountry];
                  const isC = row?.is_current, isU = row?.is_unavailable, pd = row?.priority_date;
                  const yrs = pd ? Math.floor(daysBetween(pd, TODAY) / 365.25) : null;
                  return (
                    <button key={p} onClick={() => { setSelPref(p); setSideTab('table'); }} style={{ width: '100%', textAlign: 'left', marginBottom: 6, padding: '9px 10px', fontSize: 11, cursor: 'pointer', background: selPref === p ? A_DIM : BG3, border: `1px solid ${selPref === p ? A : BD}`, borderRadius: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontFamily: MONO, fontWeight: 600, color: selPref === p ? A : T }}>{p}</span>
                        {isC && <span style={{ fontSize: 10, color: GREEN, background: G_DIM, padding: '1px 6px', borderRadius: 3 }}>Current</span>}
                        {isU && <span style={{ fontSize: 10, color: RED, background: R_DIM, padding: '1px 6px', borderRadius: 3 }}>Unavail.</span>}
                        {yrs !== null && !isC && !isU && <span style={{ fontSize: 11, fontFamily: MONO, color: yrs > 5 ? RED : yrs > 2 ? A : GREEN }}>{yrs}yr</span>}
                      </div>
                      {pd && !isC && !isU && <div style={{ fontSize: 10, color: T3, fontFamily: MONO }}>{fmtDate(pd)}</div>}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* ── Center ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${BD}`, background: BG2, flexShrink: 0 }}>
            {[['dates', 'Priority Dates'], ['chart', 'Movement Chart'], ['compare', 'Compare Countries']].map(([v, l]) => (
              <button key={v} onClick={() => setCenterTab(v)} style={{ padding: '9px 16px', fontSize: 12, background: 'none', border: 'none', borderRadius: 0, cursor: 'pointer', borderBottom: centerTab === v ? `2px solid ${A}` : '2px solid transparent', color: centerTab === v ? A : T3, fontWeight: centerTab === v ? 500 : 400 }}>{l}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!data && <div style={{ padding: 40, textAlign: 'center', color: T3, fontSize: 13 }}>Loading bulletin…</div>}

            {data && centerTab === 'dates' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ position: 'sticky', top: 0, background: BG, zIndex: 2 }}>
                    <th style={{ padding: '9px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: T3, textAlign: 'left', borderBottom: `1px solid ${BD}`, width: 110 }}>Preference</th>
                    {COUNTRIES.map((c) => (
                      <th key={c} onClick={() => setSelCountry(c)} style={{ padding: '9px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: selCountry === c ? A : T3, textAlign: 'left', borderBottom: `1px solid ${BD}`, cursor: 'pointer', background: selCountry === c ? A_DIM : 'transparent', whiteSpace: 'nowrap' }}>
                        {c === 'ALL' ? 'All Areas' : COUNTRY_LABELS[c]} {selCountry === c && '★'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prefs.map((p, i) => (
                    <tr key={p} onClick={() => setSelPref(p)} style={{ cursor: 'pointer', background: selPref === p ? A_DIM : i % 2 === 0 ? BG : BG2, borderLeft: selPref === p ? `2px solid ${A}` : '2px solid transparent' }}>
                      <td style={{ padding: '10px 14px', borderBottom: `1px solid ${BD}` }}>
                        <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: selPref === p ? A : T }}>{p}</div>
                        <div style={{ fontSize: 10, color: T3, marginTop: 1 }}>{PREF_LABELS[p]?.split(' ').slice(0, 3).join(' ')}</div>
                      </td>
                      {COUNTRIES.map((c) => {
                        const row = lookup[p]?.[c];
                        return (
                          <td key={c} style={{ padding: '10px 12px', borderBottom: `1px solid ${BD}`, background: selCountry === c ? (selPref === p ? A_DIM : A_DIM) : 'transparent' }}>
                            {!row ? <span style={{ color: T3 }}>—</span>
                              : row.is_current ? <span style={{ color: GREEN, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>Current</span>
                              : row.is_unavailable ? <span style={{ color: RED, fontFamily: MONO, fontSize: 12 }}>Unavail.</span>
                              : row.priority_date ? <span style={{ fontFamily: MONO, fontSize: 12, color: selPref === p && selCountry === c ? A : (selCountry === c || selPref === p ? T : T2) }}>{fmtDate(row.priority_date)}</span>
                              : <span style={{ color: T3, fontSize: 11 }}>{row.raw_value}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {data && centerTab === 'chart' && (
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: T3, marginBottom: 16 }}>
                  Priority date movement — <span style={{ color: A }}>{selPref} · {COUNTRY_LABELS[selCountry]}</span> — {dateType === 'final_action' ? 'Final Action' : 'Dates for Filing'}
                </div>
                {history && history.length > 1 ? (
                  <div style={{ background: BG2, border: `1px solid ${BD}`, borderRadius: 10, padding: 16 }}>
                    <SparkLine history={history} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: T3, fontFamily: MONO }}>
                      <span>{history[0]?.bulletin_date?.slice(0, 7)}</span>
                      <span>{history[history.length - 1]?.bulletin_date?.slice(0, 7)}</span>
                    </div>
                  </div>
                ) : <div style={{ color: T3, fontSize: 13, padding: '40px 0', textAlign: 'center' }}>Not enough data for chart.</div>}
              </div>
            )}

            {data && centerTab === 'compare' && (
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: T3, marginBottom: 16 }}>All chargeability for <span style={{ color: A }}>{selPref}</span> — {data.monthLabel}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                  {COUNTRIES.map((c) => {
                    const row = lookup[selPref]?.[c]; const pd = row?.priority_date;
                    const yrs = pd ? Math.floor(daysBetween(pd, TODAY) / 365.25) : null;
                    return (
                      <div key={c} onClick={() => setSelCountry(c)} style={{ background: selCountry === c ? A_DIM : BG2, border: `1px solid ${selCountry === c ? A : BD}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: selCountry === c ? A : T3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{COUNTRY_LABELS[c]}</div>
                        {!row && <div style={{ color: T3 }}>—</div>}
                        {row?.is_current && <div style={{ color: GREEN, fontFamily: MONO, fontSize: 14, fontWeight: 500 }}>Current</div>}
                        {row?.is_unavailable && <div style={{ color: RED, fontFamily: MONO, fontSize: 14 }}>Unavailable</div>}
                        {pd && !row?.is_current && !row?.is_unavailable && (
                          <>
                            <div style={{ fontFamily: MONO, fontSize: 13, color: selCountry === c ? A : T, marginBottom: 4 }}>{fmtDate(pd)}</div>
                            {yrs !== null && <div style={{ fontSize: 11, color: yrs > 5 ? RED : yrs > 2 ? A : GREEN }}>{yrs} yr backlog</div>}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="hidden lg:flex" style={{ width: 270, borderLeft: `1px solid ${BD}`, flexDirection: 'column', background: BG2, flexShrink: 0 }}>
          <div style={{ padding: '11px 14px', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}><span style={{ fontFamily: MONO, color: A }}>{selPref}</span>{' · '}{COUNTRY_LABELS[selCountry]}</div>
            <div style={{ fontSize: 11, color: T3 }}>{dateType === 'final_action' ? 'Final Action Dates' : 'Dates for Filing'}</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
            {backlog ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[
                    ['Cut-off', backlog.is_current ? 'Current' : backlog.is_unavailable ? 'Unavail.' : fmtDate(backlog.current_cut_off), backlog.is_current ? GREEN : backlog.is_unavailable ? RED : A],
                    ['Backlog', backlog.backlog_years ? `${backlog.backlog_years} yrs` : '—', backlog.backlog_years > 5 ? RED : A],
                    ['Avg Advance', backlog.avg_monthly_advance_days ? `+${Math.round(backlog.avg_monthly_advance_days)}d/mo` : '—', GREEN],
                    ['Est. Wait', backlog.est_years_to_current ? `${backlog.est_years_to_current} yrs` : backlog.is_current ? 'Now' : '—', backlog.est_years_to_current > 10 ? RED : backlog.est_years_to_current > 3 ? A : GREEN],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ background: BG3, border: `1px solid ${BD}`, borderRadius: 6, padding: '10px 11px' }}>
                      <div style={{ fontSize: 10, color: T3, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 300, color, fontFamily: MONO }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>24-Month Movement</div>
                  <div style={{ background: BG3, border: `1px solid ${BD}`, borderRadius: 6, padding: '10px 10px 6px' }}>
                    <SparkLine history={recentHistory.slice().reverse()} />
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: T3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Monthly History</div>
                {recentHistory.map((h, i) => {
                  const delta = h.movement_days;
                  const sign = delta === null ? null : delta > 0 ? '+' : delta < 0 ? '' : '=';
                  const dcolor = delta === null ? T3 : delta > 0 ? GREEN : delta < 0 ? RED : T3;
                  const dbg = delta === null ? BG4 : delta > 0 ? G_DIM : delta < 0 ? R_DIM : BG4;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${BD}` }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: T3, minWidth: 56 }}>{h.bulletin_date?.slice(0, 7)}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: h.is_current ? GREEN : h.is_unavailable ? RED : T2, flex: 1 }}>
                        {h.is_current ? 'Current' : h.is_unavailable ? 'Unavail.' : fmtDate(h.priority_date)}
                      </span>
                      {sign !== null && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: dbg, color: dcolor, fontFamily: MONO }}>{sign}{Math.abs(delta)}d</span>}
                    </div>
                  );
                })}
              </>
            ) : <div style={{ color: T3, fontSize: 12, textAlign: 'center', paddingTop: 40 }}>{data ? 'Select a preference to see backlog data.' : 'Loading…'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
