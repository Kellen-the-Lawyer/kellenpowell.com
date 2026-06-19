/* DOL Performance Data — mirrors Casebase's OFLC dashboard.
   Headline totals are REAL (from /api/oflc/landing-stats:
   PERM 680,654 · cert 50.9% · LCA 813,152 · PW 1,295,909).
   Chart distributions are representative — the public instance's pivot
   endpoint isn't queryable, so swap these for live /api/oflc/query data in
   the refactor pass. Shapes match the product's widgets exactly. */

export const DOL_PROGRAMS = [
  {
    id: 'perm', label: 'PERM', color: 'var(--warn)',
    kpis: [
      { label: 'Total Filings', value: '680,654' },
      { label: 'All Certified', value: '86.7%', sub: '590,127 cases (incl. expired)' },
      { label: 'Denied', value: '8.2%', sub: '55,814' },
      { label: 'Unique Firms', value: '4,210' },
    ],
    row: [
      { type: 'pie', title: 'Case Outcomes', subtitle: 'All statuses', data: [
        { label: 'Certified', value: 346453 },
        { label: 'Certified - Expired', value: 225296 },
        { label: 'Denied', value: 55814 },
        { label: 'Withdrawn', value: 34713 },
        { label: 'Certified - Withdrawn', value: 18378 },
      ] },
      { type: 'bar', title: 'Top Law Firms', subtitle: 'by filing volume', data: [
        { label: 'Fragomen Del Rey', value: 78420 },
        { label: 'Ogletree Deakins', value: 42110 },
        { label: 'Berry Appleman & Leiden', value: 31540 },
        { label: 'Jackson Lewis', value: 24880 },
        { label: 'Erickson Immigration', value: 19320 },
        { label: 'Seyfarth Shaw', value: 14760 },
        { label: 'Kirton McConkie', value: 9940 },
        { label: 'Flynn Hodkinson', value: 8120 },
      ] },
      { type: 'bar', title: 'Top Employers', subtitle: 'by filing volume', data: [
        { label: 'Google LLC', value: 14210 },
        { label: 'Amazon.com Services', value: 12880 },
        { label: 'Microsoft Corporation', value: 9640 },
        { label: 'Meta Platforms', value: 8330 },
        { label: 'Apple Inc.', value: 7210 },
        { label: 'Intel Corporation', value: 5940 },
        { label: 'Cognizant', value: 5120 },
        { label: 'Deloitte Consulting', value: 4610 },
      ] },
    ],
    full: { type: 'vbar', title: 'Top SOC Codes Filed', subtitle: 'by volume', data: [
      { label: '15-1252', value: 196300 }, { label: '15-1211', value: 88400 }, { label: '15-1132', value: 51200 },
      { label: '11-3021', value: 24100 }, { label: '13-2011', value: 22100 }, { label: '17-2071', value: 18400 },
      { label: '15-2031', value: 16900 }, { label: '15-1243', value: 12800 }, { label: '15-1142', value: 9600 },
      { label: '11-9111', value: 8200 }, { label: '13-1111', value: 7400 }, { label: '15-1199', value: 6100 },
    ] },
  },
  {
    id: 'lca', label: 'LCA (H-1B)', color: 'var(--blue)',
    kpis: [
      { label: 'Total LCAs', value: '813,152' },
      { label: 'Certified', value: '97.4%', sub: '792,030' },
      { label: 'Visa Classes', value: '4' },
      { label: 'Unique Firms', value: '3,860' },
    ],
    row: [
      { type: 'pie', title: 'Case Outcomes', data: [
        { label: 'Certified', value: 792030 },
        { label: 'Certified - Withdrawn', value: 15450 },
        { label: 'Withdrawn', value: 4060 },
        { label: 'Denied', value: 1612 },
      ] },
      { type: 'bar', title: 'By Visa Class', data: [
        { label: 'H-1B', value: 716400 },
        { label: 'E-3 Australian', value: 50420 },
        { label: 'H-1B1 Singapore', value: 8200 },
        { label: 'H-1B1 Chile', value: 5900 },
      ] },
      { type: 'pie', title: 'PW Wage Levels', subtitle: '% distribution', data: [
        { label: 'Level I', value: 100830 }, { label: 'Level II', value: 380550 },
        { label: 'Level III', value: 244760 }, { label: 'Level IV', value: 87012 },
      ] },
    ],
    full: { type: 'bar', title: 'Top Law Firms', subtitle: 'by LCA volume', data: [
      { label: 'Fragomen Del Rey', value: 96400 }, { label: 'Cognizant (in-house)', value: 41200 },
      { label: 'Berry Appleman & Leiden', value: 28900 }, { label: 'Ogletree Deakins', value: 21400 },
      { label: 'Flynn Hodkinson', value: 14800 }, { label: 'Jackson Lewis', value: 12100 },
      { label: 'Erickson Immigration', value: 9700 }, { label: 'Seyfarth Shaw', value: 7600 },
    ] },
  },
  {
    id: 'pw', label: 'Prevailing Wage', color: 'var(--good)',
    kpis: [
      { label: 'Total PWDs', value: '1,295,909' },
      { label: 'OES Usage', value: '92.4%', sub: 'of all PWDs' },
      { label: 'Unique Firms', value: '4,980' },
      { label: 'SOC Codes', value: '820', sub: 'suggested' },
    ],
    row: [
      { type: 'pie', title: 'Wage Level Distribution', subtitle: 'Level I–IV', data: [
        { label: 'Level I', value: 230672 }, { label: 'Level II', value: 530027 },
        { label: 'Level III', value: 366742 }, { label: 'Level IV', value: 168468 },
      ] },
      { type: 'pie', title: 'Wage Source Usage', subtitle: 'OES vs alternatives', data: [
        { label: 'OES', value: 1197420 }, { label: 'CBA', value: 40170 },
        { label: 'SCA', value: 25920 }, { label: 'DBA', value: 15550 }, { label: 'Other', value: 16849 },
      ] },
      { type: 'bar', title: 'Top Law Firms', subtitle: 'by PWD volume', data: [
        { label: 'Fragomen Del Rey', value: 142300 }, { label: 'Berry Appleman & Leiden', value: 61800 },
        { label: 'Ogletree Deakins', value: 48200 }, { label: 'Jackson Lewis', value: 33100 },
        { label: 'Erickson Immigration', value: 24600 }, { label: 'Seyfarth Shaw', value: 17900 },
      ] },
    ],
    full: { type: 'vbar', title: 'Top Suggested SOC Codes', subtitle: 'by volume', data: [
      { label: '15-1252', value: 358200 }, { label: '15-1211', value: 162400 }, { label: '15-1132', value: 96100 },
      { label: '11-3021', value: 44800 }, { label: '13-2011', value: 41200 }, { label: '17-2071', value: 33600 },
      { label: '15-2031', value: 29800 }, { label: '15-1243', value: 23100 }, { label: '15-1142', value: 18400 },
      { label: '11-9111', value: 15200 }, { label: '13-1111', value: 13100 }, { label: '15-1199', value: 10800 },
    ] },
  },
];

export const FISCAL_YEARS = ['All', 'FY2026', 'FY2025', 'FY2024', 'FY2023', 'FY2022', 'FY2021', 'FY2020'];
