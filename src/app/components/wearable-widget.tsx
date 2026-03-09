import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Field, BandwidthState } from "./field";
import { Home } from "lucide-react";

export function WearableWidget() {
  const [bandwidth, setBandwidth] = useState(52);
  const navigate = useNavigate();

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const state = getBandwidthState(bandwidth);

  const getStateColor = (s: BandwidthState) => {
    switch (s) {
      case "optimal":
        return "#0D9488";
      case "moderate":
        return "#F59E0B";
      case "strained":
        return "#F97316";
      case "critical":
        return "#E11D48";
    }
  };

  const getHapticPattern = (s: BandwidthState) => {
    switch (s) {
      case "optimal":
        return "— —";
      case "moderate":
        return "— — —";
      case "strained":
        return "—  — —";
      case "critical":
        return "———";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth((prev) => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const color = getStateColor(state);

  return (
    <div
      className="relative bg-stone-900 overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-stone-700"
      style={{ width: "198px", height: "242px" }}
    >
      <button
        onClick={() => navigate("/home")}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="Back to home"
      >
        <Home className="w-4 h-4" />
      </button>

      <div className="relative" style={{ width: "130px", height: "130px" }}>
        <Field
          bandwidth={bandwidth}
          state={state}
          isIrregular={state === "critical"}
          className="w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            {Math.round(bandwidth)}
            <span className="text-sm font-medium opacity-80">%</span>
          </span>
        </div>
      </div>

      <motion.div
        className="mt-4 px-4 py-2 rounded-xl"
        style={{
          backgroundColor: `${color}22`,
          border: `1px solid ${color}44`,
        }}
      >
        <div className="text-center">
          <div
            className="text-xs font-bold tracking-widest"
            style={{ color }}
          >
            {getHapticPattern(state)}
          </div>
          <div className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5 font-medium">
            {state}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-3 text-xs text-white/40 font-medium">
        {new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
