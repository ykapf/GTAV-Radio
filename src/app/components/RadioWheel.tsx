"use client";

import React, { CSSProperties } from "react";

type RadioWheelProps = {};

export default function RadioWheel({}: RadioWheelProps) {
  const stations = ["test_radio_1", "test_radio_2", "test_radio_3"];
  const wheelRadius = 400; // radius of the wheel in pixels

  const getStationStyle = (angle: number): CSSProperties => {
    const stationWidth = 100; // width of each station in pixels
    const stationHeight = 100; // height of each station in pixels

    return {
      // Position the center of the station on the circle's border
      transform: `rotate(${angle}deg) translate(${wheelRadius}px) rotate(-${angle}deg) translate(-50%, -50%)`,
      position: "absolute",
      top: "50%",
      left: "50%",
      transformOrigin: "0 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${stationWidth}px`, // adjust as needed
      height: `${stationHeight}px`, // adjust as needed
    };
  };

  return (
    <div
      className="wheel-container rounded-full justify-center items-center border-4 border-yellow-500"
      style={{ position: "relative", width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}
    >
      {stations.map((station, index) => {
        const angle = (360 / stations.length) * index;
        const style = getStationStyle(angle);

        return (
          <div key={station} className="rounded-full border-4 border-blue-500 justify-center items-center " style={style}>
            {station}
          </div>
        );
      })}
    </div>
  );
}
