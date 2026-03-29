"use client";

import { usePathname } from "next/navigation";
import { StickyTabs } from "./StickyTabs";

export function StickyTabsWrapper() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <StickyTabs />;
}
