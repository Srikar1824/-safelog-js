import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Playground from "./components/Playground";
import ApiReference from "./components/ApiReference";
import QuickStart from "./components/QuickStart";
import Footer from "./components/Footer";

export default function App() {
  const [safelogVersion, setSafelogVersion] = useState(null);

  useEffect(() => {
    // Fetch the real safelog-js version from the server
    axios
      .get(`${import.meta.env.VITE_API_URL || ""}/api/health`)
      .then(({ data }) => {
        setSafelogVersion(data.safelogVersion);
      })
      .catch(() => {
        // Server not running yet — silent fail
      });
  }, []);

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1c2128",
            color: "#e6edf3",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
          },
        }}
      />

      <Navbar safelogVersion={safelogVersion} />

      <main>
        <HeroSection safelogVersion={safelogVersion} />

        {/* Divider gradient */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)",
          }}
        />

        <Playground />

        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        <ApiReference />

        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        <QuickStart />
      </main>

      <Footer />
    </>
  );
}
