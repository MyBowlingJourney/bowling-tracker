// The public website, assembled around the built app.
//
// mybowlingjourney.com is the welcome page; the app itself lives at
// /app/. Vite builds the app into dist/app (base "/app/"), and this
// copies the static pages that belong at the root next to it:
//
//   dist/index.html          <- public/welcome.html
//   dist/fr/index.html       <- public/welcome-fr.html (French welcome)
//   dist/es/index.html       <- public/welcome-es.html (Spanish welcome)
//   dist/ja/index.html       <- public/welcome-ja.html (Japanese welcome)
//   dist/ko/index.html       <- public/welcome-ko.html (Korean welcome)
//   dist/tokushoho.html      <- the seller disclosure Japanese law requires
//   dist/privacy.html, terms.html, delete-account.html, and their -fr.html
//   French, -es.html Spanish, -ja.html Japanese and -ko.html Korean
//   versions, and privacy-ms.html (Malay)
//   dist/icon-*.png, apple-touch-icon.png
//
// The same files also ship inside dist/app (Vite copies public/), which
// is harmless and keeps the app self-contained -- its own footer links
// resolve without leaving /app/.
//
// The Android bundle is built separately (npm run build:native, into
// dist-native with relative URLs), so none of this affects the phone.
import { mkdir, copyFile, readdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const out = join(root, "dist");

// welcome.html becomes the site's index; the rest keep their names.
const ROOT_PAGES = [
  "privacy.html", "terms.html", "delete-account.html",
  "privacy-fr.html", "terms-fr.html", "delete-account-fr.html",
  "privacy-es.html", "terms-es.html", "delete-account-es.html",
  "privacy-ja.html", "terms-ja.html", "delete-account-ja.html", "tokushoho.html",
  "privacy-ko.html", "terms-ko.html", "delete-account-ko.html",
  "privacy-ms.html",
];

await mkdir(out, { recursive: true });
await copyFile(join(pub, "welcome.html"), join(out, "index.html"));
// The French welcome page at /fr/. Its links are root-relative, so it
// works from there.
await mkdir(join(out, "fr"), { recursive: true });
await copyFile(join(pub, "welcome-fr.html"), join(out, "fr", "index.html"));
// The Spanish welcome page at /es/, the same way.
await mkdir(join(out, "es"), { recursive: true });
await copyFile(join(pub, "welcome-es.html"), join(out, "es", "index.html"));
// And the Japanese one at /ja/.
await mkdir(join(out, "ja"), { recursive: true });
await copyFile(join(pub, "welcome-ja.html"), join(out, "ja", "index.html"));
// And the Korean one at /ko/.
await mkdir(join(out, "ko"), { recursive: true });
await copyFile(join(pub, "welcome-ko.html"), join(out, "ko", "index.html"));
for (const f of ROOT_PAGES) await copyFile(join(pub, f), join(out, f));
// Icons, so the welcome page has a favicon and a share image of its own.
for (const f of await readdir(pub)) {
  if (/\.(png|svg|ico|webmanifest)$/.test(f)) await copyFile(join(pub, f), join(out, f));
}
// Android App Links: assetlinks.json has to sit at the DOMAIN ROOT, on
// https, as application/json. Android fetches it at install time and
// only delivers mybowlingjourney.com/app/... links to the app when the
// fingerprint in it matches the installed app's signing certificate.
//
// A missing or wrong file is not an error anyone sees: verification just
// fails and links open in the browser, which is why this is copied by
// the build rather than left to be remembered.
await mkdir(join(out, ".well-known"), { recursive: true });
await copyFile(join(pub, ".well-known", "assetlinks.json"), join(out, ".well-known", "assetlinks.json"));

// GitHub Pages hides dot-directories unless Jekyll is switched off, and
// .well-known is a dot-directory. Without this, the file above 404s and
// every App Link silently falls back to the browser.
await writeFile(join(out, ".nojekyll"), "");

console.log("site: dist/index.html (welcome) + app at dist/app/ + .well-known/assetlinks.json");
