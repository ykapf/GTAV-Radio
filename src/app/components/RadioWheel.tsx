"use client";

import React, { useState, useEffect, CSSProperties, useRef, useCallback } from "react";
import Papa from "papaparse";
import { Broadcast, Item, PLAYLIST_TRACKS, Slot, broadcastFor, loopOffset, nextSlot, radioNow, slotAt, syncRadioClock } from "../lib/broadcast";

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
  type: "v" | "p"; // "v" is a single long video, "p" is a playlist
  playlistId?: string;
};

/** off: silence · video: one long mix on a shared loop · broadcast: a playlist on the synced schedule · playlist: a playlist with no known track list */
type Mode = "off" | "video" | "broadcast" | "playlist";

type RadioWheelProps = {};

const RADIO_OFF = "Radio Off";
const ADS_STORAGE_KEY = "gtav-radio:ad-breaks";
const INVALID_LINK = "Invalid link";
const DRIFT_LIMIT_S = 2.5;
const DRIFT_CHECK_MS = 10_000;
const BOUNDARY_CHECK_MS = 1000;
const BOUNDARY_GRACE_S = 0.75;
const MAX_SKIPS = 5;

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
  if (station.type === "p") return station.playlistId && PLAYLIST_TRACKS[station.playlistId] ? "broadcast" : "playlist";
  return "video";
}

const broadcastOf = (station: Station | null, ads: boolean): Broadcast | null =>
  station?.playlistId ? broadcastFor(station.playlistId, ads) : null;

function hasValidLink(station: Station) {
  const mode = modeOf(station);
  if (mode === "off") return true;
  if (mode === "video") return videoIdOf(station.link) !== null;
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

/** Progress bar plus elapsed / total time for whatever is on air, read every frame from the player or the broadcast clock. */
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

export default function RadioWheel({}: RadioWheelProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [adsOn, setAdsOn] = useState(true);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  /** Title YouTube reports for a playlist we have no track list for. */
  const [liveTitle, setLiveTitle] = useState<string | null>(null);

  const [isWheelVisible, setIsWheelVisible] = useState(true); // Default is true to show the wheel initially

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const stationRef = useRef<Station | null>(null);
  /** What to fall back to when a picked station's link turns out to be dead. */
  const prevStationRef = useRef<Station | null>(null);
  const currentRef = useRef<{ item: Item; startMs: number } | null>(null);
  const adsRef = useRef(true);
  /** Set when a long mix is loaded; the first PLAYING event seeks it onto the shared loop. */
  const pendingLoopSync = useRef(false);
  const skipsRef = useRef(0);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  /** Pushes the current volume and mute state to the player; a mix stays silent until it has joined the shared loop. */
  const applySound = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    player.setVolume(volumeRef.current);
    if (mutedRef.current || pendingLoopSync.current) player.mute();
    else player.unMute();
  }, []);

  const playSlot = useCallback(
    (slot: Slot) => {
      if (modeOf(stationRef.current) !== "broadcast") return;
      currentRef.current = { item: slot.item, startMs: slot.startMs };
      setItem(slot.item);
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      const { videoId, start, duration, ad } = slot.item;
      applySound();
      player.loadVideoById({ videoId, startSeconds: start + Math.max(0, slot.offset), endSeconds: ad ? start + duration : undefined });
    },
    [applySound],
  );

  /** How far into the current song, ad or mix we are. */
  const getTiming = useCallback((): Timing => {
    const mode = modeOf(stationRef.current);
    if (mode === "broadcast") {
      const cur = currentRef.current;
      return cur ? { elapsed: (radioNow() - cur.startMs) / 1000, duration: cur.item.duration } : null;
    }
    const player = playerRef.current;
    if (mode === "off" || pendingLoopSync.current || !player || !readyRef.current) return null;
    return { elapsed: player.getCurrentTime?.() ?? 0, duration: player.getDuration?.() ?? 0 };
  }, []);

  /** Re-seeks if this device has wandered from the broadcast clock. */
  const checkDrift = useCallback(() => {
    const player = playerRef.current;
    const cur = currentRef.current;
    const b = broadcastOf(stationRef.current, adsRef.current);
    if (!player || !readyRef.current || !cur || !b || modeOf(stationRef.current) !== "broadcast") return;
    const expected = (radioNow() - cur.startMs) / 1000;
    if (expected >= cur.item.duration) {
      playSlot(slotAt(b, radioNow()));
      return;
    }
    const actual = (player.getCurrentTime?.() ?? 0) - cur.item.start;
    if (Math.abs(actual - expected) > DRIFT_LIMIT_S) player.seekTo(cur.item.start + Math.max(0, expected), true);
  }, [playSlot]);

  /** Puts a station on air, joining wherever its shared clock says it is right now. */
  const tune = useCallback(
    (station: Station | null, remember = true) => {
      if (remember && stationRef.current && stationRef.current.name !== station?.name) prevStationRef.current = stationRef.current;
      stationRef.current = station;
      setSelectedStation(station);
      const player = playerRef.current;
      const ready = player && readyRef.current;
      const mode = modeOf(station);
      pendingLoopSync.current = false;
      setLiveTitle(null);
      if (mode !== "broadcast") {
        currentRef.current = null;
        setItem(null);
      }
      if (mode === "broadcast") {
        const b = broadcastOf(stationRef.current, adsRef.current);
        if (b) playSlot(slotAt(b, radioNow()));
      } else if (mode === "video" && station) {
        pendingLoopSync.current = true;
        if (ready) {
          // Muted until the first PLAYING event has seeked onto the shared loop, so the top of the mix never leaks out.
          player.mute();
          player.loadVideoById({ videoId: videoIdOf(station.link), startSeconds: 0 });
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
    [playSlot, applySound],
  );
  const tuneRef = useRef(tune);
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
    try {
      window.localStorage.setItem(ADS_STORAGE_KEY, on ? "on" : "off");
    } catch {
      // Storage can be blocked; the choice still holds for this visit.
    }
    const b = broadcastOf(stationRef.current, adsRef.current);
    if (b && modeOf(stationRef.current) === "broadcast") playSlot(slotAt(b, radioNow()));
  };

  useEffect(() => {
    try {
      if (window.localStorage.getItem(ADS_STORAGE_KEY) === "off") {
        adsRef.current = false;
        setAdsOn(false);
      }
    } catch {
      // Keep the default (ad breaks on).
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const host = document.createElement("div");
    hostRef.current?.appendChild(host);

    Promise.all([loadYouTubeApi(), syncRadioClock()]).then(([YT]) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(host, {
        width: 1,
        height: 1,
        playerVars: { autoplay: 1, playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
            applySound();
            if (stationRef.current) tuneRef.current(stationRef.current, false);
          },
          onStateChange: (e: any) => {
            const mode = modeOf(stationRef.current);
            if (e.data === YT.PlayerState.PLAYING) {
              skipsRef.current = 0;
              if (mode === "broadcast") checkDrift();
              else if (mode === "playlist") setLiveTitle(e.target.getVideoData?.()?.title || null);
              else if (mode === "video" && pendingLoopSync.current) {
                pendingLoopSync.current = false;
                e.target.seekTo(loopOffset(e.target.getDuration?.() ?? 0), true);
                applySound();
              }
            } else if (e.data === YT.PlayerState.ENDED && mode === "video") {
              e.target.seekTo(0, true);
              e.target.playVideo();
            } else if (e.data === YT.PlayerState.ENDED && mode === "broadcast") {
              const b = broadcastOf(stationRef.current, adsRef.current);
              if (!b) return;
              const cur = currentRef.current;
              const now = slotAt(b, radioNow());
              // Listed durations are rounded, so a track can end just before its slot does.
              const sameSlot = cur && now.item === cur.item && Math.abs(now.startMs - cur.startMs) < 5000;
              playSlot(sameSlot ? nextSlot(b, now) : now);
            }
          },
          onError: () => {
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
            // One dead song shouldn't take the whole broadcast down: skip ahead to the next item.
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

    const drift = window.setInterval(() => {
      if (!document.hidden) checkDrift();
    }, DRIFT_CHECK_MS);
    // Ads are cut out of one long video with `endSeconds`, which doesn't always fire ENDED on time.
    const boundary = window.setInterval(() => {
      const cur = currentRef.current;
      const b = broadcastOf(stationRef.current, adsRef.current);
      if (!cur || !b || modeOf(stationRef.current) !== "broadcast") return;
      if ((radioNow() - cur.startMs) / 1000 >= cur.item.duration + BOUNDARY_GRACE_S) playSlot(slotAt(b, radioNow()));
    }, BOUNDARY_CHECK_MS);
    const onVisible = () => {
      if (!document.hidden) checkDrift();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(drift);
      window.clearInterval(boundary);
      document.removeEventListener("visibilitychange", onVisible);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      readyRef.current = false;
      host.remove();
    };
  }, [checkDrift, playSlot, applySound]);

  const changeVolume = (value: number) => {
    volumeRef.current = value;
    setVolume(value);
    applySound();
  };

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    applySound();
  };

  useEffect(() => {
    async function fetchStations() {
      const response = await fetch("/radio_list.csv");
      const csv = await response.text();
      const parsedData = Papa.parse<Station>(csv, { header: true, skipEmptyLines: true, transform: (v) => v.trim() }).data;
      const list = parsedData.filter((s) => s.name);
      setStations(list);
      setInvalid(list.filter((s) => !hasValidLink(s)).map((s) => s.name));
    }

    fetchStations();
  }, []);

  const stationCount = stations.filter((s) => s.name !== RADIO_OFF).length;

  // Icons sit just inside the wheel's edge, sized so neighbours almost touch: size = 0.95·π·(wheel − size) / count.
  const wheelStyle = {
    "--wheel": "min(calc(100vh - 9rem), 90vw, 920px)",
    "--icon": `calc(var(--wheel) * 2.985 / (${Math.max(stations.length, 1)} + 2.985))`,
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
  const isInvalid = (station: Station) => invalid.includes(station.name);

  const mode = modeOf(selectedStation);
  const onAirLabel = mode === "off" ? "Radio" : item?.ad ? "Ad break" : "Now playing";
  const trackLine = mode === "broadcast" ? item?.title ?? null : mode === "playlist" ? liveTitle : null;
  const showProgress = mode !== "off";

  const volumeProps = { volume, muted, onToggleMute: toggleMute, onVolume: changeVolume };
  const adToggleProps = { on: adsOn, onChange: changeAds };

  const noticeText = notice ? (
    <p role="alert" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d4d]">
      {notice}: {INVALID_LINK}
    </p>
  ) : null;

  const statusFor = (station: Station, active: boolean) => {
    if (isInvalid(station)) return INVALID_LINK;
    if (!active) return "";
    if (modeOf(station) === "off") return "● Off";
    return item?.ad ? "● Ad break" : "● On air";
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-cream/20 bg-black">
        <div className="flex h-[4.5rem] items-center justify-between gap-6 px-6 md:px-12 lg:px-24">
          <h1 className="font-headline text-3xl leading-none md:text-4xl">GTA V Radio</h1>
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
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex min-w-0 flex-1 items-center gap-4">
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
                <div className="flex shrink-0 items-center gap-3">
                  {mode === "broadcast" && <AdBreakToggle {...adToggleProps} label="Ad breaks" />}
                  <VolumeControl {...volumeProps} />
                </div>
              </div>
            )}
            {selectedStation && showProgress && <Progress getTiming={getTiming} />}
            {noticeText}
          </div>
        )}
      </header>

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
                <img src={iconPath(station)} alt="" className="h-full w-full object-contain" />
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
            <div className="mt-6 flex items-center gap-3">
              {mode === "broadcast" && <AdBreakToggle {...adToggleProps} label="Ad breaks" />}
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

      <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-[0.01]" />
    </div>
  );
}
