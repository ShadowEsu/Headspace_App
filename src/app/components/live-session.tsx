import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Field, BandwidthState } from "./field";
import { ArrowLeft, Play, Pause, RotateCcw, Heart } from "lucide-react";

export function LiveSession() {
  const [bandwidth, setBandwidth] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const navigate = useNavigate();

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const state = getBandwidthState(bandwidth);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setBandwidth((prev) => {
          const newValue = prev + Math.random() * 2;
          if (newValue >= 70 && !showPauseOverlay) setShowPauseOverlay(true);
          return Math.min(100, newValue);
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning, showPauseOverlay]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setSeconds(0);
    setBandwidth(45);
    setIsRunning(false);
    setShowPauseOverlay(false);
  };

  return (
    <div className="relative min-h-screen w-full gradient-mesh noise-overlay overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4 glass-panel border-b border-black/5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/home")}
          className="p-2 -ml-2 rounded-full hover:bg-black/5"
        >
          <ArrowLeft className="w-5 h-5 text-stone-700" />
        </motion.button>
        <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Live session
        </span>
        <div className="w-9" />
      </header>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row h-full pt-16">
        {/* Left: Timer & controls */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:py-0 bg-white/60 md:border-r border-stone-200/80">
          <div className="text-center">
            <div className="text-5xl font-number font-bold text-stone-900 tracking-tight mb-2">
              {formatTime(seconds)}
            </div>
            <p className="text-sm text-stone-500 mb-8">Session duration</p>

            <div className="flex gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                className="w-16 h-16 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-lg shadow-[#0D9488]/30"
              >
                {isRunning ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm hover:border-stone-300"
              >
                <RotateCcw className="w-5 h-5 text-stone-600" />
              </motion.button>
            </div>

            <div className="rounded-2xl bg-stone-50 p-6 border border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Current load
              </p>
              <p
                className={`text-4xl font-number font-bold ${
                  state === "optimal"
                    ? "text-[#0D9488]"
                    : state === "moderate"
                      ? "text-[#F59E0B]"
                      : state === "strained"
                        ? "text-[#F97316]"
                        : "text-[#E11D48]"
                }`}
              >
                {Math.round(bandwidth)}%
              </p>
              <p className="text-sm text-stone-500 mt-1 capitalize">{state}</p>
            </div>
          </div>
        </div>

        {/* Right: Orb */}
        <div className="w-full md:w-1/2 min-h-[320px] md:min-h-0 relative flex items-center justify-center bg-gradient-to-br from-stone-50 to-teal-50/30">
          <Field
            bandwidth={bandwidth}
            state={state}
            isIrregular={state === "critical"}
            className="w-full h-full min-h-[320px]"
          />
        </div>
      </div>

      {/* Auto-pause overlay – softer, empathetic copy */}
      <AnimatePresence>
        {showPauseOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-stone-100"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-2">Take a moment</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Your cognitive bandwidth is elevated. A brief pause can help restore your mental
                space. There's no rush.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPauseOverlay(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm transition-colors"
                >
                  Continue session
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setShowPauseOverlay(false);
                    navigate("/interventions");
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0D9488] text-white font-medium text-sm hover:bg-[#0B8075] transition-colors"
                >
                  Try an intervention
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
