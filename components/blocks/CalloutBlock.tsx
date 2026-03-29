"use client";

import ReactMarkdown from "react-markdown";
import type { CalloutBlock as CalloutBlockType } from "@/types/story";

const CALLOUT_STYLES = {
  insight: {
    label: "Key Insight",
    borderColor: "border-l-accent",
    bgColor: "bg-accent-dim",
    labelColor: "text-accent",
    topBorderColor: "border-t-accent/30",
  },
  analogy: {
    label: "Real-World Analogy",
    borderColor: "border-l-blue",
    bgColor: "bg-blue-dim",
    labelColor: "text-blue",
    topBorderColor: "border-t-blue/30",
  },
  warning: {
    label: "Watch Out",
    borderColor: "border-l-orange",
    bgColor: "bg-orange-dim",
    labelColor: "text-orange",
    topBorderColor: "border-t-orange/30",
  },
  tip: {
    label: "Pro Tip",
    borderColor: "border-l-green",
    bgColor: "bg-green-dim",
    labelColor: "text-green",
    topBorderColor: "border-t-green/30",
  },
};

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  const style = CALLOUT_STYLES[block.style];

  return (
    <div
      className={`${style.bgColor} ${style.borderColor} ${style.topBorderColor} border-l-4 border-t rounded-r-xl p-7`}
    >
      <div
        className={`text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${style.labelColor} mb-3`}
      >
        {style.label}
      </div>
      <div className="text-[15px] text-text/85 leading-[1.7]">
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
