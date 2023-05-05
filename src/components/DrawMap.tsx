// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

interface DrawMapProps {
  data: [];
  setSelectedLocation: any;
}

const DrawMap: React.FC<DrawMapProps> = ({ data, setSelectedLocation }) => {
  // Group markers by the lat and long locations
  const [reformattedData, setReformattedData] = useState<any>({});
  const [activeMarker, setActiveMarker] = useState<null | number>(null);

  function getMarkerIcon(value: number) {
    let riskVals = Object.keys(reformattedData).map((location) => {
      return reformattedData[location]["Risk Rating"];
    });

    let maxValue = Math.max(...riskVals);
    let minValue = Math.min(...riskVals);

    // This logic was derived with the help of chat GPT
    // I asked, "Given a maximum value and minimum value, how can I output a colour between yellow (min) and red (max)?"
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

  // This logic implements clustering on the map. Since many points overlap each other on the map, the map becomes
  // glitchy when the user interacts with it. To make the interface smoother, I grouped data points at the same location
  // into one marker.

  // The logic in the useEffect below creates an object which has:
  // key: tuple of unique lat,long pair
  // value: {
  //         Asset Names: array of Asset Names at the (lat, long) location,
  //         Business Categories: array of Business Catergories at the (lat, long) location,
  //         Risk Rating: Sum of risk ratings at the (lat, long) location. Can be used to determine how high the risk is at the location.
  //        }

  // The object gets stored in the reformattedData state.
  useEffect(() => {
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

      setReformattedData(newData);
    }
  }, [data]);

  return (
    <>
      {/* Display the markers from reformattedData on the map */}
      {Object.keys(reformattedData).map((location: any, i) => {
        const markerIcon = getMarkerIcon(
          reformattedData[location]["Risk Rating"]
        );

        const lat = parseFloat(location.substring(0, location.indexOf(",")));
        const long = parseFloat(
          location.substring(location.indexOf(",") + 1, location.length)
        );

        return (
          <Marker
            key={location}
            onMouseOver={() => setActiveMarker(i)}
            onMouseOut={() => setActiveMarker(null)}
            icon={markerIcon}
            position={{
              lat: lat,
              lng: long,
            }}
            onClick={() => {
              setSelectedLocation([lat, long]);
            }}
          >
            {" "}
            {activeMarker === i && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-black">
                  <div>
                    <strong>Location: </strong>
                    {`${lat}, ${long}`}
                  </div>
                  <br></br>
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
