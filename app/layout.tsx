import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { StickyTabsWrapper } from "@/components/ui/StickyTabsWrapper";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { DifferenceCursor } from "@/components/ui/DifferenceCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${poppins.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body
        className="min-h-screen bg-bg text-text font-sans antialiased pt-16"
        style={{ animation: "bodyReveal 0.4s ease forwards" }}
      >
        <DifferenceCursor />
        <ScrollProgressBar />
        <StickyTabsWrapper />
        {children}
      </body>
    </html>
  );
}
