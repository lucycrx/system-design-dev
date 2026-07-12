"use client";

import { useState } from "react";
import { track } from "@vercel/analytics/react";

type State = "idle" | "loading" | "success" | "error";

export function SubscribeForm({ variant = "paper" }: { variant?: "paper" | "ink" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  const ink = variant === "ink";
  const border = ink ? "border-[#F4F1EA]/30" : "border-text/25";
  const inputText = ink ? "text-[#F4F1EA] placeholder:text-[#F4F1EA]/40" : "text-text placeholder:text-text-muted/60";
  const note = ink ? "text-[#F4F1EA]/60" : "text-text-muted";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.ok) {
        setState("success");
        setMessage(
          data.status === "already_subscribed"
            ? "You're already on the list."
            : "You're in. Check your inbox."
        );
        track("subscribe");
        setEmail("");
        return;
      }

      setState("error");
      setMessage(
        data.reason === "invalid_email"
          ? "That email doesn't look right."
          : data.reason === "not_configured"
            ? "Signups aren't open yet — check back soon."
            : "Something went wrong. Try again."
      );
    } catch {
      setState("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (state === "success") {
    return <p className={`label-mono ${note}`}>{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className={`flex items-stretch border ${border}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className={`flex-1 bg-transparent px-4 py-3 text-sm outline-none ${inputText}`}
        />
        <button
          type="submit"
          data-cursor
          disabled={state === "loading"}
          className="label-mono px-5 py-3 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#D62828", color: "#F4F1EA" }}
        >
          {state === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {message ? (
        <p className={`label-mono mt-2 ${state === "error" ? "text-[#D62828]" : note}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
