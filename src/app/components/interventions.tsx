import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wind, Shuffle, MapPin, Coffee, Volume2, Eye } from "lucide-react";
import { BandwidthState } from "./field";

interface Intervention {
  id: string;
  title: string;
  duration: string;
  description: string;
  icon: typeof Wind;
  triggerStates: BandwidthState[];
  category: string;
}

const interventions: Intervention[] = [
  {
    id: "1",
    title: "Box Breathing",
    duration: "2 min",
    description: "4-4-4-4 breath pattern to regulate nervous system",
    icon: Wind,
    triggerStates: ["strained", "critical"],
    category: "Breathwork",
  },
  {
    id: "2",
    title: "Task Swap",
    duration: "Immediate",
    description: "Switch to a lower-cognitive-load task temporarily",
    icon: Shuffle,
    triggerStates: ["moderate", "strained"],
    category: "Task Management",
  },
  {
    id: "3",
    title: "Environment Shift",
    duration: "5 min",
    description: "Change physical location or lighting conditions",
    icon: MapPin,
    triggerStates: ["strained", "critical"],
    category: "Environment",
  },
  {
    id: "4",
    title: "Microbreak",
    duration: "2 min",
    description: "Brief disengagement with hydration",
    icon: Coffee,
    triggerStates: ["moderate", "strained"],
    category: "Rest",
  },
  {
    id: "5",
    title: "Ambient Sound",
    duration: "Continuous",
    description: "Brown noise or binaural beats for focus",
    icon: Volume2,
    triggerStates: ["optimal", "moderate"],
    category: "Audio",
  },
  {
    id: "6",
    title: "20-20-20 Rule",
    duration: "20 sec",
    description: "Look at something 20 feet away for 20 seconds",
    icon: Eye,
    triggerStates: ["optimal", "moderate", "strained"],
    category: "Visual",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Breathwork: "bg-teal-100 text-teal-700",
  "Task Management": "bg-amber-100 text-amber-700",
  Environment: "bg-emerald-100 text-emerald-700",
  Rest: "bg-rose-100 text-rose-700",
  Audio: "bg-violet-100 text-violet-700",
  Visual: "bg-sky-100 text-sky-700",
};

export function Interventions() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = Array.from(new Set(interventions.map((i) => i.category)));

  const filteredInterventions = selectedCategory
    ? interventions.filter((i) => i.category === selectedCategory)
    : interventions;

  const getStateColor = (state: BandwidthState) => {
    switch (state) {
      case "optimal":
        return { bg: "#0D948815", color: "#0D9488" };
      case "moderate":
        return { bg: "#F59E0B15", color: "#F59E0B" };
      case "strained":
        return { bg: "#F9731615", color: "#F97316" };
      case "critical":
        return { bg: "#E11D4815", color: "#E11D48" };
    }
  };

  return (
    <div className="relative min-h-screen w-full gradient-mesh noise-overlay overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 glass-panel border-b border-black/5">
        <div className="flex items-center justify-between px-4 py-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/home")}
            className="p-2 -ml-2 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </motion.button>
          <h2 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
            Interventions
          </h2>
          <div className="w-9" />
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? "bg-[#0D9488] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0D9488] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="overflow-y-auto px-4 py-6 pb-24">
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredInterventions.map((intervention, i) => {
            const Icon = intervention.icon;
            const catColor = CATEGORY_COLORS[intervention.category] ?? "bg-stone-100 text-stone-700";
            return (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bento-card p-5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${catColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-stone-900">{intervention.title}</h3>
                      <span className="text-xs text-stone-500 whitespace-nowrap">
                        {intervention.duration}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-medium mb-2 ${catColor}`}
                    >
                      {intervention.category}
                    </span>
                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">
                      {intervention.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {intervention.triggerStates.map((state) => {
                        const { bg, color } = getStateColor(state);
                        return (
                          <span
                            key={state}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                            style={{ backgroundColor: bg, color }}
                          >
                            {state}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-stone-50/80 border border-stone-100 max-w-2xl mx-auto">
          <p className="text-sm text-stone-600 leading-relaxed">
            Interventions are context-aware and triggered based on your current bandwidth state. Each
            has been validated for cognitive load reduction in controlled studies.
          </p>
        </div>
      </div>
    </div>
  );
}
