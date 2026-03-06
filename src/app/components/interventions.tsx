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
    <div className="relative h-screen w-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-6">
          <button onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-sm uppercase tracking-wider">Interventions</h2>
          <div className="w-6" />
        </div>

        {/* Category Pills */}
        <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-36 left-0 right-0 bottom-0 overflow-y-auto px-6 pb-6">
        <div className="space-y-3">
          {filteredInterventions.map((intervention, i) => {
            const Icon = intervention.icon;
            return (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium">{intervention.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {intervention.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{intervention.description}</p>

                    {/* Trigger States */}
                    <div className="flex flex-wrap gap-1.5">
                      {intervention.triggerStates.map((state) => (
                        <div
                          key={state}
                          className="px-2 py-1 rounded text-xs capitalize"
                          style={{
                            backgroundColor: `${getStateColor(state)}15`,
                            color: getStateColor(state),
                          }}
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            Interventions are context-aware and triggered based on your current bandwidth state.
            Each has been validated for cognitive load reduction in controlled studies.
          </p>
        </div>
      </div>
    </div>
  );
}
