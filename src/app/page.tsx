import Image from "next/image";
import { Inter } from "next/font/google";
import LandingPage from "./pages/landingPage";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex w-full h-full">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}`}
      ></Script>
      <LandingPage />
    </main>
  );
}
