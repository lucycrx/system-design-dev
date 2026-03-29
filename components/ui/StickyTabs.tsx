"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Build Stories" },
  { href: "/curriculum", label: "Curriculum" },
] as const;

export function StickyTabs() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-6">
        <nav className="flex gap-8">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative py-3 text-sm font-medium transition-colors ${
                isActive(tab.href)
                  ? "text-text"
                  : "text-text-dim hover:text-text-muted"
              }`}
            >
              {tab.label}
              {isActive(tab.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
