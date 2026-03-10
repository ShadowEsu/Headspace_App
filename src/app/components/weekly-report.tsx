import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Download } from "lucide-react";

const MOCK_WEEKLY_DATA = [
  { day: "Mon", avg: 42, peak: 68 },
  { day: "Tue", avg: 55, peak: 72 },
  { day: "Wed", avg: 61, peak: 85 },
  { day: "Thu", avg: 48, peak: 71 },
  { day: "Fri", avg: 72, peak: 91 },
  { day: "Sat", avg: 38, peak: 54 },
  { day: "Sun", avg: 45, peak: 62 },
];

// Patterns derived from mock data
function getPatterns(data: typeof MOCK_WEEKLY_DATA) {
  const peakDay = data.reduce((a, b) => (b.peak > a.peak ? b : a), data[0]);
  const lowDay = data.reduce((a, b) => (b.avg < a.avg ? b : a), data[0]);
  return { peakDay, lowDay };
}

export function WeeklyReport() {
  const navigate = useNavigate();
  const patterns = getPatterns(MOCK_WEEKLY_DATA);

  const stats = {
    avgBandwidth: 58,
    peakLoad: 91,
    optimalHours: 42,
    interventionsUsed: 12,
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { week: "Feb 27 - Mar 6, 2026", data: MOCK_WEEKLY_DATA, stats },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bandwidth-weekly-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 glass-panel border-b border-black/5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/home")}
          className="p-2 -ml-2 rounded-full hover:bg-black/5"
        >
          <ArrowLeft className="w-5 h-5 text-stone-700" />
        </motion.button>
        <h2 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
          Weekly report
        </h2>
        <button
          onClick={handleDownload}
          className="p-2 -mr-2 rounded-full hover:bg-black/5"
          aria-label="Download"
        >
          <Download className="w-5 h-5 text-stone-700" />
        </button>
      </header>

      {/* Content */}
      <div className="overflow-y-auto px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xs text-stone-500 mb-1">Feb 27 – Mar 6, 2026</p>
          <h1 className="text-2xl font-bold text-stone-900 mb-6">Cognitive bandwidth</h1>

          {/* Chart */}
          <div className="bento-card p-5 mb-6">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
              Daily average load
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_WEEKLY_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#78716C" }}
                    axisLine={{ stroke: "#E7E5E4" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#78716C" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E7E5E4",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Load"]}
                    labelFormatter={(label) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="avg"
                    stroke="#0D9488"
                    strokeWidth={2}
                    fill="url(#bandwidthGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patterns / Trigger insights */}
          <div className="bento-card p-5 mb-6">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Patterns & insights
            </p>
            <ul className="space-y-2 text-sm text-stone-700">
              <li>
                <span className="font-medium">Most overloaded day:</span>{" "}
                {patterns.peakDay.day} ({patterns.peakDay.peak}% peak)
              </li>
              <li>
                <span className="font-medium">Best recovery window:</span>{" "}
                {patterns.lowDay.day} morning (avg {patterns.lowDay.avg}%)
              </li>
              <li>
                <span className="font-medium">What this means:</span> Mid-week and Friday tend to
                spike. Plan lighter tasks for Wed PM and protect Sat for recovery.
              </li>
            </ul>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg. bandwidth", value: `${stats.avgBandwidth}%`, color: "text-[#0D9488]" },
              { label: "Peak load", value: `${stats.peakLoad}%`, color: "text-[#F97316]" },
              { label: "Optimal hours", value: `${stats.optimalHours}h`, color: "text-stone-900" },
              {
                label: "Interventions used",
                value: stats.interventionsUsed,
                color: "text-stone-900",
              },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bento-card p-5 text-center"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-stone-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleDownload}
            className="mt-8 w-full py-3 rounded-xl bg-[#0D9488] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#0B8075]"
          >
            <Download className="w-4 h-4" />
            Export report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
