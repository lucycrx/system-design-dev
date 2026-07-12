"use client";

import { track } from "@vercel/analytics/react";

export function TrackedLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      onClick={() => track(event)}
      className={className}
    >
      {children}
    </a>
  );
}
