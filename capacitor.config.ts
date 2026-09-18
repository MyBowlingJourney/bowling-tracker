import type { CapacitorConfig } from '@capacitor/cli';

// ⚠️ appId CANNOT BE CHANGED AFTER THE FIRST PLAY STORE UPLOAD. ⚠️
//
// Android's applicationId is the permanent identity of the app. Changing
// it later is not a rename -- it is a different app: new listing, zero
// installs, zero reviews, and no upgrade path for anyone who installed
// the old one. Google will not merge them.
//
// So it should be a reverse-DNS name built on a domain you will still own
// in five years, which means THE DOMAIN DECISION COMES FIRST. If the LLC
// is going to be "Foo Bowling LLC" at foobowling.com, the id is
// com.foobowling.journey and that is settled forever.
//
// The value below is a placeholder chosen to be obviously wrong rather
// than plausibly right, so it cannot be shipped by accident:
const appId = 'CHANGE.ME.BEFORE.CAP.ADD.ANDROID';

// The custom scheme the magic link comes back through.
//
// Conventionally the appId, and it must match three places or sign-in
// fails silently on device:
//   1. here
//   2. Supabase → Authentication → URL Configuration → Redirect URLs,
//      as `<scheme>://auth`
//   3. the Android intent-filter, which `npx cap add android` generates
//      from this config
const config: CapacitorConfig = {
  appId,
  appName: 'My Bowling Journey',
  // Vite's output. `base: './'` in vite.config.js already makes the built
  // asset paths relative, which is what a WebView needs -- that part is
  // done.
  webDir: 'dist',
  server: {
    // Served from the app bundle, not from the network. The PWA on GitHub
    // Pages stays where it is; this is a separate, self-contained copy.
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: '#F7F8FA', // chalk's bg, so the splash matches the app
      showSpinner: false,
    },
  },
};

export default config;
