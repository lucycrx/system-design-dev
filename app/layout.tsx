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
  title: "System Design for Builders",
  description:
    "Learn system design through interactive stories. Built for vibecoders, PMs, and founders — not just engineers.",
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
