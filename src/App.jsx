import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './useTheme';
import Slate from './designs/Slate';

/* ── Dark-grey + white ("Graphite") theme, mono beams ──────────────────
   Monochrome UI in both modes. Hero beams use --beam:
   bright WHITE in dark (light-beam effect), graphite in light.
   Semantic colors (good/bad/warn) stay intact so product mockups read. */
const PALETTES = {
  dark: {
    '--bg': '#0c0d0f', '--bg2': '#141518', '--bg3': '#1d1f23', '--bg4': '#2a2d33',
    '--line': '#26282d', '--line2': '#383b42',
    '--fg': '#f4f5f7', '--fg2': '#c2c5cc', '--fg3': '#888d97',
    '--accent': '#ffffff', '--accent2': '#d6d9df', '--accent-fg': '#0c0d0f',
    '--good': '#34d399', '--bad': '#f87171', '--warn': '#fbbf24', '--blue': '#60a5fa', '--rose': '#f472b6',
    '--radius-mock': '0.75rem', '--grid-dot': 'rgba(255,255,255,0.06)',
    '--beam': '#ffffff', '--beam2': '#ffffff', // bright white light-beams in dark
  },
  light: {
    '--bg': '#f4f5f7', '--bg2': '#ffffff', '--bg3': '#eceef1', '--bg4': '#dfe2e7',
    '--line': '#e4e7eb', '--line2': '#ccd0d7',
    '--fg': '#15171a', '--fg2': '#4a4e56', '--fg3': '#8a909a',
    '--accent': '#1f2226', '--accent2': '#34383f', '--accent-fg': '#ffffff',
    '--good': '#059669', '--bad': '#dc2626', '--warn': '#d97706', '--blue': '#2563eb', '--rose': '#db2777',
    '--radius-mock': '0.75rem', '--grid-dot': 'rgba(20,22,26,0.07)',
    '--beam': '#2563eb', '--beam2': '#22d3ee', // blue→cyan beams in light
  },
};

function ThemeToggle({ pref, mode, setPref }) {
  const opts = [
    ['light', Sun, 'Light'],
    ['dark', Moon, 'Dark'],
    ['system', Monitor, 'System'],
  ];
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--line2)] bg-[var(--bg2)] p-0.5">
      {opts.map(([val, Icon, label]) => {
        const active = pref === val;
        return (
          <button
            key={val}
            onClick={() => setPref(val)}
            title={`${label}${val === 'system' ? ` (currently ${mode})` : ''}`}
            aria-label={label}
            aria-pressed={active}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
              active ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'text-[var(--fg3)] hover:text-[var(--fg)]'
            }`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const { pref, mode, setPref } = useTheme();
  return (
    <Slate
      mode={mode}
      palettes={PALETTES}
      ThemeToggle={<ThemeToggle pref={pref} mode={mode} setPref={setPref} />}
    />
  );
}
