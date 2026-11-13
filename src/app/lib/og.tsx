import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import { ImageResponse } from "next/og";

export const SITE_URL = "https://gtav-radio.vercel.app";

export const OG_SIZE = { width: 1200, height: 630 };

const CREAM = "#f5f0e6";
const CREAM_SOFT = "rgba(245, 240, 230, 0.72)";
const LINE = "rgba(245, 240, 230, 0.28)";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: "GTA Radio", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const publicFile = (file: string) => readFileSync(path.join(process.cwd(), "public", file));

const dataUri = (file: string) => {
  const type = file.endsWith(".jpg") ? "image/jpeg" : "image/png";
  return `data:${type};base64,${publicFile(file).toString("base64")}`;
};

interface PreviewCard {
  /** The game's name, drawn in the headline font. */
  game: string;
  /** Small label above the game name. */
  kicker: string;
  tagline: string;
  /** Station logos from `public/`, PNG or JPEG only. */
  logos: string[];
  /** Square logos are shown as round badges, like on the wheel. */
  roundLogos?: boolean;
  /** Top-right label, the site address by default. */
  corner?: string;
}

export function previewImage({ game, kicker, tagline, logos, roundLogos = false, corner = "gtav-radio.vercel.app" }: PreviewCard) {
  const gameSize = Math.min(176, Math.floor(1056 / (game.length * 0.62)));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#000", color: CREAM, padding: "64px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Kaftan", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: CREAM_SOFT }}>
          <span>{kicker}</span>
          <span>{corner}</span>
        </div>
        <div style={{ display: "flex", height: 1, background: LINE, marginTop: 24 }} />

        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontFamily: "Headline", fontSize: gameSize, lineHeight: 1, textTransform: "uppercase" }}>{game}</div>
          <div style={{ display: "flex", fontFamily: "Kaftan", fontSize: 32, lineHeight: 1.4, marginTop: 24, maxWidth: 960, color: CREAM_SOFT }}>{tagline}</div>
        </div>

        <div style={{ display: "flex", height: 1, background: LINE, marginBottom: 32 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              key={logo}
              src={dataUri(logo)}
              width={112}
              height={112}
              style={{ width: 112, height: 112, objectFit: roundLogos ? "cover" : "contain", borderRadius: roundLogos ? 56 : 0 }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Headline", data: publicFile("fonts/Headline.otf"), style: "normal" },
        { name: "Kaftan", data: publicFile("fonts/kaftan-trial.otf"), style: "normal" },
      ],
    },
  );
}
