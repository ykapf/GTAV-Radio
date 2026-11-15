import type { AdSet, Item, Track } from "./broadcast";

/**
 * Self-hosted MP3 copies of the songs, ads and talk shows, laid out as
 * <base>/<game>/<station>/<song>.mp3. The base is /audio (public/audio) unless
 * NEXT_PUBLIC_AUDIO_BASE_URL points at a storage bucket.
 *
 * Only runtime-free and type-only imports here: scripts/audio.mjs loads this
 * file straight into Node, so the site and the folder checklists share one set
 * of file names.
 */
export const AUDIO_BASE = (process.env.NEXT_PUBLIC_AUDIO_BASE_URL || "/audio").replace(/\/+$/, "");

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** "/gta-5" → "gta-5": each game's folder is named after its page. */
export const gameFolder = (href: string) => href.replace(/^\/+/, "") || "gta-5";

const songFileCache = new WeakMap<Track[], Record<string, string>>();

/** File name of each song in a station, keyed by video id; repeated names get -2, -3 in track order. */
export function songFiles(tracks: Track[]): Record<string, string> {
  let files = songFileCache.get(tracks);
  if (!files) {
    const out: Record<string, string> = {};
    const used = new Set<string>();
    tracks.forEach((track, i) => {
      if (out[track.id]) return;
      const base = slugify(track.title) || `track-${i + 1}`;
      let name = base;
      for (let n = 2; used.has(name); n++) name = `${base}-${n}`;
      used.add(name);
      out[track.id] = `${name}.mp3`;
    });
    songFileCache.set(tracks, out);
    files = out;
  }
  return files;
}

/** Commercials are one long file cut at the same timestamps as the YouTube video; GTA V's news bulletins are one file each. */
export function adFile(folder: string, set: AdSet, item: Item): string {
  if (!item.news) return `${folder}/ads/commercials.mp3`;
  if (set.news.every((n) => n.videoId === set.news[0].videoId)) return `${folder}/weazel-news/weazel-news.mp3`;
  const number = item.title.match(/^#(\d+)/)?.[1];
  const name = slugify(item.title.replace(/^#\d+:?/, ""));
  return `${folder}/weazel-news/${[number?.padStart(3, "0"), name].filter(Boolean).join("-")}.mp3`;
}

/** Where a scheduled song, ad or bulletin's MP3 lives, relative to the audio base. */
export function fileForItem(folder: string, stationName: string, item: Item, tracks: Track[] | undefined, set: AdSet | null): string | null {
  if (item.ad) return set ? adFile(folder, set, item) : null;
  const name = tracks ? songFiles(tracks)[item.videoId] : undefined;
  return name ? `${folder}/${slugify(stationName)}/${name}` : null;
}

/** Single-video stations (talk radio, long mixes) are one file named after the station; the commercials station reuses the ad file. */
export function fileForMix(folder: string, stationName: string, videoId: string, set: AdSet | null): string {
  if (set?.ads[0]?.videoId === videoId) return `${folder}/ads/commercials.mp3`;
  const slug = slugify(stationName);
  return `${folder}/${slug}/${slug}.mp3`;
}

export const audioUrl = (file: string) => `${AUDIO_BASE}/${file.split("/").map(encodeURIComponent).join("/")}`;

let manifest: Promise<Record<string, number>> | null = null;

/** Every uploaded MP3 and its real length in seconds, written by `npm run audio`. Songs not listed play from YouTube. */
export function loadAudioManifest(): Promise<Record<string, number>> {
  if (!manifest) {
    manifest = fetch("/audio-manifest.json", { cache: "no-cache" })
      .then((res) => (res.ok ? res.json() : { files: {} }))
      .then((data: { files?: Record<string, number> }) => data.files ?? {})
      .catch(() => ({}));
  }
  return manifest;
}
