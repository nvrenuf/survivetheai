import { createClient } from '@supabase/supabase-js';

const HELP_TEXT = `Usage:
  npm run report:lead-sources -- [--limit=50] [--status=all]

Options:
  --limit=<number>   Number of recent subscriber rows to inspect. Default: 50
  --status=<value>   all | pending | active | unsubscribed. Default: all
  --help             Show this message

Environment:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY preferred, SUPABASE_ANON_KEY as fallback
`;

function parseArgs(argv) {
  const args = { limit: 50, status: 'all', help: false };

  for (const raw of argv) {
    if (raw === '--help' || raw === '-h') {
      args.help = true;
      continue;
    }

    if (raw.startsWith('--limit=')) {
      const parsed = Number.parseInt(raw.slice('--limit='.length), 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        args.limit = Math.min(parsed, 500);
      }
      continue;
    }

    if (raw.startsWith('--status=')) {
      const status = raw.slice('--status='.length).trim().toLowerCase();
      if (['all', 'pending', 'active', 'unsubscribed'].includes(status)) {
        args.status = status;
      }
    }
  }

  return args;
}

function valueOrFallback(value, fallback = '(none)') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function summarize(rows, getKey) {
  const counts = new Map();
  for (const row of rows) {
    increment(counts, getKey(row));
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

function printSummary(title, rows) {
  console.log(`\n${title}`);
  if (rows.length === 0) {
    console.log('  (no rows)');
    return;
  }

  for (const row of rows) {
    console.log(`  ${row.count.toString().padStart(3, ' ')}  ${row.label}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP_TEXT);
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials for lead-source reporting.');
    console.error('Expected SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, with SUPABASE_ANON_KEY as fallback.');
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  let query = supabase
    .from('subscribers')
    .select('created_at,status,source_page,page_path,referrer,utm_source,utm_medium,utm_campaign,signup_intent,lead_segment')
    .order('created_at', { ascending: false })
    .limit(args.limit);

  if (args.status !== 'all') {
    query = query.eq('status', args.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Unable to load subscriber lead-source data.');
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const rows = data ?? [];

  console.log(`Lead-source report: ${rows.length} recent subscriber rows`);
  console.log(`Status filter: ${args.status}`);

  printSummary(
    'By source_page',
    summarize(rows, (row) => valueOrFallback(row.source_page)),
  );

  printSummary(
    'By page_path',
    summarize(rows, (row) => valueOrFallback(row.page_path)),
  );

  printSummary(
    'By referrer',
    summarize(rows, (row) => valueOrFallback(row.referrer)),
  );

  printSummary(
    'By UTM',
    summarize(rows, (row) => {
      const source = valueOrFallback(row.utm_source);
      const medium = valueOrFallback(row.utm_medium);
      const campaign = valueOrFallback(row.utm_campaign);
      return `${source} | ${medium} | ${campaign}`;
    }),
  );

  const recentRows = rows.map((row) => ({
    created_at: row.created_at,
    status: row.status,
    source_page: valueOrFallback(row.source_page),
    page_path: valueOrFallback(row.page_path),
    referrer: valueOrFallback(row.referrer),
    utm_source: valueOrFallback(row.utm_source),
    utm_medium: valueOrFallback(row.utm_medium),
    utm_campaign: valueOrFallback(row.utm_campaign),
    signup_intent: valueOrFallback(row.signup_intent),
    lead_segment: valueOrFallback(row.lead_segment),
  }));

  console.log('\nRecent rows');
  if (recentRows.length === 0) {
    console.log('  (no rows)');
  } else {
    console.table(recentRows);
  }
}

main().catch((error) => {
  console.error('Unexpected lead-source reporting failure.');
  console.error(error);
  process.exitCode = 1;
});
