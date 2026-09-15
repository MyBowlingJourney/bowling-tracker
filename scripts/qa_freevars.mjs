// Identifiers used but never declared -- the class check_undefined.mjs
// does not cover.
//
// check_undefined verifies that every project FUNCTION called in a file
// is imported. It says nothing about a plain free variable, so LogView
// could read `profiles` with no import, no prop and no local declaration,
// pass every check in the harness, and throw "profiles is not defined"
// on a real phone the moment a completed session rendered.
//
// Uses the TypeScript compiler's own scope analysis rather than a regex.
// Scope is exactly what a regex cannot do, and HANDOFF 4.1 is a record of
// three checkers that were confidently wrong because they tried.
import ts from "/home/claude/.npm-global/lib/node_modules/typescript/lib/typescript.js";
import fs from "fs";
import path from "path";

const SRC = "/home/claude/team-migration/src";
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.jsx?$/.test(e.name) && !/\.test\./.test(e.name)) files.push(f);
  }
})(SRC);

const program = ts.createProgram(files, {
  allowJs: true, checkJs: true, noEmit: true,
  jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ["lib.esnext.d.ts", "lib.dom.d.ts"], skipLibCheck: true, noResolve: false,
});

// TS2304 "Cannot find name 'x'" is the one that matters. Everything else
// TypeScript has an opinion about in a JS codebase is noise here.
const found = [];
for (const d of program.getSemanticDiagnostics()) {
  if (d.code !== 2304 || !d.file) continue;
  const name = String(ts.flattenDiagnosticMessageText(d.messageText, "")).match(/'([^']+)'/)?.[1] || "?";
  const { line } = d.file.getLineAndCharacterOfPosition(d.start);
  found.push({ file: d.file.fileName.replace(SRC + "/", ""), line: line + 1, name });
}

// SECOND PASS: identifiers whose only "declaration" is a JSX attribute.
//
// TypeScript's checkJs resolves a bare `userId` against the attribute name
// in `<X userId={...} />` elsewhere in the same file, so it emits no 2304
// and the free variable goes unreported. That is exactly how
// `userId is not defined` shipped and crashed the Genie for every user
// with a team, while this checker printed "0 undefined identifiers".
//
// A JSX attribute name is never a binding. If every declaration of a
// symbol is one, a bare use of that name is undefined.
for (const file of files) {
  const sf = program.getSourceFile(file);
  if (!sf) continue;
  const checker = program.getTypeChecker();

  const visit = (n) => {
    if (ts.isIdentifier(n)) {
      const p = n.parent;
      const isAttrName = p && ts.isJsxAttribute(p) && p.name === n;
      const isPropName = p && (ts.isPropertyAssignment(p) || ts.isPropertySignature(p)) && p.name === n;
      const isAccess = p && ts.isPropertyAccessExpression(p) && p.name === n;
      // JSX tag names (<div>, <Chip>) resolve through the JSX namespace,
      // not ordinary scope, so they legitimately have no symbol here.
      const isTagName = p && (ts.isJsxOpeningElement(p) || ts.isJsxClosingElement(p)
        || ts.isJsxSelfClosingElement(p)) && p.tagName === n;
      // Declarations name themselves; a binding is not a use.
      const isOwnName = p && p.name === n && !ts.isPropertyAccessExpression(p);
      // Labels, imports and member names are not scope lookups either.
      const isOther = p && (ts.isBindingElement(p) || ts.isImportSpecifier(p)
        || ts.isExportSpecifier(p) || ts.isShorthandPropertyAssignment(p)
        || ts.isQualifiedName(p) || ts.isMetaProperty(p));
      if (!isAttrName && !isPropName && !isAccess && !isTagName && !isOwnName && !isOther) {
        const sym = checker.getSymbolAtLocation(n);
        const decls = sym ? (sym.getDeclarations() || []) : [];
        // No symbol at all, or a symbol whose only "declaration" is a JSX
        // attribute name. Both mean nothing actually declares this.
        const unresolved = !sym || (decls.length > 0 && decls.every(d => ts.isJsxAttribute(d)));
        if (unresolved) {
          const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
          found.push({
            file: sf.fileName.replace(SRC + "/", ""),
            line: line + 1,
            name: `${n.text} (nothing declares this)`,
          });
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

// Known and deliberate. Buffer is the Node fallback in badgeShare, guarded
// by a `typeof btoa === "function"` check and never reached in a browser,
// so it has no browser declaration and never will.
//
// Baselined by NAME AND FILE rather than name alone -- a stray Buffer in
// any other file is still a real finding.
const BASELINE = new Set(["domain/badgeShare.js:Buffer"]);
const reported = found.filter(f => !BASELINE.has(`${f.file}:${f.name.split(" ")[0]}`));
found.length = 0;
found.push(...reported);

for (const f of found) console.log(`  UNDEFINED  ${f.file}:${f.line}  ${f.name}`);
console.log(`\nfree variables: ${found.length} undefined identifier(s) across ${files.length} files`);
process.exit(found.length === 0 ? 0 : 1);
