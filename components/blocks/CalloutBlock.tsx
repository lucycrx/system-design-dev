"use client";

import ReactMarkdown from "react-markdown";
import type { CalloutBlock as CalloutBlockType } from "@/types/story";

const CALLOUT_STYLES = {
  insight: {
    label: "Key Insight",
    borderColor: "border-l-accent",
    bgColor: "bg-accent-dim",
    labelColor: "text-accent",
  },
  analogy: {
    label: "Real-World Analogy",
    borderColor: "border-l-blue",
    bgColor: "bg-blue-dim",
    labelColor: "text-blue",
  },
  warning: {
    label: "Watch Out",
    borderColor: "border-l-orange",
    bgColor: "bg-orange-dim",
    labelColor: "text-orange",
  },
  tip: {
    label: "Pro Tip",
    borderColor: "border-l-green",
    bgColor: "bg-green-dim",
    labelColor: "text-green",
  },
};

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  const style = CALLOUT_STYLES[block.style];

  return (
    <div
      className={`${style.bgColor} ${style.borderColor} border-l-[3px] rounded-r-xl p-5 my-6`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-wider ${style.labelColor} mb-2`}
      >
        {style.label}
      </div>
      <div className="text-[14px] text-text/80 leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
            strong: ({ children }) => (
              <strong className="text-text font-semibold">{children}</strong>
            ),
          }}
        >
          {block.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
