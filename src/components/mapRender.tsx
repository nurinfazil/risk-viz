import { useMemo, useState, useEffect } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import type { NextPage } from "next";
import DrawMap from "./DrawMap";

interface Values {
  data: [];
  decade: number;
  setSelectedLocation: any;
}

// This page renders the Map
// I integrated the Google Maps API following this tutorial: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps/
const MapRender: NextPage<Values> = ({ data, decade, setSelectedLocation }) => {
  const [libraries] = useState(["places"]);
  const mapCenter = useMemo(() => ({ lat: 50.027558, lng: -104.597682 }), []);
  const [filteredData, setFilteredData] = useState<any>(data);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  // Updates data shown on the map depending on the decade
  // 0 means no decade is chosen
  useEffect(() => {
    if (data) {
      if (decade == 0) {
        setFilteredData(data);
      } else {
        let filter = data.filter((entry) => {
          return entry["Year"] == decade;
        });
        setFilteredData(filter);
      }
    }
  }, [data, decade]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="pt-2">
        <GoogleMap
          options={mapOptions}
          zoom={4}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "50vh" }}
        >
          <DrawMap
            data={filteredData}
            setSelectedLocation={setSelectedLocation}
          />
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapRender;
