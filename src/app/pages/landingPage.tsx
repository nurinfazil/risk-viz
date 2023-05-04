"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Papa, { ParseResult } from "papaparse";
import MapRender from "@/components/MapRender";
import { Dropdown } from "flowbite-react";

const inter = Inter({ subsets: ["latin"] });

// I integrated the Google Maps API following this tutorial as a guide: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps/
export default function LandingPage() {
  type Data = {
    assetName: string;
    lat: string;
    long: string;
    businessCategory: string;
    riskRating: string;
    riskFactors: object;
    year: string;
  };

  type Values = {
    data: Data[];
  };

  const [values, setValues] = useState<Values | undefined>();
  const [decade, setDecade] = useState<number>(0);

  useEffect(() => {
    Papa.parse("/data.csv", {
      header: true,
      // convert headers to camel case
      transformHeader: (headerName: string) => {
        let headerArray = headerName.split(" ");
        if (headerArray.length > 1) {
          let modHeaderName =
            headerArray[0].toLowerCase() +
            headerArray[1].slice(0, 1).toUpperCase() +
            headerArray[1].slice(1);
          return modHeaderName;
        } else {
          return headerName.toLowerCase();
        }
      },
      transform: (value: string, headerName: string) => {
        if (headerName == "riskFactors") {
          return JSON.parse(value);
        } else {
          return value;
        }
      },
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (results: ParseResult<Data>) => {
        setValues(results);
      },
    });
  }, []);

  let allYears: number[] = [];
  let uniqueYears: Set<number> = new Set([]);

  if (values) {
    allYears = values.data.map((entry) => {
      return parseInt(entry.year);
    });

    uniqueYears = new Set<number>(allYears);
  }

  const handleDropdownSelect = (year) => {
    setDecade(year);
  };

  return (
    <div>
      <div className="pt-10 pl-10">
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
    </div>
  );
}
