import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F4F1EA";
const INK = "#1A1A1A";
const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

export default async function Image() {
  const grotesk = readFileSync(
    join(process.cwd(), "assets", "SpaceGrotesk-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PAPER,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        {/* Bauhaus shapes */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: BLUE,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 90,
            right: 150,
            width: 110,
            height: 110,
            background: RED,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: "70px solid transparent",
            borderRight: "70px solid transparent",
            borderTop: `120px solid ${YELLOW}`,
          }}
        />

        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, color: INK }}>
          {SITE_NAME.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 92,
              lineHeight: 1,
              color: INK,
              maxWidth: 820,
              letterSpacing: -3,
            }}
          >
            <span>See what you actually&nbsp;</span>
            <span style={{ color: RED }}>built.</span>
          </div>
          <div style={{ fontSize: 32, color: "#4A4A4A", marginTop: 28, maxWidth: 760 }}>
            A Claude Code skill that maps your architecture and its risks — in
            plain English.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Space Grotesk", data: grotesk, style: "normal", weight: 700 }],
    }
  );
}
