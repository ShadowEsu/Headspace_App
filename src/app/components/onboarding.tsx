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
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2 && !archetype) {
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

  const ARCHETYPES: { id: CognitiveArchetype; label: string }[] = [
    { id: "Sprinter", label: "Short bursts" },
    { id: "Marathon", label: "Sustained focus" },
    { id: "Cycler", label: "Rhythmic peaks" },
    { id: "Flatline", label: "Stable output" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col noise-overlay">
      {/* Hero-style background */}
      <div className="absolute inset-0 gradient-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F6F3]/95" />
      </div>

      <div className="relative flex-1 flex flex-col z-10">
        {/* Progress */}
        <div className="flex-shrink-0 px-6 pt-8 pb-4">
          <Progress
            value={((step === 2 && archetype ? 4 : step + 1) / 4) * 100}
            className="h-1.5 rounded-full"
          />
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Step {step === 2 && archetype ? 4 : step + 1} of 4
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 min-h-0 overflow-y-auto py-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-center max-w-md w-full"
              >
                <h1 className="text-2xl font-display font-bold text-stone-900 mb-3 tracking-tight">
                  Welcome to Headspace
                </h1>
                <p className="text-stone-600 mb-8 leading-relaxed">
                  We'll establish your cognitive baseline through a brief calibration. This takes
                  about 90 seconds.
                </p>
                <motion.div
                  className="mb-8 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Field bandwidth={35} state="optimal" className="h-56 mx-auto" />
                </motion.div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-[#0D9488] hover:bg-[#0B8075] text-white h-12"
                >
                  Begin calibration
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
                className="text-center max-w-md w-full"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-3">Biometric permissions</h2>
                <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                  The app uses anonymized signals to estimate cognitive load. No identifiable health
                  data is stored.
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
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-xl p-4 border border-stone-100 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-stone-700 text-left">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-[#0D9488] hover:bg-[#0B8075] text-white h-12"
                >
                  Grant permissions
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
                className="text-center max-w-md w-full"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-3">Calibrating...</h2>
                <p className="text-stone-600 mb-8 text-sm">
                  Analyzing your baseline cognitive signature
                </p>
                <motion.div
                  className="pointer-events-none mb-8"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Field bandwidth={50} state="moderate" className="h-56 mx-auto" />
                </motion.div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-[#0D9488] hover:bg-[#0B8075] text-white h-12"
                >
                  Complete calibration
                </Button>
              </motion.div>
            )}

            {step === 2 && archetype && (
              <motion.div
                key="step2-result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-center max-w-md w-full"
              >
                <div className="inline-block px-4 py-2 bg-[#0D9488]/10 text-[#0D9488] rounded-full text-xs font-semibold mb-4">
                  Your cognitive archetype
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">{archetype}</h2>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                  {getArchetypeDescription(archetype)}
                </p>
                <div className="mb-6 grid grid-cols-2 gap-2">
                  {ARCHETYPES.map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-xl p-3 text-sm font-medium ${
                        a.id === archetype
                          ? "bg-[#0D9488]/15 border-2 border-[#0D9488] text-[#0D9488]"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {a.label}
                    </div>
                  ))}
                </div>
                <motion.div className="mb-8 pointer-events-none">
                  <Field bandwidth={20} state="optimal" className="h-40 mx-auto" />
                </motion.div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-[#0D9488] hover:bg-[#0B8075] text-white h-12"
                >
                  Continue to dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/sense")}
                  className="w-full mt-3 text-sm text-stone-500 hover:text-[#0D9488]"
                >
                  Learn how we estimate your bandwidth →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
