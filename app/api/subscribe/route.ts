import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, reason: "invalid_email" }, { status: 400 });
  }

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    // Degrade gracefully when the newsletter isn't wired up yet — the form
    // shows a friendly "not available" message instead of crashing.
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, tags: ["site"] }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true, status: "subscribed" });
    }

    // Buttondown returns 400 with a "already subscribed" style code when the
    // address exists — treat that as success from the visitor's perspective.
    const detail = await res.text();
    if (res.status === 400 && /already|exist/i.test(detail)) {
      return NextResponse.json({ ok: true, status: "already_subscribed" });
    }

    // Never echo the upstream body or key back to the client.
    return NextResponse.json({ ok: false, reason: "upstream_error" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, reason: "upstream_error" }, { status: 502 });
  }
}
