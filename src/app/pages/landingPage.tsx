"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Papa, { ParseResult } from "papaparse";
import MapRender from "@/components/mapRender";

const inter = Inter({ subsets: ["latin"] });

export default function LandingPage() {
  type Data = {
    assetName: string;
    lat: string;
    long: string;
    businessCategory: string;
    riskRating: string;
    riskFactors: object;
  };

  type Values = {
    data: Data[];
  };

  const [values, setValues] = useState<Values | undefined>();

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

  console.log(values);

  return (
    <div>
      <MapRender />
    </div>
  );
}
