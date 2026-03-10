import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type BandwidthState = "optimal" | "moderate" | "strained" | "critical";

interface FieldProps {
  bandwidth: number; // 0-100
  state: BandwidthState;
  className?: string;
  isIrregular?: boolean; // For critical state irregular breathing
}

export function Field({ bandwidth, state, className = "", isIrregular = false }: FieldProps) {
  const [breathPhase, setBreathPhase] = useState(0);

  // Get state-specific colors
  const getStateColors = (state: BandwidthState) => {
    switch (state) {
      case "optimal":
        return {
          primary: "#2DD4BF",
          secondary: "#14B8A6",
          tertiary: "#0D9488",
        };
      case "moderate":
        return {
          primary: "#FBBF24",
          secondary: "#F59E0B",
          tertiary: "#D97706",
        };
      case "strained":
        return {
          primary: "#FB923C",
          secondary: "#F97316",
          tertiary: "#EA580C",
        };
      case "critical":
        return {
          primary: "#EF4444",
          secondary: "#DC2626",
          tertiary: "#B91C1C",
        };
    }
  };

  const colors = getStateColors(state);

  // Calculate breath rate based on bandwidth (higher load = slower breath)
  const breathDuration = 2 + (bandwidth / 100) * 4; // 2s to 6s

  useEffect(() => {
    if (isIrregular) {
      // Irregular breathing for critical state
      const irregularInterval = setInterval(() => {
        setBreathPhase((prev) => (prev + 1) % 3);
      }, Math.random() * 1000 + 1500); // Random interval 1.5-2.5s
      return () => clearInterval(irregularInterval);
    }
  }, [isIrregular]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layered blurred ellipses */}
      <motion.div
        className="relative"
        animate={{
          scale: isIrregular
            ? [0.98, 1.02, 0.99, 1.01, 0.98]
            : [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: breathDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer glow - pulses with load */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.primary}30, ${colors.primary}10, transparent)`,
            filter: "blur(50px)",
          }}
          animate={{
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: breathDuration * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Outer ellipse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.primary}40, ${colors.primary}00)`,
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: breathDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle ellipse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.secondary}60, ${colors.secondary}00)`,
            filter: "blur(30px)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: breathDuration * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner core */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.tertiary}90, ${colors.tertiary}40)`,
            filter: "blur(20px)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: breathDuration * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
