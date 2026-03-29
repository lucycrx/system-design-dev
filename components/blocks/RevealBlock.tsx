"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { RevealBlock as RevealBlockType } from "@/types/story";

interface Props {
  block: RevealBlockType;
}

export function RevealBlock({ block }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-surface-hover transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 text-text-dim transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M4.5 2L9 6L4.5 10V2Z" />
        </svg>
        <span className="text-[14px] text-blue font-medium font-mono">{block.label}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border bg-surface">
          <div className="pt-4 text-[15px] text-text/70 leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="text-text font-semibold">{children}</strong>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>
                ),
                code: ({ children }) => (
                  <code className="bg-bg px-1.5 py-0.5 text-sm font-mono text-accent border border-border">
                    {children}
                  </code>
                ),
              }}
            >
              {block.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
