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

  const [isWheelVisible, setIsWheelVisible] = useState(true); // Default is true to show the wheel initially

  useEffect(() => {
    // Load the YouTube IFrame Player API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          width: "01",
          height: "01",
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
        // Load the video to get the duration
        playerRef.current.cueVideoById(station.link);

        setTimeout(() => {
          const duration = playerRef.current.getDuration();
          const randomStart = Math.floor(Math.random() * duration);
          playerRef.current.loadVideoById({ videoId: station.link, startSeconds: randomStart });
        }, 500); // Wait for 1 second to ensure video data is loaded
      } else if (station.type === "p" && station.playlistId) {
        // Load and shuffle the playlist
        playerRef.current.loadPlaylist({
          listType: "playlist",
          list: station.playlistId,
        });
        playerRef.current.setShuffle(true);
        playerRef.current.mute(); // Mute the playlist initially

        setTimeout(() => {
          const playlistSize = playerRef.current.getPlaylist().length;
          const randomIndex = Math.floor(Math.random() * playlistSize);
          playerRef.current.playVideoAt(randomIndex);
          setTimeout(() => {
            const duration = playerRef.current.getDuration();
            const randomStart = Math.floor(Math.random() * duration);
            playerRef.current.seekTo(randomStart);
            playerRef.current.unMute(); // Unmute
          }, 550);
        }, 500); // Wait for the playlist to be loaded and shuffled
      }
    }
  };

  const toggleWheelVisibility = () => {
    setIsWheelVisible(!isWheelVisible);
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
    <main className={`  flex items-center ${isWheelVisible ? "md:h-screen" : "h-full"}  `}>
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
      {/* Mobile Now Playing Bar */}
      <div className="height-mobile md:hidden fixed top-0 left-0 w-full h-[100px] bg-black text-white flex items-center justify-center z-10">
        {selectedStation && (
          <div className="flex flex-row justify-start items-center w-full px-[25px]">
            <img
              src={`/radio_icons/${selectedStation.image}`}
              alt={selectedStation.name}
              className=" flex justify-center items-center m-2 w-11/12"
              style={{ width: `${wheelRadius * 1.5}px`, height: `${wheelRadius * 1.5}px` }}
            />
            <div className="pl-[20px] text-start flex-col">
              <div className="font-bold text-lg">{selectedStation.name}</div>
              <div className="text-sm">{selectedStation.description}</div>
              <div className="text-sm">now playing place holder ... tbc</div>
            </div>
          </div>
        )}
      </div>
      {/* Mobile Layout */}
      <div className={`height-mobile md:hidden flex flex-col items-center justify-center gap-4 p-4 mt-[100px]`}>
        {stations.map((station) => {
          const imagePath = `/radio_icons/${station.image}`;

          return (
            <button
              key={station.name}
              style={{
                opacity: selectedStation?.name === station.name ? 1 : 0.6,
                transition: "transform 0.3s ease",
                borderColor: selectedStation?.name === station.name ? "blue" : "gray",
                borderWidth: selectedStation?.name === station.name ? "4px" : "2px",
                scale: selectedStation?.name === station.name ? 1.025 : 1,
              }}
              className="flex justify-start items-center w-full rounded-xl outline outline-[2px] outline-black/10 bg-black/10"
              onClick={() => {
                loadVideo(station);
              }}
            >
              <img
                src={imagePath}
                alt={station.description}
                className=" flex justify-center items-center m-2 w-11/12"
                style={{ width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}
              />
              <div className="flex flex-col justify-center items-start">
                <div className="font-bold text-xl text-start">{station.name}</div>
                <div className="pl-1 text-start">{station.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div id="youtube-player" className=""></div>

      {/* Desktop Layout Alternative */}
      <div className={` h-[(100vh+600px)]     ${isWheelVisible ? "md:hidden" : "md:block"} hidden `}>
        {/* Desktop Now Playing Bar */}
        <div className=" flex fixed top-0 left-0 w-full h-[100px] bg-black text-white  items-center  z-10 justify-end">
          {selectedStation && (
            <div className="flex flex-row justify-start items-center w-2/3 pl-[75px]">
              <img
                src={`/radio_icons/${selectedStation.image}`}
                alt={selectedStation.name}
                className=" flex justify-center items-center m-2 w-11/12"
                style={{ width: `${wheelRadius * 1.5}px`, height: `${wheelRadius * 1.5}px` }}
              />
              <div className="pl-[20px] text-start flex-col">
                <div className="font-bold text-lg">{selectedStation.name}</div>
                <div className="text-sm">{selectedStation.description}</div>
                <div className="text-sm">now playing place holder ... tbc</div>
              </div>
            </div>
          )}

          <div className="flex  justify-end items-center  w-1/3">
            {/* volume button */}
            <div className=" flex flex-row items-center justify-center gap-2">
              {volume === 0 ? (
                <button className="md:cursor-none" onClick={handleUnmute}>
                  <img src="/mute.png" alt="Mute" style={{ width: "25px", height: "25px" }} />
                </button>
              ) : (
                <button className="md:cursor-none" onClick={handleMute}>
                  <img src="/unmute.png" alt="Unmute" style={{ width: "25px", height: "25px" }} />
                </button>
              )}
              <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(e.target.value)} />
            </div>
            {/* Toggle Switch for Desktop Mode */}
            <div className="flex justify-center items-center  ">
              <button onClick={toggleWheelVisibility} className="p-2 bg-gray-300 rounded cursor-none">
                {isWheelVisible ? "List" : "Wheel"}
              </button>
            </div>
          </div>
        </div>
        {/* alt Desktop Layout */}

        <div className={` grid md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3    items-center justify-center gap-4 p-4 mt-[100px]`}>
          {stations.map((station) => {
            const imagePath = `/radio_icons/${station.image}`;

            return (
              <button
                key={station.name}
                style={{
                  opacity: selectedStation?.name === station.name ? 1 : 0.6,
                  transition: "transform 0.3s ease",
                  borderColor: selectedStation?.name === station.name ? "blue" : "gray",
                  borderWidth: selectedStation?.name === station.name ? "4px" : "2px",
                  scale: selectedStation?.name === station.name ? 1.025 : 1,
                }}
                className="flex justify-start items-center w-full rounded-xl outline outline-[2px] outline-black/10 bg-black/10 cursor-none"
                onClick={() => {
                  loadVideo(station);
                }}
              >
                <img
                  src={imagePath}
                  alt={station.description}
                  className=" flex justify-center items-center m-2 w-11/12"
                  style={{ width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}
                />
                <div className="flex flex-col justify-center items-start">
                  <div className="font-bold text-xl text-start">{station.name}</div>
                  <div className="pl-1 text-start">{station.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className={`height-desktop ${isWheelVisible ? "" : "md:hidden"} hidden md:flex `}
        style={{ position: "relative", width: `${wheelRadius * 2}vh`, height: `${wheelRadius * 2}vh` }}
      >
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
            width: "001px", // Adjust width as needed
            height: "001px", // Adjust height as needed
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
            {/* Volume Control Slider */}
            <div className={` hidden md:flex flex-row items-center justify-center gap-2    ${isWheelVisible ? "md:block" : "md:hidden"}  `}>
              {volume === 0 ? (
                <button className="md:cursor-none" onClick={handleUnmute}>
                  <img src="/mute.png" alt="Mute" style={{ width: "25px", height: "25px" }} />
                </button>
              ) : (
                <button className="md:cursor-none" onClick={handleMute}>
                  <img src="/unmute.png" alt="Unmute" style={{ width: "25px", height: "25px" }} />
                </button>
              )}
              <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Switch for Desktop Mode */}
      <div className={` hidden md:flex justify-center items-center fixed top-[28px] right-[2px]   ${isWheelVisible ? "md:block" : "md:hidden"}  `}>
        <button onClick={toggleWheelVisibility} className="p-2 px-4 bg-gray-300 rounded cursor-none">
          {isWheelVisible ? "List" : "Wheel"}
        </button>
      </div>
    </main>
  );
}
