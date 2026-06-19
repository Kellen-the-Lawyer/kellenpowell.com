import React, { useState, useEffect, useRef } from 'react';
import { CASEBASE_URL } from './content';
import { CITATION_GRAPH } from './citationGraphData';

/* Faithful mirror of Casebase's CitationGraphView (D3 force-directed graph),
   showing the real "SmartZip Analytics" (2016-PER-00695) citation network as a
   static snapshot. Same node sizing (by in-degree), outcome colors, arrow
   markers, drag, hover-to-highlight, zoom/pan, tooltip, and selected panel —
   themed to the marketing palette and rendered plainly inside the card. */

const OUTCOME_COLOR = {
  Affirmed: '#34d399',
  Reversed: '#f87171',
  Remanded: '#fbbf24',
  Dismissed: '#5a5a68',
};

export function CitationGraphMock() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [d3Ready, setD3Ready] = useState(typeof window !== 'undefined' && !!window.d3);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  // Load D3 from CDN once (same as the product component)
  useEffect(() => {
    if (window.d3) { setD3Ready(true); return; }
    const existing = document.querySelector('script[data-d3]');
    if (existing) { existing.addEventListener('load', () => setD3Ready(true)); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js';
    script.setAttribute('data-d3', '');
    script.onload = () => setD3Ready(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!d3Ready || !svgRef.current || !containerRef.current) return;
    const d3 = window.d3;
    const data = CITATION_GRAPH;

    const container = containerRef.current;
    let width = container.clientWidth || 720;
    let height = container.clientHeight || 420;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // in-degree (citations received within the graph) drives node size + badge
    const inDegree = {};
    data.nodes.forEach((n) => { inDegree[n.id] = 0; });
    data.edges.forEach((e) => { if (inDegree[e.target] !== undefined) inDegree[e.target]++; });
    const maxDegree = Math.max(...Object.values(inDegree), 1);
    const nodeRadius = (n) => {
      const deg = inDegree[n.id] || 0;
      const effectiveDeg = n.tier === 'secondary' ? Math.max(deg, n.cited_by_count || 0) : deg;
      return 10 + (effectiveDeg / maxDegree) * 28;
    };

    const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom).on('wheel.zoom', null); // disable scroll-to-zoom; keep drag-pan
    const g = svg.append('g');

    // arrow markers, one per outcome color
    const defs = svg.append('defs');
    const markerColors = { default: '#4a4a6a', Affirmed: '#34d399', Reversed: '#f87171', Remanded: '#fbbf24', Dismissed: '#5a5a68' };
    Object.entries(markerColors).forEach(([key, color]) => {
      defs.append('marker')
        .attr('id', `cgc-arrow-${key}`)
        .attr('viewBox', '0 -4 8 8').attr('refX', 10).attr('refY', 0)
        .attr('markerWidth', 7).attr('markerHeight', 7).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color).attr('opacity', 0.7);
    });

    const nodes = data.nodes.map((n) => ({ ...n }));
    const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const edges = data.edges.filter((e) => nodeById[e.source] && nodeById[e.target]).map((e) => ({ ...e }));

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((n) => n.id)
        .distance((d) => nodeRadius(nodeById[d.source.id ?? d.source]) + nodeRadius(nodeById[d.target.id ?? d.target]) + 60)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength((n) => -(nodeRadius(n) * 18)))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.08))
      .force('collision', d3.forceCollide().radius((n) => nodeRadius(n) + 20).strength(0.9))
      .alphaDecay(0.02);

    const link = g.append('g').selectAll('line').data(edges).join('line')
      .attr('stroke', (d) => OUTCOME_COLOR[nodeById[d.source.id ?? d.source]?.outcome] ?? '#4a4a6a')
      .attr('stroke-width', 1.5).attr('stroke-opacity', 0.45)
      .attr('marker-end', (d) => {
        const src = nodeById[d.source.id ?? d.source];
        return `url(#cgc-arrow-${OUTCOME_COLOR[src?.outcome] ? src.outcome : 'default'})`;
      });

    const node = g.append('g').selectAll('g').data(nodes).join('g')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.15).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (n) => { const base = OUTCOME_COLOR[n.outcome] ?? '#5a5a68'; return n.tier === 'secondary' ? base + '55' : base + 'cc'; })
      .attr('stroke', (n) => OUTCOME_COLOR[n.outcome] ?? '#5a5a68')
      .attr('stroke-width', (n) => (n.tier === 'primary' ? 2 : 1))
      .attr('stroke-opacity', 0.9);

    node.append('text')
      .text((n) => inDegree[n.id] || '')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', (n) => Math.max(8, nodeRadius(n) * 0.55))
      .attr('font-family', "'DM Mono', monospace").attr('font-weight', '600')
      .attr('fill', '#fff').attr('fill-opacity', 0.9).style('pointer-events', 'none');

    node.append('text')
      .text((n) => { const m = n.case_number?.match(/^(\d{4})-PER-0*(\d+)$/); return m ? `${m[1]}-${m[2]}` : (n.case_number ?? ''); })
      .attr('text-anchor', 'middle').attr('dy', (n) => nodeRadius(n) + 13)
      .attr('font-size', 9).attr('font-family', "'DM Mono', monospace")
      .attr('fill', (n) => OUTCOME_COLOR[n.outcome] ?? 'var(--fg3)')
      .attr('fill-opacity', (n) => (n.tier === 'primary' ? 0.85 : 0.55)).style('pointer-events', 'none');

    node.each(function (n) {
      if (!n.employer_name || nodeRadius(n) < 18) return;
      const label = n.employer_name.length > 22 ? n.employer_name.slice(0, 20) + '…' : n.employer_name;
      d3.select(this).append('text')
        .text(label).attr('text-anchor', 'middle').attr('dy', nodeRadius(n) + 24)
        .attr('font-size', 8.5).attr('font-family', 'sans-serif')
        .attr('fill', 'var(--fg3)').attr('fill-opacity', 0.7).style('pointer-events', 'none');
    });

    node.on('mouseenter', (event, d) => {
      setHovered(d);
      link.attr('stroke-opacity', (e) => ((e.source.id ?? e.source) === d.id || (e.target.id ?? e.target) === d.id ? 0.9 : 0.1))
        .attr('stroke-width', (e) => ((e.source.id ?? e.source) === d.id || (e.target.id ?? e.target) === d.id ? 2.5 : 1.5));
      const connected = new Set([d.id]);
      edges.forEach((e) => { const s = e.source.id ?? e.source, t = e.target.id ?? e.target; if (s === d.id) connected.add(t); if (t === d.id) connected.add(s); });
      node.attr('opacity', (n) => (connected.has(n.id) ? 1 : 0.2));
    }).on('mouseleave', () => {
      setHovered(null);
      link.attr('stroke-opacity', 0.45).attr('stroke-width', 1.5);
      node.attr('opacity', 1);
    }).on('click', (event, d) => { event.stopPropagation(); setSelected(d); });

    svg.on('click', () => setSelected(null));

    sim.on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
        .attr('x2', (d) => { const tr = nodeRadius(nodeById[d.target.id ?? d.target] ?? d.target); const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y; const dist = Math.sqrt(dx * dx + dy * dy) || 1; return d.target.x - (dx / dist) * (tr + 10); })
        .attr('y2', (d) => { const tr = nodeRadius(nodeById[d.target.id ?? d.target] ?? d.target); const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y; const dist = Math.sqrt(dx * dx + dy * dy) || 1; return d.target.y - (dy / dist) * (tr + 10); });
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // fit the whole network into the card (re-centers on resize too)
    const fit = (animate = true) => {
      const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
      const pad = 28;
      const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
      const bw = maxX - minX || 1, bh = maxY - minY || 1;
      const scale = Math.min(width / bw, height / bh, 1.4);
      const tx = width / 2 - scale * (minX + maxX) / 2;
      const ty = height / 2 - scale * (minY + maxY) / 2;
      const t = d3.zoomIdentity.translate(tx, ty).scale(scale);
      (animate ? svg.transition().duration(600) : svg).call(zoom.transform, t);
    };
    sim.on('end', () => fit(true));
    const fitTimer = setTimeout(() => fit(true), 3200); // backstop if 'end' is slow

    // keep the graph centred in the box when the card resizes (responsive)
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h || (w === width && h === height)) return;
      width = w; height = h;
      svg.attr('width', width).attr('height', height);
      fit(false);
    });
    ro.observe(container);

    return () => { sim.stop(); clearTimeout(fitTimer); ro.disconnect(); };
  }, [d3Ready]);

  const tierBadge = (n) => (n.tier === 'primary'
    ? { label: 'matched', bg: 'color-mix(in srgb, var(--accent) 18%, transparent)', fg: 'var(--accent)' }
    : { label: `hub · cited ${n.cited_by_count}×`, bg: 'var(--bg4)', fg: 'var(--fg3)' });

  return (
    <div className="relative rounded-xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden h-[460px] md:h-[600px]">
      <div ref={containerRef} className="absolute inset-0">
        <svg ref={svgRef} className="w-full h-full block select-none" />
      </div>

      {/* count + legend overlays (mirrors the product's header info) */}
      <div className="absolute top-3 right-3 text-[9px] font-mono text-[var(--fg3)] px-2 py-1 rounded bg-[var(--bg2)]/75 border border-[var(--line)]">
        {CITATION_GRAPH.primary_count} matched · {CITATION_GRAPH.secondary_count} hub · {CITATION_GRAPH.edges.length} links
      </div>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-mono text-[var(--fg3)]">
        {Object.entries(OUTCOME_COLOR).map(([o, c]) => (
          <span key={o} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{o}
          </span>
        ))}
      </div>

      {/* hover tooltip */}
      {hovered && !selected && (
        <div className="absolute bottom-9 left-3 z-10 max-w-[280px] rounded-lg border border-[var(--line2)] bg-[var(--bg2)] px-3.5 py-2.5 pointer-events-none shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-semibold" style={{ color: OUTCOME_COLOR[hovered.outcome] ?? 'var(--fg3)' }}>{hovered.case_number}</span>
            <span className="text-[9px] px-1.5 py-px rounded" style={{ background: tierBadge(hovered).bg, color: tierBadge(hovered).fg }}>{tierBadge(hovered).label}</span>
          </div>
          {hovered.employer_name && <div className="font-serif text-[12px] text-[var(--fg)] mb-1">{hovered.employer_name}</div>}
          <div className="flex gap-3 items-center">
            {hovered.date && <span className="font-mono text-[10px] text-[var(--fg3)]">{hovered.date}</span>}
            {hovered.outcome && <span className="text-[10px] font-medium" style={{ color: OUTCOME_COLOR[hovered.outcome] }}>● {hovered.outcome}</span>}
          </div>
        </div>
      )}

      {/* selected node panel */}
      {selected && (
        <div className="absolute top-3 right-3 z-20 w-[260px] rounded-lg bg-[var(--bg2)] px-4 py-4 shadow-2xl"
          style={{ border: `1px solid color-mix(in srgb, ${OUTCOME_COLOR[selected.outcome] ?? 'var(--line2)'} 40%, transparent)` }}>
          <div className="flex items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[11px] font-semibold" style={{ color: OUTCOME_COLOR[selected.outcome] ?? 'var(--fg3)' }}>{selected.case_number}</span>
                <span className="text-[9px] px-1.5 py-px rounded" style={{ background: tierBadge(selected).bg, color: tierBadge(selected).fg }}>{tierBadge(selected).label}</span>
              </div>
              {selected.employer_name && <div className="font-serif text-[14px] text-[var(--fg)] mb-1 leading-snug">{selected.employer_name}</div>}
              <div className="flex gap-3 flex-wrap">
                {selected.date && <span className="font-mono text-[10px] text-[var(--fg3)]">{selected.date}</span>}
                {selected.outcome && <span className="text-[10px] font-medium" style={{ color: OUTCOME_COLOR[selected.outcome] }}>● {selected.outcome}</span>}
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-[16px] leading-none text-[var(--fg3)] hover:text-[var(--fg)] ml-2 flex-shrink-0">×</button>
          </div>
          <a href={CASEBASE_URL} target="_blank" rel="noreferrer"
            className="block text-center w-full text-[12px] py-2 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-semibold hover:bg-[var(--accent2)] transition-colors">
            Open decision →
          </a>
        </div>
      )}
    </div>
  );
}
