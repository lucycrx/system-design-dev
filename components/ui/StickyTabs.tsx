"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/concepts", label: "Concepts", matchPrefix: true },
  { href: "/stories", label: "Stories", matchPrefix: true },
  { href: "/curriculum", label: "Curriculum", matchPrefix: true },
] as const;

export function StickyTabs() {
  const pathname = usePathname();

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.href === "/") return pathname === "/";
    if (tab.matchPrefix) return pathname.startsWith(tab.href);
    return pathname === tab.href;
  }

  return (
    <div className="sticky top-0 z-40 bg-accent/85 backdrop-blur-[12px] border-b border-accent">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-8">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative py-3 text-[11px] font-mono tracking-[2px] uppercase transition-colors ${
                isActive(tab)
                  ? "text-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {tab.label}
              {isActive(tab) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
