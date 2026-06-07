import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { StickyTabsWrapper } from "@/components/ui/StickyTabsWrapper";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";

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
  title: "System Design School \u2014 Learn How Apps Scale",
  description:
    "Learn system design one concept at a time. Caching, load balancing, sharding, queues, and more \u2014 each explained in plain English with real-world analogies and interactive Build Stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body
        className="min-h-screen bg-bg text-text font-sans antialiased"
        style={{ animation: "bodyReveal 0.4s ease forwards" }}
      >
        <ScrollProgressBar />
        <StickyTabsWrapper />
        {children}
      </body>
    </html>
  );
}
