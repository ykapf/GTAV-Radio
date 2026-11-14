import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { CHINATOWN_WARS_TRACKS } from "../lib/tracks/chinatown-wars";

export const metadata: Metadata = pageMetadata("CHINATOWN WARS RADIO", "Live GTA Chinatown Wars radio in your browser, synced so everyone hears the same song at the same second.");

export default function ChinatownWars() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="chinatown-wars" tracks={CHINATOWN_WARS_TRACKS} />
      <Footer />
    </main>
  );
}
