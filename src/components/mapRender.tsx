import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useMemo, useState, useEffect, use } from "react";
import DrawByDecade from "./DrawByDecade";
import DrawMap from "./DrawMap";

type Data = {
  assetName: string;
  lat: string;
  long: string;
  businessCategory: string;
  riskRating: string;
  riskFactors: object;
  year: string;
};

interface Values {
  data: [];
  decade: number;
}

const MapRender: NextPage<Values> = ({ data, decade }) => {
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
          onLoad={() => console.log("Map Component Loaded...")}
        >
          {/* <DrawByDecade data={data} decade={decade} /> */}
          {/* // TODO: filter data by decade */}
          <DrawMap data={filteredData} decade={decade} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapRender;
