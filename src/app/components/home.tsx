import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Field, BandwidthState } from "./field";
import { Settings, TrendingUp, Users, BookOpen } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function Home() {
  const [bandwidth, setBandwidth] = useState(65);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const state = getBandwidthState(bandwidth);

  // Mock load curve data for today
  const loadCurveData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    load: Math.sin(i / 3) * 30 + 50 + Math.random() * 10,
  }));

  const nudges = {
    optimal: "Your bandwidth is optimal. Consider tackling complex tasks now.",
    moderate: "Bandwidth is moderate. Good time for collaborative work.",
    strained: "Load increasing. Consider a 5-minute break in the next 30 minutes.",
    critical: "Critical load detected. Immediate intervention recommended.",
  };

  // Simulate bandwidth changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth((prev) => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-white overflow-hidden">
      {/* Settings Icon */}
      <motion.button
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/safeguards")}
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </motion.button>

      {/* Quick Actions */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        <motion.button
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/live-session")}
        >
          <TrendingUp className="w-5 h-5 text-gray-700" />
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/group")}
        >
          <Users className="w-5 h-5 text-gray-700" />
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/interventions")}
        >
          <BookOpen className="w-5 h-5 text-gray-700" />
        </motion.button>
      </div>

      {/* The Field - Fullscreen */}
      <div className="absolute inset-0">
        <Field
          bandwidth={bandwidth}
          state={state}
          isIrregular={state === "critical"}
          className="w-full h-full"
        />
      </div>

      {/* Bandwidth Percentage Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-6xl font-light tracking-tight mb-2">
            {Math.round(bandwidth)}
            <span className="text-3xl opacity-60">%</span>
          </div>
          <div className="text-sm uppercase tracking-wider opacity-70">
            {state} load
          </div>
        </motion.div>
      </div>

      {/* Bottom Drawer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
        initial={{ y: "calc(100% - 80px)" }}
        animate={{ y: isDrawerOpen ? 0 : "calc(100% - 80px)" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        drag="y"
        dragConstraints={{ top: 0, bottom: window.innerHeight - 80 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) {
            setIsDrawerOpen(false);
          } else if (info.offset.y < -100) {
            setIsDrawerOpen(true);
          }
        }}
      >
        {/* Drawer Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Drawer Content */}
        <div className="px-6 pb-8">
          <h3 className="text-lg mb-4">Today's Load Curve</h3>
          
          {/* Chart */}
          <div className="h-24 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadCurveData}>
                <Line
                  type="monotone"
                  dataKey="load"
                  stroke={
                    state === "optimal"
                      ? "#2DD4BF"
                      : state === "moderate"
                      ? "#FBBF24"
                      : state === "strained"
                      ? "#FB923C"
                      : "#EF4444"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Adaptive Nudge */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              type: "spring",
              stiffness: 200,
            }}
            className="bg-gray-50 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-2 h-2 rounded-full mt-2"
                style={{
                  backgroundColor:
                    state === "optimal"
                      ? "#2DD4BF"
                      : state === "moderate"
                      ? "#FBBF24"
                      : state === "strained"
                      ? "#FB923C"
                      : "#EF4444",
                }}
              />
              <div>
                <p className="text-sm text-gray-700">{nudges[state]}</p>
              </div>
            </div>
          </motion.div>

          {/* View Weekly Report */}
          <button
            onClick={() => navigate("/weekly-report")}
            className="w-full mt-4 py-3 bg-gray-900 text-white rounded-full text-sm"
          >
            View Weekly Report
          </button>
        </div>
      </motion.div>
    </div>
  );
}
