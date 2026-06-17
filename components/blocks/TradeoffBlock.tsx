"use client";

import ReactMarkdown from "react-markdown";
import type { TradeoffBlock as TradeoffBlockType } from "@/types/story";

interface Props {
  block: TradeoffBlockType;
}

function ScaleIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export function TradeoffBlock({ block }: Props) {
  const cols =
    block.options.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="border border-border bg-surface overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <div className="label-mono text-accent flex items-center gap-2 mb-2.5">
          <ScaleIcon />
          Tradeoff
        </div>
        <p className="text-[17px] font-semibold leading-snug text-text">
          {block.decision}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${cols} gap-px bg-border`}>
        {block.options.map((opt) => (
          <div key={opt.name} className="bg-surface px-6 py-5">
            <div className="font-bold text-[14.5px] text-text mb-3">
              {opt.name}
            </div>

            {opt.pros.length > 0 && (
              <div className="mb-3">
                <div className="label-mono text-[0.62rem] text-text-dim mb-2">
                  Gain
                </div>
                <ul className="flex flex-col gap-1.5">
                  {opt.pros.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug text-text/80">
                      <span className="font-mono font-bold text-accent w-3 text-center shrink-0">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {opt.cons.length > 0 && (
              <div>
                <div className="label-mono text-[0.62rem] text-text-dim mb-2">
                  Cost
                </div>
                <ul className="flex flex-col gap-1.5">
                  {opt.cons.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug text-text/80">
                      <span className="font-mono font-bold text-red w-3 text-center shrink-0">&ndash;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t-2 border-t-accent bg-accent-dim">
        <div className="label-mono text-accent mb-2">The call</div>
        <div className="text-[14.5px] text-text/85 leading-[1.65]">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="text-text font-bold">{children}</strong>
              ),
            }}
          >
            {block.choice}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
