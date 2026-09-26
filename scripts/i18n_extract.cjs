// Lists every piece of English text the app can show, for translation.
//
// Run: node scripts/i18n_extract.cjs [--json out.json]
//
// Parses src/ with the TypeScript compiler (it reads JSX natively) and
// collects:
//   * JSX text between tags
//   * string values of JSX attributes that are shown to people
//     (placeholder, title, aria-label, label, ...)
//   * string literals and template literals that read as prose
//     (help articles, badges, hints, alerts, messages)
//
// Each entry keeps where it came from, so a translator sees the context
// and a missing translation can be traced back to its source line.
// Template literals become patterns: `${n} teams` -> "{0} teams".
//
// Heuristic by nature: it would rather include an internal string (a
// harmless extra dictionary entry) than miss one a bowler sees.
const fs = require("fs");
const path = require("path");
let ts;
try { ts = require("typescript"); }
catch { ts = require("/opt/node-tools/node_modules/typescript"); }

const ROOT = path.resolve(__dirname, "..", "src");

// Attributes whose string value is never shown as text.
const SKIP_ATTRS = new Set([
  "className", "class", "style", "id", "key", "href", "src", "type", "name",
  "role", "htmlFor", "for", "rel", "target", "inputMode", "autoComplete",
  "autoCapitalize", "autoCorrect", "spellCheck", "method", "action", "lang",
  "dir", "d", "fill", "stroke", "viewBox", "points", "transform", "xmlns",
  "width", "height", "x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "r", "rx",
  "ry", "value", "defaultValue", "accept", "pattern", "encType", "mode",
  "variant", "kind", "size", "tab", "view", "track", "icon", "color",
  "strokeWidth", "strokeLinecap", "strokeLinejoin", "strokeDasharray",
  "textAnchor", "dominantBaseline", "fontSize", "fontWeight", "fontFamily",
  "gradientUnits", "offset", "stopColor", "stopOpacity", "opacity",
  "preserveAspectRatio", "clipPath", "mask", "filter", "marker", "markerEnd",
  "dataKey", "stackId", "orientation", "layout", "align", "verticalAlign",
  "interval", "domain", "scale", "tickFormatter", "hint-size", "list", "as",
  "component-from-global-scope", "loading", "decoding", "sizes", "srcSet",
  "download", "capture", "step", "min", "max", "maxLength", "minLength",
  "rows", "cols", "wrap", "tabIndex", "enterKeyHint", "focusTrack", "testid",
  "aria-hidden", "aria-live", "aria-current", "aria-expanded",
  "aria-controls", "aria-describedby", "aria-labelledby", "aria-pressed",
  "aria-selected", "aria-checked", "aria-haspopup", "aria-modal",
]);

// Calls whose string arguments are plumbing, not text.
const SKIP_CALLS = /^(console\.\w+|recordError|reportError|cloudRead|cloudReadDelta|cloudWrite|cloudInsert|cloudUpdate|cloudDelete|window\.storage\.\w+|storage\.\w+|localStorage\.\w+|window\.localStorage\.\w+|sessionStorage\.\w+|supabase\.\w+|\w+\.from|\w+\.rpc|\w+\.select|\w+\.eq|\w+\.neq|\w+\.in|\w+\.is|\w+\.order|\w+\.ilike|\w+\.like|\w+\.gte|\w+\.lte|\w+\.gt|\w+\.lt|\w+\.match|\w+\.upsert|\w+\.insert|\w+\.update|\w+\.delete|\w+\.invoke|\w+\.channel|\w+\.on|import|require|fetch|RegExp|new RegExp|\w+\.querySelector(All)?|\w+\.getElementById|\w+\.addEventListener|\w+\.removeEventListener|\w+\.setAttribute|\w+\.getAttribute|\w+\.removeAttribute|\w+\.setProperty|\w+\.getPropertyValue|\w+\.createElement|\w+\.getItem|\w+\.setItem|\w+\.removeItem|\w+\.split|\w+\.join|\w+\.replace|\w+\.replaceAll|\w+\.startsWith|\w+\.endsWith|\w+\.includes|\w+\.indexOf|\w+\.padStart|\w+\.padEnd|\w+\.toLocaleDateString|\w+\.toLocaleString|\w+\.toLocaleTimeString|Intl\.\w+|new Intl\.\w+|\w+\.format|\w+\.test|\w+\.exec|\w+\.getContext|\w+\.toDataURL|\w+\.toBlob|\w+\.postMessage|\w+\.dispatchEvent|new Event|new CustomEvent|new Error|Error|TypeError|\w+\.getPreferences|\w+\.set|\w+\.get|\w+\.has|\w+\.delete|\w+\.hasOwnProperty|Object\.(keys|hasOwn|getOwnPropertyNames|defineProperty)|JSON\.\w+|\w+\.log|\w+\.warn|\w+\.error|\w+\.debug|\w+\.info|expect|it|describe|test|vi\.\w+|\w+\.mock\w*)$/;

// Object keys whose string values are internal.
const SKIP_KEYS = new Set([
  "id", "key", "type", "kind", "view", "tab", "icon", "color", "bg", "surface",
  "card", "accent", "accentDim", "onAccent", "compare", "strike", "spare",
  "miss", "textMuted", "border", "fontFamily", "font", "fontWeight",
  "background", "backgroundColor", "backgroundImage", "boxShadow", "padding",
  "margin", "display", "position", "width", "height", "top", "left", "right",
  "bottom", "zIndex", "transform", "transition", "animation", "cursor",
  "borderRadius", "borderColor", "borderTop", "borderBottom", "borderLeft",
  "borderRight", "outline", "overflow", "whiteSpace", "textAlign",
  "textTransform", "letterSpacing", "lineHeight", "fontSize", "gap",
  "flexDirection", "alignItems", "justifyContent", "flex", "gridTemplateColumns",
  "table", "column", "columns", "select", "onConflict", "path", "url", "href",
  "src", "route", "env", "environment", "mode", "status", "plan", "source",
  "field", "prop", "event", "action", "method", "format", "unit_key", "slug",
  "code", "where", "sort", "order", "variant", "size", "track", "anchor",
  "target", "tier", "rank", "group", "category", "rackType", "provider",
  "billing_period", "lookup_key", "storageKey", "cacheKey", "stroke", "fill",
  "d", "viewBox", "minHeight", "maxWidth", "minWidth", "maxHeight",
  "boxSizing", "verticalAlign", "textDecoration", "WebkitTapHighlightColor",
  "opacity", "filter", "backdropFilter", "WebkitBackdropFilter", "userSelect",
  "pointerEvents", "gridColumn", "gridRow", "flexShrink", "flexGrow",
  "flexWrap", "alignSelf", "objectFit", "fontVariantNumeric", "fontStyle",
  "textOverflow", "wordBreak", "overflowWrap", "scrollbarWidth",
  "borderCollapse", "tableLayout", "listStyle", "content", "resize",
  "appearance", "WebkitAppearance", "accentColor", "caretColor", "inset",
  "borderStyle", "borderWidth", "outlineOffset", "textShadow", "mixBlendMode",
  "isolation", "contain", "willChange", "aspectRatio", "overflowX",
  "overflowY", "touchAction", "scrollSnapType", "scrollSnapAlign",
  "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "marginTop",
  "marginBottom", "marginLeft", "marginRight", "paddingInline",
  "paddingBlock", "marginInline", "marginBlock", "rowGap", "columnGap",
]);

function looksInternal(s) {
  const t = s.trim();
  if (!t) return true;
  if (!/[A-Za-z]/.test(t)) return true;
  if (/^[a-z0-9_\-.:/#?=&@]+$/.test(t)) return true;               // ids, keys, paths
  if (/^[A-Z0-9_]+$/.test(t) && t.length > 1 && /_/.test(t)) return true; // CONSTANTS
  if (/^https?:\/\//.test(t) || /^mailto:/.test(t)) return true;
  if (/^[a-z]+([A-Z][a-z0-9]*)+$/.test(t)) return true;            // camelCase
  if (/^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|linear-gradient|radial-gradient|var\(--|calc\(|env\()/.test(t)) return true;
  if (/^[\d.\s]+(px|em|rem|%|ms|s|vh|vw|fr|deg)?(\s+[\d.]+(px|em|rem|%|ms|s|vh|vw|fr|deg)?)*$/.test(t)) return true;
  if (/(^|\s)\d+(px|rem|em)\b/.test(t) && !/[a-z]{4,}\s+[a-z]{3,}/i.test(t.replace(/\d+(px|rem|em)/g, ""))) return true;
  // CSS values: every word a CSS keyword or a length ("1px solid", "center top").
  const CSSW = "(solid|dashed|dotted|none|auto|inherit|flex|grid|block|inline|inline-block|absolute|relative|fixed|sticky|hidden|visible|pointer|center|left|right|top|bottom|nowrap|bold|normal|italic|uppercase|lowercase|transparent|currentColor|space-between|flex-start|flex-end|column|row|wrap|contain|cover|ease|linear|ease-in-out|[-\\d.]+(px|em|rem|%|ms|s|vh|vw|fr|deg)?)";
  if (new RegExp(`^${CSSW}(\\s+${CSSW})*$`).test(t)) return true;
  if (/^[a-z_]+(,[a-z_()*.:!]+)+$/.test(t.replace(/\s/g, ""))) return true; // select lists
  if (/^\.?[a-z][\w-]*\s*[{>+~]/.test(t)) return true;               // css
  if (/^(select|insert|update|delete|create|alter|drop)\s/i.test(t) && /\b(from|into|table|set)\b/i.test(t)) return true;
  if (/^[\w-]+\/[\w.+-]+$/.test(t)) return true;                     // mime types
  if (/^\^|\$$|\\[dwsb]/.test(t)) return true;                       // regex sources
  if (/^(image|video|audio|text|application)\//.test(t)) return true;
  if (/^[\w.-]+\.(js|jsx|ts|css|json|png|jpg|svg|webp|html)$/.test(t)) return true;
  return false;
}

// Is a literal likely to be read by a person?
function proseScore(s) {
  const t = s.trim();
  if (looksInternal(t)) return 0;
  if (/\s/.test(t) && /[A-Za-z]{2,}/.test(t)) return 2;             // has words
  if (/^[A-Z][a-z]+[A-Za-z']*(-[A-Za-z]+)*$/.test(t)) return 1;       // Capitalised word ("Two-sided" too)
  if (/^[A-Z][a-z]+[.!?…]$/.test(t)) return 1;
  if (/^[A-Z]{2,5}$/.test(t)) return 0;                              // ABBR
  return 0;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00A0", mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", middot: "·", times: "×", deg: "°", rarr: "→", larr: "←", bull: "•", copy: "©" };
// JSX text and attribute strings arrive with their HTML entities undecoded;
// the browser shows the decoded character, so that is what gets matched.
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}
function norm(s) { return decode(s).replace(/\s+/g, " ").trim(); }

// React's JSX whitespace rule: lines are trimmed, blank lines dropped, and
// what is left is joined with single spaces -- except that whitespace on
// the SAME line as a neighbouring expression survives. This is the exact
// string React puts in the DOM, which is what the runtime sees.
function cleanJsxText(raw) {
  const lines = raw.split(/\r\n|\n|\r/);
  let last = -1;
  lines.forEach((l, i) => { if (/[^ \t]/.test(l)) last = i; });
  let out = "";
  lines.forEach((line, i) => {
    const first = i === 0, isLast = i === lines.length - 1;
    let t = line.replace(/\t/g, " ");
    if (!first) t = t.replace(/^ +/, "");
    if (!isLast) t = t.replace(/ +$/, "");
    if (t) { if (i !== 0 && out) t = " " + t; out += t; }
  });
  return out;
}

function templatePattern(node, sf) {
  let out = node.head.text;
  const exprs = [];
  node.templateSpans.forEach((span, i) => {
    out += `{${i}}` + span.literal.text;
    exprs.push(span.expression.getText(sf));
  });
  return { text: out, exprs };
}

function callName(call, sf) {
  const e = call.expression;
  let t = e.getText(sf);
  if (ts.isNewExpression(call)) t = "new " + t;
  return t.replace(/\s+/g, "");
}

function contextOf(node, sf) {
  // The nearest JSX element and a short excerpt of the source around it.
  let p = node.parent, tag = null, depth = 0;
  while (p && depth < 8) {
    if (ts.isJsxElement(p)) { tag = p.openingElement.tagName.getText(sf); break; }
    if (ts.isJsxSelfClosingElement(p)) { tag = p.tagName.getText(sf); break; }
    p = p.parent; depth++;
  }
  const start = Math.max(0, node.getStart(sf) - 140);
  const end = Math.min(sf.text.length, node.getEnd() + 140);
  const excerpt = sf.text.slice(start, end).replace(/\s+/g, " ");
  return { tag, excerpt };
}

const entries = new Map(); // text -> {text, kinds:Set, where:[], contexts:[]}
function add(text, kind, sf, node, extra = {}) {
  const t = norm(text);
  if (!t || !/[A-Za-z]/.test(t)) return;
  let e = entries.get(t);
  if (!e) { e = { text: t, kinds: new Set(), where: [], contexts: [] }; entries.set(t, e); }
  e.kinds.add(kind);
  const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const rel = path.relative(path.resolve(ROOT, ".."), sf.fileName);
  if (e.where.length < 6) e.where.push(`${rel}:${line}`);
  if (e.contexts.length < 2) e.contexts.push({ ...contextOf(node, sf), ...extra });
}

function inSkippedCall(node, sf) {
  let p = node.parent, depth = 0;
  while (p && depth < 4) {
    if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
      const name = callName(p, sf);
      if (SKIP_CALLS.test(name)) return true;
      return false;
    }
    if (ts.isJsxExpression(p) || ts.isBlock(p) || ts.isSourceFile(p)) return false;
    p = p.parent; depth++;
  }
  return false;
}

function propertyKey(node) {
  const p = node.parent;
  if (p && ts.isPropertyAssignment(p) && p.initializer === node) {
    return p.name.getText().replace(/^["']|["']$/g, "");
  }
  return null;
}

function isComparison(node) {
  const p = node.parent;
  if (p && ts.isBinaryExpression(p)) {
    const k = p.operatorToken.kind;
    return k === ts.SyntaxKind.EqualsEqualsEqualsToken || k === ts.SyntaxKind.ExclamationEqualsEqualsToken
      || k === ts.SyntaxKind.EqualsEqualsToken || k === ts.SyntaxKind.ExclamationEqualsToken;
  }
  if (p && ts.isCaseClause(p)) return true;
  return false;
}

function inImportOrType(node) {
  let p = node.parent;
  while (p) {
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isTypeNode?.(p)) return true;
    p = p.parent;
  }
  return false;
}

function visit(node, sf) {
  if (ts.isJsxElement(node)) {
    // Text and expressions mixed in one element render as several text
    // nodes under one parent. The runtime joins them back up, so record
    // the joined shape as a pattern: "{0} team{1} in this league".
    const kids = node.children;
    const onlyTextAndExpr = kids.length > 1 && kids.every(k => ts.isJsxText(k) || ts.isJsxExpression(k));
    const hasText = kids.some(k => ts.isJsxText(k) && /[A-Za-z]/.test(k.text));
    const hasExpr = kids.some(k => ts.isJsxExpression(k) && k.expression);
    if (onlyTextAndExpr && hasText && hasExpr) {
      let pat = "", exprs = [], i = 0;
      for (const k of kids) {
        if (ts.isJsxText(k)) pat += decode(cleanJsxText(k.text));
        else if (k.expression) { pat += `{${i++}}`; exprs.push(k.expression.getText(sf).slice(0, 80)); }
      }
      if (/[A-Za-z]{2,}/.test(pat.replace(/\{\d+\}/g, ""))) add(pat, "jsx-pattern", sf, node, { exprs });
    }
    // Text with inline elements ("Type <span>{email}</span> to confirm"):
    // the runtime translates the whole sentence with each child element as
    // a token, ⟨0⟩ ⟨1⟩..., so French can put its words around them. An
    // expression that may itself render an element makes the element count
    // unpredictable, so those sentences are left to the piece-by-piece path.
    const hasEl = kids.some(k => ts.isJsxElement(k) || ts.isJsxSelfClosingElement(k));
    if (hasEl && hasText) {
      let pat = "", exprs = [], i = 0, el = 0, ok = true;
      for (const k of kids) {
        if (ts.isJsxText(k)) pat += decode(cleanJsxText(k.text));
        else if (ts.isJsxElement(k) || ts.isJsxSelfClosingElement(k)) {
          const tag = (k.openingElement || k).tagName.getText(sf);
          if (!/^[a-z]/.test(tag)) { ok = false; break; } // a component: could render anything
          pat += `⟨${el++}⟩`;
        } else if (ts.isJsxFragment(k)) { ok = false; break; }
        else if (k.expression) {
          const e = k.expression;
          if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) pat += e.text;
          else if (/<[A-Za-z>]/.test(e.getText(sf))) { ok = false; break; }
          else { pat += `{${i++}}`; exprs.push(e.getText(sf).slice(0, 80)); }
        }
      }
      if (ok && /[A-Za-z]{2,}/.test(pat.replace(/\{\d+\}|⟨\d+⟩/g, ""))) add(pat, "jsx-mixed", sf, node, { exprs });
    }
  }
  if (ts.isJsxText(node)) {
    const t = norm(node.text);
    if (t && /[A-Za-z]/.test(t)) {
      // Fragment when the parent element also holds expressions.
      const parent = node.parent;
      const kids = parent && parent.children ? parent.children : [];
      const hasExpr = kids.some(k => ts.isJsxExpression(k) && k.expression);
      const hasEl = kids.some(k => ts.isJsxElement(k) || ts.isJsxSelfClosingElement(k));
      add(t, hasExpr || hasEl ? "jsx-fragment" : "jsx", sf, node, {
        siblings: hasExpr || hasEl ? kids.map(k => ts.isJsxText(k) ? norm(k.text) : (ts.isJsxExpression(k) ? `{${k.expression ? k.expression.getText(sf).slice(0, 40) : ""}}` : `<${(k.openingElement || k).tagName ? ((k.openingElement || k).tagName.getText(sf)) : "el"}>`)).filter(Boolean).join(" ") : undefined,
      });
    }
  } else if (ts.isJsxAttribute(node)) {
    const name = node.name.getText(sf);
    const init = node.initializer;
    if (init && ts.isStringLiteral(init) && !SKIP_ATTRS.has(name) && !name.startsWith("data-") && !name.startsWith("on")) {
      if (proseScore(init.text) > 0 || /^(aria-label|placeholder|title|alt|label)$/.test(name)) {
        if (/[A-Za-z]/.test(init.text) && !looksInternal(init.text)) add(init.text, `attr:${name}`, sf, init);
      }
    }
  } else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !ts.isJsxAttribute(node.parent)) {
    if (!inImportOrType(node) && !inSkippedCall(node, sf) && !ts.isPropertyAssignment(node.parent) || (ts.isPropertyAssignment(node.parent) && node.parent.initializer === node)) {
      if (!inImportOrType(node) && !inSkippedCall(node, sf) && !(ts.isElementAccessExpression(node.parent))) {
        const key = propertyKey(node);
        if (!(key && SKIP_KEYS.has(key))) {
          const score = proseScore(node.text);
          if (score >= 2 || (score === 1 && !isComparison(node))) add(node.text, key ? `prop:${key}` : "literal", sf, node);
        }
      }
    }
  } else if (ts.isTemplateExpression(node)) {
    if (!inSkippedCall(node, sf)) {
      const key = propertyKey(node);
      if (!(key && SKIP_KEYS.has(key))) {
        const { text, exprs } = templatePattern(node, sf);
        const staticPart = text.replace(/\{\d+\}/g, " ");
        if (/[A-Za-z]{2,}/.test(staticPart) && !looksInternal(staticPart) && /[A-Za-z]{2,}\s|\s[A-Za-z]{2,}/.test(" " + staticPart + " ")) {
          add(text, key ? `template:${key}` : "template", sf, node, { exprs });
        }
      }
    }
  }
  ts.forEachChild(node, n => visit(n, sf));
}

function files(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { if (f !== "i18n" && f !== "assets") out.push(...files(p)); }
    else if (/\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f) && !/test-setup/.test(f)) out.push(p);
  }
  return out;
}

for (const f of files(ROOT)) {
  const src = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith("x") ? ts.ScriptKind.JSX : ts.ScriptKind.JSX);
  visit(sf, sf);
}

const list = [...entries.values()].map(e => ({ ...e, kinds: [...e.kinds] }))
  .sort((a, b) => a.where[0].localeCompare(b.where[0], undefined, { numeric: true }));

// --missing: the English strings that have no entry (not even an empty
// one) in a catalog -- what to translate after adding text. Checks every
// catalog, or just one with --lang fr / es / ja.
if (process.argv.includes("--missing")) {
  const CATALOGS = { fr: ["fr-CA.js", "French"], es: ["es-419.js", "Spanish"], ja: ["ja-JP.js", "Japanese"] };
  const li = process.argv.indexOf("--lang");
  const only = li > 0 ? process.argv[li + 1] : null;
  const norm2 = t => t.replace(/\{(\d+):s\}/g, "{$1}").replace(/\s+/g, " ").trim();
  let total = 0;
  for (const [code, [file, name]] of Object.entries(CATALOGS)) {
    if (only && only !== code) continue;
    const src = fs.readFileSync(path.join(ROOT, "i18n", file), "utf8");
    const cat = JSON.parse(src.slice(src.indexOf("= {") + 2, src.lastIndexOf(";")));
    const known = new Set([...Object.keys(cat.exact || {}), ...(cat.patterns || []).map(p => p[0])].map(norm2));
    const missing = list.filter(e => !known.has(norm2(e.text)));
    for (const e of missing) console.log(`${JSON.stringify(e.text)}  [${e.kinds.join(",")}] ${e.where[0]}`);
    console.log(`${missing.length} of ${list.length} strings have no ${name} entry.`);
    total += missing.length;
  }
  process.exit(total ? 1 : 0);
}

const outIdx = process.argv.indexOf("--json");
if (outIdx > 0) fs.writeFileSync(process.argv[outIdx + 1], JSON.stringify(list, null, 1));
const byKind = {};
list.forEach(e => e.kinds.forEach(k => { const b = k.split(":")[0]; byKind[b] = (byKind[b] || 0) + 1; }));
console.log(`${list.length} unique strings`, byKind);
