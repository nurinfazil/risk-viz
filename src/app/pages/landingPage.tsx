"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Papa, { ParseResult } from "papaparse";
import MapRender from "@/components/MapRender";
import DataTable from "@/components/DataTable";
import { Dropdown } from "flowbite-react";

const inter = Inter({ subsets: ["latin"] });

// I integrated the Google Maps API following this tutorial as a guide: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps/
export default function LandingPage() {
  const [values, setValues] = useState<[] | undefined>();
  const [decade, setDecade] = useState<number>(0);
  const [headerNames, setHeaderNames] = useState<string[]>([]);
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
        // Convert headers to camel case
        // let headerArray = headerName.split(" ");
        // if (headerArray.length > 1) {
        //   let modHeaderName =
        //     headerArray[0].toLowerCase() +
        //     headerArray[1].slice(0, 1).toUpperCase() +
        //     headerArray[1].slice(1);
        //   return modHeaderName;
        // } else {
        //   return headerName.toLowerCase();
        // }

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

      {values ? <MapRender data={values} decade={decade} /> : null}

      <div>
        <DataTable data={values} decade={decade} headerNames={headerNames} />
      </div>

      <div>Charts</div>
    </div>
  );
}
