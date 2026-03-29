"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TextBlock as TextBlockType, GlossaryTerm } from "@/types/story";
import { GlossaryTooltip } from "@/components/glossary/GlossaryTooltip";

interface Props {
  block: TextBlockType;
  glossaryMap: Record<string, GlossaryTerm>;
}

/**
 * Splits text containing [[glossary:term-id|display text]] into
 * an array of strings and GlossaryTooltip elements.
 */
function renderWithGlossary(
  text: string,
  glossaryMap: Record<string, GlossaryTerm>
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[glossary:([a-z0-9-]+)\|([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const termId = match[1];
    const displayText = match[2];
    const term = glossaryMap[termId];

    if (term) {
      parts.push(
        <GlossaryTooltip key={`${termId}-${match.index}`} term={term}>
          {displayText}
        </GlossaryTooltip>
      );
    } else {
      parts.push(
        <span key={`${termId}-${match.index}`} className="text-accent font-medium">
          {displayText}
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Recursively walks React children, replacing glossary link syntax
 * in string children with GlossaryTooltip components.
 */
function processChildren(
  children: React.ReactNode,
  glossaryMap: Record<string, GlossaryTerm>
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      if (child.includes("[[glossary:")) {
        return <>{renderWithGlossary(child, glossaryMap)}</>;
      }
      return child;
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: processChildren(child.props.children, glossaryMap),
      });
    }
    return child;
  });
}

export function TextBlock({ block, glossaryMap }: Props) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="text-text/90 leading-relaxed mb-4 text-[15px]">
              {processChildren(children, glossaryMap)}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-text font-bold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-text-muted italic">{children}</em>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-2 mb-4 text-[15px] text-text/90">
              {children}
            </ol>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-2 mb-4 text-[15px] text-text/90">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {processChildren(children, glossaryMap)}
            </li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 border border-border">
              <table className="w-full text-sm text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface text-text-muted text-xs uppercase tracking-wider">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-t border-border text-text/80">
              {children}
            </td>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-bg p-4 text-sm font-mono text-text/70 overflow-x-auto border border-border">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-surface px-1.5 py-0.5 text-sm font-mono text-accent border border-border">
                {children}
              </code>
            );
          },
        }}
      >
        {block.content}
      </ReactMarkdown>
    </div>
  );
}
