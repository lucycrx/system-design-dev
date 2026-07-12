import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { StickyTabsWrapper } from "@/components/ui/StickyTabsWrapper";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { DifferenceCursor } from "@/components/ui/DifferenceCursor";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} \u2014 ${SITE_TAGLINE}`,
    template: `%s \u2014 ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
