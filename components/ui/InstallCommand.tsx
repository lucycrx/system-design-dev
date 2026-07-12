"use client";

import { useState } from "react";
import { track } from "@vercel/analytics/react";
import { INSTALL_COMMANDS } from "@/lib/site";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS.join("\n"));
      setCopied(true);
      track("install_copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — no-op; commands are visible.
    }
  }

  return (
    <div className="border border-text/15 bg-surface">
      <div className="flex items-center justify-between border-b border-text/10 px-4 py-2.5">
        <span className="label-mono text-text-muted">In Claude Code</span>
        <button
          type="button"
          data-cursor
          onClick={copy}
          className="label-mono text-text-muted hover:text-text transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="px-4 py-4 font-mono text-[13px] leading-relaxed overflow-x-auto">
        {INSTALL_COMMANDS.map((cmd) => (
          <div key={cmd} className="flex items-start gap-2 whitespace-nowrap">
            <span className="select-none" style={{ color: "#D62828" }}>
              &gt;
            </span>
            <span className="text-text">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
