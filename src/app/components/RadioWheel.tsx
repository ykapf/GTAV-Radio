"use client";

import React, { CSSProperties } from "react";

type RadioWheelProps = {};

export default function RadioWheel({}: RadioWheelProps) {
  const stations = [
    "radio_1",
    "radio_2",
    "radio_3",
    "radio_4",
    "radio_5",
    "radio_6",
    "radio_7",
    "radio_8",
    "radio_9",
    "radio_10",
    "radio_11",
    "radio_12",
    "radio_13",
    "radio_14",
    "radio_15",
    "radio_16",
    "radio_17",
    "radio_18",
    "radio_19",
    "radio_20",
    "radio_21",
    "radio_22",
    "radio_23",
    "radio_24",
    "radio_25",
    "radio_26",
  ];
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
      className="absolute wheel-container rounded-full justify-center items-center border-4 border-yellow-500"
      style={{ position: "relative", width: `${wheelRadius * 2}px`, height: `${wheelRadius * 2}px` }}
    >
      <div className="relative h-full w-[1px] left-[50%] bg-red-500"></div> {/*  testing guide lines */}
      <div className="relative w-full h-[1px] top-[-50%] bg-red-500"></div> {/*  testing guide lines */}
      {stations.map((station, index) => {
        const angle = (90 + (360 / stations.length) * index) % 360;
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
