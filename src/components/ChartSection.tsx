import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";

interface ChartSectionProps {
  data: [];
}

const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  const [uniqueLatLong, setUniqueLatLong] = useState<[]>([]);
  const [uniqueAsset, setUniqueAsset] = useState<[]>([]);
  const [uniqueBusiness, setUniqueBusiness] = useState<[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>("All");
  const [selectedAsset, setSelectedAsset] = useState<string>("All");
  const [selectedBusiness, setSelectedBusiness] = useState<string>("All");

  useEffect(() => {
    // get unique values for Location, Asset Name and Business Category
    if (data) {
      const allLatLong = data.map((row) => {
        return [row["Lat"], row["Long"]];
      });

      let uniqueLatLong = Array.from(
        new Set(allLatLong.map(JSON.stringify))
      ).map(JSON.parse);

      setUniqueLatLong(["All"].concat(uniqueLatLong));

      const allAsset = data.map((row) => {
        return row["Asset Name"];
      });

      let uniqueAsset: Set<number> = new Set<number>(allAsset);
      setUniqueAsset(["All"].concat(Array.from(uniqueAsset.values())));

      const allBusiness = data.map((row) => {
        return row["Business Category"];
      });

      let uniqueBusiness: Set<number> = new Set<number>(allBusiness);
      setUniqueBusiness(["All"].concat(Array.from(uniqueBusiness.values())));
    }
  }, [data]);

  const handleDropdownSelect = (selectedVal: any, type: string) => {
    if (type == "location") {
      setSelectedLocation(selectedVal);
    }
    if (type == "asset") {
      setSelectedAsset(selectedVal);
    }
    if (type == "business") {
      setSelectedBusiness(selectedVal);
    }

    console.log(selectedLocation, selectedBusiness, selectedAsset);
  };

  return (
    <div className="flex justify-evenly">
      <Dropdown
        label={selectedLocation == "All" ? "Location (All)" : selectedLocation}
      >
        {uniqueLatLong.map((location) => {
          return (
            <Dropdown.Item
              key={`${location[0]}, ${location[1]}`}
              onClick={() => {
                handleDropdownSelect(location, "location");
              }}
            >
              {location == "All" ? "All" : `${location[0]}, ${location[1]}`}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
      <Dropdown
        label={selectedAsset == "All" ? "Asset Name (All)" : selectedAsset}
      >
        {uniqueAsset.map((asset) => {
          return (
            <Dropdown.Item
              key={asset}
              onClick={() => {
                handleDropdownSelect(asset, "asset");
              }}
            >
              {asset}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
      <Dropdown
        label={
          selectedBusiness == "All"
            ? "Business Category (All)"
            : selectedBusiness
        }
      >
        {uniqueBusiness.map((business) => {
          return (
            <Dropdown.Item
              key={business}
              onClick={() => {
                handleDropdownSelect(business, "business");
              }}
            >
              {business}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

export default ChartSection;
