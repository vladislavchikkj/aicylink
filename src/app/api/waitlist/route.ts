import { NextResponse } from "next/server";
import { appDetails } from "@/content/apps";
import type { AppId } from "@/content/site";

// Forwards waitlist sign-ups to a webhook (a Google Apps Script bound to a Sheet — see README).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const app = String(body?.app ?? "") as AppId;

  // Bots fill the hidden field; pretend it worked.
  if (body?.website) return NextResponse.json({ ok: true });
  if (!EMAIL.test(email) || email.length > 200 || !(app in appDetails) || body?.consent !== true) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      app,
      country: request.headers.get("x-vercel-ip-country") ?? "",
      createdAt: new Date().toISOString(),
    }),
  }).catch(() => null);

  if (!res?.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
