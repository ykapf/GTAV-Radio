import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { VICE_CITY_TALK, VICE_CITY_TRACKS } from "../lib/tracks/vice-city";

export const metadata: Metadata = pageMetadata("VICE CITY RADIO", "Live GTA Vice City radio in your browser, synced so everyone hears the same song at the same second.");

export default function ViceCity() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="vice-city" tracks={VICE_CITY_TRACKS} talk={VICE_CITY_TALK} />
      <Footer />
    </main>
  );
}
