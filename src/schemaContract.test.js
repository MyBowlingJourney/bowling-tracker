import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// ── Does every query ask for the columns its mapper reads? ──────────
//
// This exists because of a bug that shipped, was "fixed", and was still
// broken afterwards.
//
// centerFromRow maps `rackType: row.rack_type || ""`. The query that
// loads bowling_centers did not ask for rack_type. So rackType was ""
// for every centre ever loaded, rackTypeByLeague came out empty, and the
// free-fall-versus-string card returned null -- for everybody, with any
// data, forever. The same query was also missing created_by, which meant
// the client could not tell a shared centre belonged to someone else, so
// it rewrote the row, got refused by RLS, and tried again the next day.
//
// Both files were individually correct. The mapper read what it needed;
// the query selected a sensible-looking list. Nothing threw, nothing
// logged, and no unit test could see it, because the defect lives in the
// space BETWEEN them. The symptom -- a card that renders nothing --
// looks exactly like "you have not bowled enough yet", which is why it
// survived.
//
// A mapper that reads a column its query never requested fails silently
// and always in that shape. It is also entirely mechanical to detect,
// which is what this file does.
//
// WHY TEXT AND NOT IMPORTS: the thing being checked is the literal
// string inside .select(), which does not survive being imported. This
// reads the source, so it stays honest about what the code actually
// says.

const SRC = path.resolve(__dirname);

function read(f) {
  return fs.readFileSync(path.join(SRC, f), 'utf8');
}

// Property names that are JavaScript, not database columns. Without
// this, `rows.map` and `row.length` get reported as missing columns.
const NOT_COLUMNS = new Set([
  'length', 'map', 'filter', 'forEach', 'reduce', 'slice', 'split', 'join',
  'trim', 'toString', 'includes', 'push', 'sort', 'some', 'every', 'find',
  'indexOf', 'replace', 'match', 'concat', 'keys', 'values', 'entries',
  'charAt', 'substring', 'toLowerCase', 'toUpperCase', 'startsWith',
  'endsWith', 'flatMap', 'pop', 'shift', 'at', 'padStart', 'padEnd',
]);

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// The body of a named function, by brace matching from its opening {.
// Regex alone cannot find the end of a function; this can, and a mapper
// body read one character short would silently drop its last column.
function functionBody(source, name) {
  const start = source.search(new RegExp(`function\\s+${name}\\s*\\(`));
  if (start === -1) return null;
  const open = source.indexOf('{', start);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  return null;
}

// Every `row.x` / `r.x` / `x.x` read inside a mapper body. In a
// FromRow mapper these are database columns by definition -- the whole
// job of the function is to turn a row into client shape.
function columnsReadBy(body) {
  const found = new Set();
  const re = /\b(?:row|r|x)\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let m;
  while ((m = re.exec(body))) {
    if (!NOT_COLUMNS.has(m[1])) found.add(m[1]);
  }
  return found;
}

// ── Parse the main load ─────────────────────────────────────────────
//
// The destructured names and the Promise.all calls are positionally
// aligned, which is what lets a response variable be tied to the table
// it came from and then to the mapper applied to it.
function parseLoad() {
  const tracker = stripComments(read('BowlingTracker.jsx'));
  const declStart = tracker.search(/const\s*\[\s*\n\s*shotsRes\s*,/);
  if (declStart === -1) return null;
  const arrEnd = tracker.indexOf('] = await Promise.all([', declStart);
  if (arrEnd === -1) return null;

  const names = tracker
    .slice(declStart, arrEnd)
    .replace(/const\s*\[/, '')
    .split('\n')
    .map(s => s.trim().replace(/,$/, ''))
    .filter(Boolean);

  const callsEnd = tracker.indexOf(']);', arrEnd);
  const body = tracker.slice(arrEnd, callsEnd);

  // A cursored table appears twice in one array element -- the delta
  // branch and the full branch of a ternary. Collapsing consecutive
  // repeats puts the list back in step with the names.
  const raw = [...body.matchAll(/cloud(?:Read|ReadDelta)\("([a-z_]+)"/g)].map(m => m[1]);
  const tables = raw.filter((t, i) => i === 0 || raw[i - 1] !== t);

  // Every select in the whole app, by table. A table read in one place
  // with an explicit list and elsewhere with "*" is satisfied by the
  // "*": the mapper is fed somewhere with everything it needs.
  const selects = new Map();
  for (const file of fs.readdirSync(SRC)) {
    if (!/\.jsx?$/.test(file) || /\.test\./.test(file)) continue;
    const text = stripComments(read(file));
    for (const m of text.matchAll(/cloudRead\("([a-z_]+)"\s*,\s*q\s*=>\s*q\s*\.select\("([^"]*)"/g)) {
      if (!selects.has(m[1])) selects.set(m[1], []);
      selects.get(m[1]).push(m[2]);
    }
    // A cursored read has no select() of its own -- it fetches '*'.
    for (const m of text.matchAll(/cloudReadDelta\("([a-z_]+)"/g)) {
      if (!selects.has(m[1])) selects.set(m[1], []);
      selects.get(m[1]).push('*');
    }
  }

  // Which mapper each response variable is fed through.
  const pairs = [];
  names.forEach((name, i) => {
    const table = tables[i];
    if (!table) return;
    const re = new RegExp(`${name}\\.data[\\s\\S]{0,400}?\\b(\\w+From(?:Supabase)?Rows?)\\b`);
    const m = tracker.match(re);
    if (m) pairs.push({ name, table, mapper: m[1] });
  });

  return { names, tables, selects, pairs };
}

// Mapper bodies, wherever in src/domain they live.
function findMapperBody(mapper) {
  const dir = path.join(SRC, 'domain');
  for (const file of fs.readdirSync(dir)) {
    if (!/\.js$/.test(file) || /\.test\./.test(file)) continue;
    const text = stripComments(fs.readFileSync(path.join(dir, file), 'utf8'));
    const body = functionBody(text, mapper);
    if (body) return body;
  }
  return null;
}

describe('supabase select covers what its mapper reads', () => {
  const load = parseLoad();

  // ── The parser has to fail loudly, never quietly ──────────────────
  //
  // A checker that silently finds nothing to check is worse than no
  // checker: it reports success forever while covering zero cases, and
  // it does that the moment somebody reformats the code it reads. These
  // three assertions are the tripwire on the tripwire.
  it('finds the main load block', () => {
    expect(load).not.toBeNull();
  });

  it('keeps the destructured names in step with the queries', () => {
    // If these ever drift, every pair below is mis-attributed and the
    // failures would be nonsense. Better to fail here, pointing at the
    // parse, than to report a wrong column on the wrong table.
    expect(load.names.length).toBe(load.tables.length);
  });

  it('still recognises the pair this test was written for', () => {
    // bowling_centers -> centerFromRow is the exact pairing that broke.
    // If a refactor stops this being found, the regression it guards is
    // unguarded again, and that must be a failure rather than a silent
    // reduction in coverage.
    expect(load.pairs.some(p => p.table === 'bowling_centers' && p.mapper === 'centerFromRow'))
      .toBe(true);
  });

  it('checks a meaningful number of tables', () => {
    expect(load.pairs.length).toBeGreaterThanOrEqual(8);
  });

  // ── The contract itself ───────────────────────────────────────────
  it('requests every column each mapper reads', () => {
    const problems = [];

    for (const { table, mapper } of load.pairs) {
      const lists = load.selects.get(table) || [];
      if (!lists.length) continue;               // never read with an explicit list
      if (lists.some(l => l.trim() === '*')) continue;  // fetches everything

      const body = findMapperBody(mapper);
      if (!body) {
        problems.push(`${mapper}: could not find its body to check`);
        continue;
      }
      const needed = columnsReadBy(body);

      // Satisfied if ANY select for this table covers the mapper. A
      // narrow query built for some other purpose -- leagues is read
      // several times, mostly as just id and name -- is not evidence
      // that the mapper is starved.
      const covered = lists.some(list => {
        const cols = new Set(list.split(',').map(c => c.trim()).filter(Boolean));
        return [...needed].every(c => cols.has(c));
      });

      if (!covered) {
        const widest = lists
          .map(l => new Set(l.split(',').map(c => c.trim())))
          .sort((a, b) => b.size - a.size)[0];
        const missing = [...needed].filter(c => !widest.has(c));
        problems.push(
          `${table} -> ${mapper} reads ${missing.join(', ')}, which no select() asks for`
        );
      }
    }

    expect(problems).toEqual([]);
  }, 20000);
});
