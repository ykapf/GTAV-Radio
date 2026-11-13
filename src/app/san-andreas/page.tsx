import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { SAN_ANDREAS_TALK, SAN_ANDREAS_TRACKS } from "../lib/tracks/san-andreas";

export const metadata: Metadata = pageMetadata("SAN ANDREAS RADIO", "Live GTA San Andreas radio in your browser, synced so everyone hears the same song at the same second.");

export default function SanAndreas() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="san-andreas" tracks={SAN_ANDREAS_TRACKS} talk={SAN_ANDREAS_TALK} />
      <Footer />
    </main>
  );
}
