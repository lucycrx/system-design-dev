"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORDMARK_SHORT } from "@/lib/site";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/example", label: "Example", matchPrefix: true },
  { href: "/stories", label: "Stories", matchPrefix: true },
  { href: "/concepts", label: "Concepts", matchPrefix: true },
] as const;

const INK = "var(--color-text)";

export function StickyTabs() {
  const pathname = usePathname();

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.href === "/") return pathname === "/";
    if ("matchPrefix" in tab && tab.matchPrefix)
      return pathname.startsWith(tab.href);
    return pathname === tab.href;
  }

  return (
    /* Fixed header — frosted paper surface so nav items stay legible and
       unobstructed over any content (hero, marquee, shapes) that scrolls
       beneath it. Ink text on a translucent paper bar. */
    <header className="fixed inset-x-0 top-0 z-50 bg-bg/80 backdrop-blur-[8px] border-b border-text/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-3">
        <Link
          href="/"
          data-cursor
          className="font-display font-bold text-2xl lowercase shrink-0"
          style={{ color: INK, letterSpacing: "-0.06em" }}
        >
          {WORDMARK_SHORT}
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
              style={{ color: INK, opacity: isActive(tab) ? 1 : 0.55 }}
            >
              {tab.label}
              {isActive(tab) && (
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: INK }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
