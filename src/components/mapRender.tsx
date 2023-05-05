import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import DrawByDecade from "./DrawByDecade";

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
          <DrawByDecade data={data} decade={decade} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapRender;
