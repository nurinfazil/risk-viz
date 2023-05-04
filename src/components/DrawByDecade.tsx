import { Marker, InfoWindow } from "@react-google-maps/api";
import React, { useState } from "react";

type Data = {
  assetName: string;
  lat: string;
  long: string;
  businessCategory: string;
  riskRating: string;
  riskFactors: object;
  year: string;
};

interface DrawbyDecadeProps {
  data: [];
  decade: number;
}

const DrawByDecade: React.FC<DrawbyDecadeProps> = ({ data, decade }) => {
  const [activeMarker, setActiveMarker] = useState<null | number>(null);
  function getMarkerIcon(value: number) {
    const hue = Math.floor((1 - value) * 120);
    const color = `hsl(${hue}, 100%, 50%)`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='${color}'%3e%3ccircle cx='12' cy='12' r='8'/%3e%3c/svg%3e`,
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: { x: 12, y: 12 },
    };
  }

  return (
    <>
      {data.map((entry: any, i) => {
        const markerIcon = getMarkerIcon(parseFloat(entry["Risk Rating"]));

        if (decade === 0) {
          return (
            <Marker
              key={`${entry["Lat"]}${entry["Long"]}${i}`}
              position={{
                lat: parseFloat(entry["Lat"]),
                lng: parseFloat(entry["Long"]),
              }}
              onMouseOver={() => setActiveMarker(i)}
              onMouseOut={() => setActiveMarker(null)}
              icon={markerIcon}
            >
              {activeMarker === i && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="text-black">
                    <div>Asset Name: {entry["Asset Name"]}</div>
                    <div>Business Category: {entry["Business Category"]}</div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        } else if (parseInt(entry["Year"]) === decade) {
          return (
            <Marker
              key={`${entry.lat}${entry.long}${i}`}
              position={{
                lat: parseFloat(entry["Lat"]),
                lng: parseFloat(entry["Long"]),
              }}
              onMouseOver={() => setActiveMarker(i)}
              onMouseOut={() => setActiveMarker(null)}
              icon={markerIcon}
            >
              {activeMarker === i && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="text-black">
                    <div>Asset Name: {entry["Asset Name"]}</div>
                    <div>Business Category: {entry["Business Category"]}</div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        }
      })}
    </>
  );
};

export default DrawByDecade;
