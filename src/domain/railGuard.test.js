// Which rail may change a bowler's entitlement (supabase/functions/_shared/railGuard.ts).
import { test, expect } from "vitest";
import { shouldApply } from "../../supabase/functions/_shared/railGuard.ts";
const future = new Date(Date.now()+20*864e5).toISOString(), past = new Date(Date.now()-864e5).toISOString();
const stripeActive = { plan:"plus", status:"active", current_period_end:future, source:"stripe", stripe_subscription_id:"sub_A" };
test("Play expiry for an old token does not lock out a Stripe subscriber", ()=>{
  expect(shouldApply(stripeActive, { plan:"free", status:"expired", source:"play", play_purchase_token:"tok" })).toBe(false);
});
test("a second Stripe subscription ending does not take Pro away", ()=>{
  expect(shouldApply(stripeActive, { plan:"free", status:"expired", source:"stripe", stripe_subscription_id:"sub_B" })).toBe(false);
});
test("the paying subscription itself can end access", ()=>{
  expect(shouldApply(stripeActive, { plan:"free", status:"expired", source:"stripe", stripe_subscription_id:"sub_A" })).toBe(true);
});
test("granting always applies", ()=>{
  expect(shouldApply(stripeActive, { plan:"plus", status:"active", current_period_end:future, source:"play", play_purchase_token:"t" })).toBe(true);
});
test("nothing to protect when the row is not entitled", ()=>{
  expect(shouldApply({ ...stripeActive, current_period_end: past }, { plan:"free", status:"expired", source:"play" })).toBe(true);
  expect(shouldApply(null, { plan:"free", status:"expired" })).toBe(true);
});

test("a winding-down second subscription cannot take the row over", ()=>{
  expect(shouldApply(stripeActive, { plan:"plus", status:"canceled", current_period_end:future, source:"stripe", stripe_subscription_id:"sub_B" })).toBe(false);
});
test("an actively renewing other subscription takes over", ()=>{
  expect(shouldApply(stripeActive, { plan:"plus", status:"active", current_period_end:future, source:"play", play_purchase_token:"t2" })).toBe(true);
});
