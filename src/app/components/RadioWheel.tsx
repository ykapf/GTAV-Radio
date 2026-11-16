"use client";

import React, { useState, useEffect, CSSProperties, ReactNode, useRef, useCallback } from "react";
import Papa from "papaparse";
import { AD_SETS, AdSet, Broadcast, Item, MIX_LENGTHS, Slot, Track, broadcastFor, loopOffset, nextSlot, radioNow, slotAt, syncRadioClock } from "../lib/broadcast";
import { audioUrl, fileForItem, fileForMix, gameFolder, loadAudioManifest } from "../lib/audio";
import { GameId, gameById } from "../lib/games";
import GamePicker from "./GamePicker";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

type Station = {
  name: string;
  description: string;
  image: string;
  link: string;
  type: "v" | "p" | "a"; // "v" is a single long video, "p" is a playlist, "a" is an audio file in /public
  playlistId?: string;
};

/** off: silence · video: one long mix on a shared loop · broadcast: a playlist on the synced schedule · playlist: a playlist with no known track list · audio: a hosted audio file on a shared loop */
type Mode = "off" | "video" | "broadcast" | "playlist" | "audio";

/** The scheduled song or ad on air, and when this device asked for it. */
type OnAir = { item: Item; startMs: number; loadedAt: number };

/** Which player makes the sound: YouTube's frame, or the page's own audio element (MP3s and the GTA VI previews). */
type Engine = "yt" | "audio";

/** auto: MP3 when it starts quickly, otherwise YouTube · mp3: always MP3 where uploaded · youtube: never MP3. */
type Source = "auto" | "mp3" | "youtube";

type RadioWheelProps = {
  game: GameId;
  /** This game's song lists, keyed by playlist id. */
  tracks: Record<string, Track[]>;
  /** Playlist ids of talk stations, which keep their segments in order. */
  talk?: string[];
  /** Songs heard in each station's preview, keyed by station name. */
  previews?: Record<string, string[]>;
  /** Shown between the top bar and the radio. */
  banner?: ReactNode;
};

/** The one radio on the page plays from its game's library; each game is its own page. */
const library: { tracks: Record<string, Track[]>; talk: Set<string>; adSet: AdSet | null; folder: string } = {
  tracks: {},
  talk: new Set(),
  adSet: null,
  folder: "",
};

const RADIO_OFF = "Radio Off";
const ADS_STORAGE_KEY = "gtav-radio:ad-breaks";
const VOLUME_STORAGE_KEY = "gtav-radio:volume";
const MUTED_STORAGE_KEY = "gtav-radio:muted";
const SOURCE_STORAGE_KEY = "gtav-radio:source";
const SOURCES: Source[] = ["auto", "mp3", "youtube"];

/** Storage can be blocked (private mode, strict settings); settings then just last for this visit. */
function readSetting(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}
const INVALID_LINK = "Invalid link";
const DRIFT_LIMIT_S = 2.5;
const DRIFT_CHECK_MS = 10_000;
/** A freshly loaded video needs a moment to buffer before its position means anything. */
const SETTLE_MS = 3000;
/** Listed lengths are rounded, so an ENDED this close to the slot's end is the real end. */
const END_SLACK_S = 3;
/** `endSeconds` doesn't always fire ENDED, so a slot this far past its end moves on regardless. */
const BOUNDARY_GRACE_S = 0.75;
const WATCH_MS = 1000;
const LOAD_TIMEOUT_MS = 8000;
const MAX_RETRY_BACKOFF = 4;
const STALL_CHECKS = 2;
const MAX_SKIPS = 5;
/** In Auto, an MP3 that hasn't started by now hands the station to YouTube. */
const MP3_TIMEOUT_MS = 3000;
/** This many MP3 failures in a row means the storage is unreachable, so the visit carries on from YouTube. */
const MAX_MP3_ERRORS = 3;
/** Reloads of a failed MP3 while the phone is locked, before it gives up and falls back to YouTube. */
const HIDDEN_MP3_RETRIES = 2;
/** After this many slow stations, Auto stops trying MP3s for the rest of the visit. */
const MAX_SLOW_STATIONS = 2;

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const PLAYLIST_ID = /^[A-Za-z0-9_-]{10,}$/;

const iconPath = (station: Station) => `/radio_icons/${station.image}`;

/** Accepts a bare video id or a full YouTube / youtu.be URL. */
function videoIdOf(link: string): string | null {
  if (VIDEO_ID.test(link)) return link;
  try {
    const url = new URL(link);
    const id = url.hostname.endsWith("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") ?? "";
    return VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

function modeOf(station: Station | null): Mode {
  if (!station || station.name === RADIO_OFF) return "off";
  if (station.type === "a") return "audio";
  if (station.type === "p") return station.playlistId && library.tracks[station.playlistId] ? "broadcast" : "playlist";
  return "video";
}

const broadcastOf = (station: Station | null, ads: boolean): Broadcast | null =>
  station?.playlistId ? broadcastFor(station.playlistId, ads ? library.adSet : null, library.tracks, library.talk.has(station.playlistId)) : null;

function fileOfItem(station: Station | null, item: Item): string | null {
  if (!station) return null;
  return fileForItem(library.folder, station.name, item, station.playlistId ? library.tracks[station.playlistId] : undefined, library.adSet);
}

function fileOfMix(station: Station): string | null {
  const videoId = videoIdOf(station.link);
  return videoId ? fileForMix(library.folder, station.name, videoId, library.adSet) : null;
}

function hasValidLink(station: Station) {
  const mode = modeOf(station);
  if (mode === "off") return true;
  if (mode === "video") return videoIdOf(station.link) !== null;
  if (mode === "audio") return station.link.startsWith("/");
  return PLAYLIST_ID.test(station.playlistId ?? "");
}

let youTubeApi: Promise<any> | null = null;

/** Loads the YouTube IFrame API once and resolves with `window.YT` when it's usable. */
function loadYouTubeApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youTubeApi) {
    youTubeApi = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    });
  }
  return youTubeApi;
}

const segmentClass = (active: boolean) =>
  `h-12 px-4 text-xs uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current ${
    active ? "bg-cream text-black" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
  }`;

const DEFAULT_VOLUME = 50;
const VOLUME_STEP = 5;
const VOLUME_CLOSE_MS = 1200;
/** Touch devices leave loudness to the phone's own volume buttons. */
const FINE_POINTER_QUERY = "(pointer: fine)";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" />
      ) : (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

type VolumeControlProps = {
  volume: number;
  muted: boolean;
  onToggleMute: () => void;
  onVolume: (value: number) => void;
  /** Which side of the mute button the volume panel pops out on. */
  placement?: "above" | "below";
  className?: string;
};

/** Square mute button that opens a slim vertical volume panel on hover, as on the portfolio radio. */
function VolumeControl({ volume, muted, onToggleMute, onVolume, placement = "below", className = "" }: VolumeControlProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => setFinePointer(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (muted) setOpen(false);
  }, [muted]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const openPanel = () => {
    window.clearTimeout(closeTimer.current);
    if (finePointer && !muted) setOpen(true);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), VOLUME_CLOSE_MS);
  };

  const toggle = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(muted && finePointer);
    onToggleMute();
  };

  const volumeFromPointer = (clientY: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (r) onVolume(Math.round(clamp01(1 - (clientY - r.top) / r.height) * 100));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const delta: Record<string, number> = { ArrowUp: VOLUME_STEP, ArrowRight: VOLUME_STEP, ArrowDown: -VOLUME_STEP, ArrowLeft: -VOLUME_STEP };
    if (e.key in delta) onVolume(Math.max(0, Math.min(100, volume + delta[e.key])));
    else if (e.key === "Home") onVolume(0);
    else if (e.key === "End") onVolume(100);
    else if (e.key === "Escape") setOpen(false);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={`relative shrink-0 ${className}`}
      onMouseEnter={openPanel}
      onMouseLeave={() => {
        if (!dragging) scheduleClose();
      }}
      onFocus={openPanel}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) scheduleClose();
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Unmute radio" : "Mute radio"}
        className="flex h-12 w-12 items-center justify-center border border-cream text-cream transition-colors duration-150 hover:bg-cream hover:text-black focus-visible:bg-cream focus-visible:text-black focus-visible:outline-none motion-reduce:transition-none"
      >
        <SpeakerIcon muted={muted} />
      </button>

      {open && (
        <div
          role="slider"
          tabIndex={0}
          aria-label="Radio volume"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volume}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            volumeFromPointer(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging) volumeFromPointer(e.clientY);
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            setDragging(false);
            if (!rootRef.current?.matches(":hover")) scheduleClose();
          }}
          onPointerCancel={() => setDragging(false)}
          className={`absolute left-1/2 z-30 h-[180px] w-9 -translate-x-1/2 touch-none border border-cream/70 bg-black/85 text-cream outline-none backdrop-blur-md focus-visible:border-cream ${
            placement === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <div className="flex h-9 items-center justify-center text-[13px] font-bold leading-none tabular-nums">{volume}</div>
          <div ref={trackRef} className="absolute left-1/2 top-[39px] h-[120px] w-3 -translate-x-1/2 overflow-hidden bg-cream/15">
            <div className="absolute inset-x-0 bottom-0 bg-white transition-[height] duration-75 motion-reduce:transition-none" style={{ height: `${volume}%` }} />
            <div
              className="absolute inset-x-0 h-[3px] bg-white"
              style={{ bottom: `calc(${volume}% - 1.5px)`, boxShadow: dragging ? "0 0 6px 1px rgba(255,255,255,0.8)" : "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

type Timing = { elapsed: number; duration: number } | null;

const pad2 = (n: number) => String(n).padStart(2, "0");

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s / 60) % 60;
  return h ? `${h}:${pad2(m)}:${pad2(s % 60)}` : `${m}:${pad2(s % 60)}`;
}

/** Progress bar plus elapsed / total time for whatever is on air, read every frame from the player. */
function Progress({ getTiming, className = "" }: { getTiming: () => Timing; className?: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      const t = getTiming();
      const known = t !== null && t.duration > 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${known ? clamp01(t.elapsed / t.duration) : 0})`;
      const elapsed = known ? clock(Math.min(t.elapsed, t.duration)) : "-:--";
      const total = known ? clock(t.duration) : "-:--";
      if (elapsedRef.current && elapsedRef.current.textContent !== elapsed) elapsedRef.current.textContent = elapsed;
      if (totalRef.current && totalRef.current.textContent !== total) totalRef.current.textContent = total;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [getTiming]);

  return (
    <div aria-hidden="true" className={className}>
      <div className="h-1.5 w-full bg-cream/20">
        <div ref={barRef} className="h-full w-full origin-left bg-cream" style={{ transform: "scaleX(0)" }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] tabular-nums text-cream/60">
        <span ref={elapsedRef}>-:--</span>
        <span ref={totalRef}>-:--</span>
      </div>
    </div>
  );
}

type AdBreakToggleProps = {
  on: boolean;
  onChange: (on: boolean) => void;
  label: string;
  className?: string;
};

function AdBreakToggle({ on, onChange, label, className = "" }: AdBreakToggleProps) {
  return (
    <div role="group" aria-label="Ad breaks" className={`flex shrink-0 items-center border border-cream/25 ${className}`}>
      <span aria-hidden="true" className="px-3 text-[10px] uppercase tracking-[0.3em] text-cream/50">
        {label}
      </span>
      <button type="button" aria-pressed={on} onClick={() => onChange(true)} className={`border-l border-cream/25 ${segmentClass(on)}`}>
        On
      </button>
      <button type="button" aria-pressed={!on} onClick={() => onChange(false)} className={`border-l border-cream/25 ${segmentClass(!on)}`}>
        Off
      </button>
    </div>
  );
}

/** Square one-tap ad breaks switch for small screens, styled like the mute button; struck through when off. */
function AdBreakButton({ on, onChange, className = "" }: Omit<AdBreakToggleProps, "label">) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Ad breaks on. Turn off" : "Ad breaks off. Turn on"}
      onClick={() => onChange(!on)}
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center border border-cream text-cream transition-colors duration-150 hover:bg-cream hover:text-black focus-visible:bg-cream focus-visible:text-black focus-visible:outline-none motion-reduce:transition-none ${className}`}
    >
      <span aria-hidden="true" className={`text-[11px] font-bold uppercase leading-none tracking-[0.1em] ${on ? "" : "opacity-60"}`}>
        Ads
      </span>
      {!on && (
        <svg aria-hidden="true" viewBox="0 0 48 48" className="pointer-events-none absolute inset-0 h-full w-full">
          <line x1="10" y1="38" x2="38" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      )}
    </button>
  );
}

type SourceControlProps = {
  source: Source;
  onChange: (source: Source) => void;
  className?: string;
};

/** Auto / MP3 / YouTube switch. */
function SourceToggle({ source, onChange, className = "" }: SourceControlProps) {
  return (
    <div role="group" aria-label="Audio source" className={`flex shrink-0 items-center border border-cream/25 ${className}`}>
      <span aria-hidden="true" className="px-3 text-[10px] uppercase tracking-[0.3em] text-cream/50">
        Source
      </span>
      {SOURCES.map((choice) => (
        <button
          key={choice}
          type="button"
          aria-pressed={source === choice}
          onClick={() => onChange(choice)}
          className={`border-l border-cream/25 ${segmentClass(source === choice)}`}
        >
          {SOURCE_NAMES[choice]}
        </button>
      ))}
    </div>
  );
}

const SOURCE_NAMES: Record<Source, string> = { auto: "Auto", mp3: "MP3", youtube: "YouTube" };
const SOURCE_SHORT: Record<Source, string> = { auto: "Auto", mp3: "MP3", youtube: "YT" };

/** Square one-tap source switch for small screens: Auto → MP3 → YouTube. */
function SourceButton({ source, onChange, className = "" }: SourceControlProps) {
  const next = SOURCES[(SOURCES.indexOf(source) + 1) % SOURCES.length];
  return (
    <button
      type="button"
      aria-label={`Audio source: ${SOURCE_NAMES[source]}. Switch to ${SOURCE_NAMES[next]}`}
      onClick={() => onChange(next)}
      className={`flex h-12 w-12 shrink-0 items-center justify-center border border-cream text-cream transition-colors duration-150 hover:bg-cream hover:text-black focus-visible:bg-cream focus-visible:text-black focus-visible:outline-none motion-reduce:transition-none ${className}`}
    >
      <span aria-hidden="true" className={`text-[11px] font-bold uppercase leading-none tracking-[0.1em] ${source === "auto" ? "opacity-60" : ""}`}>
        {SOURCE_SHORT[source]}
      </span>
    </button>
  );
}

export default function RadioWheel({ game: gameId, tracks, talk = [], previews, banner }: RadioWheelProps) {
  const game = gameById(gameId);
  library.tracks = tracks;
  library.talk = new Set(talk);
  library.adSet = game.ads ? AD_SETS[game.id] ?? null : null;
  library.folder = gameFolder(game.href);

  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [adsOn, setAdsOn] = useState(game.ads);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  /** Title YouTube reports for the playlist song on air. */
  const [liveTitle, setLiveTitle] = useState<string | null>(null);

  const [isWheelVisible, setIsWheelVisible] = useState(true); // Default is true to show the wheel initially

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  /** Plays the hosted audio stations; YouTube handles everything else. */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const readyRef = useRef(false);
  const stationRef = useRef<Station | null>(null);
  /** What to fall back to when a picked station's link turns out to be dead. */
  const prevStationRef = useRef<Station | null>(null);
  const adsRef = useRef(game.ads);
  const currentRef = useRef<OnAir | null>(null);
  /** Set while a long mix is loading; it stays muted until the first PLAYING event has seeked onto the shared loop. */
  const pendingLoopSync = useRef(false);
  /** Set when the listener pauses from the lock screen or headphones, so the stall watcher leaves it paused. */
  const pausedRef = useRef(false);
  /** Whether the current song or ad has started; only one that never started counts as a failed load. */
  const startedRef = useRef(false);
  const retriesRef = useRef(0);
  const skipsRef = useRef(0);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const tuneRef = useRef<(station: Station | null, remember?: boolean) => void>(() => {});

  const engineRef = useRef<Engine>("yt");
  const [engine, setEngine] = useState<Engine>("yt");
  /** The audio element either loops a whole file (previews, talk mixes) or plays one scheduled item at a time. */
  const audioLoopRef = useRef(false);
  /** Muted until the audio element has jumped to the live point, so the top of a file never leaks out. */
  const seekPendingRef = useRef(false);
  /** The MP3 on the audio element, relative to the audio base; null for the GTA VI previews, which have no YouTube fallback. */
  const audioFileRef = useRef<string | null>(null);
  const audioLoadedAtRef = useRef(0);
  /** The browser refused to start sound before the visitor interacted; that isn't a slow MP3. */
  const playBlockedRef = useRef(false);
  const mp3TimerRef = useRef(0);
  const sourceRef = useRef<Source>("auto");
  const [source, setSource] = useState<Source>("auto");
  /** Uploaded MP3s and their lengths, from the audio manifest. */
  const filesRef = useRef<Record<string, number>>({});
  const [hasMp3, setHasMp3] = useState(false);
  /** MP3s that failed to load this visit; their songs play from YouTube. */
  const failedFilesRef = useRef(new Set<string>());
  const mp3ErrorsRef = useRef(0);
  /** In Auto, a station whose MP3 was too slow stays on YouTube until another station is picked. */
  const fallbackStationRef = useRef<string | null>(null);
  const slowCountRef = useRef(0);

  /** Pushes the current volume and mute state to both players; each stays silent until it has joined the live point. */
  const applySound = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volumeRef.current / 100;
      audio.muted = mutedRef.current || seekPendingRef.current;
    }
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    player.setVolume(volumeRef.current);
    if (mutedRef.current || pendingLoopSync.current) player.mute();
    else player.unMute();
  }, []);

  const blocked = useCallback((error: unknown) => {
    if ((error as { name?: string })?.name === "NotAllowedError") playBlockedRef.current = true;
  }, []);

  /** Whether this file should play from MP3 rather than YouTube, given the listener's choice and how MP3s have gone this visit. */
  const mp3Ok = useCallback((file: string | null): file is string => {
    if (!file || !audioRef.current || sourceRef.current === "youtube") return false;
    if (filesRef.current[file] === undefined || failedFilesRef.current.has(file) || mp3ErrorsRef.current >= MAX_MP3_ERRORS) return false;
    if (sourceRef.current === "auto" && (fallbackStationRef.current === stationRef.current?.name || slowCountRef.current >= MAX_SLOW_STATIONS)) return false;
    return true;
  }, []);

  const stopAudio = useCallback(() => {
    window.clearTimeout(mp3TimerRef.current);
    audioFileRef.current = null;
    seekPendingRef.current = false;
    const audio = audioRef.current;
    if (!audio || !audio.getAttribute("src")) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  const switchEngine = useCallback(
    (next: Engine) => {
      const previous = engineRef.current;
      engineRef.current = next;
      setEngine(next);
      if (previous === next) return;
      if (next === "yt") stopAudio();
      else if (playerRef.current && readyRef.current) playerRef.current.stopVideo();
    },
    [stopAudio],
  );

  /** In Auto, hands the station to YouTube if its MP3 hasn't started within a few seconds. */
  const armMp3Timer = useCallback(() => {
    window.clearTimeout(mp3TimerRef.current);
    if (!audioFileRef.current || sourceRef.current !== "auto") return;
    mp3TimerRef.current = window.setTimeout(() => {
      const station = stationRef.current;
      if (!station || engineRef.current !== "audio" || startedRef.current || playBlockedRef.current || pausedRef.current) return;
      // A locked phone won't start YouTube, so a slow MP3 is left to the watcher's reload instead.
      if (document.hidden) return;
      fallbackStationRef.current = station.name;
      slowCountRef.current += 1;
      tuneRef.current(station, false);
    }, MP3_TIMEOUT_MS);
  }, []);

  /** Loads a file into the audio element; it plays muted until its metadata is in and it has jumped to the live point. */
  const startAudio = useCallback(
    (url: string, file: string | null, loop: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      switchEngine("audio");
      audio.loop = loop;
      audioLoopRef.current = loop;
      audioFileRef.current = file;
      audioLoadedAtRef.current = Date.now();
      seekPendingRef.current = true;
      startedRef.current = false;
      applySound();
      audio.src = url;
      // Started inside the click (or lock-screen press) so the browser lets it play; the seek follows once the length is known.
      audio.play().catch(blocked);
      armMp3Timer();
    },
    [switchEngine, applySound, blocked, armMp3Timer],
  );

  /** One request: the MP3, or YouTube, loads the song or ad straight at the second the schedule is up to. */
  const playSlot = useCallback(
    (slot: Slot) => {
      if (modeOf(stationRef.current) !== "broadcast") return;
      currentRef.current = { item: slot.item, startMs: slot.startMs, loadedAt: Date.now() };
      startedRef.current = false;
      setItem(slot.item);
      const file = fileOfItem(stationRef.current, slot.item);
      const audio = audioRef.current;
      if (audio && mp3Ok(file)) {
        if (engineRef.current === "audio" && audioFileRef.current === file && audio.readyState >= 1 && !seekPendingRef.current) {
          // Ads share one commercials file, so moving between them (or rejoining live) is just a seek.
          const target = slot.item.start + Math.max(0, (radioNow() - slot.startMs) / 1000);
          if (Math.abs(audio.currentTime - target) > 1) audio.currentTime = target;
          if (audio.paused) audio.play().catch(blocked);
          startedRef.current = !audio.paused;
          audioLoadedAtRef.current = Date.now();
          armMp3Timer();
          return;
        }
        // The #t fragment has the browser fetch from the live point, not the top of a long file like the commercials.
        const at = slot.item.start + Math.max(0, (radioNow() - slot.startMs) / 1000);
        startAudio(audioUrl(file) + (at > 1 ? `#t=${at.toFixed(1)}` : ""), file, false);
        return;
      }
      switchEngine("yt");
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      const { videoId, start, duration, ad } = slot.item;
      const offset = Math.min(Math.max(0, (radioNow() - slot.startMs) / 1000), Math.max(0, duration - 1));
      applySound();
      player.loadVideoById({ videoId, startSeconds: start + offset, endSeconds: ad ? start + duration : undefined });
    },
    [applySound, blocked, mp3Ok, armMp3Timer, startAudio, switchEngine],
  );

  /** Joins whatever the station's schedule has on air right now. */
  const playNow = useCallback(() => {
    const b = broadcastOf(stationRef.current, adsRef.current);
    if (b) playSlot(slotAt(b, radioNow()));
  }, [playSlot]);

  /** Re-seeks only once the video has settled and this device has clearly wandered from the schedule. */
  const checkDrift = useCallback(() => {
    const audio = audioRef.current;
    if (engineRef.current === "audio") {
      if (!audio || audio.paused || seekPendingRef.current || !(audio.duration > 0)) return;
      if (audioLoopRef.current) {
        const expected = loopOffset(audio.duration);
        const gap = Math.abs(audio.currentTime - expected);
        if (Math.min(gap, audio.duration - gap) > DRIFT_LIMIT_S) audio.currentTime = expected;
        return;
      }
      const cur = currentRef.current;
      if (!cur || modeOf(stationRef.current) !== "broadcast") return;
      const expected = (radioNow() - cur.startMs) / 1000;
      if (expected >= cur.item.duration + BOUNDARY_GRACE_S) return playNow();
      if (expected < 0 || Date.now() - cur.loadedAt < SETTLE_MS) return;
      const actual = audio.currentTime - cur.item.start;
      if (Math.abs(actual - expected) > DRIFT_LIMIT_S && cur.item.start + expected < audio.duration - 1) audio.currentTime = cur.item.start + expected;
      return;
    }
    const player = playerRef.current;
    const cur = currentRef.current;
    if (!player || !readyRef.current || !cur || modeOf(stationRef.current) !== "broadcast") return;
    const expected = (radioNow() - cur.startMs) / 1000;
    if (expected >= cur.item.duration || expected < -(END_SLACK_S + 1)) return playNow();
    if (expected < 0 || Date.now() - cur.loadedAt < SETTLE_MS) return;
    if (player.getPlayerState?.() !== window.YT?.PlayerState?.PLAYING) return;
    if (player.getVideoData?.()?.video_id !== cur.item.videoId) return;
    const actual = (player.getCurrentTime?.() ?? 0) - cur.item.start;
    if (Math.abs(actual - expected) > DRIFT_LIMIT_S) player.seekTo(cur.item.start + expected, true);
  }, [playNow]);

  /** How far into the current song, ad or mix we are. */
  const getTiming = useCallback((): Timing => {
    const mode = modeOf(stationRef.current);
    if (mode === "broadcast") {
      const cur = currentRef.current;
      return cur ? { elapsed: (radioNow() - cur.startMs) / 1000, duration: cur.item.duration } : null;
    }
    if (engineRef.current === "audio") {
      const audio = audioRef.current;
      return audio && !seekPendingRef.current && audio.duration > 0 ? { elapsed: audio.currentTime, duration: audio.duration } : null;
    }
    const player = playerRef.current;
    if (mode === "off" || pendingLoopSync.current || !player || !readyRef.current) return null;
    return { elapsed: player.getCurrentTime?.() ?? 0, duration: player.getDuration?.() ?? 0 };
  }, []);

  /** Puts a station on air, joining wherever its shared clock says it is right now. */
  const tune = useCallback(
    (station: Station | null, remember = true) => {
      if (remember && stationRef.current && stationRef.current.name !== station?.name) prevStationRef.current = stationRef.current;
      if (stationRef.current?.name !== station?.name) fallbackStationRef.current = null;
      stationRef.current = station;
      setSelectedStation(station);
      const player = playerRef.current;
      const ready = player && readyRef.current;
      const mode = modeOf(station);
      pendingLoopSync.current = false;
      pausedRef.current = false;
      retriesRef.current = 0;
      skipsRef.current = 0;
      currentRef.current = null;
      window.clearTimeout(mp3TimerRef.current);
      setItem(null);
      setLiveTitle(null);
      if (mode === "audio" && station) return startAudio(station.link, null, true);
      if (mode === "broadcast") return playNow();
      if (mode === "video" && station) {
        const file = fileOfMix(station);
        if (mp3Ok(file)) return startAudio(audioUrl(file), file, true);
      }
      switchEngine("yt");
      if (mode === "video" && station) {
        const videoId = videoIdOf(station.link);
        const length = videoId ? MIX_LENGTHS[videoId] : undefined;
        if (length) {
          if (ready) {
            applySound();
            player.loadVideoById({ videoId, startSeconds: loopOffset(length) });
          }
        } else {
          pendingLoopSync.current = true;
          if (ready) {
            // Muted until the first PLAYING event has seeked onto the shared loop, so the top of the mix never leaks out.
            player.mute();
            player.loadVideoById({ videoId, startSeconds: 0 });
          }
        }
      } else if (mode === "playlist" && station) {
        if (ready) {
          applySound();
          player.loadPlaylist({ listType: "playlist", list: station.playlistId, index: 0 });
        }
      } else if (ready) {
        player.stopVideo();
      }
    },
    [playNow, applySound, startAudio, mp3Ok, switchEngine],
  );
  tuneRef.current = tune;

  const markInvalid = (name: string) => setInvalid((list) => (list.includes(name) ? list : [...list, name]));

  const pickStation = (station: Station) => {
    if (!hasValidLink(station)) {
      markInvalid(station.name);
      setNotice(station.name);
      return;
    }
    setInvalid((list) => list.filter((n) => n !== station.name));
    setNotice(null);
    tune(station);
  };

  const changeAds = (on: boolean) => {
    setAdsOn(on);
    adsRef.current = on;
    saveSetting(ADS_STORAGE_KEY, on ? "on" : "off");
    if (modeOf(stationRef.current) === "broadcast") playNow();
  };

  const changeSource = (next: Source) => {
    sourceRef.current = next;
    setSource(next);
    saveSetting(SOURCE_STORAGE_KEY, next);
    // A fresh choice gets a fresh try at MP3s that were slow or unreachable earlier.
    fallbackStationRef.current = null;
    slowCountRef.current = 0;
    mp3ErrorsRef.current = 0;
    const station = stationRef.current;
    const mode = modeOf(station);
    if (station && (mode === "broadcast" || mode === "video")) tune(station, false);
  };

  useEffect(() => {
    if (game.ads && readSetting(ADS_STORAGE_KEY) === "off") {
      adsRef.current = false;
      setAdsOn(false);
    }
    const savedVolume = Number(readSetting(VOLUME_STORAGE_KEY));
    if (readSetting(VOLUME_STORAGE_KEY) !== null && Number.isFinite(savedVolume)) {
      const value = Math.min(100, Math.max(0, Math.round(savedVolume)));
      volumeRef.current = value;
      setVolume(value);
    }
    if (readSetting(MUTED_STORAGE_KEY) === "true") {
      mutedRef.current = true;
      setMuted(true);
    }
    const savedSource = readSetting(SOURCE_STORAGE_KEY) as Source | null;
    if (savedSource && SOURCES.includes(savedSource)) {
      sourceRef.current = savedSource;
      setSource(savedSource);
    }
  }, [game.ads]);

  useEffect(() => {
    if (selectedStation) saveSetting(game.stationKey, selectedStation.name);
  }, [selectedStation, game.stationKey]);

  // Only MP3s and the GTA VI previews play in this page. YouTube plays inside YouTube's frame, which runs its own
  // lock-screen controls; claiming the session here as well makes iOS drop them a moment after the phone locks.
  const ownsSession = !!selectedStation && engine === "audio";

  useEffect(() => {
    if (!("mediaSession" in navigator) || !ownsSession) return;
    const session = navigator.mediaSession;
    // Play rejoins the preview live, like turning a radio back on.
    const pause = () => {
      pausedRef.current = true;
      audioRef.current?.pause();
      session.playbackState = "paused";
    };
    const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => stationRef.current && tuneRef.current(stationRef.current, false)],
      ["pause", pause],
      ["stop", pause],
    ];
    for (const [action, handler] of actions) {
      try {
        session.setActionHandler(action, handler);
      } catch {}
    }
    return () => {
      for (const [action] of actions) {
        try {
          session.setActionHandler(action, null);
        } catch {}
      }
      session.metadata = null;
      session.playbackState = "none";
    };
  }, [ownsSession]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    const session = navigator.mediaSession;
    if (!ownsSession || !selectedStation) return;
    const track = item ? (item.news ? `Weazel News ${item.title}` : item.ad ? `Ad break: ${item.title}` : item.title) : modeOf(selectedStation) === "playlist" ? liveTitle : null;
    const icon = new URL(iconPath(selectedStation), window.location.origin).href;
    session.metadata = new MediaMetadata({
      title: track || selectedStation.name,
      artist: track ? selectedStation.name : selectedStation.description,
      album: game.title,
      artwork: [{ src: icon, sizes: "512x512" }],
    });
    session.playbackState = "playing";
  }, [ownsSession, selectedStation, item, liveTitle, game.title]);

  // Browsers often block sound until the visitor interacts, so a restored station may load silently; the first click or key press starts it.
  useEffect(() => {
    const stop = () => {
      window.removeEventListener("pointerdown", resume, true);
      window.removeEventListener("keydown", resume, true);
    };
    const resume = () => {
      const audio = audioRef.current;
      if (engineRef.current === "audio" && audio) {
        stop();
        // A blocked start has fallen behind the clock, so this rejoins live rather than resuming where it sat.
        if (audio.paused && stationRef.current) tuneRef.current(stationRef.current, false);
        return;
      }
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      stop();
      if (!stationRef.current || modeOf(stationRef.current) === "off") return;
      if (player.getPlayerState?.() !== window.YT?.PlayerState?.PLAYING) tuneRef.current(stationRef.current, false);
    };
    window.addEventListener("pointerdown", resume, true);
    window.addEventListener("keydown", resume, true);
    return stop;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const host = document.createElement("div");
    hostRef.current?.appendChild(host);

    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    /** Jumps a freshly loaded file to the live point: the shared loop for whole files, the scheduled second for songs and ads. */
    const onAudioReady = () => {
      if (engineRef.current !== "audio" || !seekPendingRef.current) return;
      if (audioLoopRef.current) {
        audio.currentTime = loopOffset(audio.duration);
      } else {
        const cur = currentRef.current;
        if (!cur) return;
        const room = Math.max(0, Math.min(cur.item.duration, audio.duration - cur.item.start) - 0.5);
        audio.currentTime = cur.item.start + Math.min(Math.max(0, (radioNow() - cur.startMs) / 1000), room);
      }
      seekPendingRef.current = false;
      applySound();
      if (!pausedRef.current) audio.play().catch(blocked);
    };
    const onAudioStarted = () => {
      if (engineRef.current !== "audio" || seekPendingRef.current || audio.paused || startedRef.current) return;
      startedRef.current = true;
      playBlockedRef.current = false;
      retriesRef.current = 0;
      if (audioFileRef.current) mp3ErrorsRef.current = 0;
      window.clearTimeout(mp3TimerRef.current);
    };
    /** Moves on to the next scheduled item; on a locked phone this keeps the same audio element going, so iOS lets it play. */
    const advance = () => {
      const cur = currentRef.current;
      const b = broadcastOf(stationRef.current, adsRef.current);
      if (!cur || !b || modeOf(stationRef.current) !== "broadcast") return;
      playSlot(nextSlot(b, { item: cur.item, startMs: cur.startMs, offset: 0 }));
    };
    const onAudioTime = () => {
      onAudioStarted();
      if (engineRef.current !== "audio" || audioLoopRef.current || seekPendingRef.current || audio.paused) return;
      // Ads end part-way through the commercials file, and a song's MP3 may run a little past its YouTube length.
      const cur = currentRef.current;
      if (cur && audio.currentTime >= cur.item.start + cur.item.duration) advance();
    };
    const onAudioEnded = () => {
      if (engineRef.current === "audio" && !audioLoopRef.current && !seekPendingRef.current) advance();
    };
    const onAudioError = () => {
      const failed = stationRef.current;
      if (!failed || engineRef.current !== "audio" || !audio.getAttribute("src")) return;
      seekPendingRef.current = false;
      const file = audioFileRef.current;
      if (file && document.hidden && retriesRef.current < HIDDEN_MP3_RETRIES) {
        // YouTube can't start on a locked phone, so a dropped load is retried on the same audio element first.
        retriesRef.current += 1;
        if (audioLoopRef.current) startAudio(audioUrl(file), file, true);
        else playNow();
        return;
      }
      if (file) {
        // A missing or unreachable MP3 isn't a dead station: the same song carries on from YouTube.
        failedFilesRef.current.add(file);
        mp3ErrorsRef.current += 1;
        tuneRef.current(failed, false);
        return;
      }
      markInvalid(failed.name);
      setNotice(failed.name);
      const back = prevStationRef.current && prevStationRef.current.name !== failed.name ? prevStationRef.current : null;
      tuneRef.current(back, false);
    };
    audio.addEventListener("loadedmetadata", onAudioReady);
    audio.addEventListener("playing", onAudioStarted);
    audio.addEventListener("timeupdate", onAudioTime);
    audio.addEventListener("ended", onAudioEnded);
    audio.addEventListener("error", onAudioError);
    if (modeOf(stationRef.current) === "audio") tuneRef.current(stationRef.current, false);

    // The player starts as soon as YouTube's script is in; the server clock correction lands whenever it's ready.
    syncRadioClock().then(() => {
      if (!cancelled) checkDrift();
    });

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(host, {
        width: 1,
        height: 1,
        playerVars: { autoplay: 1, playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
            applySound();
            if (stationRef.current && engineRef.current === "yt") tuneRef.current(stationRef.current, false);
          },
          onStateChange: (e: any) => {
            // Stopping YouTube for an MP3 still fires its events; they belong to the item before.
            if (engineRef.current !== "yt") return;
            const mode = modeOf(stationRef.current);
            const player = e.target;
            if (e.data === YT.PlayerState.PLAYING) {
              startedRef.current = true;
              retriesRef.current = 0;
              skipsRef.current = 0;
              // iOS refuses seeks and new loads on a locked phone, so a lock-screen play just resumes; unlocking rejoins live.
              if (mode === "broadcast" && !document.hidden) checkDrift();
              else if (mode === "playlist") setLiveTitle(player.getVideoData?.()?.title || null);
              else if (mode === "video" && pendingLoopSync.current) {
                pendingLoopSync.current = false;
                player.seekTo(loopOffset(player.getDuration?.() ?? 0), true);
                applySound();
              }
            } else if (e.data === YT.PlayerState.ENDED && mode === "video") {
              if (pendingLoopSync.current || (player.getCurrentTime?.() ?? 0) < (player.getDuration?.() ?? 0) - END_SLACK_S) return;
              player.seekTo(0, true);
              player.playVideo();
            } else if (e.data === YT.PlayerState.ENDED && mode === "broadcast") {
              const cur = currentRef.current;
              const b = broadcastOf(stationRef.current, adsRef.current);
              // Loading a video straight after another fires a stale ENDED at 0:00; only one near the slot's end is real.
              if (!cur || !b || (radioNow() - cur.startMs) / 1000 < cur.item.duration - END_SLACK_S) return;
              // After a lock-screen pause the next slot may already be over; one load straight onto the live slot beats a chain of them.
              if (document.hidden) return playNow();
              playSlot(nextSlot(b, { item: cur.item, startMs: cur.startMs, offset: 0 }));
            }
          },
          onError: () => {
            if (engineRef.current !== "yt") return;
            const failed = stationRef.current;
            const mode = modeOf(failed);
            if (!failed) return;
            if (mode === "video" || mode === "playlist") {
              pendingLoopSync.current = false;
              markInvalid(failed.name);
              setNotice(failed.name);
              const back = prevStationRef.current && prevStationRef.current.name !== failed.name ? prevStationRef.current : null;
              tuneRef.current(back, false);
              return;
            }
            // One dead song shouldn't take the whole station down: play the next item, then rejoin the schedule after it.
            const cur = currentRef.current;
            const b = broadcastOf(stationRef.current, adsRef.current);
            if (mode !== "broadcast" || !cur || !b || skipsRef.current >= MAX_SKIPS) return;
            skipsRef.current += 1;
            const next = nextSlot(b, { item: cur.item, startMs: cur.startMs, offset: 0 });
            playSlot({ ...next, offset: 0, startMs: radioNow() });
          },
        },
      });
    });

    // Moves on at slot boundaries, reloads a song YouTube never started, and un-pauses one it left paused.
    let stalled = 0;
    const watch = window.setInterval(() => {
      const player = playerRef.current;
      const YT = window.YT;
      const mode = modeOf(stationRef.current);
      if (pausedRef.current) return;
      if (engineRef.current === "audio") {
        // Only resumes once the browser has let sound start; a blocked autoplay waits for the first click instead.
        if (audio.paused && !seekPendingRef.current && audio.readyState >= 2 && !playBlockedRef.current) audio.play().catch(blocked);
        const cur = currentRef.current;
        if (!audioLoopRef.current && cur && !document.hidden && (radioNow() - cur.startMs) / 1000 >= cur.item.duration + BOUNDARY_GRACE_S) return playNow();
        // Picked "MP3" outright: a file that never starts is reloaded, further apart each time, rather than swapped for YouTube.
        const wait = LOAD_TIMEOUT_MS * Math.min(2 ** retriesRef.current, MAX_RETRY_BACKOFF);
        if (audioFileRef.current && !startedRef.current && !playBlockedRef.current && Date.now() - audioLoadedAtRef.current > wait) {
          retriesRef.current += 1;
          if (stationRef.current) tuneRef.current(stationRef.current, false);
        }
        return;
      }
      if (!player || !readyRef.current || !YT || mode === "off") return;
      const state = player.getPlayerState?.();
      // A locked phone pauses YouTube, and reloading or restarting it then removes the lock-screen controls.
      if (document.hidden && state !== YT.PlayerState.PLAYING) {
        stalled = 0;
        return;
      }
      const cur = currentRef.current;
      if (mode === "broadcast" && cur) {
        // While locked, a song resumed behind the clock plays out and its ENDED moves on; cutting it off here would stall it.
        if (!document.hidden && (radioNow() - cur.startMs) / 1000 >= cur.item.duration + BOUNDARY_GRACE_S) {
          stalled = 0;
          return playNow();
        }
        // YouTube can throttle a burst of loads for a while; keep retrying, further apart each time.
        const wait = LOAD_TIMEOUT_MS * Math.min(2 ** retriesRef.current, MAX_RETRY_BACKOFF);
        if (!startedRef.current && state !== YT.PlayerState.PLAYING && Date.now() - cur.loadedAt > wait) {
          retriesRef.current += 1;
          stalled = 0;
          return playNow();
        }
      }
      stalled = state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED ? stalled + 1 : 0;
      if (stalled >= STALL_CHECKS) {
        stalled = 0;
        player.playVideo();
      }
    }, WATCH_MS);
    const drift = window.setInterval(() => {
      if (!document.hidden) checkDrift();
    }, DRIFT_CHECK_MS);
    // Phones often pause playback while locked; coming back rejoins the live point straight away instead of waiting on the watcher.
    const onVisible = () => {
      if (document.hidden) return;
      const station = stationRef.current;
      const mode = modeOf(station);
      if (!station || mode === "off" || pausedRef.current || pendingLoopSync.current || seekPendingRef.current) return;
      const player = playerRef.current;
      const stopped =
        engineRef.current === "audio" ? audio.paused : !!player && readyRef.current && player.getPlayerState?.() !== window.YT?.PlayerState?.PLAYING;
      if (stopped) tuneRef.current(station, false);
      else checkDrift();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(watch);
      window.clearInterval(drift);
      document.removeEventListener("visibilitychange", onVisible);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      window.clearTimeout(mp3TimerRef.current);
      audio.removeEventListener("loadedmetadata", onAudioReady);
      audio.removeEventListener("playing", onAudioStarted);
      audio.removeEventListener("timeupdate", onAudioTime);
      audio.removeEventListener("ended", onAudioEnded);
      audio.removeEventListener("error", onAudioError);
      audio.pause();
      audio.removeAttribute("src");
      audioRef.current = null;
      readyRef.current = false;
      host.remove();
    };
  }, [applySound, blocked, checkDrift, playNow, playSlot, startAudio]);

  const changeVolume = (value: number) => {
    volumeRef.current = value;
    setVolume(value);
    saveSetting(VOLUME_STORAGE_KEY, String(value));
    applySound();
  };

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    saveSetting(MUTED_STORAGE_KEY, String(mutedRef.current));
    applySound();
  };

  useEffect(() => {
    async function fetchStations() {
      const [response, files] = await Promise.all([fetch(game.stationList), loadAudioManifest()]);
      filesRef.current = files;
      setHasMp3(Object.keys(files).some((file) => file.startsWith(`${library.folder}/`)));
      const csv = await response.text();
      const parsedData = Papa.parse<Station>(csv, { header: true, skipEmptyLines: true, transform: (v) => v.trim() }).data;
      const list = parsedData.filter((s) => s.name);
      setStations(list);
      setInvalid(list.filter((s) => !hasValidLink(s)).map((s) => s.name));
      const saved = list.find((s) => s.name === readSetting(game.stationKey));
      if (saved && hasValidLink(saved) && !stationRef.current) tuneRef.current(saved, false);
    }

    fetchStations();
  }, [game.stationList, game.stationKey]);

  const stationCount = stations.filter((s) => s.name !== RADIO_OFF).length;

  // Icons sit just inside the wheel's edge, sized so neighbours almost touch: size = 0.95·π·(wheel − size) / count.
  const wheelStyle = {
    "--wheel": "min(calc(100vh - 9rem), 90vw, 920px)",
    // Capped so a short station list doesn't grow icons into the centre text.
    "--icon": `min(calc(var(--wheel) * 2.985 / (${Math.max(stations.length, 1)} + 2.985)), calc(var(--wheel) * 0.16))`,
    width: "var(--wheel)",
    height: "var(--wheel)",
  } as CSSProperties;

  // Positions each station around the wheel, starting at the bottom.
  const getStationStyle = (index: number): CSSProperties => {
    const angle = ((90 + (360 / stations.length) * index) % 360) * (Math.PI / 180);
    const cos = Math.cos(angle).toFixed(4);
    const sin = Math.sin(angle).toFixed(4);
    return {
      left: `calc(50% + (var(--wheel) - var(--icon)) / 2 * ${cos})`,
      top: `calc(50% + (var(--wheel) - var(--icon)) / 2 * ${sin})`,
      width: "var(--icon)",
      height: "var(--icon)",
    };
  };

  const isSelected = (station: Station) => selectedStation?.name === station.name;
  /** Hosted-audio stations use full-bleed square station art rather than a cut-out logo. */
  const isTile = (station: Station) => station.type === "a";
  const previewStations = previews ? stations.filter((s) => previews[s.name]) : [];
  const isInvalid = (station: Station) => invalid.includes(station.name);

  const mode = modeOf(selectedStation);
  const onAirLabel = mode === "off" ? "Radio" : mode === "audio" ? "Station preview" : item?.news ? "Weazel News" : item?.ad ? "Ad break" : "Now playing";
  const trackLine = item?.title ?? (mode === "playlist" ? liveTitle : null);
  const showProgress = mode !== "off";
  const showAds = mode === "broadcast" && game.ads;
  const showSource = hasMp3 && (mode === "broadcast" || mode === "video");

  const volumeProps = { volume, muted, onToggleMute: toggleMute, onVolume: changeVolume };
  const adToggleProps = { on: adsOn, onChange: changeAds };
  const sourceProps = { source, onChange: changeSource };

  const noticeText = notice ? (
    <p role="alert" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d4d]">
      {notice}: {INVALID_LINK}
    </p>
  ) : null;

  const statusFor = (station: Station, active: boolean) => {
    if (isInvalid(station)) return INVALID_LINK;
    if (!active) return "";
    if (modeOf(station) === "off") return "● Off";
    return item?.news ? "● Weazel News" : item?.ad ? "● Ad break" : "● On air";
  };

  return (
    <div className="flex w-full flex-1 flex-col max-md:contents">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-cream/20 bg-black">
        <div className="flex h-[4.5rem] items-center justify-between gap-6 px-6 md:px-12 lg:px-24">
          <GamePicker current={game} />
          <div className="flex items-center gap-4 md:gap-6">
            <VolumeControl {...volumeProps} className={selectedStation ? "hidden" : isWheelVisible ? "md:hidden" : ""} />
            <div role="group" aria-label="View" className="hidden border border-cream/25 md:flex">
              <button type="button" aria-pressed={isWheelVisible} onClick={() => setIsWheelVisible(true)} className={segmentClass(isWheelVisible)}>
                Wheel
              </button>
              <button
                type="button"
                aria-pressed={!isWheelVisible}
                onClick={() => setIsWheelVisible(false)}
                className={`border-l border-cream/25 ${segmentClass(!isWheelVisible)}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Now playing strip (mobile, and desktop list view) */}
        {(selectedStation || notice) && (
          <div className={`space-y-2 border-t border-cream/10 px-6 py-3 md:px-12 lg:px-24 ${isWheelVisible ? "md:hidden" : ""}`}>
            {selectedStation && (
              <div className="flex items-center gap-x-3 gap-y-2 md:flex-wrap md:gap-x-4">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconPath(selectedStation)} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50">{onAirLabel}</p>
                    <p className="truncate text-sm font-medium uppercase leading-tight">{trackLine ?? selectedStation.name}</p>
                    <p className="truncate text-xs font-light uppercase leading-tight tracking-[0.12em] text-cream/60">
                      {trackLine ? selectedStation.name : selectedStation.description || "\u00a0"}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 md:gap-3">
                  {showSource && (
                    <>
                      <SourceButton {...sourceProps} className="md:hidden" />
                      <div className="hidden md:block">
                        <SourceToggle {...sourceProps} />
                      </div>
                    </>
                  )}
                  {showAds && (
                    <>
                      <AdBreakButton {...adToggleProps} className="md:hidden" />
                      <div className="hidden md:block">
                        <AdBreakToggle {...adToggleProps} label="Ad breaks" />
                      </div>
                    </>
                  )}
                  <VolumeControl {...volumeProps} />
                </div>
              </div>
            )}
            {selectedStation && showProgress && <Progress getTiming={getTiming} />}
            {noticeText}
          </div>
        )}
      </header>

      {banner}

      {/* Wheel view (desktop) */}
      <section aria-label="Radio wheel" className={`${isWheelVisible ? "md:flex" : ""} hidden min-h-[calc(100vh-4.5rem)] items-center justify-center px-8 py-8`}>
        <div className="relative" style={wheelStyle}>
          {stations.map((station, index) => {
            const active = isSelected(station);
            const dead = isInvalid(station);
            return (
              <button
                key={station.name}
                type="button"
                aria-label={`${station.name}${station.description ? ` — ${station.description}` : ""}${dead ? ` (${INVALID_LINK})` : ""}`}
                aria-pressed={active}
                onClick={() => pickStation(station)}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 p-0.5 transition-[border-color,opacity] duration-200 focus-visible:border-cream focus-visible:opacity-100 focus-visible:outline-none motion-reduce:transition-none ${
                  dead
                    ? "border-[#ff4d4d] opacity-40 hover:opacity-70"
                    : active
                      ? "border-cream opacity-100"
                      : "border-transparent opacity-60 hover:border-cream/60 hover:opacity-100"
                }`}
                style={getStationStyle(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconPath(station)} alt="" className={`h-full w-full ${isTile(station) ? "rounded-full object-cover" : "object-contain"}`} />
              </button>
            );
          })}

          <div className="absolute left-1/2 top-1/2 flex w-[52%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            {selectedStation ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-cream/50">{onAirLabel}</p>
                <p className="mt-4 font-headline text-4xl leading-[0.95] lg:text-5xl">{selectedStation.name}</p>
                {selectedStation.description && (
                  <p className="mt-3 text-sm font-light uppercase tracking-[0.15em] text-cream/70">{selectedStation.description}</p>
                )}
                {trackLine && <p className="mt-4 max-w-full truncate text-base font-medium uppercase tracking-[0.15em]">{trackLine}</p>}
                {showProgress && <Progress getTiming={getTiming} className={`w-full max-w-xs ${trackLine ? "mt-3" : "mt-5"}`} />}
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Tune in</p>
                <p className="mt-4 font-headline text-4xl leading-[0.95] lg:text-5xl">Pick a station</p>
                <p className="mt-3 text-sm font-light uppercase tracking-[0.15em] text-cream/70">{stationCount} stations on the wheel</p>
              </>
            )}
            {noticeText && <div className="mt-4">{noticeText}</div>}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {showSource && <SourceToggle {...sourceProps} />}
              {showAds && <AdBreakToggle {...adToggleProps} label="Ad breaks" />}
              <VolumeControl {...volumeProps} placement="above" />
            </div>
          </div>
        </div>
      </section>

      {/* List view (mobile, and desktop when switched) */}
      <section aria-labelledby="stations-title" className={`${isWheelVisible ? "md:hidden" : ""} px-6 py-12 md:px-12 md:py-16 lg:px-24`}>
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-cream/20 pb-4">
          <h2 id="stations-title" className="text-xs uppercase tracking-[0.3em] text-cream/50">
            Stations
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/40">{stationCount} stations</p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {stations.map((station) => {
            const active = isSelected(station);
            const dead = isInvalid(station);
            return (
              <li key={station.name}>
                <button
                  type="button"
                  onClick={() => pickStation(station)}
                  aria-pressed={active}
                  className={`flex min-h-[4.5rem] w-full items-center gap-3 border px-3 py-2 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream motion-reduce:transition-none ${
                    active ? "border-cream bg-cream text-black" : "border-cream/25 hover:border-cream hover:bg-cream/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconPath(station)} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" loading="lazy" />
                  <span className="block min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium uppercase leading-tight">{station.name}</span>
                    <span className={`block truncate text-xs font-light leading-tight ${active ? "text-black/70" : "text-cream/60"}`}>
                      {station.description || "\u00a0"}
                    </span>
                    <span
                      className={`mt-1 block h-3 truncate text-[9px] font-medium uppercase leading-3 tracking-[0.3em] ${dead ? "text-[#ff4d4d]" : ""}`}
                    >
                      {statusFor(station, active)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {previewStations.length > 0 && (
        <section aria-labelledby="previews-title" className="border-t border-cream/20 px-6 py-12 md:px-12 md:py-16 lg:px-24">
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-cream/20 pb-4">
            <h2 id="previews-title" className="text-xs uppercase tracking-[0.3em] text-cream/50">
              In this preview
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40">3 songs per station</p>
          </div>
          <ul className="grid grid-cols-1 gap-px bg-cream/20 sm:grid-cols-2 xl:grid-cols-3">
            {previewStations.map((station) => {
              const active = isSelected(station);
              return (
                <li key={station.name} className={`p-5 ${active ? "bg-cream text-black" : "bg-black"}`}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconPath(station)} alt="" width={40} height={40} className="h-10 w-10 shrink-0" loading="lazy" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium uppercase leading-tight">{station.name}</p>
                      <p className={`text-xs font-light uppercase leading-tight tracking-[0.12em] ${active ? "text-black/70" : "text-cream/60"}`}>
                        {active ? "● On air" : station.description}
                      </p>
                    </div>
                  </div>
                  <ol className="mt-4 space-y-2">
                    {previews![station.name].map((song, i) => (
                      <li key={song} className="flex gap-3 text-sm leading-snug">
                        <span aria-hidden="true" className={`w-5 shrink-0 tabular-nums ${active ? "text-black/50" : "text-cream/40"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">{song}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-[0.01]" />
    </div>
  );
}
