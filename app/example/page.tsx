import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink } from "@/components/ui/TrackedLink";

export const metadata: Metadata = {
  title: "Example Output",
  description:
    "A real architecture review generated from a public codebase — interactive diagram, component cards, and plain-English risk analysis, all in a single shareable HTML file.",
  alternates: { canonical: "/example" },
};

const SOURCE_REPO = "https://github.com/facebookresearch/Hyperagents";

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header bar */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            data-cursor
            className="label-mono text-text-dim hover:text-text transition-colors"
          >
            &larr; Home
          </Link>
          <span className="text-border">|</span>
          <span className="label-mono text-text-muted">Example Output</span>
        </div>
        <TrackedLink
          href={SOURCE_REPO}
          event="github_click"
          className="label-mono text-accent hover:text-text transition-colors"
        >
          View source repo &nearr;
        </TrackedLink>
      </div>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-6 pb-4">
        <p className="text-[0.9375rem] text-text-muted leading-relaxed max-w-2xl">
          This is exactly what the skill produces — one self-contained HTML file
          you can open, click around, and share. Below is a live review generated
          from a public repository.
        </p>
      </div>

      {/* Context bar */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="bg-surface border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="label-mono text-text-dim">Input</span>
            <TrackedLink
              href={SOURCE_REPO}
              event="github_click"
              className="font-mono text-[13px] text-accent hover:underline"
            >
              facebookresearch/Hyperagents
            </TrackedLink>
          </div>
          <span className="hidden sm:inline font-mono text-[20px] text-text-dim">&rarr;</span>
          <div className="flex items-center gap-3">
            <span className="label-mono text-text-dim">Output</span>
            <span className="font-mono text-[13px] text-text-muted">
              Interactive architecture review
            </span>
          </div>
          <div className="sm:ml-auto">
            <a
              href="/examples/hyperagents.html"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="label-mono text-text-dim hover:text-text transition-colors"
            >
              Open full page &nearr;
            </a>
          </div>
        </div>
      </div>

      {/* Iframe */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          className="border border-border overflow-hidden"
          style={{ height: "calc(100vh - 260px)" }}
        >
          <iframe
            src="/examples/hyperagents.html"
            className="w-full h-full border-0"
            title="Architecture Review — Hyperagents"
          />
        </div>
      </div>
    </div>
  );
}
