// TestHub — paid PDF notes: Razorpay order, payment verification, time-limited download.
// Secrets (Supabase dashboard → Edge Functions → Secrets):
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET            (required to sell)
//   RAZORPAY_WEBHOOK_SECRET                          (optional, for the razorpay-webhook function)
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided by the platform.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const PRODUCTS: Record<string, { amount: number; file: string; downloadName: string; title: string }> = {
  "ag3-en": {
    amount: 19900, // paise
    file: "TESTHUB_AG3_2026_ENGLISH_COMPLETE_NOTES.pdf",
    downloadName: "TestHub-MP-High-Court-AG3-2026-English-Notes.pdf",
    title: "MP High Court AG-3 2026 — English Notes (PDF)",
  },
  "ag3-hi": {
    amount: 19900,
    file: "TESTHUB_AG3_2026_HINDI_COMPLETE_NOTES.pdf",
    downloadName: "TestHub-MP-High-Court-AG3-2026-Hindi-Notes.pdf",
    title: "MP हाई कोर्ट सहायक ग्रेड-3 2026 — हिंदी नोट्स (PDF)",
  },
};
const MAX_DOWNLOADS = 10;
const LINK_SECONDS = 600;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function newToken() {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  // tolerate pasted whitespace / quotes / "NAME=value" in the dashboard
  const clean = (v: string | undefined, name: string) => (v ?? "").trim().replace(new RegExp("^" + name + "\\s*=\\s*"), "").replace(/^["']|["']$/g, "").trim();
  const keyId = clean(Deno.env.get("RAZORPAY_KEY_ID"), "RAZORPAY_KEY_ID");
  const keySecret = clean(Deno.env.get("RAZORPAY_KEY_SECRET"), "RAZORPAY_KEY_SECRET");
  const ready = !!keyId && !!keySecret;

  switch (body.action) {
    case "diag": {
      // non-secret health check for setup
      return json({ idFormatOk: /^rzp_(test|live)_[A-Za-z0-9]+$/.test(keyId), mode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown", idLen: keyId.length, secretLen: keySecret.length });
    }
    case "status": {
      const p = PRODUCTS[body.product ?? ""];
      if (!p) return json({ ready: false });
      const slash = p.file.lastIndexOf("/");
      const { data } = await db.storage.from("notes").list(slash > 0 ? p.file.slice(0, slash) : "", { search: p.file.slice(slash + 1) });
      return json({ ready: ready && !!data?.length, amount: p.amount });
    }

    case "create": {
      const p = PRODUCTS[body.product ?? ""];
      if (!p) return json({ error: "unknown_product" }, 400);
      if (!ready) return json({ error: "payments_not_configured" }, 503);
      const r = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(`${keyId}:${keySecret}`) },
        body: JSON.stringify({ amount: p.amount, currency: "INR", receipt: `${body.product}-${Date.now()}`, notes: { product: body.product } }),
      });
      const o = await r.json();
      if (!r.ok) return json({ error: "razorpay_order_failed", detail: o?.error?.description }, 502);
      const { error } = await db.from("orders").insert({ product: body.product, amount: p.amount, rzp_order_id: o.id });
      if (error) return json({ error: "db" }, 500);
      return json({ order_id: o.id, key_id: keyId, amount: p.amount, currency: "INR", name: "TestHub", description: p.title });
    }

    case "verify": {
      const { order_id, payment_id, signature } = body;
      if (!order_id || !payment_id || !signature || !ready) return json({ error: "bad_request" }, 400);
      const expected = await hmacHex(keySecret, `${order_id}|${payment_id}`);
      if (!safeEqual(expected, signature)) return json({ error: "signature_mismatch" }, 400);
      const { data: ord } = await db.from("orders").select("*").eq("rzp_order_id", order_id).maybeSingle();
      if (!ord) return json({ error: "unknown_order" }, 404);
      if (ord.download_token) return json({ token: ord.download_token });
      // fetch payment for buyer contact (best effort)
      let email: string | null = null, phone: string | null = null;
      try {
        const pr = await fetch(`https://api.razorpay.com/v1/payments/${payment_id}`, { headers: { Authorization: "Basic " + btoa(`${keyId}:${keySecret}`) } });
        if (pr.ok) { const pj = await pr.json(); email = pj.email ?? null; phone = pj.contact ?? null; }
      } catch { /* ignore */ }
      const token = newToken();
      await db.from("orders").update({ status: "paid", rzp_payment_id: payment_id, download_token: token, paid_at: new Date().toISOString(), email, phone })
        .eq("rzp_order_id", order_id);
      return json({ token });
    }

    case "recover": {
      // buyer lost the page: payment id + email or phone used at checkout
      const pid = (body.payment_id ?? "").trim();
      const who = (body.contact ?? "").trim().toLowerCase();
      if (!pid.startsWith("pay_") || who.length < 5) return json({ error: "bad_request" }, 400);
      const { data: ord } = await db.from("orders").select("*").eq("rzp_payment_id", pid).eq("status", "paid").maybeSingle();
      const digits = (s: string | null) => (s ?? "").replace(/\D/g, "").slice(-10);
      if (!ord || !(ord.email?.toLowerCase() === who || (digits(ord.phone) && digits(ord.phone) === digits(who)))) return json({ error: "not_found" }, 404);
      return json({ token: ord.download_token });
    }

    case "download": {
      const token = body.token ?? "";
      if (token.length < 20) return json({ error: "bad_token" }, 400);
      const { data: ord } = await db.from("orders").select("*").eq("download_token", token).eq("status", "paid").maybeSingle();
      if (!ord) return json({ error: "not_found" }, 404);
      const p = PRODUCTS[ord.product];
      if (body.peek) return json({ title: p.title, downloads: ord.downloads, max: MAX_DOWNLOADS, payment_id: ord.rzp_payment_id });
      if (ord.downloads >= MAX_DOWNLOADS) return json({ error: "limit", max: MAX_DOWNLOADS }, 429);
      const { data, error } = await db.storage.from("notes").createSignedUrl(p.file, LINK_SECONDS, { download: p.downloadName });
      if (error || !data) return json({ error: "storage" }, 500);
      await db.from("orders").update({ downloads: ord.downloads + 1 }).eq("id", ord.id);
      return json({ url: data.signedUrl, title: p.title, downloads: ord.downloads + 1, max: MAX_DOWNLOADS });
    }
  }
  return json({ error: "unknown_action" }, 400);
});
