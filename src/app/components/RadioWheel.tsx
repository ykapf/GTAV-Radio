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
  const wheelRadius = 400; // radius of the wheel in pixels

  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Load the YouTube IFrame Player API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          width: "00",
          height: "00",
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
      transform: `rotate(${angle}deg) translate(${wheelRadius}px) rotate(-${angle}deg) translate(-50%, -50%) scale(${isHovered ? 1.1 : 1})`,
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
      <div className="" style={{ position: "relative", width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}>
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
            width: "00px", // Adjust width as needed
            height: "00px", // Adjust height as needed
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
    </main>
  );
}
