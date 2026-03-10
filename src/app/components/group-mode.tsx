import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";
import { Field, BandwidthState } from "./field";
import { cn } from "./ui/utils";

interface ParticipantData {
  id: string;
  bandwidth: number;
  state: BandwidthState;
}

type Scenario = "standup" | "deepwork" | "lecture";

const SCENARIO_CONFIG: Record<
  Scenario,
  { label: string; bias: number; recommendation: string }
> = {
  standup: {
    label: "Stand-up",
    bias: -5,
    recommendation: "Keep updates to 60s each. Group stays in moderate range.",
  },
  deepwork: {
    label: "Deep work block",
    bias: 0,
    recommendation: "Quiet focus. Check in if anyone drifts above 80%.",
  },
  lecture: {
    label: "Lecture",
    bias: 12,
    recommendation: "Class drifting to strained. Insert a 2-minute check-in or stretch.",
  },
};

export function GroupMode() {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [aggregateBandwidth, setAggregateBandwidth] = useState(0);
  const [scenario, setScenario] = useState<Scenario>("deepwork");
  const navigate = useNavigate();

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const generateParticipants = useCallback(
    (bias: number) =>
      Array.from({ length: 12 }, (_, i) => {
        const base = 35 + Math.random() * 40 + bias;
        const bandwidth = Math.max(10, Math.min(95, base));
        return {
          id: `participant-${i}`,
          bandwidth,
          state: getBandwidthState(bandwidth),
        };
      }),
    []
  );

  useEffect(() => {
    const config = SCENARIO_CONFIG[scenario];
    setParticipants(generateParticipants(config.bias));
  }, [scenario, generateParticipants]);

  useEffect(() => {
    const interval = setInterval(() => {
      const config = SCENARIO_CONFIG[scenario];
      setParticipants((prev) =>
        prev.map((p) => {
          const drift = (Math.random() - 0.5) * 6 + config.bias * 0.1;
          const newBandwidth = Math.max(
            10,
            Math.min(95, p.bandwidth + drift)
          );
          return {
            ...p,
            bandwidth: newBandwidth,
            state: getBandwidthState(newBandwidth),
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [scenario]);

  useEffect(() => {
    if (participants.length === 0) return;
    const avg =
      participants.reduce((sum, p) => sum + p.bandwidth, 0) / participants.length;
    setAggregateBandwidth(avg);
  }, [participants]);

  const aggregateState = getBandwidthState(aggregateBandwidth);

  const stateCounts = {
    optimal: participants.filter((p) => p.state === "optimal").length,
    moderate: participants.filter((p) => p.state === "moderate").length,
    strained: participants.filter((p) => p.state === "strained").length,
    critical: participants.filter((p) => p.state === "critical").length,
  };

  const strainedOrCritical = stateCounts.strained + stateCounts.critical;
  const groupWeather =
    aggregateBandwidth < 50
      ? "Clear"
      : aggregateBandwidth < 70
        ? "Cloudy"
        : "Stormy";

  const getStateColor = (state: BandwidthState) => {
    switch (state) {
      case "optimal":
        return "#0D9488";
      case "moderate":
        return "#F59E0B";
      case "strained":
        return "#F97316";
      case "critical":
        return "#E11D48";
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
      <header className="sticky top-0 z-20 glass-panel border-b border-black/5">
        <div className="flex items-center justify-between px-4 py-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/home")}
            className="p-2 -ml-2 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </motion.button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0D9488]" />
            <span className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
              Group Mode
            </span>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <div className="overflow-y-auto px-4 py-6 pb-24">
        {/* Scenario toggles */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Scenario
          </p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(SCENARIO_CONFIG) as Scenario[]).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  scenario === s
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {SCENARIO_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Aggregate Field */}
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden mb-6">
          <div className="h-56 relative">
            <Field
              bandwidth={aggregateBandwidth}
              state={aggregateState}
              isIrregular={aggregateState === "critical"}
              className="w-full h-full"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-4xl font-bold text-stone-900">
                {Math.round(aggregateBandwidth)}
                <span className="text-xl opacity-60">%</span>
              </div>
              <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
                Group average
              </p>
              <p className="text-sm font-medium text-stone-600 mt-1">
                Group weather: {groupWeather} — {strainedOrCritical} of {participants.length}{" "}
                strained/critical
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation card */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 mb-6">
          <p className="text-sm font-medium text-teal-800">
            {SCENARIO_CONFIG[scenario].recommendation}
          </p>
        </div>

        {/* Alert if group is strained */}
        {aggregateBandwidth >= 70 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Group load high</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {strainedOrCritical} participants showing elevated cognitive load. Consider a brief
                group pause.
              </p>
            </div>
          </motion.div>
        )}

        {/* State distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-stone-800 mb-3">State distribution</h3>
          <div className="grid grid-cols-4 gap-2">
            {(["optimal", "moderate", "strained", "critical"] as BandwidthState[]).map(
              (state) => (
                <div
                  key={state}
                  className="rounded-xl bg-stone-50 p-3 text-center border-l-4"
                  style={{ borderLeftColor: getStateColor(state) }}
                >
                  <div className="text-xl font-bold text-stone-900">
                    {stateCounts[state]}
                  </div>
                  <div className="text-xs text-stone-500 capitalize">{state}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Participant grid */}
        <div>
          <h3 className="text-sm font-medium text-stone-800 mb-3">
            Participants ({participants.length})
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {participants.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${getStateColor(p.state)}22, ${getStateColor(p.state)}44)`,
                }}
              >
                <span className="text-xs font-medium text-stone-700">
                  {Math.round(p.bandwidth)}%
                </span>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    backgroundColor: getStateColor(p.state),
                    opacity: 0.6,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100">
          <p className="text-xs text-stone-600 leading-relaxed">
            All participant data is anonymized. Individual identities are not tracked or stored.
            Group metrics are computed locally and deleted after the session.
          </p>
        </div>
      </div>
    </div>
  );
}
