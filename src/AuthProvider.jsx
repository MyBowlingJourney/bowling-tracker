import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
// authRedirectTo is deliberately NOT imported any more -- see
// signInWithMagicLink. listenForAuthLinks stays: it costs nothing on the
// web, and if a link ever does reach the app it still completes.
import { listenForAuthLinks } from './nativeAuth.js';
import { APP_URL } from './constants.js';
import { cloudRead, cloudWrite, adoptLegacyQueueItems, flushPendingQueue } from './syncQueue.js';
import { setStorageUser, adoptLegacyData } from './scopedStorage.js';
import { normalizePreferences, defaultPreferences } from './domain/preferences.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [preferences, setPreferences] = useState(defaultPreferences());
  // Whether local storage is ready to be read as THIS user. Adoption
  // moves pre-scoping data into their namespace, and the tracker's load
  // effect reads that namespace on mount -- so mounting before adoption
  // finishes is a race the offline case loses: the load would find an
  // empty namespace, cache an empty result into it, and adoption would
  // then decline to overwrite what it found. A returning bowler with no
  // signal would open the app to a blank history.
  const [scopeReady, setScopeReady] = useState(false);
  // A sign-in that failed AFTER the email was sent -- an expired or reused
  // magic link arriving as a deep link. SignIn owns the errors it causes
  // itself; this one has no form submission behind it, so it needs
  // somewhere to live that outlasts the tap.
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check for an existing session on first load (e.g. returning visitor
    // whose session is still valid).
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Set before setSession, not after. setSession schedules a render,
      // and anything that render triggers -- a cached read, a queued
      // write -- must already know whose device this is. Doing it in an
      // effect that reacts to session would leave a window where the
      // answer is "nobody", and a read in that window falls back to the
      // unscoped key.
      setStorageUser(session?.user?.id || null);
      setSession(session);
      setLoading(false);
    });

    // Fires on sign-in, sign-out, token refresh, and — importantly — the
    // moment a magic-link redirect lands back on this page and the client
    // library finishes parsing the tokens out of the URL automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Sign-out lands here too, and clearing the active user is what
        // makes the previous bowler's cache unreadable rather than merely
        // unattributed.
        setStorageUser(session?.user?.id || null);
        setSession(session);
        setLoading(false);
      }
    );

    // Deep links, for the Android shell only.
    //
    // On the web this resolves to null and nothing is attached: the
    // browser already completes a magic link on its own. On a device it
    // listens for the app being opened by its own scheme and finishes
    // the sign-in by hand -- see nativeAuth.js.
    //
    // The listener is async, so the unsubscribe function may not exist
    // yet when this effect is cleaned up. `cancelled` covers the case
    // where cleanup wins the race, and the listener is removed as soon
    // as it does arrive rather than leaking.
    let cancelled = false;
    let removeLinkListener = null;
    listenForAuthLinks(msg => setAuthError(msg)).then(off => {
      if (cancelled) { off?.(); return; }
      removeLinkListener = off;
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      removeLinkListener?.();
    };
  }, []);

  // Loads this user's own display name whenever they sign in (or the app
  // starts with an existing session already active).
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) { setDisplayName(''); return; }
    cloudRead('profiles', q => q.select('display_name').eq('id', userId).single())
      .then(({ data, online }) => {
        if (online && data) setDisplayName(data.display_name || '');
      });
  }, [session?.user?.id]);

  // One-time claim of pre-scoping data, on the first sign-in after this
  // shipped. Cache and queue are adopted together and guarded by the same
  // device marker, so they cannot disagree about whether it has run --
  // half-adopted state (queue claimed, cache not) would be worse than
  // either outcome.
  //
  // The flush afterwards is deliberate: those adopted items have been
  // unflushable since the update landed, and now have an owner.
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    let cancelled = false;
    setScopeReady(false);
    (async () => {
      try {
        const { skipped } = await adoptLegacyData(userId);
        if (!skipped) {
          await adoptLegacyQueueItems(userId);
          await flushPendingQueue();
        }
      } catch {}
      // Ready even if adoption threw. A failed adoption means some legacy
      // data stays where it is; refusing to render at all over that would
      // turn a partial cache miss into a bricked app.
      if (!cancelled) setScopeReady(true);
    })();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  const PREFERENCES_KEY = 'bowling-preferences-v1';

  // Loads whatever's cached on this device immediately, before any network
  // round trip and regardless of sign-in state. This is what lets Settings
  // work the instant the app opens.
  useEffect(() => {
    (async () => {
      try {
        const cached = await window.storage.get(PREFERENCES_KEY);
        if (cached) setPreferences(normalizePreferences(JSON.parse(cached.value)));
      } catch {}
    })();
  }, []);

  // Same pattern for preferences -- stored as one JSONB blob per user
  // rather than a fixed set of columns, since the toggle set is expected
  // to keep growing (this is meant to absorb any future "opt in/out of X"
  // setting, not just the four accessory fields it starts with).
  //
  // No sign-out reset here (previously this called setPreferences on every
  // change including sign-out, wiping local Settings back to defaults).
  // Signing out should not erase choices made on this device.
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    cloudRead('user_preferences', q => q.select('preferences').eq('user_id', userId).single())
      .then(({ data, online }) => {
        if (online && data) {
          const normalized = normalizePreferences(data.preferences);
          setPreferences(normalized);
          try { window.storage.set(PREFERENCES_KEY, JSON.stringify(normalized)); } catch {}
        }
      });
  }, [session?.user?.id]);

  // Sends the sign-in email. ONE call, TWO ways in.
  //
  // The email template carries both {{ .Token }} and {{ .ConfirmationURL }},
  // so the same message contains a numeric code AND a link. Supabase
  // treats them as the same request -- the difference is only what the
  // email says -- so nothing here changes to support both.
  //
  // The code exists because the LINK is the fragile half on a phone. It
  // has to survive: the email client choosing to open it in its own
  // embedded browser (Gmail does), that browser deciding whether to hand
  // a custom scheme back to the OS, Android matching an intent filter,
  // and Capacitor delivering the appUrlOpen event. Any one of those
  // silently drops the link and the bowler sees nothing happen. Typing
  // the code into the app that is already open skips all of it.
  //
  // ── The link always points at the WEBSITE, never at the app ──────────
  //
  // This used to ask nativeAuth for a platform-specific redirect, so a
  // code requested from the Android app produced a link addressed to
  // com.mybowlingjourney.app://auth. That link is meaningless to any
  // browser: tapped on a desktop, or in an email client that would not
  // hand the scheme back to Android, it opened a blank tab and did
  // nothing. Observed in testing, and it looks exactly like a broken app.
  //
  // APP_URL always resolves and always signs the bowler in -- on the web,
  // which is a real outcome rather than a dead end. The app has the code,
  // which does not depend on any of the above going right.
  //
  // The deep-link machinery is left in place (the listener above, the
  // manifest intent filter): nothing sends links there now, but if one
  // ever arrives it still completes, and reverting is a one-line change.
  async function signInWithMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: APP_URL },
    });
    return { error };
  }

  // Finish a sign-in from the code in the email.
  //
  // Digits are stripped of anything else first. People paste "123 456"
  // out of an email, or copy a trailing space with it, and a rejected
  // code reads as "the app is broken" rather than "you included a
  // space". Cheap to forgive, expensive not to.
  //
  // On success nothing is set here on purpose: verifyOtp establishes the
  // session, and onAuthStateChange above is already listening for it --
  // the same route a link takes. Two places setting the session is how
  // they end up disagreeing.
  // No length check here, deliberately.
  //
  // This first shipped rejecting anything that was not six digits --
  // because six is the convention and the docs use six in their example.
  // Supabase actually sent EIGHT. The client then refused a perfectly
  // valid code, which is the worst kind of bug: the server was right, the
  // app was wrong, and the app was the one talking to the bowler.
  //
  // The lesson generalises. Code length is the auth server's business,
  // it is not documented as fixed, and it can change without this file
  // hearing about it. So the only thing checked here is that SOMETHING
  // numeric was entered; verifyOtp is the authority on whether it is
  // right, and its rejection is a real answer rather than a guess.
  async function verifyEmailCode(email, code) {
    const token = String(code || "").replace(/\D/g, "");
    if (!token) {
      return { error: new Error("Enter the code from your email.") };
    }
    const { error } = await supabase.auth.verifyOtp({
      email: String(email || "").trim(),
      token,
      type: "email",
    });
    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateDisplayName(newName) {
    const clean = newName.trim();
    if (!clean || !session?.user?.id) return { error: new Error('Not signed in or name is empty') };
    setDisplayName(clean); // optimistic, matches the rest of the app's pattern
    const result = await cloudWrite('profiles', { id: session.user.id, display_name: clean });
    if (!result.synced) {
      return { error: new Error(`Name change hasn't reached the cloud yet (${result.reason || 'unknown reason'}) — teammates won't be able to find you until it syncs.`) };
    }
    return { error: null };
  }

  // Accepts either a full preferences object or an updater function
  // (prevPrefs => newPrefs), matching React's own setState convention --
  // callers doing a targeted change (e.g. domain/preferences.js's
  // setTrackedField) can pass a function without needing the current
  // value from two places at once.
  //
  // Local-first, like every other piece of state in this app (shots,
  // sessions, bags, tournaments all write to window.storage immediately
  // and treat the cloud as best-effort). Previously this required a signed
  // -in session and returned an error with NO local update otherwise --
  // meaning every Settings toggle, including Environment, silently did
  // nothing for anyone not currently signed in.
  async function updatePreferences(next) {
    const resolved = typeof next === 'function' ? next(preferences) : next;
    const normalized = normalizePreferences(resolved);
    setPreferences(normalized); // always takes effect on this device
    try { window.storage.set(PREFERENCES_KEY, JSON.stringify(normalized)); } catch {}

    if (!session?.user?.id) {
      // Not an error -- the change is saved on this device. It just won't
      // follow the bowler to another device until they sign in.
      return { error: null };
    }
    // Keyed by user_id, not by the table's generated primary key.
    const result = await cloudWrite('user_preferences', { user_id: session.user.id, preferences: normalized }, { onConflict: 'user_id' });
    if (!result.synced) {
      return { error: new Error(`Saved on this device, but hasn't reached the cloud yet (${result.reason || 'unknown reason'}) — it may not carry over to another device yet.`) };
    }
    return { error: null };
  }

  const value = {
    session,
    scopeReady,
    user: session?.user ?? null,
    displayName,
    preferences,
    loading,
    authError,
    clearAuthError: () => setAuthError(""),
    signInWithMagicLink,
    verifyEmailCode,
    signOut,
    updateDisplayName,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
