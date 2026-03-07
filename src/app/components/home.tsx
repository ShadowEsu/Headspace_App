import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Field } from "./field";
import { Button } from "./ui/button";
import {
  Settings,
  RotateCcw,
  History,
  Download,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Radio,
  BarChart3,
  Flame,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "./ui/utils";

const MOCK_STATS = {
  sessionsThisWeek: 12,
  avgBandwidth: 58,
  optimalHours: 24,
  currentStreak: 3,
};

const MOCK_HISTORY = [
  { id: "1", date: "Today", duration: "8 min", peakLoad: 72 },
  { id: "2", date: "Yesterday", duration: "12 min", peakLoad: 65 },
  { id: "3", date: "Mar 4", duration: "5 min", peakLoad: 81 },
  { id: "4", date: "Mar 3", duration: "15 min", peakLoad: 54 },
];

const TIPS = [
  "Take a 2-minute breath break when you feel scattered.",
  "Switch to one task at a time to lower cognitive load.",
  "A short walk can reset your bandwidth in 5 minutes.",
  "Close unused tabs and apps to free mental space.",
  "Hydration and a small snack often improve focus.",
  "If you're stuck, name the feeling—it reduces load.",
];

const FUN_FACTS = [
  "The brain uses ~20% of the body's energy.",
  "Short breaks every 90 min align with ultradian rhythms.",
  "Deep breathing activates the parasympathetic nervous system.",
  "Cognitive load drops when you write tasks down.",
  "Natural light helps regulate focus and sleep.",
  "Micro-movements (stretching) can reduce mental fatigue.",
];

const EMERGENCY_DIALS = [
  { name: "Emergency", number: "911", desc: "Police, Fire, Medical" },
  { name: "Crisis Line", number: "988", desc: "Suicide & Crisis Lifeline" },
  { name: "SAMHSA", number: "1-800-662-4357", desc: "Substance use & mental health" },
  { name: "Crisis Text", number: "Text HOME to 741741", desc: "24/7 crisis support" },
];

const ASSISTANT_RESPONSES: Record<string, string> = {
  stressed:
    "It's okay to feel stressed. Try one small thing: close your eyes and take three slow breaths. I'm here.",
  anxious:
    "Anxiety can make everything feel bigger. You're safe right now. Want to try naming 3 things you can see?",
  overwhelmed:
    "When everything feels like too much, pick just one small step. You don't have to do it all at once.",
  sad: "I'm sorry you're having a hard time. It's okay to rest. Be as gentle with yourself as you would be with a friend.",
  tired: "Your body might be asking for a break. Even 2 minutes of closing your eyes can help.",
  other: "Thanks for sharing. You're not alone. Is there one tiny thing that would feel good right now?",
};

const STAT_ICONS = [
  { key: "sessionsThisWeek", Icon: BarChart3, label: "Sessions this week", color: "text-[#2DD4BF]" },
  { key: "avgBandwidth", Icon: TrendingUp, label: "Avg. bandwidth", color: "text-[#0D9488]" },
  { key: "optimalHours", Icon: Clock, label: "Optimal hours", color: "text-[#14B8A6]" },
  { key: "currentStreak", Icon: Flame, label: "Streak", color: "text-[#F59E0B]" },
];

export function Home() {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  const handleDownload = () => {
    const blob = new Blob(
      [JSON.stringify({ stats: MOCK_STATS, history: MOCK_HISTORY }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `headspace-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAssistantChoice = (key: string) => {
    setAssistantMessage(ASSISTANT_RESPONSES[key] ?? ASSISTANT_RESPONSES.other);
  };

  const statValues: Record<string, number | string> = {
    sessionsThisWeek: MOCK_STATS.sessionsThisWeek,
    avgBandwidth: `${MOCK_STATS.avgBandwidth}%`,
    optimalHours: `${MOCK_STATS.optimalHours}h`,
    currentStreak: `${MOCK_STATS.currentStreak} days`,
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col gradient-mesh bg-[#f8fcfb]">
      {/* Top bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 glass-panel border-b border-white/60 z-30">
        <div className="flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 border-white/80 bg-white/60 shadow-sm"
              onClick={() => navigate("/")}
            >
              <RotateCcw className="w-4 h-4" />
              Play again
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 border-white/80 bg-white/60 shadow-sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 border-white/80 bg-white/60 shadow-sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </motion.div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-black/5"
          onClick={() => navigate("/safeguards")}
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>
      </header>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden glass-panel border-b border-white/40"
          >
            <div className="px-4 py-3 max-h-48 overflow-y-auto">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Recent sessions
              </p>
              <ul className="space-y-1">
                {MOCK_HISTORY.map((entry, i) => (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-white/60 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-800">{entry.date}</span>
                    <span className="text-xs text-gray-500 tabular-nums">
                      {entry.duration} · peak {entry.peakLoad}%
                    </span>
                  </motion.li>
                ))}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-[#0D9488] hover:bg-[#2DD4BF]/10"
                onClick={() => {
                  setShowHistory(false);
                  navigate("/weekly-report");
                }}
              >
                View full report →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-5 p-4 min-h-0">
        {/* Left: Statistics */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-teal-500/5 card-glow card-glow-hover p-5 flex flex-col order-2 lg:order-1 transition-shadow duration-300">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
            Statistics
          </h2>
          <div className="space-y-4">
            {STAT_ICONS.map(({ key, Icon, label, color }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-white/80"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl bg-white shadow-sm", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 tabular-nums">
                  {statValues[key]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-gray-200/80 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full border-[#2DD4BF]/30 text-[#0D9488] hover:bg-[#2DD4BF]/10 hover:border-[#2DD4BF]/50"
              onClick={() => navigate("/weekly-report")}
            >
              Weekly report
            </Button>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full gap-2 border-dashed border-[#2DD4BF]/40 text-gray-600 hover:bg-[#2DD4BF]/5 hover:border-[#2DD4BF]/60"
                onClick={() => navigate("/environment-radar")}
              >
                <Radio className="w-4 h-4" />
                Stress Radar
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                  Add-on
                </span>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Center: Tips */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-amber-500/5 card-glow card-glow-hover p-5 flex flex-col order-1 lg:order-2 transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Tips & responses
            </h2>
          </div>
          <div className="flex-1 min-h-[140px] flex flex-col justify-center">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 leading-relaxed text-[15px] font-medium"
            >
              {TIPS[tipIndex]}
            </motion.p>
            <div className="flex gap-2 mt-5">
              {TIPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === tipIndex
                      ? "w-6 bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] shadow-sm shadow-teal-500/30"
                      : "w-2 bg-gray-200 hover:bg-gray-300"
                  )}
                  aria-label={`Tip ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="rounded-full flex-1 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-md shadow-teal-500/25 hover:opacity-95 border-0"
              onClick={() => navigate("/live-session")}
            >
              Start session
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 hover:bg-gray-50"
              onClick={() => navigate("/interventions")}
            >
              More interventions
            </Button>
          </div>
        </section>

        {/* Right: AI assistant blob */}
        <section className="rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-teal-500/5 card-glow card-glow-hover p-5 flex flex-col order-3 transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 shadow-sm">
              <MessageCircle className="w-4 h-4 text-[#0D9488]" />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              How are you?
            </h2>
          </div>
          <div className="flex flex-col items-center flex-1 min-h-0">
            <motion.div
              className="relative w-36 h-36 flex-shrink-0 pointer-events-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2DD4BF]/20 to-[#14B8A6]/10 blur-xl blob-glow" />
              <Field
                bandwidth={25}
                state="optimal"
                className="absolute inset-0 rounded-full"
              />
            </motion.div>
            <p className="text-xs text-gray-500 mt-2 text-center font-medium">
              Tap how you're feeling — I'll respond.
            </p>
            <div className="w-full mt-3 space-y-2 flex-1 min-h-0 overflow-y-auto">
              {["stressed", "anxious", "overwhelmed", "sad", "tired", "other"].map((key) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAssistantChoice(key)}
                  className="w-full text-left px-4 py-2.5 rounded-2xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-[#2DD4BF]/10 hover:to-[#14B8A6]/5 border border-transparent hover:border-[#2DD4BF]/20 text-sm font-medium text-gray-700 capitalize transition-all duration-200"
                >
                  {key}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {assistantMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#2DD4BF]/15 to-[#14B8A6]/10 border border-[#2DD4BF]/25 text-sm text-gray-800 leading-relaxed shadow-sm w-full"
                >
                  {assistantMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Emergency */}
      <div className="flex-shrink-0 px-4 pb-3">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2 bg-white/80 border-white shadow-sm hover:bg-white hover:shadow-md"
            onClick={() => setShowEmergency(!showEmergency)}
          >
            <div className="p-1 rounded-full bg-red-50">
              <Phone className="w-3.5 h-3.5 text-red-500" />
            </div>
            Emergency dials for your location
            <ChevronDown
              className={cn("w-4 h-4 transition-transform duration-200", showEmergency && "rotate-180")}
            />
          </Button>
        </motion.div>
        <AnimatePresence>
          {showEmergency && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <div className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-4 space-y-3">
                <p className="text-[11px] text-gray-500 font-medium">
                  Common crisis numbers (US). Use your local emergency number if elsewhere.
                </p>
                {EMERGENCY_DIALS.map((d) => (
                  <div
                    key={d.name}
                    className="flex justify-between items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{d.name}</span>
                      <span className="text-xs text-gray-500 block">{d.desc}</span>
                    </div>
                    <a
                      href={d.number.startsWith("Text") ? undefined : `tel:${d.number.replace(/\D/g, "")}`}
                      className="font-mono text-sm font-semibold text-[#0D9488] whitespace-nowrap hover:underline"
                    >
                      {d.number}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fun facts */}
      <footer className="flex-shrink-0 border-t border-white/60 bg-gradient-to-r from-white/90 via-teal-50/30 to-amber-50/30 py-4 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-3">
          Fun facts
        </p>
        <div className="flex gap-8 px-4 fun-facts-scroll hover:[animation-play-state:paused]">
          {[...FUN_FACTS, ...FUN_FACTS].map((fact, i) => (
            <span
              key={i}
              className="text-sm text-gray-600 whitespace-nowrap flex-shrink-0 font-medium"
            >
              {fact}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
