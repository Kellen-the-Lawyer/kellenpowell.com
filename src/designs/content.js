// Shared content for every design option. Designs differ in look & structure,
// never in the underlying copy — so all of it lives here.

export const CASEBASE_URL = 'https://casebase.kellenpowell.com';

export const HERO = {
  badge: 'Immigration research, reimagined',
  titleLead: 'Every immigration tool,',
  titleAccent: 'one workbench.',
  body: 'Casebase is a research and analytics workbench for employment-based immigration. Search BALCA and AAO case law, the CFR, and USCIS policy together, dig into 1.4M+ records of DOL outcome data, and check experience against the PWD with the PERM Comparer.',
  primaryCta: 'Open Casebase',
  secondaryCta: 'See it in action',
  reassurance: 'Free to use — no account, no sign-up.',
};

export const STATS = [
  { target: 1.4, kind: 'm', label: 'DOL disclosure records', display: '1.4M+' },
  { target: 7334, kind: 'int', label: 'BALCA decisions indexed', display: '7,334' },
  { target: 6, kind: 'int', label: 'searchable corpora', display: '6' },
  { target: 21, kind: 'int', label: 'pre-built report templates', display: '21' },
];

// Alternating feature rows. `icon` is a lucide-react export name.
export const FEATURES = [
  {
    id: 'research',
    eyebrow: 'Cross-corpus search',
    tone: 'rose',
    title: 'One query across every source that matters.',
    body: 'Type once and search BALCA decisions, AAO decisions, the CFR, and USCIS policy at the same time. Results are ranked by relevance and citation authority, with full operator support for exact phrases, exclusions, and OR.',
    points: [
      'BALCA & AAO full-text search with outcome filters',
      'Inline citation hyperlinks jump straight to the cited case',
      'Operators: "exact phrase", -exclude, term OR term',
    ],
    mock: 'search',
  },
  {
    id: 'citations',
    eyebrow: 'Citation graph',
    tone: 'good',
    title: 'See how the case law connects.',
    body: 'Every decision sits in a web of citations. Casebase draws that web as an interactive graph so you can spot the authorities that anchor a line of reasoning — sized by influence, colored by outcome.',
    points: [
      'Force-directed graph of citing and cited decisions',
      'Nodes colored by outcome: affirmed, reversed, remanded',
      'Click any node to open the full decision',
    ],
    mock: 'graph',
  },
  {
    id: 'data',
    eyebrow: 'DOL performance data',
    tone: 'good',
    title: '1.4M+ records of what actually happened.',
    body: 'Go beyond the opinions. Explore PERM, LCA, and Prevailing Wage disclosure data from FY2020–FY2026 with live dashboards, 21 pre-built report templates, and a pivot builder for anything custom.',
    points: [
      'KPI dashboards: cert rates, top firms, wage trends, SOC drift',
      '21 template reports across outcomes and cross-program trends',
      'Pivot builder with CSV export for your own cuts',
    ],
    mock: 'dashboard',
  },
  {
    id: 'tools',
    eyebrow: 'PERM Comparer',
    tone: 'accent',
    title: 'Check experience against the PWD in seconds.',
    body: 'Drag in a Prevailing Wage Determination and your experience verification letters. Casebase extracts the fields, computes total months, and checks each requirement keyword against the letters — flagging what’s covered and what’s missing.',
    points: [
      'Auto-extract fields from ETA-9141 PWDs and experience letters',
      'Requirement keyword coverage, found vs. missing',
      'Equal-pay-transparency checks by jurisdiction',
    ],
    mock: 'comparer',
  },
];

export const CAPABILITIES = [
  { icon: 'Scale', tone: 'accent', title: 'BALCA & AAO decisions', desc: 'Full-text search across thousands of administrative appeals with outcome filters and judge/panel lookup.' },
  { icon: 'Network', tone: 'good', title: 'Citation graphs', desc: 'See how decisions cite each other in an interactive force-directed map, color-coded by outcome.' },
  { icon: 'BookOpen', tone: 'blue', title: 'Regulations (CFR)', desc: 'The immigration CFR, cross-linked from the cases that interpret it.' },
  { icon: 'Library', tone: 'blue', title: 'Policy manuals', desc: 'USCIS policy and precedent decisions, searchable alongside everything else.' },
  { icon: 'BarChart3', tone: 'good', title: 'DOL dashboards', desc: 'PERM, LCA, and Prevailing Wage KPIs — cert rates, top firms, wage trends, SOC breakdowns.' },
  { icon: 'Layers', tone: 'accent', title: 'Pivot builder', desc: 'Build any custom report: drag fields, set filters, pivot by any dimension, export to CSV.' },
  { icon: 'FileSearch', tone: 'accent', title: 'PERM Comparer', desc: 'Drag in a PWD and experience letters; auto-extract fields and check requirement coverage.' },
  { icon: 'CalendarRange', tone: 'rose', title: 'Visa Bulletin', desc: 'Track priority-date movement across categories and chargeability areas.' },
  { icon: 'FolderKanban', tone: 'blue', title: 'Projects & Read Later', desc: 'Save cases into projects, drop notes, and stash citations while you read.' },
];

export const NAV_LINKS = [
  ['Research', '#research'],
  ['Data', '#data'],
  ['Tools', '#tools'],
  ['Everything', '#everything'],
];

export const CTA = {
  title: 'Open Casebase and start searching.',
  body: 'It’s free to use right now — no account, no paywall. Just open it and run a query.',
  cta: 'Open Casebase',
  url: 'casebase.kellenpowell.com',
};

// Mock data for the SearchMock product screenshot.
export const SEARCH_RESULTS = [
  { num: '2023-PER-00148', corpus: 'BALCA', title: 'Specialty occupation degree requirement', outcome: 'Affirmed' },
  { num: 'JAN032024_01B5203', corpus: 'AAO', title: 'EB-1A extraordinary ability — final merits', outcome: 'Reversed' },
  { num: '20 CFR § 656.17', corpus: 'CFR', title: 'Recruitment & filing requirements', outcome: null },
  { num: '2022-PER-00091', corpus: 'BALCA', title: 'Business necessity for foreign language', outcome: 'Remanded' },
];
