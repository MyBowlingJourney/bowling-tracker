// Shows the app in another language by translating what React renders.
//
// Why here and not at each string: the app's text lives inline in about a
// hundred files. Wrapping every string in t() would mean touching thousands
// of lines, and every one missed would stay English. Translating the
// rendered page instead covers every screen, including text built by
// domain code, with one choke point -- the same reasoning scopedStorage
// uses for storage keys.
//
// How it stays correct while React keeps updating the page:
//
//   * Every text node we change remembers its ORIGINAL English. When React
//     later writes a new value into that node, the value no longer equals
//     what we wrote, so we know it is fresh English and translate it again.
//   * An element whose children are all text (React splits
//     "{n} teams in this league" into three text nodes) is translated as
//     one sentence: the English pieces are joined, translated, and the
//     result goes in the first node with the rest emptied. Each piece still
//     remembers its own English, so React updating just the number works.
//   * placeholder / title / aria-label / alt are handled the same way.
//   * translate="no" (the standard HTML attribute) keeps a subtree as-is --
//     for names bowlers typed, which must never be "translated".
//
// Input and textarea VALUES are never touched: they are the bowler's data.


const ATTRS = ["placeholder", "title", "aria-label", "alt"];
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "svg:style"]);

export function installDomTranslation(tr, root = document.documentElement) {
  const textState = new WeakMap();  // Text -> { orig, applied }
  const attrState = new WeakMap();  // Element -> { [attr]: { orig, applied } }
  let pending = new Set();
  let scheduled = false;

  function skipped(el) {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP_TAGS.has(e.tagName)) return true;
      // The nearest translate attribute decides, as in HTML: "yes" inside
      // a "no" subtree translates again.
      const t = e.getAttribute && e.getAttribute("translate");
      if (t === "no") return true;
      if (t === "yes") return false;
      if (e.isContentEditable) return true;
    }
    return false;
  }

  // The English currently meant by this node: what React last wrote.
  function englishOf(node) {
    const rec = textState.get(node);
    const cur = node.nodeValue;
    if (rec && cur === rec.applied) return rec.orig;
    return cur;
  }

  function set(node, orig, applied) {
    textState.set(node, { orig, applied });
    if (node.nodeValue !== applied) node.nodeValue = applied;
  }

  function translateNode(node) {
    const orig = englishOf(node);
    const el = node.parentElement;
    if (el && el.closest && el.closest("[data-i18n]")) {
      const hit = lookupIn(el, orig);
      if (hit !== null) {
        const lead = /^\s*/.exec(orig)[0], trail = /\s*$/.exec(orig)[0];
        set(node, orig, lead + tr.numbers(hit) + (orig.trim() ? trail : ""));
        return;
      }
    }
    let out = tr.translate(orig);
    // "%" in its own element after the number ("<b>42</b><span>%</span>"):
    // French puts a non-breaking space between them (the others do not).
    if (tr.lang === "fr" && /^%/.test(out) && /\d$/.test(textBefore(node))) out = "\u00A0" + out;
    set(node, orig, out);
  }

  function textBefore(node) {
    for (let n = node; n; n = n.parentElement) {
      const prev = n.previousSibling;
      if (prev) return (prev.textContent || "").replace(/\s+$/, "");
      if (n.parentElement && n.parentElement.childNodes.length > 1) return "";
    }
    return "";
  }

  // A context name on an element (data-i18n="theme") picks the entry
  // "theme::Light" over plain "Light", for the rare English word that
  // needs two different French words on two screens.
  function lookupIn(el, text) {
    const ctx = el.closest && el.closest("[data-i18n]");
    if (ctx) {
      const hit = tr.context(ctx.getAttribute("data-i18n"), text);
      if (hit !== null) return hit;
    }
    return tr.lookup(text);
  }

  // Text with inline elements -- "Type <span>you@x.com</span> to confirm" --
  // is looked up as one sentence with each child element as a token:
  // "Type ⟨0⟩ to confirm" -> "Tapez ⟨0⟩ pour confirmer". The French words
  // go into the existing text nodes around the elements; the elements
  // themselves are never moved (React owns them), so the French must keep
  // them in the same order. Anything that does not fit falls back to
  // translating each piece on its own.
  function translateMixed(el, kids) {
    const els = kids.filter(c => c.nodeType === 1);
    if (!els.length || els.length > 8) return false;
    const texts = kids.filter(c => c.nodeType === 3);
    if (!texts.some(n => /[A-Za-z]/.test(englishOf(n)))) return false;
    // slots[i] = the text nodes before element i; slots[k] = after the last
    const slots = [[]];
    let key = "";
    for (const c of kids) {
      if (c.nodeType === 3) { slots[slots.length - 1].push(c); key += englishOf(c); }
      else if (c.nodeType === 1) { key += `⟨${slots.length - 1}⟩`; slots.push([]); }
    }
    const hit = lookupIn(el, key);
    if (hit === null) return false;
    const parts = hit.split(/⟨(\d+)⟩/);
    const order = parts.filter((_, i) => i % 2 === 1).map(Number);
    if (order.length !== els.length || order.some((n, i) => n !== i)) return false;
    const segs = parts.filter((_, i) => i % 2 === 0);
    // A slot with no text node cannot take words without adding a node.
    if (segs.some((s, i) => !slots[i].length && s.trim())) return false;
    const origs = new Map(texts.map(n => [n, englishOf(n)]));
    segs.forEach((s, i) => {
      const nodes = slots[i];
      if (!nodes.length) return;
      // keep the outer whitespace of the whole sentence as React wrote it
      let seg = s;
      if (i === 0) seg = /^\s*/.exec(origs.get(nodes[0]))[0] + seg.replace(/^\s+/, "");
      if (i === segs.length - 1) {
        const last = origs.get(nodes[nodes.length - 1]);
        seg = seg.replace(/\s+$/, "") + /\s*$/.exec(last)[0];
      }
      nodes.forEach((n, j) => set(n, origs.get(n), j === 0 ? tr.numbers(seg) : ""));
    });
    return true;
  }

  function translateElementText(el) {
    if (!el || skipped(el)) return;
    const nodes = [];
    const kids = [];
    let onlyText = true;
    for (const c of el.childNodes) {
      if (c.nodeType === 3) { nodes.push(c); kids.push(c); }
      else if (c.nodeType === 1) { onlyText = false; kids.push(c); }
    }
    if (!nodes.length) return;
    if (onlyText && nodes.length > 1) {
      const origs = nodes.map(englishOf);
      const whole = lookupIn(el, origs.join(""));
      if (whole !== null) {
        const joined = origs.join("");
        const lead = /^\s*/.exec(joined)[0], trail = /\s*$/.exec(joined)[0];
        const text = lead + tr.numbers(whole) + trail;
        nodes.forEach((n, i) => set(n, origs[i], i === 0 ? text : ""));
        return;
      }
      // No entry for the whole: each piece on its own, but the numbers
      // formatted across the joins -- "$" and "26.25" are two pieces in
      // JSX ("${amount}") and "26,25 $" needs both.
      const pieces = origs.map(o => {
        const h = lookupIn(el, o);
        if (h === null) return o;
        const lead = /^\s*/.exec(o)[0], trail = /\s*$/.exec(o)[0];
        return lead + h + (o.trim() ? trail : "");
      });
      const text = tr.numbers(pieces.join(""));
      nodes.forEach((n, i) => set(n, origs[i], i === 0 ? text : ""));
      return;
    }
    if (!onlyText && translateMixed(el, kids)) return;
    nodes.forEach(translateNode);
  }

  function translateAttrs(el) {
    // A textarea's text is the bowler's, but its placeholder is ours.
    const own = el.tagName === "TEXTAREA" ? el.parentElement : el;
    if (!el.getAttribute || (own && skipped(own))) return;
    let rec = attrState.get(el);
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      const prev = rec && rec[a];
      const orig = prev && cur === prev.applied ? prev.orig : cur;
      // "placeholder::Score" can give a narrow field a shorter word.
      const own = tr.context(a, String(orig));
      const applied = own !== null ? tr.numbers(own) : tr.translate(orig);
      if (!rec) { rec = {}; attrState.set(el, rec); }
      rec[a] = { orig, applied };
      if (applied !== cur) el.setAttribute(a, applied);
    }
  }

  function walk(start) {
    if (start.nodeType === 3) { translateElementText(start.parentElement); return; }
    if (start.nodeType !== 1) return;
    // No early exit for a translate="no" start: a translate="yes" inside it
    // still translates. Each element is checked on its own below.
    const els = [start, ...start.querySelectorAll("*")];
    for (const el of els) {
      translateAttrs(el); // a textarea's placeholder too
      if (SKIP_TAGS.has(el.tagName)) continue;
      translateElementText(el);
    }
  }

  function flush() {
    scheduled = false;
    const batch = pending;
    pending = new Set();
    for (const n of batch) {
      if (!n.isConnected) continue;
      walk(n);
    }
  }

  function queue(n) {
    if (!n) return;
    pending.add(n);
    if (!scheduled) { scheduled = true; queueMicrotask(flush); }
  }

  const observer = new MutationObserver(records => {
    for (const r of records) {
      if (r.type === "characterData") {
        const rec = textState.get(r.target);
        if (rec && r.target.nodeValue === rec.applied) continue; // our own write
        queue(r.target.parentElement);
      } else if (r.type === "childList") {
        r.addedNodes.forEach(n => queue(n.nodeType === 3 ? n.parentElement : n));
        if (r.removedNodes.length && r.target.nodeType === 1) queue(r.target);
      } else if (r.type === "attributes") {
        const rec = attrState.get(r.target);
        const cur = r.target.getAttribute(r.attributeName);
        if (rec && rec[r.attributeName] && cur === rec[r.attributeName].applied) continue;
        queue(r.target);
      }
    }
  });

  walk(root);
  observer.observe(root, {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ATTRS,
  });

  // Alerts and confirmations are text too, and never reach the DOM.
  const w = root.ownerDocument.defaultView;
  const { alert, confirm, prompt } = w;
  w.alert = (m) => alert.call(w, tr.translateMessage(String(m ?? "")));
  w.confirm = (m) => confirm.call(w, tr.translateMessage(String(m ?? "")));
  w.prompt = (m, d) => prompt.call(w, tr.translateMessage(String(m ?? "")), d);

  return {
    // Re-translate the whole page (after the protected names change).
    refresh() { walk(root); },
    stop() {
      observer.disconnect();
      w.alert = alert; w.confirm = confirm; w.prompt = prompt;
    },
  };
}
