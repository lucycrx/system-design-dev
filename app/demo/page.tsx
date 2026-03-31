import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header bar */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="label-mono text-text-dim hover:text-text transition-colors"
          >
            &larr; Home
          </Link>
          <span className="text-border">|</span>
          <span className="label-mono text-text-muted">
            Example Output
          </span>
        </div>
        <a
          href="https://github.com/facebookresearch/Hyperagents"
          target="_blank"
          rel="noopener noreferrer"
          className="label-mono text-accent hover:text-text transition-colors"
        >
          View source repo &nearr;
        </a>
      </div>

      {/* Context bar */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="bg-surface border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="label-mono text-text-dim">Input</span>
            <a
              href="https://github.com/facebookresearch/Hyperagents"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] text-accent hover:underline"
            >
              facebookresearch/Hyperagents
            </a>
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
              className="label-mono text-text-dim hover:text-text transition-colors"
            >
              Open full page &nearr;
            </a>
          </div>
        </div>
      </div>

      {/* Iframe */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="border border-border overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
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
