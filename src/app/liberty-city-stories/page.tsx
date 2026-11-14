import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { LCS_TALK, LCS_TRACKS } from "../lib/tracks/liberty-city-stories";

export const metadata: Metadata = pageMetadata("LIBERTY CITY STORIES RADIO", "Live GTA Liberty City Stories radio in your browser, synced so everyone hears the same song at the same second.");

export default function LibertyCityStories() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="liberty-city-stories" tracks={LCS_TRACKS} talk={LCS_TALK} />
      <Footer />
    </main>
  );
}
