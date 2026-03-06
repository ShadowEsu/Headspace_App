import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Field, BandwidthState } from "./field";

export function WearableWidget() {
  const [bandwidth, setBandwidth] = useState(52);

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const state = getBandwidthState(bandwidth);

  // Simulate bandwidth changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth((prev) => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Haptic pattern legend based on state
  const getHapticPattern = (state: BandwidthState) => {
    switch (state) {
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

  const getStateColor = (state: BandwidthState) => {
    switch (state) {
      case "optimal":
        return "#2DD4BF";
      case "moderate":
        return "#FBBF24";
      case "strained":
        return "#FB923C";
      case "critical":
        return "#EF4444";
    }
  };

  return (
    <div
      className="relative bg-black overflow-hidden flex flex-col items-center justify-center"
      style={{ width: "198px", height: "242px" }}
    >
      {/* Field Thumbnail */}
      <div className="relative" style={{ width: "140px", height: "140px" }}>
        <Field
          bandwidth={bandwidth}
          state={state}
          isIrregular={state === "critical"}
          className="w-full h-full"
        />
        
        {/* Bandwidth Percentage */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-light tracking-tight text-white">
            {Math.round(bandwidth)}
            <span className="text-base opacity-60">%</span>
          </div>
        </div>
      </div>

      {/* Haptic Pattern Legend */}
      <motion.div
        className="mt-4 px-4 py-2 rounded-full"
        style={{
          backgroundColor: `${getStateColor(state)}20`,
          border: `1px solid ${getStateColor(state)}40`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <div
            className="text-sm tracking-widest mb-1"
            style={{ color: getStateColor(state) }}
          >
            {getHapticPattern(state)}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider">
            {state}
          </div>
        </div>
      </motion.div>

      {/* Time */}
      <div className="absolute bottom-3 text-xs text-white/40">
        {new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
