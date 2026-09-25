import { describe, it, expect } from "vitest";
import { friendlyFunctionError, isBowlerFacing, readFunctionFailure, failureDetail, NETWORK_MESSAGE, SIGNED_OUT_MESSAGE } from "./functionErrors.js";

const FALLBACK = "Couldn't get your insights right now. Try again in a few minutes.";

describe("friendlyFunctionError: the messages that were reaching bowlers", () => {
  it("hides the importer's setup paragraph", () => {
    const f = { status: 500, body: { error: "No Gemini API key configured for this function. Set a secret named GEMINI_API_KEY (the same one analyze-performance uses) in Project Settings > Edge Functions > Secrets, then redeploy." }, message: "Edge Function returned a non-2xx status code" };
    expect(friendlyFunctionError(f, FALLBACK).text).toBe(FALLBACK);
  });
  it("hides supabase-js's generic non-2xx text when there is no body", () => {
    expect(friendlyFunctionError({ status: 500, body: null, message: "Edge Function returned a non-2xx status code" }, FALLBACK).text).toBe(FALLBACK);
  });
  it("hides 'not configured on the server'", () => {
    expect(friendlyFunctionError({ status: 500, body: { error: "Insights aren't configured on the server." } }, FALLBACK).text).toBe(FALLBACK);
  });
  it("hides model-named errors", () => {
    expect(friendlyFunctionError({ status: 502, body: { error: "Gemini's response wasn't valid JSON" } }, FALLBACK).text).toBe(FALLBACK);
  });
  it("hides messages carrying a status code", () => {
    expect(friendlyFunctionError({ status: 502, body: { error: "Couldn't pour the nightcap (500). Tap to try again." } }, FALLBACK).text).toBe(FALLBACK);
  });
});

describe("friendlyFunctionError: messages written for bowlers still get through", () => {
  it("rate limit, and says so", () => {
    const r = friendlyFunctionError({ status: 429, body: { error: "You've used this quite a lot in the last hour. Give it a little while and try again." } }, FALLBACK);
    expect(r.text).toMatch(/quite a lot/); expect(r.kind).toBe("limit");
  });
  it("paid plan, flagged as upgrade", () => {
    const r = friendlyFunctionError({ status: 402, body: { error: "Insights is part of the paid plan.", upgrade: true } }, FALLBACK);
    expect(r.text).toBe("Insights is part of the paid plan."); expect(r.kind).toBe("upgrade");
  });
  it("Brooklyn's in-voice limit", () => {
    expect(friendlyFunctionError({ status: 429, body: { error: "You've used all three questions today. Ask again tomorrow.", limited: true } }, "x").text).toMatch(/Ask again tomorrow/);
  });
  it("a bowler-facing 5xx is shown", () => {
    expect(friendlyFunctionError({ status: 504, body: { error: "The nightcap took too long. Tap to try again." } }, FALLBACK).text).toBe("The nightcap took too long. Tap to try again.");
  });
});

describe("friendlyFunctionError: no response at all", () => {
  it("network failure gets the connection message", () => {
    const r = friendlyFunctionError({ status: 0, body: null, message: "Failed to send a request to the Edge Function" }, FALLBACK);
    expect(r.text).toBe(NETWORK_MESSAGE); expect(r.kind).toBe("network");
  });
  it("an unknown status-less failure gets the fallback, not the raw text", () => {
    expect(friendlyFunctionError({ status: 0, body: null, message: "TypeError: x is not a function" }, FALLBACK).text).toBe(FALLBACK);
  });
  it("401 asks them to sign in again", () => {
    expect(friendlyFunctionError({ status: 401, body: { error: "Not authenticated" } }, FALLBACK).text).toBe(SIGNED_OUT_MESSAGE);
  });
  it("a developer-facing fallback is itself refused", () => {
    expect(friendlyFunctionError({ status: 500 }, "Edge Function failed").text).toMatch(/Something went wrong/);
  });
});

describe("isBowlerFacing", () => {
  it("rejects empty and very long text", () => {
    expect(isBowlerFacing("")).toBe(false);
    expect(isBowlerFacing("a".repeat(300))).toBe(false);
  });
  it("accepts ordinary sentences", () => { expect(isBowlerFacing("Ask me something.")).toBe(true); });
});

describe("readFunctionFailure", () => {
  it("reads status and JSON body off error.context", async () => {
    const err = { message: "Edge Function returned a non-2xx status code", context: { status: 429, json: async () => ({ error: "slow down", limited: true }) } };
    const f = await readFunctionFailure(err);
    expect(f.status).toBe(429); expect(f.body.limited).toBe(true);
  });
  it("survives a body that isn't JSON", async () => {
    const f = await readFunctionFailure({ message: "m", context: { status: 500, json: async () => { throw new Error("bad json"); } } });
    expect(f.status).toBe(500); expect(f.body).toBeNull();
  });
  it("status 0 when there was no response", async () => {
    expect((await readFunctionFailure({ message: "Failed to fetch" })).status).toBe(0);
  });
});

describe("failureDetail keeps the raw cause for Diagnostics", () => {
  it("includes the server's own error text", () => {
    const d = failureDetail({ status: 500, body: { error: "No Gemini API key configured", requestId: "r1" }, message: "non-2xx" });
    expect(d.error).toMatch(/Gemini/); expect(d.requestId).toBe("r1"); expect(d.status).toBe(500);
  });
});
