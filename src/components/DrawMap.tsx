// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

interface DrawMapProps {
  data: [];
  decade: number;
}

const DrawMap: React.FC<DrawMapProps> = ({ data, decade }) => {
  // Group markers by the lat and long locations
  const [uniqueLatLong, setUniqueLatLong] = useState<[]>([]);
  const [reformattedData, setReformattedData] = useState<any>({});
  const [activeMarker, setActiveMarker] = useState<null | number>(null);

  function getMarkerIcon(value: number) {
    let riskVals = Object.keys(reformattedData).map((location) => {
      return reformattedData[location]["Risk Rating"];
    });

    let maxValue = Math.max(...riskVals);
    let minValue = Math.min(...riskVals);

    // This logic was derived with the help of chat GPT
    const range = maxValue - minValue;
    const normalizedValue = (value - minValue) / range;
    const hue = Math.floor((1 - normalizedValue) * 60);
    const color = `hsl(${hue}, 100%, 50%)`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='${color}'%3e%3ccircle cx='12' cy='12' r='8'/%3e%3c/svg%3e`,
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: { x: 12, y: 12 },
    };
  }

  useEffect(() => {
    // get unique values for Location, Asset Name and Business Category
    if (data) {
      const allLatLong = data.map((row) => {
        return [row["Lat"], row["Long"]];
      });

      let uniqueLatLong = Array.from(
        new Set(allLatLong.map((latLong) => JSON.stringify(latLong, null, 2)))
      ).map((str) => JSON.parse(str, undefined));

      let newData: any = {};
      uniqueLatLong.map((location) => {
        newData[location] = {
          "Asset Names": [],
          "Business Categories": [],
          "Risk Rating": 0,
        };
      });

      data.map((entry) => {
        Object.keys(newData).map((location) => {
          let lat = location.substring(0, location.indexOf(","));
          let long = location.substring(
            location.indexOf(",") + 1,
            location.length
          );
          if (entry["Lat"] == lat && entry["Long"] == long) {
            if (
              !newData[location]["Asset Names"].includes(entry["Asset Name"])
            ) {
              newData[location]["Asset Names"].push(entry["Asset Name"]);
            }

            if (
              !newData[location]["Business Categories"].includes(
                entry["Business Category"]
              )
            ) {
              newData[location]["Business Categories"].push(
                entry["Business Category"]
              );
            }

            newData[location]["Risk Rating"] += parseFloat(
              entry["Risk Rating"]
            );
          }
        });
      });

      //   setUniqueLatLong(uniqueLatLong);
      //   console.log(newData);
      setReformattedData(newData);
    }
  }, [data]);

  return (
    <>
      {Object.keys(reformattedData).map((location: any, i) => {
        const markerIcon = getMarkerIcon(
          reformattedData[location]["Risk Rating"]
        );

        return (
          <Marker
            key={location}
            onMouseOver={() => setActiveMarker(i)}
            onMouseOut={() => setActiveMarker(null)}
            icon={markerIcon}
            position={{
              lat: parseFloat(location.substring(0, location.indexOf(","))),
              lng: parseFloat(
                location.substring(location.indexOf(",") + 1, location.length)
              ),
            }}
          >
            {" "}
            {activeMarker === i && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-black">
                  <div>
                    <strong>Asset Names:</strong>{" "}
                    {reformattedData[location]["Asset Names"].reduce(
                      (acc, curr) => {
                        return (acc += " " + curr + ", ");
                      },
                      ""
                    )}
                  </div>
                  <br></br>
                  <div>
                    <strong>Business Catergories:</strong>{" "}
                    {reformattedData[location]["Business Categories"].reduce(
                      (acc, curr) => {
                        return (acc += " " + curr + ", ");
                      },
                      ""
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default DrawMap;
