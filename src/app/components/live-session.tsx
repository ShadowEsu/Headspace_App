import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Field, BandwidthState } from "./field";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

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

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Simulate bandwidth increase over time
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setBandwidth((prev) => {
          const newValue = prev + Math.random() * 2;
          // Show pause overlay at 70%
          if (newValue >= 70 && !showPauseOverlay) {
            setShowPauseOverlay(true);
          }
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
    <div className="relative h-screen w-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-sm uppercase tracking-wider">Live Session</h2>
        <div className="w-6" />
      </div>

      {/* Split View */}
      <div className="flex h-full">
        {/* Left: Task Timer */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-200">
          <div className="text-center">
            <div className="text-5xl font-light tracking-tight mb-6">
              {formatTime(seconds)}
            </div>
            
            <div className="flex gap-3 justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-14 h-14 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>

            <div className="mt-8 text-sm text-gray-600">
              <div className="mb-2">Current Load</div>
              <div className="text-3xl font-light">{Math.round(bandwidth)}%</div>
            </div>
          </div>
        </div>

        {/* Right: Field Ambient */}
        <div className="w-1/2 relative">
          <Field
            bandwidth={bandwidth}
            state={state}
            isIrregular={state === "critical"}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Auto-Pause Suggestion Overlay */}
      <AnimatePresence>
        {showPauseOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="bg-white rounded-3xl p-8 max-w-xs mx-6 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-orange-600" />
              </div>
              
              <h3 className="text-xl mb-2">Load Threshold Reached</h3>
              <p className="text-gray-600 text-sm mb-6">
                Your cognitive bandwidth is at 70%. Consider taking a brief pause to restore
                capacity.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPauseOverlay(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-full text-sm"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setShowPauseOverlay(false);
                    navigate("/interventions");
                  }}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-full text-sm"
                >
                  View Interventions
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
