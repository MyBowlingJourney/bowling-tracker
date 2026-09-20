import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import fs from 'fs';
import path from 'path';

// ── Does every name in every file actually exist? ───────────────────
//
// A reference to an identifier that was never defined or imported is
// valid JavaScript syntax. It compiles. It bundles. `npm run build`
// prints no warning. It throws only when that line runs -- and if the
// line is inside a component, "when that line runs" means the first
// time a bowler opens that screen, as a blank screen with no
// explanation.
//
// This has happened more than once in this app:
//
//   DISPLAY_PRICES used in BowlingTracker without being imported --
//   would have thrown on EVERY screen, because it sat in shared render
//   code rather than behind a condition.
//
//   C.textDim, a colour token that does not exist, silently undefined
//   rather than an error, so the text rendered with no colour.
//
// appRender.test.jsx catches this class for the main tree, because
// rendering the tree runs the code. But it can only see code that
// actually executes during that render: a branch behind `if
// (somethingRare)`, a handler nobody clicks, a screen reached from one
// menu item. 44 of the 51 components in this app have no test of their
// own, and this check does not care -- it is static, so an unreachable
// line is checked exactly as thoroughly as a hot one.
//
// TypeScript is used purely as a parser and scope resolver over plain
// JavaScript. Nothing here asks for type annotations or type
// correctness; the ONLY diagnostic collected is TS2304, "cannot find
// name". Everything else TypeScript might complain about in untyped JS
// is ignored on purpose -- this is a spell-checker for identifiers, not
// a migration to TypeScript.
//
// typescript is already a devDependency, so this adds nothing to
// install.

const SRC = path.resolve(__dirname);
const CANNOT_FIND_NAME = 2304;

function sourceFiles() {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      // Tests are excluded: they legitimately reference globals this
      // program is not told about, and a test file cannot ship a blank
      // screen to a bowler.
      else if (/\.jsx?$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(full);
    }
  })(SRC);
  return out;
}

describe('every identifier resolves', () => {
  const files = sourceFiles();

  // Same reasoning as the parser guards in schemaContract.test.js: a
  // check that silently examines nothing passes forever while covering
  // nothing. If the walk stops finding files, that is a failure.
  it('finds the source files to check', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('has no undefined names anywhere in src/', () => {
    const program = ts.createProgram(files, {
      allowJs: true,
      checkJs: true,
      noEmit: true,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
      skipLibCheck: true,
    });

    const problems = [];
    for (const d of program.getSemanticDiagnostics()) {
      if (d.code !== CANNOT_FIND_NAME || !d.file) continue;
      // Only our own files -- never node_modules.
      if (!d.file.fileName.startsWith(SRC)) continue;
      const name =
        String(ts.flattenDiagnosticMessageText(d.messageText, '')).match(/'([^']+)'/)?.[1] || '?';
      const { line } = d.file.getLineAndCharacterOfPosition(d.start);
      problems.push(`${path.relative(SRC, d.file.fileName)}:${line + 1}  ${name}`);
    }

    expect(problems).toEqual([]);
  }, 120000); // A whole-program parse is slower than a unit test.
});
