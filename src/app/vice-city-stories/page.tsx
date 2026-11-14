import type { Metadata } from "next";
import RadioWheel from "../components/RadioWheel";
import Footer from "../components/Footer";
import { pageMetadata } from "../lib/og";
import { VCS_TALK, VCS_TRACKS } from "../lib/tracks/vice-city-stories";

export const metadata: Metadata = pageMetadata("VICE CITY STORIES RADIO", "Live GTA Vice City Stories radio in your browser, synced so everyone hears the same song at the same second.");

export default function ViceCityStories() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-cream">
      <RadioWheel game="vice-city-stories" tracks={VCS_TRACKS} talk={VCS_TALK} />
      <Footer />
    </main>
  );
}
