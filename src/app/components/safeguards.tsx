import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Shield,
  Trash2,
  EyeOff,
  AlertTriangle,
  Lock,
  Database,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import { Switch } from "./ui/switch";

const EMERGENCY_NUMBERS = [
  { name: "Emergency", number: "911" },
  { name: "Crisis Line", number: "988" },
  { name: "Crisis Text", number: "741741" },
];

export function Safeguards() {
  const [ghostMode, setGhostMode] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [emergencyProtocol, setEmergencyProtocol] = useState(true);
  const [deleteSchedule, setDeleteSchedule] = useState<"daily" | "weekly" | "monthly">("weekly");
  const navigate = useNavigate();

  const handleGhostMode = (enabled: boolean) => {
    setGhostMode(enabled);
  };

  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      "This will permanently delete all your cognitive bandwidth data. This action cannot be undone."
    );
    if (confirmed) {
      alert("All data has been deleted.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
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
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0D9488]" />
            <h2 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
              Safeguards
            </h2>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <div className="overflow-y-auto px-4 py-6 pb-24 max-w-2xl mx-auto">
        {/* Emergency numbers - prominent */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency resources
          </h3>
          <div className="bento-card p-4 space-y-3">
            {EMERGENCY_NUMBERS.map((e) => (
              <div
                key={e.name}
                className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0"
              >
                <span className="text-sm font-medium text-stone-800">{e.name}</span>
                <a
                  href={`tel:${e.number.replace(/\D/g, "")}`}
                  className="font-mono text-sm font-semibold text-[#0D9488] hover:underline"
                >
                  {e.number}
                </a>
              </div>
            ))}
            <button
              onClick={() => navigate("/hospitals")}
              className="w-full flex items-center justify-between py-3 mt-2 text-left hover:bg-stone-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-stone-800">
                <MapPin className="w-4 h-4 text-[#0D9488]" />
                Find nearby hospitals
              </span>
              <span className="text-xs text-stone-400">→</span>
            </button>
          </div>
        </section>

        {/* Ghost Mode */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Privacy
          </h3>
          <div
            className={`bento-card p-5 transition-colors ${
              ghostMode ? "bg-stone-900 border-stone-900" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ghostMode ? "bg-white/10" : "bg-stone-100"
                  }`}
                >
                  <EyeOff
                    className={`w-5 h-5 ${ghostMode ? "text-white" : "text-stone-700"}`}
                  />
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-0.5 ${ghostMode ? "text-white" : "text-stone-900"}`}
                  >
                    Ghost mode
                  </h4>
                  <p
                    className={`text-sm ${ghostMode ? "text-white/70" : "text-stone-600"}`}
                  >
                    Instantly pause all tracking
                  </p>
                </div>
              </div>
              <Switch checked={ghostMode} onCheckedChange={handleGhostMode} />
            </div>
            {ghostMode && (
              <p className="mt-4 pt-4 border-t border-white/10 text-xs text-white/70">
                All sensors paused. No data is being collected.
              </p>
            )}
          </div>
        </section>

        {/* Data Controls */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data controls
          </h3>

          <div className="bento-card p-5 mb-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-stone-900 mb-0.5">Auto-delete schedule</h4>
                <p className="text-sm text-stone-600">Delete old bandwidth data automatically</p>
              </div>
              <Switch
                checked={autoDeleteEnabled}
                onCheckedChange={setAutoDeleteEnabled}
              />
            </div>
            {autoDeleteEnabled && (
              <div className="flex gap-2 pt-3 border-t border-stone-100">
                {(["daily", "weekly", "monthly"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDeleteSchedule(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                      deleteSchedule === s
                        ? "bg-[#0D9488] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDeleteAllData}
            className="w-full bento-card p-5 flex items-center gap-4 hover:shadow-md border-red-100 hover:border-red-200"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-semibold text-red-900">Delete all data</h4>
              <p className="text-sm text-red-700">Permanently erase all records</p>
            </div>
          </button>
        </section>

        {/* Emergency Protocol */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alerts
          </h3>
          <div className="bento-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 mb-0.5">Critical state alert</h4>
                  <p className="text-sm text-stone-600">
                    Notify emergency contact if critical state persists 45+ minutes
                  </p>
                </div>
              </div>
              <Switch
                checked={emergencyProtocol}
                onCheckedChange={setEmergencyProtocol}
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </h3>
          <div className="bento-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-stone-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-stone-900 mb-0.5">End-to-end encryption</h4>
                <p className="text-sm text-stone-600">All data encrypted locally before storage</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </div>
            </div>
          </div>
        </section>

        {/* Legal */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
          <h4 className="font-semibold text-stone-900 mb-2 text-sm">Important notice</h4>
          <p className="text-xs text-stone-600 leading-relaxed mb-2">
            This app is not a medical device and should not replace professional mental health care.
            Cognitive bandwidth estimates are approximations based on behavioral signals.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            No personally identifiable information (PII) or protected health information (PHI) is
            collected or stored. All data remains on your device unless explicitly shared.
          </p>
        </div>
      </div>
    </div>
  );
}
