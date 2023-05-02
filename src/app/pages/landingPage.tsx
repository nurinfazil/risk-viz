"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Papa, { ParseResult } from "papaparse";

const inter = Inter({ subsets: ["latin"] });

export default function LandingPage() {
  type Data = {
    name: string;
    family: string;
    email: string;
    date: string;
    job: string;
  };

  type Values = {
    data: Data[];
  };

  const [values, setValues] = useState<Values | undefined>();

  useEffect(() => {
    Papa.parse("/data.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (results: ParseResult<Data>) => {
        setValues(results);
      },
    });
  }, []);

  return <div>hi</div>;
}
