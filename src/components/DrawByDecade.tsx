import { MarkerF } from "@react-google-maps/api";
import React from "react";

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
  if (decade == 0) {
    return (
      <>
        {data.map((entry: Data, i) => {
          return (
            <MarkerF
              key={`${entry.lat}${entry.long}${i}`}
              position={{
                lat: parseFloat(entry.lat),
                lng: parseFloat(entry.long),
              }}
            />
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
              <MarkerF
                key={`${entry.lat}${entry.long}${i}`}
                position={{
                  lat: parseFloat(entry.lat),
                  lng: parseFloat(entry.long),
                }}
              />
            );
          }
        })}
      </>
    );
};

export default DrawByDecade;
