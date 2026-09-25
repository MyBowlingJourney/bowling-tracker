// Supabase Edge Function: delete-account
//
// Deletes the CALLER'S OWN account and everything belonging to it.
//
// Google Play requires an in-app path to account deletion for any app
// that allows account creation. This is that path's server half; the
// client half is the confirmation flow in Settings.
//
// Deploy with: supabase functions deploy delete-account
// No secrets to add: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
// injected into every Edge Function by the platform.
//
// ── Why this deletes ONE row and not twenty-five ────────────────────────
//
// The obvious implementation enumerates every table and deletes from each
// in turn. That version is wrong the day someone adds a table and forgets
// to add it here -- and the failure is silent, leaves personal data
// behind, and makes the privacy policy a false statement.
//
// It is also unnecessary. Deleting the auth.users row cascades through
// the foreign key graph and reaches every table that holds personal data,
// verified against pg_constraint rather than assumed:
//
//   auth.users --CASCADE--> profiles --CASCADE--> sessions, shots,
//                                                 friendships, team_members
//   auth.users --CASCADE--> arsenals, bags, bowler_names, bowler_profiles,
//                           bowler_goals, coaching_*, drills, manual_scores,
//                           tournaments, user_preferences, error_reports,
//                           sync_tombstones, api_usage, ...
//   auth.users --SET NULL-> leagues, teams, bowling_centers, oil_patterns
//
// The SET NULL group is deliberate and predates this function: a league is
// readable by every authenticated bowler and a team by its whole roster,
// so deleting either because one member left would take it away from
// people still using it. They survive with no creator, which is what the
// privacy policy describes.
//
// Correctness therefore lives in the schema, where a new table gets a
// foreign key as a matter of course, rather than in a list here that
// someone has to remember to update.

import { createClient } from "jsr:@supabase/supabase-js@2";
// Cancelling whatever they are paying for, before the row that knows
// about it is deleted along with them.
import { fetchPurchase, cancelSubscription, configured as playConfigured } from "../_shared/playApi.ts";
import { cancelSubscriptionNow, cancelAllForCustomer, stripeConfigured } from "../_shared/stripeApi.ts";

// Allowed origins from the ALLOWED_ORIGINS secret.
//
// NO "*" FALLBACK HERE, unlike the other functions.
//
// They fall back to "*" when the secret is unset so an unconfigured
// deploy keeps working. That trade is fine for reading stats; it is not
// fine for the one endpoint that erases a bowler's account and cancels
// their subscription, and cannot be undone. An unset secret is a
// misconfiguration, and this refuses rather than serving every origin on
// the internet.
//
// The session token is still the thing that authorises the delete -- CORS
// was never the lock -- but a destructive endpoint should not also be
// advertising itself to any page that asks.
function allowedOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);
}

function corsFor(req: Request): Record<string, string> {
  const configured = allowedOrigins();
  const origin = req.headers.get("Origin") || "";
  const allow = configured.includes(origin) ? origin : (configured[0] || "");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, cors: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  const CORS = corsFor(req);

  // Unconfigured is a refusal, not a free-for-all. Loud in the log,
  // because nothing else about this failure says why.
  if (allowedOrigins().length === 0) {
    console.error("delete-account refused: ALLOWED_ORIGINS is not set");
    return new Response(
      JSON.stringify({ error: "Account deletion isn't configured on the server." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  // POST only. A deletion behind a GET is one crawler, one prefetch, or
  // one link preview away from firing on its own.
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, CORS, 405);
  }

  // ── Identity comes from the token, and ONLY from the token ────────────
  //
  // The request body is never read. There is no user id parameter to
  // pass, so there is nothing to tamper with: the only account this
  // function can delete is the one whose JWT was presented.
  //
  // getUser() VALIDATES the token against the auth server rather than
  // decoding it and trusting the contents, which is the difference
  // between authentication and reading a claim someone handed you.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Not authenticated." }, CORS, 401);
  }

  const asCaller = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authError } = await asCaller.auth.getUser();
  if (authError || !user) {
    return json({ error: "Not authenticated." }, CORS, 401);
  }

  // ── Only now, with identity established, take the service role ────────
  //
  // Created after the check rather than at module scope, so there is no
  // window in which an admin client exists without a verified caller
  // behind it. Deleting an auth user is the one operation the anon key
  // cannot do, and this is the only reason this function holds the key.
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    console.error("delete-account: SUPABASE_SERVICE_ROLE_KEY is not set");
    return json({
      error: "Account deletion isn't configured on the server. Email support@mybowlingjourney.com and we'll do it by hand.",
    }, CORS, 500);
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── Stop the money BEFORE deleting the account ───────────────────────
  //
  // entitlements.user_id references auth.users ON DELETE CASCADE, so the
  // row holding the purchase token and the Stripe subscription id
  // disappears the instant the user does. Cancel afterwards and there is
  // nothing left to cancel WITH -- the subscription goes on renewing
  // against a customer nobody can trace back to a person, and the first
  // anyone hears of it is a chargeback.
  //
  // No refund on either rail. They keep what they already paid for; they
  // simply are not charged again. Play's cancel and Stripe's delete both
  // do exactly that, and both are one word away from a method that
  // refunds -- see the comments on each.
  //
  // Failure here does NOT stop the deletion. The bowler asked to be
  // deleted and that is the promise that matters; a subscription left
  // running is a problem for us to fix by hand, and the ids are logged
  // loudly so it CAN be fixed by hand. Refusing to delete somebody
  // because Stripe was slow would be the worse trade.
  try {
    const { data: ent } = await admin
      .from("entitlements")
      .select("play_purchase_token,stripe_subscription_id,stripe_customer_id,status,plan")
      .eq("user_id", user.id)
      .maybeSingle();

    // Not gated on the status we have stored. A paused or on-hold Play
    // subscription resumes and charges; a Stripe subscription our row
    // does not point at still bills. Cancelling something already over
    // is harmless -- the provider just says so.
    if (ent?.stripe_customer_id && stripeConfigured()) {
      const r = await cancelAllForCustomer(String(ent.stripe_customer_id));
      console.log("delete-account: stripe subscriptions cancelled", r.cancelled, "failed", r.failed);
      if (r.failed) console.error("delete-account: FAILED to cancel", r.failed,
        "stripe subscription(s) for customer", ent.stripe_customer_id, "-- cancel by hand in the Stripe dashboard");
    }
    if (ent?.stripe_subscription_id && stripeConfigured()) {
      // Also by id, in case the customer lookup found nothing.
      await cancelSubscriptionNow(String(ent.stripe_subscription_id));
    }

    if (ent?.play_purchase_token && playConfigured()) {
      const token = String(ent.play_purchase_token);
      // The product id is not stored on the row, and the cancel endpoint
      // needs it, so the purchase is read back to find it.
      const purchase = await fetchPurchase(token);
      const productId = purchase?.lineItems?.find(li => li?.productId)?.productId || "";
      const done = await cancelSubscription(productId, token);
      if (done) console.log("delete-account: cancelled play subscription");
      else console.error("delete-account: FAILED to cancel play subscription for token ending",
        token.slice(-8), "-- cancel it by hand in the Play Console");
    }
  } catch (e) {
    console.error("delete-account: cancelling subscriptions threw (continuing with deletion)", String(e));
  }

  // user.id, never anything from the request. Worth stating twice.
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    // Logged with the id because a failed deletion is a promise not kept
    // -- the bowler asked, and something has to be able to find out why.
    console.error("delete-account failed", user.id, deleteError.message);
    return json({
      error: "Couldn't delete the account just then. Try again, or email support@mybowlingjourney.com.",
    }, CORS, 500);
  }

  // ── Sweep up groups nobody is left to use ─────────────────────────────
  //
  // leagues.created_by and teams.created_by are SET NULL rather than
  // CASCADE, so a league or team the bowler created SURVIVES their
  // deletion -- deliberately, because other bowlers may still be using it
  // and it must not vanish underneath them.
  //
  // But when nobody else was ever in it, that leaves a ghost: a team with
  // no members and no creator, which nothing can reach and nobody can
  // clean up. cleanup_orphaned_groups deletes exactly those, and only
  // those -- it requires that NOTHING references the row, because
  // deleting a team cascades to matches, lane_patterns, pending_invites
  // and team_members, and a careless condition would take another
  // bowler's match records with it.
  //
  // Runs AFTER the user is gone, on purpose. Before, their own sessions
  // and shots still reference the league and it looks occupied; after,
  // those have cascaded away and the question "is anyone else using this"
  // has an honest answer.
  //
  // Failure here is logged but NOT returned as an error. The account is
  // already deleted at this point, which is what the bowler asked for and
  // what the law cares about; a leftover empty league is untidy, not a
  // broken promise. Reporting failure would tell them their deletion did
  // not work when it did.
  try {
    const { data: swept, error: sweepError } = await admin.rpc("cleanup_orphaned_groups");
    if (sweepError) {
      console.error("delete-account: cleanup failed (account WAS deleted)", sweepError.message);
    } else if (swept?.[0]) {
      console.log("delete-account: swept", swept[0].deleted_teams, "teams,", swept[0].deleted_leagues, "leagues");
    }
  } catch (e) {
    console.error("delete-account: cleanup threw (account WAS deleted)", e?.message);
  }

  console.log("delete-account: deleted", user.id);
  return json({ deleted: true }, CORS);
});
