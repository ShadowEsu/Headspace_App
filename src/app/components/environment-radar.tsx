import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Radio, Volume2, Sun, Wind, Users, MapPin, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

type StressLevel = "low" | "moderate" | "high" | "critical";

interface EnvFactor {
  id: string;
  label: string;
  value: number;
  level: StressLevel;
  icon: typeof Volume2;
}

const MOCK_CURRENT = {
  name: "Current space",
  overall: 42,
  level: "moderate" as StressLevel,
  factors: [
    { id: "noise", label: "Noise", value: 55, level: "moderate" as StressLevel, icon: Volume2 },
    { id: "light", label: "Light", value: 30, level: "low" as StressLevel, icon: Sun },
    { id: "air", label: "Air quality", value: 25, level: "low" as StressLevel, icon: Wind },
    { id: "crowding", label: "Crowding", value: 68, level: "high" as StressLevel, icon: Users },
  ] as EnvFactor[],
};

const MOCK_SPACES = [
  { name: "Quiet room 3F", stress: 18, level: "low" as StressLevel, distance: "2 min" },
  { name: "Café (back corner)", stress: 35, level: "low" as StressLevel, distance: "5 min" },
  { name: "Outdoor bench", stress: 22, level: "low" as StressLevel, distance: "3 min" },
  { name: "Main floor", stress: 71, level: "high" as StressLevel, distance: "1 min" },
];

const LEVEL_COLORS: Record<StressLevel, string> = {
  low: "#2DD4BF",
  moderate: "#FBBF24",
  high: "#FB923C",
  critical: "#EF4444",
};

const LEVEL_GRADIENTS: Record<StressLevel, string> = {
  low: "from-[#2DD4BF] to-[#14B8A6]",
  moderate: "from-[#FBBF24] to-[#F59E0B]",
  high: "from-[#FB923C] to-[#F97316]",
  critical: "from-[#EF4444] to-[#DC2626]",
};

const LEVEL_LABELS: Record<StressLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

export function EnvironmentRadar() {
  const navigate = useNavigate();
  const [sensingEnabled, setSensingEnabled] = useState(true);
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSweepAngle((a) => (a + 2) % 360), 50);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col gradient-mesh bg-[#f8fcfb]">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 glass-panel border-b border-white/60">
        <button
          onClick={() => navigate("/home")}
          className="p-2.5 -ml-2 rounded-full hover:bg-white/60 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100/80 px-2.5 py-1 rounded-full border border-gray-200/60">
            Add-on
          </span>
          <h1 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Stress Radar
          </h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-10">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          See invisible environmental load — noise, light, air, crowding — and find calmer spaces.
        </p>

        {/* Radar viz: concentric circles + sweep */}
        <section className="rounded-3xl border border-white/80 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden card-glow">
          <div className="p-5 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <Radio className="w-4 h-4 text-[#2DD4BF]" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Your current space
              </h2>
            </div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-4xl font-light text-white tracking-tight">
                  {MOCK_CURRENT.overall}
                  <span className="text-xl text-gray-400">/100</span>
                </span>
                <p className="text-xs text-gray-400 mt-1">Lower = calmer</p>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-3 py-1.5 rounded-full text-white bg-gradient-to-r shadow-lg",
                  LEVEL_GRADIENTS[MOCK_CURRENT.level]
                )}
              >
                {LEVEL_LABELS[MOCK_CURRENT.level]}
              </span>
            </div>

            {/* Radar circles */}
            <div className="relative flex items-center justify-center aspect-square max-w-[280px] mx-auto">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[12%] rounded-full border border-white/10" />
              <div className="absolute inset-[24%] rounded-full border border-white/10" />
              <div className="absolute inset-[36%] rounded-full border border-white/10" />
              <div className="absolute inset-[48%] rounded-full border border-[#2DD4BF]/30" />
              {/* Sweep line */}
              <motion.div
                className="absolute left-1/2 top-1/2 w-1/2 h-0.5 origin-left bg-gradient-to-r from-transparent via-[#2DD4BF]/80 to-[#2DD4BF]"
                style={{ rotate: sweepAngle }}
              />
              {/* Center dot */}
              <div className="absolute w-3 h-3 rounded-full bg-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/50" />
              {/* Factor blips (mock positions by angle) */}
              {MOCK_CURRENT.factors.map((f, i) => {
                const angle = (i / 4) * 360 - 90;
                const r = 35 + (f.value / 100) * 15;
                const x = 50 + r * Math.cos((angle * Math.PI) / 180);
                const y = 50 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <motion.div
                    key={f.id}
                    className="absolute w-2 h-2 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: LEVEL_COLORS[f.level],
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Factor bars */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-teal-500/5 p-5 card-glow">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Breakdown
          </h2>
          <div className="space-y-4">
            {MOCK_CURRENT.factors.map((f) => (
              <div key={f.id} className="flex items-center gap-4">
                <div
                  className="p-2.5 rounded-xl shadow-sm flex-shrink-0"
                  style={{ backgroundColor: `${LEVEL_COLORS[f.level]}20` }}
                >
                  <f.icon className="w-4 h-4" style={{ color: LEVEL_COLORS[f.level] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-700">{f.label}</span>
                    <span className="font-semibold tabular-nums" style={{ color: LEVEL_COLORS[f.level] }}>
                      {f.value}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full bg-gradient-to-r", LEVEL_GRADIENTS[f.level])}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.value}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby spaces */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-teal-500/5 p-5 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 shadow-sm">
              <MapPin className="w-4 h-4 text-[#0D9488]" />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Nearby spaces
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4 font-medium">
            Lower stress = better for focus and bandwidth.
          </p>
          <ul className="space-y-2">
            {MOCK_SPACES.map((space, i) => (
              <motion.li
                key={space.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                  space.level === "low"
                    ? "bg-gradient-to-r from-[#2DD4BF]/10 to-transparent border-[#2DD4BF]/30 shadow-sm"
                    : "bg-gray-50/80 border-gray-100"
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{space.name}</p>
                  <p className="text-xs text-gray-500">{space.distance} away</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{ color: LEVEL_COLORS[space.level] }}
                  >
                    {space.stress}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-lg text-white bg-gradient-to-r",
                      LEVEL_GRADIENTS[space.level]
                    )}
                  >
                    {LEVEL_LABELS[space.level]}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Safeguards */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg p-5 flex items-start gap-4 card-glow">
          <div className="p-2.5 rounded-xl bg-gray-100 flex-shrink-0">
            <Shield className="w-5 h-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 mb-1">Add-on safeguards</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sensing is opt-in. No continuous recording; only on-demand or when you open this
              screen. Data stays on your device. You can disable the add-on in Safeguards.
            </p>
            <Button
              variant={sensingEnabled ? "default" : "outline"}
              size="sm"
              className={cn(
                "mt-3 rounded-full",
                sensingEnabled && "bg-gradient-to-r from-[#0D9488] to-[#14B8A6] border-0 shadow-md shadow-teal-500/20"
              )}
              onClick={() => setSensingEnabled(!sensingEnabled)}
            >
              {sensingEnabled ? "Sensing on" : "Sensing off"}
            </Button>
          </div>
        </section>

        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full border-gray-200 hover:bg-gray-50 font-medium"
          onClick={() => navigate("/home")}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}
