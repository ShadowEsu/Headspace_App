import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Field } from "./field";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

type CognitiveArchetype = "Sprinter" | "Marathon" | "Cycler" | "Flatline";

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [archetype, setArchetype] = useState<CognitiveArchetype | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2 && !archetype) {
      // Simulate calibration
      const archetypes: CognitiveArchetype[] = ["Sprinter", "Marathon", "Cycler", "Flatline"];
      setArchetype(archetypes[Math.floor(Math.random() * archetypes.length)]);
    } else {
      navigate("/home");
    }
  };

  const getArchetypeDescription = (type: CognitiveArchetype) => {
    switch (type) {
      case "Sprinter":
        return "You perform best in short, intense bursts. Peak capacity early, require longer recovery.";
      case "Marathon":
        return "Consistent, sustained focus over extended periods. Steady bandwidth distribution.";
      case "Cycler":
        return "Natural ultradian rhythms. Predictable peaks and valleys throughout the day.";
      case "Flatline":
        return "Minimal variance. Highly stable cognitive output regardless of external factors.";
    }
  };

  return (
    <div className="relative h-screen w-screen bg-white overflow-hidden flex flex-col">
      {/* Progress */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <Progress value={((step + 1) / 4) * 100} className="h-1" />
        <p className="text-xs text-gray-500 mt-2">Step {step + 1} of 3</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center max-w-sm"
            >
              <h1 className="text-2xl mb-4">Welcome to Headspace</h1>
              <p className="text-gray-600 mb-8">
                We'll establish your cognitive baseline through a brief calibration. This takes
                approximately 90 seconds.
              </p>
              <div className="mb-8">
                <Field bandwidth={35} state="optimal" className="h-64" />
              </div>
              <Button onClick={handleNext} className="w-full">
                Begin Calibration
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center max-w-sm"
            >
              <h2 className="text-xl mb-4">Biometric Permissions</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Headspace uses anonymized biometric signals to estimate cognitive load. No
                identifiable health data is stored.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Heart rate variability",
                  "Screen interaction patterns",
                  "Ambient noise levels",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setPermissionsGranted(true);
                  handleNext();
                }}
                className="w-full"
              >
                Grant Permissions
              </Button>
            </motion.div>
          )}

          {step === 2 && !archetype && (
            <motion.div
              key="step2-calibrating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center max-w-sm"
            >
              <h2 className="text-xl mb-4">Calibrating...</h2>
              <p className="text-gray-600 mb-8 text-sm">
                Analyzing your baseline cognitive signature
              </p>
              <Field bandwidth={50} state="moderate" className="h-64" />
              <Button onClick={handleNext} className="w-full mt-8">
                Complete Calibration
              </Button>
            </motion.div>
          )}

          {step === 2 && archetype && (
            <motion.div
              key="step2-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center max-w-sm"
            >
              <div className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs mb-4">
                Your Cognitive Archetype
              </div>
              <h2 className="text-2xl mb-3">{archetype}</h2>
              <p className="text-gray-600 text-sm mb-8">{getArchetypeDescription(archetype)}</p>
              <div className="mb-8">
                <Field bandwidth={20} state="optimal" className="h-48" />
              </div>
              <Button onClick={handleNext} className="w-full">
                Continue to Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
