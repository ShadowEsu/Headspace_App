import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Field } from "./field";
import { Button } from "./ui/button";
import {
  Settings,
  History,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Play,
  Wind,
  Coffee,
  Home as HomeIcon,
  FileText,
  Shield,
  Search,
  X,
  RefreshCw,
  MapPin,
  Cloud,
  CloudRain,
  Sun,
  Calendar,
  Brain,
  Users,
  Radio,
} from "lucide-react";
import { cn } from "./ui/utils";
import { useEnvironmentContext } from "../hooks/useEnvironmentContext";

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
];

const TIPS = [
  "Take a 2-minute breath break when you feel scattered.",
  "Switch to one task at a time to lower cognitive load.",
  "A short walk can reset your bandwidth in 5 minutes.",
];

const QUICK_ACTIONS = [
  {
    id: "1",
    title: "Box Breathing",
    type: "Breathwork",
    desc: "4-4-4-4 pattern to regulate nervous system",
    duration: "2 min",
    icon: Wind,
    downloads: "245",
  },
  {
    id: "2",
    title: "Microbreak",
    type: "Rest",
    desc: "Brief disengagement with hydration",
    duration: "2 min",
    icon: Coffee,
    downloads: "189",
    highlight: true,
  },
];

const EMERGENCY_DIALS = [
  { name: "Emergency", number: "911" },
  { name: "Crisis Line", number: "988" },
  { name: "Crisis Text", number: "741741" },
];

const ASSISTANT_RESPONSES: Record<string, string> = {
  stressed: "Try three slow breaths. I'm here.",
  anxious: "You're safe right now. Try naming 3 things you can see.",
  overwhelmed: "Pick just one small step. You don't have to do it all.",
  sad: "It's okay to rest. Be gentle with yourself.",
  tired: "Even 2 minutes of closing your eyes can help.",
  other: "Is there one tiny thing that would feel good right now?",
};

const CATEGORY_TABS = ["All", "Sessions", "Tips", "Interventions"] as const;
type Tab = (typeof CATEGORY_TABS)[number];

// Cognitive Weather: Clear (<50 avg, <1 critical spike), Cloudy (50-70), Stormy (>70 or 2+ critical)
function getCognitiveWeather(stats: { avgBandwidth: number }, history: { peakLoad: number }[]) {
  const criticalCount = history.filter((h) => h.peakLoad >= 80).length;
  if (stats.avgBandwidth < 50 && criticalCount < 1)
    return { label: "Clear", icon: Sun, color: "text-teal-600", bg: "bg-teal-50", copy: "Plenty of mental space. Good time for deep work." };
  if (stats.avgBandwidth < 70 && criticalCount < 2)
    return { label: "Cloudy", icon: Cloud, color: "text-amber-600", bg: "bg-amber-50", copy: "Moderate load. Pace yourself and take short breaks." };
  return { label: "Stormy", icon: CloudRain, color: "text-rose-600", bg: "bg-rose-50", copy: "Elevated load. Stick to small tasks, delay big decisions." };
}

// Smart Day Planner: mock schedule with focus blocks and breaks
const MOCK_DAY_SCHEDULE = [
  { start: 9, end: 11, type: "focus", label: "Deep work" },
  { start: 11, end: 11.25, type: "break", label: "5 min reset" },
  { start: 11.25, end: 12.5, type: "focus", label: "Focused work" },
  { start: 12.5, end: 13.5, type: "lunch", label: "Lunch" },
  { start: 13.5, end: 15, type: "meetings", label: "Meetings" },
  { start: 15, end: 15.08, type: "break", label: "5 min reset" },
  { start: 15.08, end: 17, type: "light", label: "Light tasks" },
];

export function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [showEmergency, setShowEmergency] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: envContext } = useEnvironmentContext();

  const handleAssistantChoice = (key: string) => {
    setAssistantMessage(ASSISTANT_RESPONSES[key] ?? ASSISTANT_RESPONSES.other);
  };

  const weather = getCognitiveWeather(MOCK_STATS, MOCK_HISTORY);
  const WeatherIcon = weather.icon;

  return (
    <div className="min-h-screen w-full flex flex-col gradient-mesh noise-overlay">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-stone-200 flex-shrink-0">
        <div className="p-4 border-b border-stone-100">
          <Button
            className="w-full rounded-lg bg-stone-900 hover:bg-stone-800 text-white gap-2"
            onClick={() => navigate("/live-session")}
          >
            <Play className="w-4 h-4" />
            Start session
          </Button>
        </div>

        <div className="p-4 border-b border-stone-100">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Account
          </p>
          <nav className="space-y-0.5">
            {[
              { label: "Dashboard", icon: HomeIcon, path: "/home" },
              { label: "History", icon: History, path: "/home", onClick: () => {} },
              { label: "Settings", icon: Settings, path: "/safeguards" },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => (path === "/home" && label === "Dashboard" ? {} : navigate(path))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                <Icon className="w-4 h-4 text-stone-500" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-b border-stone-100">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Resources
          </p>
          <nav className="space-y-0.5">
            {[
              { label: "Interventions", icon: Wind, path: "/interventions" },
              { label: "Weekly Report", icon: FileText, path: "/weekly-report" },
              { label: "Group Mode", icon: Users, path: "/group" },
              { label: "Environment Radar", icon: Radio, path: "/environment-radar" },
              { label: "About this sense", icon: Brain, path: "/sense" },
              { label: "Safeguards", icon: Shield, path: "/safeguards" },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                <Icon className="w-4 h-4 text-stone-500" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1" />
        <div className="p-4 border-t border-stone-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-stone-500 hover:bg-stone-50">
            <span className="w-4 h-4 rounded-full bg-amber-100" />
            Light theme
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="flex-shrink-0 border-b border-stone-200/80 px-4 lg:px-6 py-4 glass-panel">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <span className="text-white font-bold text-lg">HS</span>
              </div>
              <h1 className="text-xl font-display font-semibold text-stone-900 tracking-tight">Headspace</h1>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="search"
                  placeholder="Search tips, sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-1.5"
                onClick={() => navigate("/")}
              >
                Onboarding
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/safeguards")}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile: Start session CTA */}
        <div className="lg:hidden px-4 py-3 border-b border-stone-100 bg-stone-50/50">
          <Button
            className="w-full rounded-lg bg-stone-900 hover:bg-stone-800 text-white gap-2"
            onClick={() => navigate("/live-session")}
          >
            <Play className="w-4 h-4" />
            Start session
          </Button>
        </div>

        {/* Main content - document scroll (reliable everywhere) */}
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left column */}
          <div className="flex-shrink-0 lg:flex-1 min-w-0 p-4 lg:p-6 lg:border-r border-stone-100">
            {/* Cognitive Weather banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn("rounded-2xl p-4 mb-5 flex items-start gap-3 bento-card", weather.bg)}
            >
              <WeatherIcon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", weather.color)} />
              <div>
                <p className={cn("text-sm font-semibold", weather.color)}>
                  Cognitive Weather: {weather.label}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">{weather.copy}</p>
              </div>
            </motion.div>

            {/* Smart Day Planner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl bento-card bento-card-accent p-5 mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-stone-900 text-sm">Today's plan</h3>
              </div>
              <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                {MOCK_DAY_SCHEDULE.map((s) => (
                  <div
                    key={s.label}
                    className={cn(
                      "flex-shrink-0 h-8 rounded-lg flex items-center justify-center text-[10px] font-medium px-2",
                      s.type === "focus" && "bg-teal-100 text-teal-700",
                      s.type === "break" && "bg-amber-100 text-amber-700",
                      s.type === "meetings" && "bg-rose-100 text-rose-700",
                      s.type === "lunch" && "bg-stone-100 text-stone-600",
                      s.type === "light" && "bg-stone-50 text-stone-500"
                    )}
                    title={`${s.start}-${s.end}: ${s.label}`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-500">
                Best deep work: 9:30–11:00 · Suggested break: 3:00 PM
              </p>
            </motion.div>

            {/* Environment Context - live APIs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="rounded-2xl bento-card p-4 mb-6 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/environment-radar")}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-teal-100">
                  <Radio className="w-4 h-4 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-stone-900 text-sm">Environment Radar</h3>
                  <p className="text-xs text-stone-500 truncate">
                    {envContext ? (
                      <>{(envContext.geo.city && `${envContext.geo.city} · `)}
                        {Math.round(envContext.weather.temp)}° · AQI {envContext.airQuality.usAqi}</>
                    ) : (
                      "Live weather, air quality, UV, pollen…"
                    )}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
            </motion.div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-1">
                Recent activity
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </h2>
            </div>

            {/* Category tabs - pill style */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    activeTab === tab
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Featured card: Start session / Cognitive state */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bento-card card-glow p-5 mb-6 relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                New
              </span>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 mb-1">Track your cognitive bandwidth</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    Start a session to monitor your mental load in real time.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="rounded-lg bg-stone-900 hover:bg-stone-800"
                      onClick={() => navigate("/live-session")}
                    >
                      Start session
                    </Button>
                    <button className="p-2 rounded-lg hover:bg-stone-200/80">
                      <RefreshCw className="w-4 h-4 text-stone-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-stone-200/80">
                      <X className="w-4 h-4 text-stone-500" />
                    </button>
                  </div>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Field bandwidth={25} state="optimal" className="absolute inset-0" />
                </div>
              </div>
            </motion.div>

            {/* Session cards */}
            <div className="space-y-4">
              {MOCK_HISTORY.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.05 }}
                  className="rounded-2xl bento-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{entry.date}</p>
                      <p className="text-xs text-stone-500">
                        {entry.duration} · peak load <span className="font-number">{entry.peakLoad}%</span>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-stone-200"
                      onClick={() => navigate("/live-session")}
                    >
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column: Trending / Quick actions */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-4 lg:p-6 bg-stone-50/40">
            <h2 className="text-base font-semibold text-stone-900 mb-2">
              Trending last 7 days
            </h2>
            <div className="flex gap-2 mb-4">
              {["All", "Breathwork", "Rest"].map((t) => (
                <button
                  key={t}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    t === "All" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {QUICK_ACTIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                    className={cn(
                      "rounded-2xl bento-card p-4",
                      item.highlight
                        ? "bento-card-accent border-teal-200/60 bg-gradient-to-br from-teal-50/80 to-white"
                        : ""
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            item.highlight ? "bg-teal-100 text-teal-600" : "bg-stone-100 text-stone-600"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 text-sm">{item.title}</p>
                          <p className="text-xs text-stone-500">{item.type}</p>
                        </div>
                      </div>
                      {item.highlight && (
                        <span className="text-teal-600">♥ {item.downloads}</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mb-3">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500">{item.duration}</span>
                      <Button
                        size="sm"
                        className={cn(
                          "rounded-lg text-xs h-8",
                          item.highlight
                            ? "bg-teal-600 hover:bg-teal-700"
                            : "bg-stone-900 hover:bg-stone-800"
                        )}
                        onClick={() => navigate("/interventions")}
                      >
                        Try
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* How are you / AI assistant */}
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-6 rounded-2xl bento-card p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-teal-600" />
                <h3 className="font-medium text-stone-900 text-sm">How are you?</h3>
              </div>
              <p className="text-xs text-stone-500 mb-3">Tap how you're feeling.</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["stressed", "anxious", "overwhelmed", "sad", "tired"].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleAssistantChoice(key)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-medium text-stone-700 capitalize"
                  >
                    {key}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {assistantMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-xs text-stone-700"
                  >
                    {assistantMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Emergency */}
            <div className="mt-6">
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                onClick={() => setShowEmergency(!showEmergency)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bento-card"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-stone-700">Emergency dials</span>
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 text-stone-400 transition-transform", showEmergency && "rotate-180")}
                />
              </motion.button>
              <AnimatePresence>
                {showEmergency && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2 rounded-2xl bento-card p-4 space-y-2"
                  >
                    {EMERGENCY_DIALS.map((d) => (
                      <div
                        key={d.name}
                        className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0"
                      >
                        <span className="text-sm text-stone-700">{d.name}</span>
                        <a
                          href={`tel:${d.number.replace(/\D/g, "")}`}
                          className="text-sm font-semibold text-teal-600 hover:underline"
                        >
                          {d.number}
                        </a>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate("/hospitals")}
                      className="w-full flex items-center justify-between py-3 mt-2 text-left hover:bg-stone-50 rounded-lg -mx-2 px-2 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        Find nearby hospitals
                      </span>
                      <span className="text-xs text-stone-400">→</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
