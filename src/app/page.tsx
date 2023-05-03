import Image from "next/image";
import { Inter } from "next/font/google";
import LandingPage from "./pages/landingPage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}`}
      ></script>
      <LandingPage />
    </main>
  );
}
