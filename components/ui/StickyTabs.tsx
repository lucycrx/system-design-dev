"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/concepts", label: "Concepts", matchPrefix: true },
  { href: "/stories", label: "Stories", matchPrefix: true },
  { href: "/curriculum", label: "Curriculum", matchPrefix: true },
] as const;

const PAPER = "#F4F1EA";

export function StickyTabs() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(tab: (typeof TABS)[number]) {
    if (tab.href === "/") return pathname === "/";
    if ("matchPrefix" in tab && tab.matchPrefix)
      return pathname.startsWith(tab.href);
    return pathname === tab.href;
  }

  return (
    <>
      {/* Fixed header — mix-blend-difference reads over paper and color blocks */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            data-cursor
            className="font-display font-bold text-2xl lowercase"
            style={{ color: PAPER, letterSpacing: "-0.06em" }}
          >
            sd
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-8">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                data-cursor
                className="relative label-mono py-1"
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

          {/* Mobile toggle — plus glyph inside a circle */}
          <button
            type="button"
            data-cursor
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full"
            style={{ backgroundColor: PAPER }}
          >
            <span
              className="block text-lg leading-none"
              style={{
                color: "#1A1A1A",
                transform: open ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 300ms var(--ease-premium)",
              }}
            >
              +
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu panel — solid (not blended) */}
      {open && (
        <div
          className="fixed inset-x-0 top-[64px] z-40 sm:hidden border-y"
          style={{
            backgroundColor: "#1A1A1A",
            color: PAPER,
            borderColor: "rgba(244,241,234,0.12)",
          }}
        >
          <nav className="max-w-6xl mx-auto px-6 py-2 flex flex-col">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setOpen(false)}
                className="label-mono py-3 border-b last:border-b-0"
                style={{
                  color: PAPER,
                  opacity: isActive(tab) ? 1 : 0.6,
                  borderColor: "rgba(244,241,234,0.10)",
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
