import React, { useRef, useEffect } from 'react';

/* ════════════════════════════════════════════════════════════════════
   Canvas flow field with a ROAMING convergence point.
   Beams stream in from asymmetric anchors to a focal point. Periodically
   a bright "scout" dot breaks off and travels to a new off-centre spot,
   then the whole field of beams eases over to follow it. Pure canvas +
   requestAnimationFrame so the beams can retarget a moving point.
   Colors come from --beam / --beam2 (theme-aware); `mode` flips the
   blend mode (additive glow on dark, normal on light).
   ════════════════════════════════════════════════════════════════════ */

// Off-centre focal spots (fractions of the canvas). Deliberately not centred.
const SPOTS = [
  { x: 0.30, y: 0.40 },
  { x: 0.71, y: 0.34 },
  { x: 0.64, y: 0.67 },
  { x: 0.37, y: 0.60 },
  { x: 0.52, y: 0.30 },
];

// Asymmetric perimeter anchors (fractions; just off-screen). Not mirrored.
const ANCHORS = [
  { x: -0.04, y: 0.08 }, { x: -0.04, y: 0.37 }, { x: -0.04, y: 0.63 }, { x: -0.04, y: 0.92 },
  { x: 0.06, y: -0.05 }, { x: 0.33, y: -0.05 }, { x: 0.58, y: -0.05 }, { x: 0.86, y: -0.05 },
  { x: 1.04, y: 0.14 }, { x: 1.04, y: 0.41 }, { x: 1.04, y: 0.70 }, { x: 1.04, y: 0.95 },
  { x: 0.16, y: 1.05 }, { x: 0.44, y: 1.05 }, { x: 0.69, y: 1.05 }, { x: 0.93, y: 1.05 },
  { x: -0.04, y: 0.22 }, { x: 0.97, y: -0.05 },
];

const DWELL = 3.2, SCOUT = 0.9;
// Each beam relocates on its own: fade OUT at the old spot → brief GAP
// (gone) → SHOOT in to the new spot. SPREAD staggers when each beam's turn
// starts, so they migrate one-by-one while the rest hold on the old spot.
const FADE = 0.15, GAP = 0.16, SHOOT = 0.34, SPREAD = 0.4;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

function hexToRgb(hex) {
  let h = (hex || '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h || 'ffffff', 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;

export default function FlowCanvas({ mode, fixedConvergence }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // theme colors (re-read so light/dark + palette tweaks just work)
    const cs = getComputedStyle(canvas);
    const core = hexToRgb(cs.getPropertyValue('--beam') || '#ffffff');
    const edge = hexToRgb(cs.getPropertyValue('--beam2') || cs.getPropertyValue('--beam') || '#ffffff');
    const additive = mode === 'dark';
    const fixed = fixedConvergence; // when set: no roaming, beams hold here

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = wrap.clientWidth; H = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // packets riding each beam (varied, asymmetric speeds)
    const packets = [];
    ANCHORS.forEach((a, i) => {
      const count = i % 3 === 0 ? 2 : 1;
      for (let k = 0; k < count; k++) {
        packets.push({ ai: i, a, t: ((i * 0.17 + k * 0.53) % 1), speed: 0.16 + ((i * 7 + k * 11) % 13) / 32 });
      }
    });
    const N = ANCHORS.length;
    const TR = FADE + GAP + SHOOT;          // one beam's full relocation
    const MOVE = (N - 1) * SPREAD + TR;     // whole field migrates over this

    let from = SPOTS[0], to = SPOTS[1], idx = 1, phase = 'dwell', pe = 0, last = performance.now();

    const px = (pt) => ({ x: pt.x * W, y: pt.y * H });

    const drawBeam = (a, c, bright) => {
      const g = ctx.createLinearGradient(a.x, a.y, c.x, c.y);
      g.addColorStop(0, rgba(edge, 0));
      g.addColorStop(0.55, rgba(edge, additive ? 0.10 : 0.06));
      g.addColorStop(1, rgba(core, bright));
      ctx.strokeStyle = g;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
    };

    const dot = (x, y, r, a, blur) => {
      ctx.shadowColor = rgba(core, 1); ctx.shadowBlur = blur;
      ctx.fillStyle = rgba(core, a);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;

      // Fixed-convergence mode (static hero): same beams, no roaming.
      if (fixed) {
        const c = px(fixed);
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over';
        ctx.lineCap = 'round';
        ANCHORS.forEach((af) => {
          const a = px(af);
          ctx.lineWidth = 3; drawBeam(a, c, additive ? 0.16 : 0.10);
          ctx.lineWidth = 1.1; drawBeam(a, c, additive ? 0.5 : 0.34);
        });
        packets.forEach((p) => {
          p.t += p.speed * dt; if (p.t > 1) p.t -= 1;
          const a = px(p.a);
          const x = lerp(a.x, c.x, p.t), y = lerp(a.y, c.y, p.t);
          const a2 = Math.pow(p.t, 0.6);
          dot(x, y, 1.8 + p.t * 1.4, (additive ? 0.9 : 0.7) * a2, 9);
        });
        const pulseF = 0.7 + 0.3 * Math.sin(now / 380);
        dot(c.x, c.y, 3.5 + pulseF * 1.5, additive ? 0.95 : 0.8, 16);
        schedule();
        return;
      }

      // phase machine for the roaming focal point
      pe += dt;
      if (phase === 'dwell' && pe >= DWELL) { phase = 'scout'; pe = 0; }
      else if (phase === 'scout' && pe >= SCOUT) { phase = 'move'; pe = 0; }
      else if (phase === 'move' && pe >= MOVE) { phase = 'dwell'; pe = 0; from = to; idx = (idx + 1) % SPOTS.length; to = SPOTS[idx]; }

      // Per-beam relocation state. Until a beam's slot, it stays on the old
      // spot. Then it fades out, vanishes for a GAP, and shoots into the new
      // spot — one beam at a time while the others still hold on the old spot.
      const fromPx = px(from), toPx = px(to);
      const beams = ANCHORS.map((af, i) => {
        const a = px(af);
        if (phase !== 'move') return { a, c: fromPx, alpha: 1, mode: 'hold' };
        const local = pe - i * SPREAD;
        if (local < 0) return { a, c: fromPx, alpha: 1, mode: 'hold' };
        if (local < FADE) return { a, c: fromPx, alpha: 1 - local / FADE, mode: 'hold' };
        if (local < FADE + GAP) return { a, c: fromPx, alpha: 0, mode: 'gone' };
        if (local < FADE + GAP + SHOOT) {
          const st = easeOut((local - FADE - GAP) / SHOOT);
          return { a, c: toPx, alpha: 1, mode: 'shoot', st, head: { x: lerp(a.x, toPx.x, st), y: lerp(a.y, toPx.y, st) } };
        }
        return { a, c: toPx, alpha: 1, mode: 'hold' };
      });

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';

      beams.forEach((b) => {
        if (b.mode === 'gone' || b.alpha <= 0.01) return;
        if (b.mode === 'shoot') {
          // the beam eases in softly from its anchor toward the new spot
          const r = 0.45 + 0.55 * b.st; // gentle ramp, never a hard flash
          ctx.lineWidth = 2.4; drawBeam(b.a, b.head, (additive ? 0.11 : 0.07) * r);
          ctx.lineWidth = 1.1; drawBeam(b.a, b.head, (additive ? 0.4 : 0.28) * r);
          dot(b.head.x, b.head.y, 1.7, 0.45 * r, 7);
        } else {
          ctx.lineWidth = 3; drawBeam(b.a, b.c, (additive ? 0.16 : 0.10) * b.alpha);
          ctx.lineWidth = 1.1; drawBeam(b.a, b.c, (additive ? 0.5 : 0.34) * b.alpha);
        }
      });

      // packets only ride beams that are settled (not mid-relocation)
      packets.forEach((p) => {
        p.t += p.speed * dt; if (p.t > 1) p.t -= 1;
        const b = beams[p.ai];
        if (b.mode !== 'hold' || b.alpha < 0.6) return;
        const x = lerp(b.a.x, b.c.x, p.t), y = lerp(b.a.y, b.c.y, p.t);
        const a2 = Math.pow(p.t, 0.6);
        dot(x, y, 1.8 + p.t * 1.4, (additive ? 0.9 : 0.7) * a2, 9);
      });

      // cores: old fades out across the move, new grows in
      const pulse = 0.7 + 0.3 * Math.sin(now / 380);
      if (phase === 'move') {
        const prog = pe / MOVE;
        dot(fromPx.x, fromPx.y, 3.5, (additive ? 0.9 : 0.75) * (1 - prog), 14);
        dot(toPx.x, toPx.y, 3.5 + pulse * 1.2, (additive ? 0.95 : 0.8) * (0.4 + 0.6 * prog), 16);
      } else {
        dot(fromPx.x, fromPx.y, 3.5 + pulse * 1.5, additive ? 0.95 : 0.8, 16);
      }

      // scout dot heralds the new spot before the beams start relocating
      if (phase === 'scout') {
        const l = px({ x: lerp(from.x, to.x, easeOut(pe / SCOUT)), y: lerp(from.y, to.y, easeOut(pe / SCOUT)) });
        dot(l.x, l.y, 4.2, 1, 20);
        dot(l.x, l.y, 2, 1, 6);
      }

      schedule();
    };

    // The beam field is purely decorative, so don't burn CPU/GPU on it when it
    // can't be seen: pause the rAF loop while the hero is scrolled out of view
    // or the tab is backgrounded, and resume seamlessly when it returns.
    let raf = null;
    let onScreen = true;          // intersecting the viewport
    let tabVisible = !document.hidden;
    let io = null;
    const schedule = () => {
      raf = onScreen && tabVisible ? requestAnimationFrame(frame) : null;
    };
    const sync = () => {
      if (onScreen && tabVisible) {
        if (raf == null) { last = performance.now(); raf = requestAnimationFrame(frame); }
      } else if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const onVisChange = () => { tabVisible = !document.hidden; sync(); };

    if (reduce) {
      // static single frame at the convergence (fixed spot, or first roam spot)
      const conv = px(fixed || from);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      ANCHORS.forEach((af) => { const a = px(af); ctx.lineWidth = 1.1; drawBeam(a, conv, additive ? 0.5 : 0.34); });
      dot(conv.x, conv.y, 5, additive ? 0.95 : 0.8, 16);
    } else {
      io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
      io.observe(wrap);
      document.addEventListener('visibilitychange', onVisChange);
      raf = requestAnimationFrame(frame); // kick off; observers pause it if needed
    }

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      ro.disconnect();
    };
  }, [mode, fixedConvergence]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 78% 68% at 50% 50%, transparent 32%, var(--bg) 94%)' }}
      />
    </div>
  );
}
