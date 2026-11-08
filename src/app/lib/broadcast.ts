/**
 * Playlist stations as "live" broadcasts: every listener hears the same song at
 * the same position, derived only from the (server-corrected) UTC clock.
 * Ported from the portfolio's Non-Stop-Pop radio with the same tracks, ads, seed
 * and on-air date, so with ad breaks on both sites play the same thing.
 * With ad breaks off the songs follow their own schedule, still clock-derived.
 */

export interface Track {
  id: string;
  title: string;
  /** Seconds. */
  duration: number;
}

/**
 * Real YouTube lengths of each playlist's videos, keyed by playlist id. A playlist
 * only becomes a synced broadcast once its tracks are listed here.
 */
export const PLAYLIST_TRACKS: Record<string, Track[]> = {
  // Non-Stop-Pop 100.7 FM (DJ Cara)
  PLv2IGBk7nw2N7ibp1azSzGAAHYRncfaFN: [
    { id: "T8sWgUzuTo0", title: "1 Thing", duration: 229 },
    { id: "6N3JQkMFK2M", title: "6 Underground", duration: 233 },
    { id: "Qq3u0UWIX2s", title: "Adult Education", duration: 250 },
    { id: "ec2Dvm9QvZg", title: "Alright", duration: 223 },
    { id: "1GKX53eJHQc", title: "Anthem", duration: 247 },
    { id: "_mjgdUBhvnM", title: "Applause", duration: 212 },
    { id: "Xl9ORbZkWS8", title: "Bad Girls", duration: 233 },
    { id: "ypi5Lyv_aSA", title: "Cooler Than Me", duration: 218 },
    { id: "alaUJKV7t94", title: "Days Go By", duration: 224 },
    { id: "6V_ZMZbeT6c", title: "Don't Wanna Fall In Love", duration: 238 },
    { id: "Q7OaKc9eiX0", title: "Everything She Wants", duration: 207 },
    { id: "LD1s3afd9kU", title: "Feel Good Inc.", duration: 225 },
    { id: "47KrNuGWeLU", title: "Gimme More", duration: 209 },
    { id: "UrLwlqy2hY0", title: "Glamorous", duration: 239 },
    { id: "D9LL3B8xL5E", title: "I Want It That Way", duration: 218 },
    { id: "XDibRgVpBzo", title: "Kids", duration: 264 },
    { id: "mdA5x-f_nWE", title: "Lady (Hear Me Tonight)", duration: 229 },
    { id: "jNJ6uKeoAik", title: "Let's Go All The Way", duration: 221 },
    { id: "8S4gIGc652o", title: "Living In A Box", duration: 188 },
    { id: "LZexOk4us1M", title: "Me & U", duration: 197 },
    { id: "wBAMAawyi20", title: "Meet Me Halfway", duration: 257 },
    { id: "9_7hTRoPRF8", title: "Midnight City", duration: 246 },
    { id: "jRg-i57w_f4", title: "Moves Like Jagger", duration: 205 },
    { id: "9fL7L75Ez5g", title: "Music Sounds Better With You", duration: 264 },
    { id: "zqb3iI21dyc", title: "New Sensation", duration: 225 },
    { id: "cwU5qJv-4DQ", title: "On Our Own", duration: 286 },
    { id: "r_46nwoB6uQ", title: "Only Girl (In The World)", duration: 238 },
    { id: "u2NDyds48ek", title: "Promises, Promises", duration: 228 },
    { id: "N2kBYUhW_cc", title: "Pure Shores", duration: 275 },
    { id: "fKsm6cw1b5g", title: "Scandalous", duration: 242 },
    { id: "ivKosHJM0Io", title: "Send Me An Angel", duration: 234 },
    { id: "qhzlIZdBsmo", title: "Smalltown Boy", duration: 278 },
    { id: "dpSTP_5WNW0", title: "Something Got Me Started", duration: 300 },
    { id: "CelMDlpTbDs", title: "Tape Loop", duration: 231 },
    { id: "h4igSWmbGO4", title: "Tell It To My Heart", duration: 224 },
    { id: "Oe-OkX-rEv4", title: "Tennis Court", duration: 202 },
    { id: "pntr19zqj-k", title: "The Rhythm Of The Night", duration: 216 },
    { id: "Hofep767nOI", title: "The Time Is Now", duration: 218 },
    { id: "jBT0h_IssjU", title: "Wait", duration: 193 },
    { id: "AsNH1k60TLM", title: "West End Girls", duration: 236 },
    { id: "EPHWnaoNKf0", title: "Work", duration: 196 },
    { id: "rTYlbJ0iSzQ", title: "With Every Heartbeat", duration: 253 },
  ],
};

/** The GTA V Radio Commercials video; each ad is one of its chapters. */
const COMMERCIALS_VIDEO = "2QF_sZa-qk0";
const COMMERCIALS_END = 4452;

/** [chapter start in seconds, ad name]; an ad runs until the next chapter starts. */
const ADS: [number, string][] = [
  [0, "Alcoholla"],
  [69, "Up 'n' Atom"],
  [93, "Vinewood Health"],
  [152, "San Andreas Water & Power"],
  [190, "Righteous Slaughter 7"],
  [220, "Appropriate Associates"],
  [276, "Rehab Island"],
  [325, "Fly US"],
  [346, "Sue Murry For Governor"],
  [391, "DigiFarm"],
  [440, "Whiz Wireless"],
  [482, "Pride Not Prejudice"],
  [531, "Proposition 208"],
  [564, "Serious Cougar"],
  [594, "Epsilon Program"],
  [621, "Toeshoes"],
  [647, "Hitting Kids Works Wonders"],
  [690, "San Andreas Tourism Board"],
  [743, "LS Benders"],
  [794, "Jay's Bail Bonds"],
  [836, "Ammunation Apocalypse Kit"],
  [908, "Bravado"],
  [971, "Proposition 14"],
  [1008, "Crevis"],
  [1050, "Ovine Human Resources Academy"],
  [1099, "13 Steps To Heaven"],
  [1159, "Jock Cranley For Governor"],
  [1217, "Pisswasser"],
  [1302, "Fly US"],
  [1319, "P.I.C Prison Industrial Complex"],
  [1358, "Shark Credit Cards"],
  [1405, "Life Invader Tablet"],
  [1439, "FLEECA"],
  [1482, "Proposition 208"],
  [1508, "Cuckold Therapy"],
  [1570, "Unlock The Power"],
  [1630, "San Andreas State Lottery"],
  [1657, "Righteous Slaughter 7"],
  [1714, "YouTool"],
  [1770, "Chains of Intimacy"],
  [1806, "Preservex"],
  [1848, "Toilet Cleaner"],
  [1879, "Rectify Holistic"],
  [1927, "Hammerstein & Faust Employment Law"],
  [1972, "Darwinian Yoga"],
  [2013, "13 Steps To Heaven"],
  [2037, "Pride Not Prejudice"],
  [2097, "Lorenzo O'houlihan Dream Maker"],
  [2162, "M.M.A"],
  [2203, "Windsor Real Estate"],
  [2247, "Pontius Advanced Hand Sanitizer"],
  [2300, "Flow Water"],
  [2352, "Donate Your Car"],
  [2394, "FLEECA"],
  [2440, "Egochaser Energy Bar"],
  [2492, "Proposition 43"],
  [2527, "Night Lights"],
  [2580, "Menopause Adventures"],
  [2651, "Gastro Band Surgery"],
  [2711, "Hitting Kids Works Wonders"],
  [2736, "San Andreas Flight School"],
  [2792, "LS Benders"],
  [2851, "Floyd's Scrap Metal Emporium"],
  [2904, "Fly US"],
  [2926, "Stop Paying Your Mortgage"],
  [2970, "Bravado"],
  [3004, "Implant Outsource"],
  [3042, "Los Santos Chamber of Commerce"],
  [3102, "Larry's Used RV Sales"],
  [3155, "13 Steps To Heaven"],
  [3184, "Grand Senora Desert Tourism Board"],
  [3223, "Blaine County Savings Bank"],
  [3257, "P.I.C Prison Industrial Complex"],
  [3325, "Unlock The Power"],
  [3372, "Smoked Dreams"],
  [3435, "Epsilon Program"],
  [3464, "Buddy's Trucking"],
  [3515, "Jock Cranley For Governor"],
  [3562, "Queensbury Boxing"],
  [3611, "Crevis"],
  [3651, "DigiFarm Spin-offs"],
  [3708, "Righteous Slaughter 7"],
  [3759, "Economic Recovery Group"],
  [3794, "Lombank"],
  [3858, "Proposition 45"],
  [3909, "Chains of Intimacy"],
  [3958, "Race To Pluto"],
  [3988, "Ammunation Apocalypse Kit"],
  [4070, "San Andreas State Lottery"],
  [4094, "Grain Of Truth Food Stores"],
  [4158, "Electrotoke E-Pipe"],
  [4208, "13 Steps To Heaven"],
  [4236, "Windsor Real Estate"],
  [4297, "San Andreas Labotomy"],
  [4337, "Don's Country Store"],
  [4382, "Cumulonimbus Computing"],
];

/** One thing on air: a whole song, or one ad cut out of the commercials video. */
export interface Item {
  videoId: string;
  title: string;
  /** Seconds into the video where this item begins. */
  start: number;
  /** Seconds. */
  duration: number;
  ad: boolean;
}

const AD_ITEMS: Item[] = ADS.map(([start, title], i) => ({
  videoId: COMMERCIALS_VIDEO,
  title,
  start,
  duration: (i + 1 < ADS.length ? ADS[i + 1][0] : COMMERCIALS_END) - start,
  ad: true,
}));

const SONGS_PER_BLOCK = [3, 5] as const;
const ADS_PER_BREAK = [3, 6] as const;
/** Two shuffled passes of the songs share one shuffled pass of every ad, which keeps breaks within 3-6 ads. */
const SONG_PASSES = 2;
const sum = (items: Item[]) => items.reduce((s, it) => s + it.duration, 0);

/** The broadcast "went on air" here; changing it reshuffles everyone's schedule. */
const ON_AIR = Date.UTC(2024, 0, 1);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Splits `total` into `n` random sizes, each within [min, max]. Needs n*min <= total <= n*max. */
function split(total: number, n: number, [min, max]: readonly [number, number], rand: () => number): number[] {
  const sizes = new Array<number>(n).fill(min);
  let rem = total - n * min;
  while (rem > 0) {
    const i = Math.floor(rand() * n);
    if (sizes[i] < max) {
      sizes[i] += 1;
      rem -= 1;
    }
  }
  return sizes;
}

/** A playlist's endless schedule, with or without ad breaks. */
export interface Broadcast {
  songs: Item[];
  ads: boolean;
  /** Every program contains the same items, so its length is fixed and any moment maps straight to one. */
  length: number;
  cachedProgram: number;
  cachedItems: Item[];
}

const broadcasts: Record<string, Broadcast> = {};

export function broadcastFor(playlistId: string, ads: boolean): Broadcast | null {
  const tracks = PLAYLIST_TRACKS[playlistId];
  if (!tracks) return null;
  const key = `${playlistId}:${ads ? "ads" : "no-ads"}`;
  if (!broadcasts[key]) {
    const songs = tracks.map((t) => ({ videoId: t.id, title: t.title, start: 0, duration: t.duration, ad: false }));
    broadcasts[key] = {
      songs,
      ads,
      length: SONG_PASSES * sum(songs) + (ads ? sum(AD_ITEMS) : 0),
      cachedProgram: -1,
      cachedItems: [],
    };
  }
  return broadcasts[key];
}

/** One full program: song blocks and ad breaks alternating, freshly shuffled each time round. */
function programFor(b: Broadcast, index: number): Item[] {
  if (index === b.cachedProgram) return b.cachedItems;
  const rand = mulberry32(index * 2654435761 + 0x5eed);
  const songs: Item[] = [];
  for (let pass = 0; pass < SONG_PASSES; pass++) songs.push(...shuffled(b.songs, rand));
  let items: Item[];
  if (!b.ads) {
    items = songs;
  } else {
    const ads = shuffled(AD_ITEMS, rand);
    const fewest = Math.max(Math.ceil(songs.length / SONGS_PER_BLOCK[1]), Math.ceil(ads.length / ADS_PER_BREAK[1]));
    const most = Math.min(Math.floor(songs.length / SONGS_PER_BLOCK[0]), Math.floor(ads.length / ADS_PER_BREAK[0]));
    const breaks = fewest + Math.floor(rand() * (most - fewest + 1));
    const blockSizes = split(songs.length, breaks, SONGS_PER_BLOCK, rand);
    const breakSizes = split(ads.length, breaks, ADS_PER_BREAK, rand);
    items = [];
    let s = 0;
    let a = 0;
    for (let k = 0; k < breaks; k++) {
      for (let j = 0; j < blockSizes[k]; j++) items.push(songs[s++]);
      for (let j = 0; j < breakSizes[k]; j++) items.push(ads[a++]);
    }
  }
  b.cachedProgram = index;
  b.cachedItems = items;
  return items;
}

export interface Slot {
  item: Item;
  /** Seconds into the item. */
  offset: number;
  /** Epoch ms at which this item started on air. */
  startMs: number;
}

/** What is on air at `nowMs`. */
export function slotAt(b: Broadcast, nowMs: number): Slot {
  const t = (nowMs - ON_AIR) / 1000;
  const index = Math.floor(t / b.length);
  let rem = t - index * b.length;
  const items = programFor(b, index);
  for (let i = 0; i < items.length; i++) {
    const d = items[i].duration;
    if (rem < d) return { item: items[i], offset: rem, startMs: nowMs - rem * 1000 };
    rem -= d;
  }
  const last = items[items.length - 1];
  return { item: last, offset: last.duration, startMs: nowMs - last.duration * 1000 };
}

/** The slot that follows the one starting at `startMs`. */
export function nextSlot(b: Broadcast, slot: Slot): Slot {
  const boundary = slot.startMs + slot.item.duration * 1000 + 1;
  return { ...slotAt(b, boundary), offset: 0 };
}

let clockOffset = 0;
let clockSynced: Promise<void> | null = null;

/** Corrects for a wrong device clock using the server's time, so devices agree. */
export function syncRadioClock(): Promise<void> {
  if (!clockSynced) {
    clockSynced = (async () => {
      try {
        const sent = Date.now();
        const res = await fetch("/api/radio-clock", { cache: "no-store" });
        const { now } = (await res.json()) as { now: number };
        const received = Date.now();
        clockOffset = now + (received - sent) / 2 - received;
      } catch {
        clockOffset = 0;
      }
    })();
  }
  return clockSynced;
}

export function radioNow(): number {
  return Date.now() + clockOffset;
}

/** Long mixes have no published schedule, so everyone joins at the same point of a clock-derived loop. */
export const loopOffset = (duration: number) => (duration > 0 ? (radioNow() / 1000) % duration : 0);
