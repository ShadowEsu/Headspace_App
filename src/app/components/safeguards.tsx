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
} from "lucide-react";
import { Switch } from "./ui/switch";

export function Safeguards() {
  const [ghostMode, setGhostMode] = useState(false);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [emergencyProtocol, setEmergencyProtocol] = useState(true);
  const [deleteSchedule, setDeleteSchedule] = useState<"daily" | "weekly" | "monthly">("weekly");
  const navigate = useNavigate();

  const handleGhostMode = (enabled: boolean) => {
    setGhostMode(enabled);
    // In a real app, this would immediately stop all tracking
  };

  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      "This will permanently delete all your cognitive bandwidth data. This action cannot be undone."
    );
    if (confirmed) {
      // Delete all data
      alert("All data has been deleted.");
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
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-sm uppercase tracking-wider">Safeguards</h2>
          </div>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-20 left-0 right-0 bottom-0 overflow-y-auto px-6 pb-6">
        {/* Ghost Mode - Instant Pause */}
        <div className="mb-6">
          <motion.div
            className={`rounded-2xl p-5 border-2 transition-all ${
              ghostMode
                ? "bg-gray-900 border-gray-900"
                : "bg-white border-gray-200"
            }`}
            animate={{
              scale: ghostMode ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ghostMode ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <EyeOff
                    className={`w-5 h-5 ${ghostMode ? "text-white" : "text-gray-700"}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-medium mb-1 ${ghostMode ? "text-white" : "text-gray-900"}`}
                  >
                    Ghost Mode
                  </h3>
                  <p
                    className={`text-sm ${
                      ghostMode ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    Instantly pause all tracking and monitoring
                  </p>
                </div>
              </div>
              <Switch checked={ghostMode} onCheckedChange={handleGhostMode} />
            </div>
            {ghostMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-white/10"
              >
                <p className="text-xs text-white/70">
                  All sensors paused. No data is being collected.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Data Controls */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data Controls
          </h3>

          <div className="space-y-3">
            {/* Auto-Delete */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Auto-Delete Schedule</h4>
                    <p className="text-sm text-gray-600">
                      Automatically delete old bandwidth data
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoDeleteEnabled}
                  onCheckedChange={setAutoDeleteEnabled}
                />
              </div>

              {autoDeleteEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-gray-100"
                >
                  <div className="flex gap-2">
                    {(["daily", "weekly", "monthly"] as const).map((schedule) => (
                      <button
                        key={schedule}
                        onClick={() => setDeleteSchedule(schedule)}
                        className={`flex-1 py-2 rounded-lg text-xs capitalize transition-colors ${
                          deleteSchedule === schedule
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {schedule}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Manual Delete */}
            <button
              onClick={handleDeleteAllData}
              className="w-full bg-white border border-red-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-medium text-red-900">Delete All Data</h4>
                <p className="text-sm text-red-700">Permanently erase all records</p>
              </div>
            </button>
          </div>
        </div>

        {/* Emergency Protocol */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Protocol
          </h3>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Critical State Alert</h4>
                  <p className="text-sm text-gray-600">
                    Notify emergency contact if Critical state persists 45+ minutes
                  </p>
                </div>
              </div>
              <Switch
                checked={emergencyProtocol}
                onCheckedChange={setEmergencyProtocol}
              />
            </div>
          </div>
        </div>

        {/* Data Encryption */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </h3>

          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h4 className="font-medium mb-1">End-to-End Encryption</h4>
                <p className="text-sm text-gray-600">
                  All data is encrypted locally before storage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <h4 className="font-medium mb-2 text-sm">Important Notice</h4>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">
            Headspace is not a medical device and should not replace professional mental health
            care. Cognitive bandwidth estimates are approximations based on behavioral signals.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            No personally identifiable information (PII) or protected health information (PHI) is
            collected or stored. All data remains on your device unless explicitly shared.
          </p>
        </div>
      </div>
    </div>
  );
}
