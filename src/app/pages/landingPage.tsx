"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "flowbite-react";

import Papa from "papaparse";
import MapRender from "../../components/mapRender";
import DataTable from "../../components/DataTable";
import DataChart from "../../components/DataChart";

export default function LandingPage() {
  const [values, setValues] = useState<[] | undefined>();
  const [decade, setDecade] = useState<number>(0);
  const [headerNames, setHeaderNames] = useState<string[]>([]);
  const [uniqueLatLong, setUniqueLatLong] = useState<string[]>([]);
  const [uniqueAsset, setUniqueAsset] = useState<string[]>([]);
  const [uniqueBusiness, setUniqueBusiness] = useState<string[]>([]);
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
    // I followed this tutorial to understand how to parse a csv: https://dev.to/mahdi_falamarzi/how-to-read-csv-file-in-typescript-react-app-106h
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
      complete: (results: any) => {
        // Integrate each of the risk factors into the data as columns
        const newData: any = [];
        results.data.forEach((row: any) => {
          const newRow = { ...row };
          riskFactorNames.forEach((header) => {
            newRow[header] = row["Risk Factors"]
              ? row["Risk Factors"][header] || 0
              : 0;
          });
          newData.push(newRow);
        });

        setValues(newData);
      },
    });
  }, []);

  useEffect(() => {
    // Get unique values for Location, Asset Name and Business Category
    if (values) {
      const allLatLong = values.map((row) => {
        return [row["Lat"], row["Long"]];
      });

      let uniqueLatLong = Array.from(
        new Set(allLatLong.map((latLong) => JSON.stringify(latLong, null, 2)))
      ).map((str) => JSON.parse(str, undefined));

      setUniqueLatLong((prevState) => ["All"].concat(uniqueLatLong));

      const allAsset = values.map((row) => {
        return row["Asset Name"];
      });

      let uniqueAsset: Set<any> = new Set<any>(allAsset);
      setUniqueAsset(["All"].concat(Array.from(uniqueAsset.values())));

      const allBusiness = values.map((row) => {
        return row["Business Category"];
      });

      let uniqueBusiness: Set<any> = new Set<any>(allBusiness);
      setUniqueBusiness(["All"].concat(Array.from(uniqueBusiness.values())));

      setFilteredData(values);
    }
  }, [values]);

  // If any of the filters change (location, asset or business), this useEffect is called to filter the data
  useEffect(() => {
    var modifiedData: any = values;

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

  let allYears: any[] = [];
  let uniqueYears: Set<any> = new Set([]);

  if (values) {
    allYears = values.map((entry) => {
      return parseInt(entry["Year"]);
    });

    uniqueYears = new Set<number>(allYears);
  }

  const handleDropdownSelect = (year: any) => {
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
      <div className="text-4xl text-center pt-5">
        Risk Visualization in Canada
      </div>

      <p className="text-center pt-3">
        Use this application to visualize risk data in Canada via an interactive
        map, table and chart. Data comes from the{" "}
        <Link
          href="https://docs.google.com/spreadsheets/d/1Y_yiT-_7IimioBvcqiCPwLzTLazfdRyzZ4k3cpQXiAw/edit?usp=sharing"
          rel="noopener noreferrer"
          target="_blank"
        >
          <u>Climate Risk Rating dataset</u>
        </Link>
        .
      </p>

      {/* FILTERS */}
      <div className="flex pt-5 justify-evenly pb-5">
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
          <div className="max-h-96 overflow-y-scroll">
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
          </div>
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

      {/* MAP */}
      {values ? (
        <MapRender
          data={filteredData}
          decade={decade}
          setSelectedLocation={setSelectedLocation}
        />
      ) : null}

      {/* TABLE */}
      <DataTable
        data={filteredData}
        decade={decade}
        headerNames={headerNames}
      />

      {/* CHART */}
      <div className="pt-5">
        <DataChart filteredData={filteredData} />
      </div>
      <br></br>
      <p className="text-center pt-3">
        Copyright © 2023{" "}
        <Link
          href="https://nurinfazil.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <u>Nurin Fazil</u>
        </Link>
      </p>
    </div>
  );
}
