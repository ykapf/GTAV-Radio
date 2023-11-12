"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import Papa from "papaparse";

type Station = {
  name: string;
  description: string;
  image: string;
};

type RadioWheelProps = {};

export default function RadioWheel({}: RadioWheelProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const wheelRadius = 400; // radius of the wheel in pixels

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
      transform: `rotate(${angle}deg) translate(${wheelRadius}px) rotate(-${angle}deg) translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
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
      borderColor: selectedStation === stationName ? "blue" : "gray",
      borderWidth: selectedStation === stationName ? "6px" : "4px",
      opacity: selectedStation === stationName ? 1 : 0.5,
    };
  };

  return (
    <div className="" style={{ position: "relative", width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}>
      {stations.map((station, index) => {
        const angle = (90 + (360 / stations.length) * index) % 360;
        const isHovered = station.name === hoveredStation;
        const style = getStationStyle(angle, isHovered, station.name);
        const imagePath = `/radio_icons/${station.image}`;

        return (
          <button
            key={station.name}
            className="rounded-full flex justify-center items-center"
            style={style}
            onMouseEnter={() => setHoveredStation(station.name)}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={() => setSelectedStation(station.name)}
          >
            <img src={imagePath} alt={station.description} style={{ maxWidth: "100%", maxHeight: "100%" }} />
          </button>
        );
      })}
    </div>
  );
}
