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
  data: Data[];
  decade: number;
}

const DrawByDecade: React.FC<DrawbyDecadeProps> = ({ data, decade }) => {
  const [activeMarker, setActiveMarker] = useState<null | number>(null);

  if (decade == 0) {
    return (
      <>
        {data.map((entry: Data, i) => {
          return (
            <Marker
              key={`${entry.lat}${entry.long}${i}`}
              position={{
                lat: parseFloat(entry.lat),
                lng: parseFloat(entry.long),
              }}
              onMouseOver={() => setActiveMarker(i)}
              onMouseOut={() => setActiveMarker(null)}
            >
              {activeMarker === i && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="text-black">
                    <div>Asset Name: {entry.assetName}</div>
                    <div>Business Category: {entry.businessCategory}</div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </>
    );
  } else
    return (
      <>
        {data.map((entry: Data, i) => {
          if (parseInt(entry.year) == decade) {
            return (
              <Marker
                key={`${entry.lat}${entry.long}${i}`}
                position={{
                  lat: parseFloat(entry.lat),
                  lng: parseFloat(entry.long),
                }}
                onMouseOver={() => setActiveMarker(i)}
                onMouseOut={() => setActiveMarker(null)}
              >
                {activeMarker === i && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div className="text-black">
                      <div>Asset Name: {entry.assetName}</div>
                      <div>Business Category: {entry.businessCategory}</div>
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
