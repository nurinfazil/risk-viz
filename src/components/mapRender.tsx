import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { Dropdown } from "flowbite-react";

type Data = {
  assetName: string;
  lat: string;
  long: string;
  businessCategory: string;
  riskRating: string;
  riskFactors: object;
};

interface Values {
  data: Data[];
}

const MapRender: NextPage<Values> = ({ data }) => {
  const [libraries] = useState(["places"]);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
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

  let allYears: number[] = [];
  let uniqueYears: number[] = [];

  if (data) {
    allYears = data.data.map((entry) => {
      return parseInt(entry.year);
    });

    uniqueYears = new Set<number>(allYears);
  }

  return (
    <div>
      <Dropdown label="Select Decade">
        {Array.from(uniqueYears.values())
          .sort()
          .map((year) => {
            return <Dropdown.Item>{year}</Dropdown.Item>;
          })}
      </Dropdown>
      <div className="pt-10">
        <GoogleMap
          options={mapOptions}
          zoom={2}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "800px", height: "800px" }}
          onLoad={() => console.log("Map Component Loaded...")}
        />
      </div>
    </div>
  );
};

export default MapRender;
