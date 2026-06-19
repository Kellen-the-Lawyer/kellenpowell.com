import React, { useState, useMemo } from 'react';

/* Mirror of Casebase's PERM Comparer — the main "Text Comparison Workspace"
   (Text Diff mode): Reference vs. Comparison for the Job Description and the
   Minimum Requirements, with line/token-level highlighted differences, plus a
   results summary. Uses the product's own diff engine (ported) on a
   representative sample, themed to the site palette. */

const A = 'var(--accent)', A_DIM = 'color-mix(in srgb, var(--accent) 16%, transparent)';
const GOOD = 'var(--good)', GOOD_DIM = 'color-mix(in srgb, var(--good) 16%, transparent)';
const BAD = 'var(--bad)', BAD_DIM = 'color-mix(in srgb, var(--bad) 16%, transparent)';
const T = 'var(--fg)', T2 = 'var(--fg2)', T3 = 'var(--fg3)';
const BG = 'var(--bg)', BG2 = 'var(--bg2)', BG3 = 'var(--bg3)', BG4 = 'var(--bg4)';
const BD = 'var(--line)';
const MONO = "'DM Mono', monospace", SERIF = "'DM Serif Display', serif";

/* ── diff engine (ported from PermComparer.jsx) ─────────────────────── */
const splitLines = (t) => t.replace(/\r\n/g, '\n').split('\n');
const tok = (t, s) => (s ? Array.from(t) : (t.match(/(\s+|[A-Za-z0-9]+|[^A-Za-z0-9\s])/g) ?? []));
function lcs(l, r, ci) {
  const eq = (a, b) => (ci ? a.toLowerCase() === b.toLowerCase() : a === b);
  const m = Array.from({ length: l.length + 1 }, () => new Array(r.length + 1).fill(0));
  for (let i = l.length - 1; i >= 0; i--) for (let j = r.length - 1; j >= 0; j--) m[i][j] = eq(l[i], r[j]) ? m[i + 1][j + 1] + 1 : Math.max(m[i + 1][j], m[i][j + 1]);
  return m;
}
function diffTok(a, b, s, ci) {
  if (ci) {
    const wordsOf = (str) => str.replace(/[^A-Za-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase().split(' ').filter((w) => w.length > 0);
    const aw = wordsOf(a), bw = wordsOf(b), m = lcs(aw, bw, true), ar = [], br = [];
    let ai = 0, bi = 0;
    while (ai < aw.length && bi < bw.length) {
      if (aw[ai] === bw[bi]) { ar.push({ t: aw[ai], c: false }); br.push({ t: bw[bi], c: false }); ai++; bi++; }
      else if (m[ai + 1][bi] >= m[ai][bi + 1]) ar.push({ t: aw[ai++], c: true });
      else br.push({ t: bw[bi++], c: true });
    }
    while (ai < aw.length) ar.push({ t: aw[ai++], c: true });
    while (bi < bw.length) br.push({ t: bw[bi++], c: true });
    const spaced = (tks) => tks.flatMap((tk2, i) => (i === 0 ? [tk2] : [{ t: ' ', c: false }, tk2]));
    return { ar: spaced(ar), br: spaced(br) };
  }
  const at = tok(a, s), bt = tok(b, s), m = lcs(at, bt, ci), ar = [], br = [];
  const eq = (x, y) => (ci ? x.toLowerCase() === y.toLowerCase() : x === y);
  let ai = 0, bi = 0;
  while (ai < at.length && bi < bt.length) {
    if (eq(at[ai], bt[bi])) { ar.push({ t: at[ai], c: false }); br.push({ t: bt[bi], c: false }); ai++; bi++; }
    else if (m[ai + 1][bi] >= m[ai][bi + 1]) ar.push({ t: at[ai++], c: true });
    else br.push({ t: bt[bi++], c: true });
  }
  while (ai < at.length) ar.push({ t: at[ai++], c: true });
  while (bi < bt.length) br.push({ t: bt[bi++], c: true });
  return { ar, br };
}
function diffLines(a, b, s, ci) {
  const al = splitLines(a), bl = splitLines(b);
  const eqLine = (x, y) => (ci ? x.toLowerCase() === y.toLowerCase() : x === y);
  const m = lcs(al, bl, ci), ops = [];
  let ai = 0, bi = 0;
  while (ai < al.length && bi < bl.length) {
    if (eqLine(al[ai], bl[bi])) { ops.push({ t: 'eq', s: al[ai] }); ai++; bi++; }
    else if (m[ai + 1][bi] >= m[ai][bi + 1]) ops.push({ t: 'rm', s: al[ai++] });
    else ops.push({ t: 'add', s: bl[bi++] });
  }
  while (ai < al.length) ops.push({ t: 'rm', s: al[ai++] });
  while (bi < bl.length) ops.push({ t: 'add', s: bl[bi++] });
  const lines = []; let oi = 0, rn = 1, cn = 1;
  while (oi < ops.length) {
    const cur = ops[oi];
    if (cur.t === 'eq') { lines.push({ rn, cn, rt: [{ t: cur.s, c: false }], ct: [{ t: cur.s, c: false }], ch: false }); rn++; cn++; oi++; continue; }
    const rm = [], add = [];
    while (oi < ops.length && ops[oi].t !== 'eq') { const p = ops[oi++]; (p.t === 'rm' ? rm : add).push(p.s); }
    const sz = Math.max(rm.length, add.length);
    for (let k = 0; k < sz; k++) { const { ar, br } = diffTok(rm[k] ?? '', add[k] ?? '', s, ci); lines.push({ rn: k < rm.length ? rn : null, cn: k < add.length ? cn : null, rt: ar, ct: br, ch: true }); if (k < rm.length) rn++; if (k < add.length) cn++; }
  }
  return lines;
}
function summarize(field, ref, cmp, strict, igFmt) {
  const wordOnly = (t2) => t2.replace(/[^A-Za-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const exact = igFmt ? wordOnly(ref) === wordOnly(cmp) : ref === cmp;
  const lines = diffLines(ref, cmp, strict, igFmt);
  const changed = lines.filter((l) => l.ch).length;
  return { field, exact, status: exact ? 'Exact Match' : 'Differences Found', detail: exact ? 'Texts are identical.' : `${changed} differing line${changed === 1 ? '' : 's'}.`, lines };
}
function PTokens({ tokens, kind }) {
  if (!tokens.length) return <span style={{ color: T3, fontStyle: 'italic' }}>(no text)</span>;
  return tokens.map((tk2, i) => (
    <span key={i} style={tk2.c ? { borderRadius: 4, padding: '0 1px', background: kind === 'reference' ? BAD_DIM : GOOD_DIM, color: kind === 'reference' ? BAD : GOOD } : undefined}>{tk2.t}</span>
  ));
}

/* ── sample inputs ──────────────────────────────────────────────────── */
const JD_REF = 'The Senior Data Scientist will design, build, and deploy machine learning models in Python.\nThe role requires close collaboration with product and engineering teams to ship analytics features.';
const JD_CMP = 'The Senior Data Scientist will design, develop, and deploy machine learning systems in Python.\nThe role requires collaboration with product and engineering teams to deliver analytics features.';
const MR_REF = "Master's degree in Computer Science or a related field, plus 36 months of experience.\nExperience must include Python, machine learning, Apache Spark, and distributed systems.";
const MR_CMP = "Master's degree in Computer Science or a related field, plus 24 months of experience.\nExperience must include Python, machine learning, and distributed systems.";

const card = { background: BG2, border: `1px solid ${BD}`, borderRadius: 10, padding: 16 };
const cardRef = { background: BG3, border: `1px solid ${BD}`, borderRadius: 10, padding: 16 };
const label = { display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 600, color: T2 };
const badge = (match) => ({ display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', background: match === null ? BG4 : match ? GOOD_DIM : BAD_DIM, color: match === null ? T3 : match ? GOOD : BAD });
const diffCell = (ch) => ({ minWidth: 0, padding: '10px 12px', border: `1px solid ${ch ? BAD : BD}`, borderRadius: 8, background: BG });
const textBox = (tint) => ({ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: MONO, fontSize: 12, lineHeight: 1.7, color: T, padding: '12px 14px', borderRadius: 10, border: `1px solid ${tint || BD}`, background: tint ? BAD_DIM : BG, minHeight: 78 });

function CardHeader({ kicker, title, match }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: T3, marginBottom: 4 }}>{kicker}</div>
        <div style={{ fontSize: 14, fontFamily: SERIF, color: T }}>{title}</div>
      </div>
      {typeof match === 'boolean' && <span style={badge(match)}>{match ? 'Exact Match' : 'Differences Found'}</span>}
    </div>
  );
}

function DiffPanel({ res, title }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div><div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: T3, marginBottom: 4 }}>Highlighted Differences</div><div style={{ fontSize: 14, fontFamily: SERIF, color: T }}>{title} Review</div></div>
        <span style={badge(res.exact)}>{res.status}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: T3, padding: '0 4px' }}>
        <div>Reference</div><div>Comparison</div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {res.lines.map((line, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={diffCell(line.ch)}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T3, fontFamily: MONO, marginBottom: 6 }}>{line.rn ? `Line ${line.rn}` : ' '}</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: MONO, fontSize: 12, lineHeight: 1.6 }}><PTokens tokens={line.rt} kind="reference" /></pre>
            </div>
            <div style={diffCell(line.ch)}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T3, fontFamily: MONO, marginBottom: 6 }}>{line.cn ? `Line ${line.cn}` : ' '}</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: MONO, fontSize: 12, lineHeight: 1.6 }}><PTokens tokens={line.ct} kind="comparison" /></pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({ on, children, onClick }) {
  return <button onClick={onClick} style={{ fontSize: 11, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', background: on ? A_DIM : BG3, color: on ? A : T3, border: `1px solid ${on ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : BD}`, fontWeight: on ? 600 : 400 }}>{children}</button>;
}

export function PermComparerMock() {
  const [strict, setStrict] = useState(false);
  const [ignoreFmt, setIgnoreFmt] = useState(false);
  const [mode, setMode] = useState('diff');

  const jd = useMemo(() => summarize('Job Description', JD_REF, JD_CMP, strict, ignoreFmt), [strict, ignoreFmt]);
  const mr = useMemo(() => summarize('Minimum Requirements', MR_REF, MR_CMP, strict, ignoreFmt), [strict, ignoreFmt]);

  return (
    <div className="rounded-xl border border-[var(--line)] p-4 md:p-6" style={{ background: BG, color: T }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: T3, marginBottom: 6 }}>PERM Labor Certification</div>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(1.4rem,3vw,2rem)', color: T, lineHeight: 1.1 }}>{mode === 'audit' ? 'Recruitment Compliance Review' : 'Text Comparison Workspace'}</div>
          <div style={{ fontSize: 13, color: T3, marginTop: 6, maxWidth: 560, lineHeight: 1.6 }}>Compare job description and requirements language, and validate PWD wage positioning.</div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
          <div style={{ display: 'flex', border: `1px solid ${BD}`, borderRadius: 20, overflow: 'hidden' }}>
            {[['diff', 'Text Diff'], ['audit', 'Recruitment Review']].map(([m, lbl]) => (
              <button key={m} onClick={() => setMode(m)} style={{ fontSize: 11, padding: '5px 14px', border: 'none', cursor: 'pointer', background: mode === m ? A_DIM : 'transparent', color: mode === m ? A : T3, fontWeight: mode === m ? 600 : 400 }}>{lbl}</button>
            ))}
          </div>
          <Pill on={ignoreFmt} onClick={() => setIgnoreFmt((v) => !v)}>Ignore Formatting</Pill>
          <Pill on={strict} onClick={() => setStrict((v) => !v)}>Strict Mode</Pill>
          <span style={{ fontSize: 12, padding: '7px 18px', borderRadius: 8, background: A, color: 'var(--accent-fg)', fontWeight: 600 }}>Compare Text</span>
        </div>
      </div>

      {mode === 'audit' ? (
        <div style={{ ...card, textAlign: 'center', padding: '48px 20px', color: T3, fontSize: 13 }}>
          Recruitment Compliance Review — audit each recruitment piece against the PWD under 20 CFR 656 and BALCA. Open Casebase to run a full audit.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Job Description pair */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div style={cardRef}>
              <CardHeader kicker="Reference" title="Job Description" />
              <div style={label}>Official PWD job description</div>
              <div style={textBox()}>{JD_REF}</div>
            </div>
            <div style={card}>
              <CardHeader kicker="Comparison" title="Job Description Comparison" match={jd.exact} />
              <div style={label}>Text to compare against</div>
              <div style={textBox(!jd.exact ? BAD : null)}>{JD_CMP}</div>
            </div>
          </div>
          <DiffPanel res={jd} title="Job Description" />

          {/* Minimum Requirements pair */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div style={cardRef}>
              <CardHeader kicker="Reference" title="Minimum Requirements" />
              <div style={label}>Minimum requirements from the PWD</div>
              <div style={textBox()}>{MR_REF}</div>
            </div>
            <div style={card}>
              <CardHeader kicker="Comparison" title="Requirements Comparison" match={mr.exact} />
              <div style={label}>Text to compare against</div>
              <div style={textBox(!mr.exact ? BAD : null)}>{MR_CMP}</div>
            </div>
          </div>
          <DiffPanel res={mr} title="Minimum Requirements" />

          {/* Summary */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div><div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: T3, marginBottom: 4 }}>Summary</div><div style={{ fontSize: 14, fontFamily: SERIF, color: T }}>Comparison Results</div></div>
              <span style={badge(null)}>{ignoreFmt ? 'Formatting Ignored' : strict ? 'Strict Mode' : 'Standard Mode'}</span>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[jd, mr].map((r) => (
                <div key={r.field} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px,1.1fr) minmax(110px,.7fr) minmax(0,2fr)', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 8, background: BG3, fontSize: 12 }}>
                  <strong style={{ color: T }}>{r.field}</strong>
                  <div style={{ fontWeight: 600, color: r.exact ? GOOD : BAD }}>{r.status}</div>
                  <div style={{ color: T2 }}>{r.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
