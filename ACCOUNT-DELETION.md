# Deleting an account

What to do when someone asks for their account and data to be removed, how
deletion actually works underneath, and how to test it without destroying
anything real.

Google Play requires **both** an in-app route and a web page where someone
can request deletion without reinstalling the app. Both exist. This
document is for the third case: a request that arrives by email.

---

## When a request arrives by email

### 1. Point them at self-service first

Most requests end here, and it is faster for them than waiting on you:

> You can do this yourself right now: open My Bowling Journey, go to
> **Settings → Danger Zone → Delete My Account**, and type your email
> address to confirm. It happens immediately. If you have already
> uninstalled the app or cannot get in, reply and I will do it from here.

### 2. If they cannot, verify before acting

Check the request came **from the account's own email address**, then
**reply and ask them to confirm**.

That round trip is the point. The risk here is not leaking data — it is
someone maliciously deleting another person's account. A spoofed sender
can send you a request but usually cannot receive your reply.

### 3. Delete the user

Supabase dashboard → **Authentication** → **Users** → search the email →
delete the user.

That is genuinely all. Deleting the `auth.users` row cascades to
everything else; see *How deletion works* below for why you do not need to
touch any other table.

### 4. Sweep empty leagues and teams

In the SQL editor:

```sql
SELECT * FROM public.cleanup_orphaned_groups();
```

Returns how many teams and leagues were removed.

The Edge Function calls this automatically for in-app deletions. A
dashboard deletion does not, so run it by hand.

### 5. Confirm, and record it

Reply to say it is done. Note the date and the email address somewhere
durable.

The privacy policy commits to **30 days**. A record is what lets you show
the commitment was met.

---

## How deletion works

**One row is deleted. The database does the rest.**

`auth.users` is the root of a foreign-key graph that reaches every table
holding personal data. Removing a user cascades outward:

```
auth.users ──CASCADE──> profiles ──CASCADE──> sessions, shots,
                                              friendships, team_members

auth.users ──CASCADE──> arsenals, bags, ball_bags, ball_groups,
                        ball_submissions, ball_confirmations,
                        bowler_names, bowler_profiles, bowler_goals,
                        closed_seasons, coaching_notes, coaching_tasks,
                        coaching_relationships, drills, error_reports,
                        hidden_leagues, imported_scores, manual_scores,
                        sync_tombstones, tournaments, user_preferences,
                        api_usage

auth.users ──SET NULL─> leagues, teams, bowling_centers, oil_patterns
```

### Why some things are SET NULL

A league is readable by **every authenticated bowler**; a team is readable
by its whole roster. Deleting either because one member left would take it
away from people still using it. They survive with no creator, which is
what the privacy policy describes.

`cleanup_orphaned_groups()` then removes the ones **nobody else is in** —
so a league or team the departing bowler created alone does not linger as
a ghost. Its condition is deliberately strict: it deletes only rows that
**nothing at all** references, because deleting a team cascades to
`matches`, `lane_patterns`, `pending_invites` and `team_members`, and a
careless condition would take another bowler's match records with it.

### Why the Edge Function does not enumerate tables

`supabase/functions/delete-account/index.ts` deletes one row. It would be
easy to write it as a list of twenty-five deletes instead — and that
version is wrong the first time someone adds a table and forgets to add it
to the list. The failure is silent, leaves personal data behind, and makes
the privacy policy a false statement.

Correctness lives in the schema, where a new table gets a foreign key as a
matter of course.

**So: when you add a table that holds personal data, give it a foreign key
to `auth.users` (directly or via `profiles`) with `ON DELETE CASCADE`.**
That is the whole maintenance burden, and it is the same thing you would
do anyway.

---

## What not to do

- **Do not delete rows table by table.** That is how data gets missed. If
  you find yourself doing it, something is wrong with the cascades and
  that is the thing to fix.
- **Do not delete from `profiles` instead of `auth.users`.** It cascades
  to sessions and shots, but leaves the login and everything hanging off
  `auth.users` directly.
- **Do not test on a real account.** There is no undo.

---

## Testing it

Use a throwaway address you can receive mail at.

1. Sign out. Sign in with the throwaway address.
2. Log a couple of shots, and create a league and a team, so there is
   something to destroy and something to sweep.
3. Note the user id: Supabase → Authentication → Users.
4. Delete via **Settings → Danger Zone → Delete My Account**.
5. Verify nothing survives:

```sql
-- replace with the id you noted
SELECT 'sessions' AS t, count(*) FROM public.sessions WHERE user_id = 'USER-ID-HERE'
UNION ALL SELECT 'shots',        count(*) FROM public.shots        WHERE user_id = 'USER-ID-HERE'
UNION ALL SELECT 'bowler_names', count(*) FROM public.bowler_names WHERE created_by = 'USER-ID-HERE'
UNION ALL SELECT 'arsenals',     count(*) FROM public.arsenals     WHERE created_by = 'USER-ID-HERE'
UNION ALL SELECT 'auth.users',   count(*) FROM auth.users          WHERE id = 'USER-ID-HERE';
```

Every count should be `0`.

6. Confirm the empty league and team are gone, and that any league with
   another bowler in it survived.

---

## Where the pieces live

| Piece | Where |
|---|---|
| In-app flow | `src/Settings.jsx` — Danger Zone → Delete My Account |
| Client call | `src/AuthProvider.jsx` — `deleteAccount()` |
| Server | `supabase/functions/delete-account/index.ts` |
| Orphan sweep | `public.cleanup_orphaned_groups()` in the database |
| Public page | `public/delete-account.html` |
| Privacy policy | `public/privacy.html` |

**Four places describe this behaviour to users**: the Settings
confirmation text, the privacy policy, the deletion page, and the Data
Safety form in Play Console. If the behaviour changes, all four need
chasing down — they have drifted apart before.

---

## Why the account deletion route is always visible

The Danger Zone card used to be hidden behind `hasData`, so a bowler with
nothing logged could not reach it. The bowler most likely to want their
account gone is precisely the one who signed up, looked around, and
decided against it.

Clear All Data still hides when there is nothing to clear. Account
deletion does not.
