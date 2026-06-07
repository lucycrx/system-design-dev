"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { LessonSection as LessonSectionType } from "@/types/story";
import { Shape, type ShapeType } from "@/components/ui/Shape";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

const SECTION_META: Record<
  LessonSectionType["heading"],
  { label: string; shape: ShapeType; color: string }
> = {
  what: { label: "What is it?", shape: "circle", color: BLUE },
  why: { label: "Why does it matter?", shape: "square", color: YELLOW },
  how: { label: "How does it work?", shape: "triangle", color: RED },
  when: { label: "When should I use it?", shape: "half-circle", color: BLUE },
};

interface Props {
  section: LessonSectionType;
}

export function LessonSection({ section }: Props) {
  const meta = SECTION_META[section.heading];

  return (
    <div className="border-l-2 border-l-text pl-5 py-1 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Shape type={meta.shape} color={meta.color} size={11} />
        <span className="label-mono text-text">{meta.label}</span>
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
                <code className="bg-bg px-1.5 py-0.5 text-sm font-mono text-text border border-border">
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
