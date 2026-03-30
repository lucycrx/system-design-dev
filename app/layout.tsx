import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { StickyTabsWrapper } from "@/components/ui/StickyTabsWrapper";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Architecture Review \u2014 Any Codebase, Understood",
  description:
    "A Claude Code skill that scans any codebase and generates an interactive architecture map with plain-English explanations and risk analysis. For PMs, founders, and vibecoders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <StickyTabsWrapper />
        {children}
      </body>
    </html>
  );
}
