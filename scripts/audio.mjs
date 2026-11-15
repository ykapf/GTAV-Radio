// Builds the MP3 library's folders and checklists, then records every MP3 that's there.
//
//   npm run audio
//
// 1. Creates public/audio/<game>/<station>/ for every station, ad break and news
//    rotation, each with a _files.txt listing the exact MP3 names it expects.
// 2. Reads the length of every expected MP3 that exists and writes
//    public/audio-manifest.json. The site only plays MP3s listed there;
//    everything else carries on from YouTube.
//
// Re-run it whenever you add files. It never deletes or renames anything.

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

import { adFile, fileForMix, gameFolder, songFiles, slugify } from "../src/app/lib/audio.ts";
import { AD_SETS, MIX_LENGTHS, PLAYLIST_TRACKS } from "../src/app/lib/broadcast.ts";
import { GAMES } from "../src/app/lib/games.ts";
import { CHINATOWN_WARS_TRACKS } from "../src/app/lib/tracks/chinatown-wars.ts";
import { GTA_1_TRACKS } from "../src/app/lib/tracks/gta-1.ts";
import { GTA_2_TRACKS } from "../src/app/lib/tracks/gta-2.ts";
import { GTA_III_TRACKS } from "../src/app/lib/tracks/gta-3.ts";
import { GTA_IV_TRACKS } from "../src/app/lib/tracks/gta-4.ts";
import { GTA_LONDON_TRACKS } from "../src/app/lib/tracks/gta-london.ts";
import { LCS_TRACKS } from "../src/app/lib/tracks/liberty-city-stories.ts";
import { SAN_ANDREAS_TRACKS } from "../src/app/lib/tracks/san-andreas.ts";
import { VCS_TRACKS } from "../src/app/lib/tracks/vice-city-stories.ts";
import { VICE_CITY_TRACKS } from "../src/app/lib/tracks/vice-city.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const AUDIO = join(PUBLIC, "audio");
const MANIFEST = join(PUBLIC, "audio-manifest.json");
/** MP3s this far off the YouTube length still play in sync, but are worth a look. */
const LENGTH_WARNING_S = 5;

/** GTA VI's previews are committed to the repo and play on their own. */
const TRACKS = {
  "gta-v": PLAYLIST_TRACKS,
  "chinatown-wars": CHINATOWN_WARS_TRACKS,
  "gta-4": GTA_IV_TRACKS,
  "vice-city-stories": VCS_TRACKS,
  "liberty-city-stories": LCS_TRACKS,
  "san-andreas": SAN_ANDREAS_TRACKS,
  "vice-city": VICE_CITY_TRACKS,
  "gta-3": GTA_III_TRACKS,
  "gta-2": GTA_2_TRACKS,
  "gta-london": GTA_LONDON_TRACKS,
  "gta-1": GTA_1_TRACKS,
};

const youtube = (videoId, start = 0) => `https://youtu.be/${videoId}${start ? `?t=${Math.floor(start)}` : ""}`;
const clock = (s) => {
  const t = Math.round(s);
  const h = Math.floor(t / 3600);
  const m = Math.floor(t / 60) % 60;
  const sec = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};
const end = (items) => Math.max(...items.map((it) => it.start + it.duration));

/** Every file the site can play, grouped by folder. */
function expectedFiles() {
  const folders = new Map();
  const add = (file, entry) => {
    const dir = dirname(file);
    if (!folders.has(dir)) folders.set(dir, { title: entry.folderTitle, files: new Map() });
    const files = folders.get(dir).files;
    if (!files.has(file)) files.set(file, entry);
  };

  for (const game of GAMES) {
    const tracks = TRACKS[game.id];
    if (!tracks) continue;
    const folder = gameFolder(game.href);
    const set = game.ads ? AD_SETS[game.id] ?? null : null;
    const csv = readFileSync(join(PUBLIC, game.stationList), "utf8").replace(/^\uFEFF/, "");
    const stations = Papa.parse(csv, { header: true, skipEmptyLines: true, transform: (v) => v.trim() }).data.filter((s) => s.name && s.name !== "Radio Off");

    for (const station of stations) {
      const folderTitle = `${station.name} (${game.title})`;
      if (station.type === "p") {
        const list = tracks[station.playlistId];
        if (!list) continue;
        const names = songFiles(list);
        for (const track of list) {
          add(`${folder}/${slugify(station.name)}/${names[track.id]}`, { folderTitle, title: track.title, duration: track.duration, url: youtube(track.id) });
        }
      } else if (station.type === "v" && station.link) {
        const file = fileForMix(folder, station.name, station.link, set);
        add(file, {
          folderTitle: file.includes("/ads/") ? `Commercials (${game.title})` : folderTitle,
          title: `${station.name}, the whole video as one file`,
          duration: MIX_LENGTHS[station.link],
          url: youtube(station.link),
        });
      }
    }

    if (set) {
      add(adFile(folder, set, set.ads[0]), {
        folderTitle: `Commercials (${game.title})`,
        title: "The whole commercials video as one file; ad breaks are cut from it at the video's timestamps",
        duration: end(set.ads),
        atLeast: true,
        url: youtube(set.ads[0].videoId),
      });
      for (const news of set.news) {
        const file = adFile(folder, set, news);
        const single = news.start > 0 || set.news.every((n) => n.videoId === set.news[0].videoId);
        add(file, {
          folderTitle: `Weazel News (${game.title})`,
          title: single ? "The whole Weazel News video as one file; bulletins are cut from it at the video's timestamps" : `Weazel News ${news.title}`,
          duration: single ? end(set.news) : news.duration,
          atLeast: single,
          url: youtube(news.videoId),
        });
      }
    }
  }
  return folders;
}

const BITRATES = {
  "1-1": [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
  "1-2": [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  "1-3": [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  "2-1": [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
  "2-2": [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const SAMPLE_RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

/** Length of an MP3 in seconds, from its Xing/VBRI header or by walking every frame. No dependencies, so it runs anywhere. */
function mp3Duration(buf) {
  let i = 0;
  if (buf.toString("latin1", 0, 3) === "ID3") {
    const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    i = 10 + size + (buf[5] & 0x10 ? 10 : 0);
  }
  let seconds = 0;
  let first = true;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) {
      i++;
      continue;
    }
    const version = (buf[i + 1] >> 3) & 3; // 3: MPEG-1, 2: MPEG-2, 0: MPEG-2.5
    const layer = 4 - ((buf[i + 1] >> 1) & 3); // 1, 2 or 3
    const bitrateIndex = buf[i + 2] >> 4;
    const rateIndex = (buf[i + 2] >> 2) & 3;
    if (version === 1 || layer === 4 || bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3) {
      i++;
      continue;
    }
    const mpeg1 = version === 3;
    const bitrate = BITRATES[mpeg1 ? `1-${layer}` : layer === 1 ? "2-1" : "2-2"][bitrateIndex] * 1000;
    const rate = SAMPLE_RATES[version][rateIndex];
    const padding = (buf[i + 2] >> 1) & 1;
    const samples = layer === 1 ? 384 : layer === 3 && !mpeg1 ? 576 : 1152;
    const length = layer === 1 ? (Math.floor((12 * bitrate) / rate) + padding) * 4 : Math.floor(((samples / 8) * bitrate) / rate) + padding;
    if (first) {
      first = false;
      const mono = (buf[i + 3] >> 6) === 3;
      const xing = i + 4 + (mpeg1 ? (mono ? 17 : 32) : mono ? 9 : 17);
      const tag = buf.toString("latin1", xing, xing + 4);
      if ((tag === "Xing" || tag === "Info") && buf[xing + 7] & 1) return (buf.readUInt32BE(xing + 8) * samples) / rate;
      if (buf.toString("latin1", i + 36, i + 40) === "VBRI") return (buf.readUInt32BE(i + 36 + 14) * samples) / rate;
    }
    seconds += samples / rate;
    i += Math.max(length, 1);
  }
  return seconds;
}

function mp3sUnder(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return mp3sUnder(path);
    return name.toLowerCase().endsWith(".mp3") ? [path] : [];
  });
}

const folders = expectedFiles();
const manifest = {};
const warnings = [];
let expected = 0;

for (const [dir, { title, files }] of folders) {
  mkdirSync(join(AUDIO, dir), { recursive: true });
  const lines = [
    title,
    "",
    "Put these MP3s in this folder, named exactly as below ([x] = found).",
    "Anything missing plays from YouTube, so you can fill folders gradually.",
    "Then run `npm run audio` again to record them.",
    "",
  ];
  for (const [file, entry] of files) {
    expected++;
    const path = join(AUDIO, file);
    const found = existsSync(path);
    if (found) {
      const seconds = mp3Duration(readFileSync(path));
      if (!(seconds > 0)) {
        warnings.push(`${file}: couldn't read its length, so it isn't an MP3 the site can use`);
      } else {
        manifest[file] = Math.round(seconds * 10) / 10;
        const gap = seconds - (entry.duration ?? seconds);
        if (entry.duration && (entry.atLeast ? gap < -LENGTH_WARNING_S : Math.abs(gap) > LENGTH_WARNING_S)) {
          warnings.push(`${file}: ${clock(seconds)} long, but the YouTube version is ${clock(entry.duration)}`);
        }
      }
    }
    const name = file.slice(dir.length + 1);
    lines.push(`[${found ? "x" : " "}] ${name}`, `    ${entry.title}${entry.duration ? `, ${clock(entry.duration)}` : ""}`, `    ${entry.url}`, "");
  }
  writeFileSync(join(AUDIO, dir, "_files.txt"), lines.join("\n"));
}

const known = new Set([...folders.values()].flatMap(({ files }) => [...files.keys()]));
const strays = mp3sUnder(AUDIO)
  .map((path) => relative(AUDIO, path).split("\\").join("/"))
  .filter((file) => !file.startsWith("gta-6/") && !known.has(file));

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(MANIFEST, `${JSON.stringify({ files: sorted }, null, 1)}\n`);

console.log(`${Object.keys(manifest).length} of ${expected} MP3s found, in ${folders.size} folders under public/audio.`);
console.log(`Wrote public/audio-manifest.json.`);
if (warnings.length) console.log(`\nCheck these:\n${warnings.map((w) => `  ${w}`).join("\n")}`);
if (strays.length) console.log(`\nNot expected anywhere, so they won't play (check the name against that folder's _files.txt):\n${strays.map((s) => `  ${s}`).join("\n")}`);
