import React, { use, useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import DataChart from "./DataChart";

interface ChartSectionProps {
  data: [];
  decade: number;
}

const ChartSection: React.FC<ChartSectionProps> = ({ data, decade }) => {
  const [uniqueLatLong, setUniqueLatLong] = useState<[]>([]);
  const [uniqueAsset, setUniqueAsset] = useState<[]>([]);
  const [uniqueBusiness, setUniqueBusiness] = useState<[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>("All");
  const [selectedAsset, setSelectedAsset] = useState<string>("All");
  const [selectedBusiness, setSelectedBusiness] = useState<string>("All");
  const [filteredData, setFilteredData] = useState<[]>([]);

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

      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    var modifiedData: any = data;

    // Filter by decade
    if (decade !== 0) {
      modifiedData = modifiedData.filter((row: any) => {
        const year = parseInt(row["Year"]);
        return year == decade;
      });
    }

    // Filter by location
    if (selectedLocation !== "All") {
      modifiedData = modifiedData.filter((row: any) => {
        const lat = row["Lat"];
        const long = row["Long"];

        return selectedLocation[0] == lat && selectedLocation[1] == long;
      });
    }

    // Filter by asset name
    if (selectedAsset !== "All") {
      modifiedData = modifiedData.filter((row: any) => {
        return selectedAsset == row["Asset Name"];
      });
    }

    // Filter by business name
    if (selectedBusiness !== "All") {
      modifiedData = modifiedData.filter((row: any) => {
        return selectedBusiness == row["Business Category"];
      });
    }

    setFilteredData(modifiedData);
  }, [selectedLocation, selectedBusiness, selectedAsset, decade]);

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
  };

  return (
    <div>
      <div className="flex justify-evenly">
        <Dropdown
          label={
            selectedLocation == "All"
              ? "Location (All)"
              : `${selectedLocation[0]}, ${selectedLocation[1]}`
          }
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
      <DataChart filteredData={filteredData} />
    </div>
  );
};

export default ChartSection;
