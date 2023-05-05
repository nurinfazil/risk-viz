"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Papa, { ParseResult } from "papaparse";
import MapRender from "@/components/MapRender";
import DataTable from "@/components/DataTable";
import { Dropdown } from "flowbite-react";
import DataChart from "@/components/DataChart";

const inter = Inter({ subsets: ["latin"] });

// I integrated the Google Maps API following this tutorial as a guide: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps/
export default function LandingPage() {
  const [values, setValues] = useState<[] | undefined>();
  const [decade, setDecade] = useState<number>(0);
  const [headerNames, setHeaderNames] = useState<string[]>([]);
  const [uniqueLatLong, setUniqueLatLong] = useState<[]>([]);
  const [uniqueAsset, setUniqueAsset] = useState<[]>([]);
  const [uniqueBusiness, setUniqueBusiness] = useState<[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>("All");
  const [selectedAsset, setSelectedAsset] = useState<string>("All");
  const [selectedBusiness, setSelectedBusiness] = useState<string>("All");
  const [filteredData, setFilteredData] = useState<[]>([]);
  const riskFactorNames = [
    "Earthquake",
    "Extreme heat",
    "Wildfire",
    "Tornado",
    "Flooding",
    "Volcano",
    "Hurricane",
    "Extreme cold",
    "Drought",
    "Sea level rise",
  ];

  useEffect(() => {
    Papa.parse("/data.csv", {
      header: true,

      transformHeader: (headerName: string) => {
        // Get header names for the data table
        let headerNamesCopy = headerNames;
        if (!headerNamesCopy.includes(headerName)) {
          if (headerName == "Risk Factors") {
            headerNamesCopy = headerNamesCopy.concat(riskFactorNames);
            setHeaderNames(headerNamesCopy);
          } else {
            headerNamesCopy.push(headerName);
            setHeaderNames(headerNamesCopy);
          }
        }

        return headerName;
      },
      transform: (value: string, headerName: string) => {
        if (headerName == "Risk Factors") {
          return JSON.parse(value);
        } else {
          return value;
        }
      },
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (results: ParseResult<Data>) => {
        const newData = [];
        results.data.forEach((row: any) => {
          const newRow = { ...row };
          riskFactorNames.forEach((header) => {
            newRow[header] = row["Risk Factors"]
              ? row["Risk Factors"][header] || 0
              : 0;
          });
          newData.push(newRow);
        });

        // console.log(newData);
        setValues(newData);
      },
    });
  }, []);

  useEffect(() => {
    // get unique values for Location, Asset Name and Business Category
    if (values) {
      const allLatLong = values.map((row) => {
        return [row["Lat"], row["Long"]];
      });

      let uniqueLatLong = Array.from(
        new Set(allLatLong.map(JSON.stringify))
      ).map(JSON.parse);

      setUniqueLatLong(["All"].concat(uniqueLatLong));

      const allAsset = values.map((row) => {
        return row["Asset Name"];
      });

      let uniqueAsset: Set<number> = new Set<number>(allAsset);
      setUniqueAsset(["All"].concat(Array.from(uniqueAsset.values())));

      const allBusiness = values.map((row) => {
        return row["Business Category"];
      });

      let uniqueBusiness: Set<number> = new Set<number>(allBusiness);
      setUniqueBusiness(["All"].concat(Array.from(uniqueBusiness.values())));

      setFilteredData(values);
    }
  }, [values]);

  useEffect(() => {
    var modifiedData: any = values;

    // Filter by decade
    // if (decade !== 0) {
    //   modifiedData = modifiedData.filter((row: any) => {
    //     const year = parseInt(row["Year"]);
    //     return year == decade;
    //   });
    // }

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
  }, [selectedLocation, selectedBusiness, selectedAsset]);

  let allYears: number[] = [];
  let uniqueYears: Set<number> = new Set([]);

  if (values) {
    allYears = values.map((entry) => {
      return parseInt(entry["Year"]);
    });

    uniqueYears = new Set<number>(allYears);
  }

  const handleDropdownSelect = (year) => {
    setDecade(year);
  };

  const handleChartDropdownSelect = (selectedVal: any, type: string) => {
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
    <div className="w-full mx-10">
      <h1 className="text-4xl text-center pt-5">RiskThinking AI Assessment</h1>

      <div className="pt-5 pl-10 w-full flex justify-center ">
        <Dropdown label={decade == 0 ? "Select Decade" : `${decade}s`}>
          {Array.from(uniqueYears.values())
            .sort()
            .map((year) => {
              return (
                <Dropdown.Item
                  key={year}
                  onClick={() => {
                    handleDropdownSelect(year);
                  }}
                >
                  {" "}
                  {`${year}`}s
                </Dropdown.Item>
              );
            })}
        </Dropdown>
      </div>

      {values ? <MapRender data={filteredData} decade={decade} /> : null}

      <div>
        <DataTable
          data={filteredData}
          decade={decade}
          headerNames={headerNames}
        />
      </div>

      <div className="pt-5">
        <div className="flex justify-evenly pb-5">
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
                    handleChartDropdownSelect(location, "location");
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
                    handleChartDropdownSelect(asset, "asset");
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
                    handleChartDropdownSelect(business, "business");
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
    </div>
  );
}
