import { describe, it, expect } from 'vitest';
import { journalEntries, searchJournal, journalByDate, filterJournal, journalKinds } from './journal.js';

const session = (date, notes, over = {}) =>
  ({ bowler: 'R', league: 'Tuesday', date, notes, scores: [210, 195, 220], ...over });
const shot = (date, notes, over = {}) =>
  ({ bowler: 'R', league: 'Tuesday', date, game: '2', frame: '6', notes, ...over });
const drill = (date, notes, over = {}) =>
  ({ bowler: 'R', date, target: '10pin', made: 9, missed: 1, notes, ...over });

describe('the journal', () => {
  // Notes are scattered by design -- shot notes ride on the delivery,
  // drill notes on the drill, session notes on the night. Right for
  // writing, useless for reading back.
  it('gathers all three kinds', () => {
    const e = journalEntries({
      sessions: [session('2026-09-10', 'night note')],
      shots: [shot('2026-09-10', 'shot note')],
      drills: [drill('2026-09-10', 'drill note')],
      bowler: 'R',
    });
    expect(e.map(x => x.kind)).toEqual(['session', 'drill', 'shot']);
  });

  it('puts the newest day first', () => {
    const e = journalEntries({
      sessions: [session('2026-09-03', 'older'), session('2026-09-10', 'newer')],
      bowler: 'R',
    });
    expect(e[0].text).toBe('newer');
  });

  // On one night the session note is the summary and belongs above the
  // shot-by-shot remarks.
  it('leads a day with its session note', () => {
    const e = journalEntries({
      shots: [shot('2026-09-10', 'shot note')],
      sessions: [session('2026-09-10', 'night note')],
      bowler: 'R',
    });
    expect(e[0].kind).toBe('session');
  });

  // The notes box keeps its text between shots, so three more balls
  // saves the same line three times.
  it('does not repeat a note kept between shots', () => {
    const e = journalEntries({
      shots: [shot('2026-09-10', 'moved left 2'), shot('2026-09-10', 'moved left 2', { frame: '7' })],
      bowler: 'R',
    });
    expect(e).toHaveLength(1);
  });

  it('keeps the same words on a different night', () => {
    const e = journalEntries({
      shots: [shot('2026-09-10', 'same words'), shot('2026-09-03', 'same words')],
      bowler: 'R',
    });
    expect(e).toHaveLength(2);
  });

  it('skips empty notes entirely', () => {
    const e = journalEntries({
      sessions: [session('2026-09-10', '   ')],
      shots: [shot('2026-09-10', '')],
      drills: [drill('2026-09-10', undefined)],
      bowler: 'R',
    });
    expect(e).toEqual([]);
  });

  it('stays on one bowler', () => {
    const e = journalEntries({
      sessions: [session('2026-09-10', 'theirs', { bowler: 'Maggie' })],
      bowler: 'R',
    });
    expect(e).toEqual([]);
  });

  // A note needs context to mean anything: "felt slow" reads differently
  // beside 620 than beside 480.
  it('carries context with each entry', () => {
    const e = journalEntries({
      sessions: [session('2026-09-10', 'n')],
      shots: [shot('2026-09-10', 's')],
      drills: [drill('2026-09-10', 'd')],
      bowler: 'R',
    });
    expect(e.find(x => x.kind === 'session').detail).toBe('210 · 195 · 220');
    expect(e.find(x => x.kind === 'shot').detail).toBe('Game 2, frame 6');
    expect(e.find(x => x.kind === 'drill').detail).toContain('9/10');
  });

  it('uses a label function for drill targets when given one', () => {
    const e = journalEntries({
      drills: [drill('2026-09-10', 'd')],
      bowler: 'R',
      labelFor: t => (t === '10pin' ? '10 Pin' : t),
    });
    expect(e[0].detail).toContain('10 Pin');
  });

  // Searching "10 pin" should find a drill note about the 10 pin even
  // when those words are not in what the bowler typed.
  it('searches the context as well as the text', () => {
    const e = journalEntries({ drills: [drill('2026-09-10', 'kept it in front')], bowler: 'R' });
    expect(searchJournal(e, '10pin')).toHaveLength(1);
    expect(searchJournal(e, 'front')).toHaveLength(1);
    expect(searchJournal(e, 'nonsense')).toHaveLength(0);
  });

  it('returns everything for an empty search', () => {
    const e = journalEntries({ sessions: [session('2026-09-10', 'n')], bowler: 'R' });
    expect(searchJournal(e, '   ')).toHaveLength(1);
  });

  it('groups by date in order', () => {
    const e = journalEntries({
      sessions: [session('2026-09-03', 'a'), session('2026-09-10', 'b')],
      bowler: 'R',
    });
    const days = journalByDate(e);
    expect(days.map(d => d.date)).toEqual(['2026-09-10', '2026-09-03']);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => journalEntries(j)).not.toThrow();
      expect(() => searchJournal(j, j)).not.toThrow();
      expect(() => journalByDate(j)).not.toThrow();
    }
  });
});

describe('tournament notes', () => {
  const tournament = {
    bowler: 'Ryan', name: 'City Open',
    notes: 'Lanes broke down early', placementNote: 'First win of the year',
    days: [
      { dayNumber: 1, date: '2026-09-22', squad: 'A', notes: 'Moved left 2 after game one',
        games: [{ score: '225' }, { score: '289' }] },
      { dayNumber: 2, date: '2026-09-23', notes: '', games: [{ score: '247' }] },
    ],
  };

  it('gathers the block note, the event note and the finish note', () => {
    const out = journalEntries({ tournaments: [tournament], bowler: 'Ryan' });
    expect(out.map(e => e.text)).toEqual([
      'Lanes broke down early',
      'First win of the year',
      'Moved left 2 after game one',
    ]);
    expect(out.every(e => e.kind === 'tournament')).toBe(true);
    expect(out.every(e => e.league === 'City Open')).toBe(true);
  });

  it('dates the event note by its last block', () => {
    const out = journalEntries({ tournaments: [tournament], bowler: 'Ryan' });
    expect(out.find(e => e.detail === 'Overall').date).toBe('2026-09-23');
  });

  it('gives a block note its day, squad and scores', () => {
    const out = journalEntries({ tournaments: [tournament], bowler: 'Ryan' });
    expect(out.find(e => e.text.startsWith('Moved left')).detail)
      .toBe('Day 1 · Squad A · 225 · 289');
  });

  it('skips blocks with nothing written and other bowlers entirely', () => {
    expect(journalEntries({ tournaments: [tournament], bowler: 'Someone Else' })).toEqual([]);
    expect(journalEntries({ tournaments: [{ name: 'X', days: [{ dayNumber: 1, notes: '' }] }] })).toEqual([]);
  });

  it('survives junk', () => {
    expect(journalEntries({ tournaments: [null, 7, { days: null }] })).toEqual([]);
    expect(journalEntries({ tournaments: 'nope' })).toEqual([]);
  });
});

describe('filtering', () => {
  const entries = [
    { kind: 'session', date: '2026-09-21', text: 'a' },
    { kind: 'shot', date: '2026-09-15', text: 'b' },
    { kind: 'drill', date: '', text: 'c' },
    { kind: 'tournament', date: '2026-08-02', text: 'd' },
  ];
  const texts = o => filterJournal(entries, o).map(e => e.text);

  it('keeps everything when nothing is asked for', () => {
    expect(texts({})).toEqual(['a', 'b', 'c', 'd']);
    expect(texts()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('narrows to the kinds given', () => {
    expect(texts({ kinds: ['shot', 'drill'] })).toEqual(['b', 'c']);
    // An empty list is "all", not "none" -- the default must cost nothing.
    expect(texts({ kinds: [] })).toEqual(['a', 'b', 'c', 'd']);
  });

  it('narrows by either end of a date range, or both', () => {
    expect(texts({ from: '2026-09-01' })).toEqual(['a', 'b']);
    expect(texts({ to: '2026-08-31' })).toEqual(['d']);
    expect(texts({ from: '2026-09-01', to: '2026-09-20' })).toEqual(['b']);
  });

  it('drops undated entries once a range is set', () => {
    // A note with no date cannot honestly be said to fall inside one.
    expect(texts({ from: '2020-01-01' })).not.toContain('c');
    expect(texts({})).toContain('c');
  });

  it('combines kind and range', () => {
    expect(texts({ kinds: ['session'], from: '2026-09-01' })).toEqual(['a']);
  });

  it('survives junk', () => {
    expect(filterJournal(null, { kinds: ['shot'] })).toEqual([]);
    expect(filterJournal(entries, { kinds: 'shot' })).toHaveLength(4);
  });

  it('lists only the kinds present, in reading order', () => {
    expect(journalKinds(entries)).toEqual(['session', 'tournament', 'drill', 'shot']);
    expect(journalKinds(null)).toEqual([]);
  });
});
