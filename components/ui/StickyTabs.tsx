"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/concepts", label: "Concepts", matchPrefix: true },
  { href: "/stories", label: "Stories", matchPrefix: true },
  { href: "/curriculum", label: "Curriculum", matchPrefix: true },
] as const;

const PAPER = "#F4F1EA";

export function StickyTabs() {
  const pathname = usePathname();

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.href === "/") return pathname === "/";
    if ("matchPrefix" in tab && tab.matchPrefix)
      return pathname.startsWith(tab.href);
    return pathname === tab.href;
  }

  return (
    /* Fixed header — mix-blend-difference reads over paper and color blocks */
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-3">
        <Link
          href="/"
          data-cursor
          className="font-display font-bold text-2xl lowercase shrink-0"
          style={{ color: PAPER, letterSpacing: "-0.06em" }}
        >
          sd
        </Link>

        {/* Primary nav — always visible at every width. On very narrow
            screens it scrolls horizontally rather than collapsing. */}
        <nav className="flex items-center gap-4 sm:gap-8 min-w-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              data-cursor
              className="relative label-mono py-1 whitespace-nowrap"
              style={{ color: PAPER, opacity: isActive(tab) ? 1 : 0.6 }}
            >
              {tab.label}
              {isActive(tab) && (
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: PAPER }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
