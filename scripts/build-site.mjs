// The public website, assembled around the built app.
//
// mybowlingjourney.com is the welcome page; the app itself lives at
// /app/. Vite builds the app into dist/app (base "/app/"), and this
// copies the static pages that belong at the root next to it:
//
//   dist/index.html          <- public/welcome.html
//   dist/privacy.html, terms.html, delete-account.html
//   dist/icon-*.png, apple-touch-icon.png
//
// The same files also ship inside dist/app (Vite copies public/), which
// is harmless and keeps the app self-contained -- its own footer links
// resolve without leaving /app/.
//
// The Android bundle is built separately (npm run build:native, into
// dist-native with relative URLs), so none of this affects the phone.
import { mkdir, copyFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const out = join(root, "dist");

// welcome.html becomes the site's index; the rest keep their names.
const ROOT_PAGES = ["privacy.html", "terms.html", "delete-account.html"];

await mkdir(out, { recursive: true });
await copyFile(join(pub, "welcome.html"), join(out, "index.html"));
for (const f of ROOT_PAGES) await copyFile(join(pub, f), join(out, f));
// Icons, so the welcome page has a favicon and a share image of its own.
for (const f of await readdir(pub)) {
  if (/\.(png|svg|ico|webmanifest)$/.test(f)) await copyFile(join(pub, f), join(out, f));
}
console.log("site: dist/index.html (welcome) + app at dist/app/");
