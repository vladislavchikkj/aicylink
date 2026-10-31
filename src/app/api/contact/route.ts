import { NextResponse } from "next/server";
import { contactTopics } from "@/content/site";

// Messages are delivered to Telegram. Set TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID in the environment (e.g. Vercel project settings).

const topicLabels = new Map<string, string>(contactTopics.map((t) => [t.id, t.label]));

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const topic = topicLabels.get(clean(body.topic, 40)) ?? "Other";
  const message = clean(body.message, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set; message not delivered");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const text = [
    `📩 New inquiry — ${topic}`,
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Company: ${company}`,
    "",
    message,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    console.error("[contact] Telegram delivery failed", res.status, await res.text());
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
