import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";
import { Field, BandwidthState } from "./field";

interface ParticipantData {
  id: string;
  bandwidth: number;
  state: BandwidthState;
}

export function GroupMode() {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [aggregateBandwidth, setAggregateBandwidth] = useState(0);
  const navigate = useNavigate();

  // Mock group data - simulate a classroom of 12 students
  useEffect(() => {
    const initialParticipants: ParticipantData[] = Array.from({ length: 12 }, (_, i) => {
      const bandwidth = 30 + Math.random() * 50;
      return {
        id: `participant-${i}`,
        bandwidth,
        state: getBandwidthState(bandwidth),
      };
    });
    setParticipants(initialParticipants);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          const newBandwidth = Math.max(
            0,
            Math.min(100, p.bandwidth + (Math.random() - 0.5) * 8)
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
  }, []);

  // Calculate aggregate
  useEffect(() => {
    if (participants.length === 0) return;
    const avg = participants.reduce((sum, p) => sum + p.bandwidth, 0) / participants.length;
    setAggregateBandwidth(avg);
  }, [participants]);

  const getBandwidthState = (value: number): BandwidthState => {
    if (value < 40) return "optimal";
    if (value < 60) return "moderate";
    if (value < 80) return "strained";
    return "critical";
  };

  const aggregateState = getBandwidthState(aggregateBandwidth);

  // Count participants in each state
  const stateCounts = {
    optimal: participants.filter((p) => p.state === "optimal").length,
    moderate: participants.filter((p) => p.state === "moderate").length,
    strained: participants.filter((p) => p.state === "strained").length,
    critical: participants.filter((p) => p.state === "critical").length,
  };

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
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-700" />
          <span className="text-sm uppercase tracking-wider">Group Mode</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Aggregate Field */}
      <div className="absolute top-24 left-0 right-0 h-64">
        <Field
          bandwidth={aggregateBandwidth}
          state={aggregateState}
          isIrregular={aggregateState === "critical"}
          className="w-full h-full"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl font-light tracking-tight mb-1">
            {Math.round(aggregateBandwidth)}
            <span className="text-2xl opacity-60">%</span>
          </div>
          <div className="text-xs uppercase tracking-wider opacity-70">
            Group Average
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-96 left-0 right-0 bottom-0 overflow-y-auto px-6 pb-6">
        {/* Alert if group is strained */}
        {aggregateBandwidth >= 70 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-orange-900 mb-1">
                Group Load High
              </div>
              <p className="text-xs text-orange-700">
                {stateCounts.strained + stateCounts.critical} participants showing elevated
                cognitive load. Consider a brief group pause.
              </p>
            </div>
          </motion.div>
        )}

        {/* State Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">State Distribution</h3>
          <div className="grid grid-cols-4 gap-2">
            {(["optimal", "moderate", "strained", "critical"] as BandwidthState[]).map((state) => (
              <div
                key={state}
                className="bg-gray-50 rounded-xl p-3 text-center"
                style={{
                  borderLeft: `3px solid ${getStateColor(state)}`,
                }}
              >
                <div className="text-xl mb-1">{stateCounts[state]}</div>
                <div className="text-xs text-gray-600 capitalize">{state}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous Participant Grid */}
        <div>
          <h3 className="text-sm font-medium mb-3">
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
                  background: `linear-gradient(135deg, ${getStateColor(p.state)}20, ${getStateColor(
                    p.state
                  )}40)`,
                }}
              >
                <div className="text-xs opacity-70">{Math.round(p.bandwidth)}%</div>
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

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            All participant data is anonymized. Individual identities are not tracked or stored.
            Group metrics are computed locally and deleted after the session.
          </p>
        </div>
      </div>
    </div>
  );
}
