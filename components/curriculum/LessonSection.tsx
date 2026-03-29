"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { LessonSection as LessonSectionType } from "@/types/story";

const SECTION_META = {
  what: {
    label: "What is it?",
    color: "text-accent",
    borderColor: "border-l-accent",
  },
  why: {
    label: "Why does it matter?",
    color: "text-orange",
    borderColor: "border-l-orange",
  },
  how: {
    label: "How does it work?",
    color: "text-blue",
    borderColor: "border-l-blue",
  },
  when: {
    label: "When should I use it?",
    color: "text-green",
    borderColor: "border-l-green",
  },
};

interface Props {
  section: LessonSectionType;
}

export function LessonSection({ section }: Props) {
  const meta = SECTION_META[section.heading];

  return (
    <div className={`${meta.borderColor} border-l-[3px] pl-5 py-1 mb-8`}>
      <div
        className={`label-mono ${meta.color} mb-3`}
      >
        {meta.label}
      </div>
      <div className="text-base text-text/80 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            strong: ({ children }) => (
              <strong className="text-text font-bold">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-text-muted">{children}</em>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1.5 mb-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1.5 mb-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code className="block bg-bg p-4 text-sm font-mono text-text/70 overflow-x-auto mb-4 border border-border">
                    {children}
                  </code>
                );
              }
              return (
                <code className="bg-bg px-1.5 py-0.5 text-sm font-mono text-accent border border-border">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="mb-4">{children}</pre>,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
