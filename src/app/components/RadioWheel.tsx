"use client";

import React, { useState, useEffect, CSSProperties, useRef } from "react";
import Papa from "papaparse";

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
  type: "v" | "p"; // New field to distinguish between video and playlist
  playlistId?: string; // New field to store playlist ID
};

type RadioWheelProps = {};

export default function RadioWheel({}: RadioWheelProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const wheelRadius = 40; // radius of the wheel in vw

  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);

  const [volume, setVolume] = useState(100); // Volume state
  const [tempVolume, setTempVolume] = useState(100); // Temporary volume state

  useEffect(() => {
    // Load the YouTube IFrame Player API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          width: "500",
          height: "500",
          videoId: "", // Default video ID, can be a placeholder
          startSeconds: 0, // gonna be useful if i want to add random start times.===
          events: {
            onReady: () => setPlayerReady(true),
          },
          playerVars: {
            playsinline: 1,
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            loop: 1,
            playlist: "", // Same as videoId for looping
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; allowfullscreen; loop;",
          },
        });
      };
    }
  }, []);

  // Function to handle volume changes from the slider
  const handleVolumeChange = (newVolume: any) => {
    newVolume = parseInt(newVolume); // Ensure newVolume is an integer
    setVolume(newVolume);

    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(newVolume);
    }

    // Mute if volume is 0, otherwise, store the current volume as tempVolume
    if (newVolume === 0) {
      handleMute();
    } else {
      setTempVolume(newVolume);
    }
  };

  // Function to handle mute
  const handleMute = () => {
    if (volume > 0) {
      setTempVolume(volume);
    }
    setVolume(0);
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(0);
    }
  };

  // Function to handle unmute
  const handleUnmute = () => {
    const newVolume = Math.max(tempVolume, 10); // Use tempVolume or 10, whichever is greater
    setVolume(newVolume);
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const loadVideo = (station: Station) => {
    setSelectedStation(station);
    if (playerReady && playerRef.current) {
      if (station.type === "v") {
        playerRef.current.loadVideoById(station.link);
      } else if (station.type === "p" && station.playlistId) {
        playerRef.current.loadPlaylist({
          listType: "playlist",
          list: station.playlistId,
          index: 0,
          startSeconds: 0,
          autoplay: 1,
          loop: 1,
        });
        playerRef.current.playVideo();
      }
    }
  };

  useEffect(() => {
    async function fetchStations() {
      const response = await fetch("/radio_list.csv");
      if (!response.body) {
        throw new Error("Response body is null");
      }
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const parsedData = Papa.parse(csv, { header: true }).data as Station[];
      setStations(parsedData);
    }

    fetchStations();
  }, []);

  const getStationStyle = (angle: number, isHovered: boolean, stationName: string): CSSProperties => {
    const stationWidth = isHovered ? 110 : 100; // 110 when hovered, 100 otherwise
    const stationHeight = isHovered ? 110 : 100;
    return {
      transform: `rotate(${angle}deg) translate(${wheelRadius}vh) rotate(-${angle}deg) translate(-50%, -50%) scale(${isHovered ? 1.1 : 1})`,
      position: "absolute",
      top: "50%",
      left: "50%",
      transformOrigin: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${stationWidth}px`,
      height: `${stationHeight}px`,
      transition: "transform 0.3s ease",
      borderColor: selectedStation?.name === stationName ? "blue" : "gray",
      borderWidth: selectedStation?.name === stationName ? "6px" : "4px",
      opacity: selectedStation?.name === stationName ? 1 : 0.6,
    };
  };

  return (
    <main>
      <style>
        {`
          @media screen and (max-height: 700px || max-width: 700px)  {
            .height-mobile {
              display: block;
            }
            .height-desktop {
              display: none;
            }
          }

          @media screen and (min-height: 701px || min-width: 701px) {
            .height-mobile {
              display: none;
            }
            .height-desktop {
              display: block;
            }
          }
        `}
      </style>
      {/* Mobile Layout */}
      <div className={`height-mobile md:hidden flex flex-col items-center justify-center`}>
        {stations.map((station) => {
          const imagePath = `/radio_icons/${station.image}`;

          return (
            <button
              key={station.name}
              className="rounded-full flex justify-center items-center m-2 w-11/12"
              style={{ width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}
              onClick={() => {
                loadVideo(station);
              }}
            >
              <img src={imagePath} alt={station.description} className="max-w-full max-h-full" />
            </button>
          );
        })}
      </div>
      <div id="youtube-player" className=""></div>
      {/* Desktop Layout */}
      <div className="height-desktop hidden md:flex" style={{ position: "relative", width: `${wheelRadius * 2}vh`, height: `${wheelRadius * 2}vh` }}>
        {stations.map((station, index) => {
          const angle = (90 + (360 / stations.length) * index) % 360;
          const isHovered = station.name === hoveredStation;
          const style = getStationStyle(angle, isHovered, station.name);
          const imagePath = `/radio_icons/${station.image}`;

          return (
            <button
              key={station.name}
              className="rounded-full flex justify-center items-center cursor-none"
              style={style}
              onMouseEnter={() => setHoveredStation(station.name)}
              onMouseLeave={() => setHoveredStation(null)}
              onClick={() => {
                loadVideo(station);
              }}
            >
              <img className=" " src={imagePath} alt={station.description} style={{ maxWidth: "100%", maxHeight: "100%" }} />
            </button>
          );
        })}
        <div
          style={{
            position: "fixed",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "500px", // Adjust width as needed
            height: "500px", // Adjust height as needed
          }}
        >
          <div id="youtube-player" className=""></div>
        </div>
        {selectedStation && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "white",
              textAlign: "center",
            }}
          >
            <div>{selectedStation.name}</div>
            <div>{selectedStation.description}</div>
          </div>
        )}
      </div>
      {/* Volume Control Slider */}
      <div className="volume-control flex flex-col items-center justify-center gap-2" style={{ position: "fixed", top: "50px", right: "20px" }}>
        {volume === 0 ? (
          <button className="md:cursor-none" onClick={handleUnmute}>
            <img src="/mute.png" alt="Mute" style={{ width: "75px", height: "75px" }} />
          </button>
        ) : (
          <button className="md:cursor-none" onClick={handleMute}>
            <img src="/unmute.png" alt="Unmute" style={{ width: "75px", height: "75px" }} />
          </button>
        )}
        <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(e.target.value)} />
      </div>
    </main>
  );
}
