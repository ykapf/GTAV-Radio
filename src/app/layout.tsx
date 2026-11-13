import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CustomCursor from "./components/Cursor";
import { SITE_URL, pageMetadata } from "./lib/og";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata("GTA V RADIO", "Live GTA V radio in your browser. Every station is synced, so everyone hears the same song at the same second, with optional ad breaks."),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-cream antialiased`}>
        {children} <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
