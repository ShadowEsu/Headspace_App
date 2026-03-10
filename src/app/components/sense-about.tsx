import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Brain, Eye, Zap } from "lucide-react";

export function SenseAbout() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF9] overflow-hidden">
      <header className="sticky top-0 z-20 glass-panel border-b border-black/5">
        <div className="flex items-center justify-between px-4 py-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </motion.button>
          <h2 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
            About your new sense
          </h2>
          <div className="w-9" />
        </div>
      </header>

      <div className="overflow-y-auto px-4 py-6 pb-24 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bento-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Brain className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">What is cognitive bandwidth?</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Think of it like your brain's RAM. Just as a computer slows down when it runs too many
              programs at once, your mind has a finite capacity for attention, decisions, and complex
              thinking. Cognitive bandwidth is how much of that capacity you have available at any
              moment.
            </p>
          </div>

          <div className="bento-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Why humans misjudge it</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-3">
              We're surprisingly bad at sensing our own cognitive load. Multitasking feels productive
              but drains bandwidth faster. Hidden fatigue builds up before we notice. And we often
              push through when our brain is already in the red.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              This app gives you a new "sense" you didn't have before: a clearer picture of when your
              mental space is full, when it's recovering, and when to shift gears.
            </p>
          </div>

          <div className="bento-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">How we approximate it</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-3">
              In this prototype, cognitive bandwidth is estimated from session data, patterns, and
              simple behavioral cues—all simulated. A future version could integrate:
            </p>
            <ul className="list-disc list-inside text-stone-600 text-sm space-y-1 mb-3">
              <li>Heart rate variability</li>
              <li>Screen interaction patterns</li>
              <li>Ambient noise and lighting</li>
              <li>Calendar and task load</li>
            </ul>
            <p className="text-stone-600 text-sm leading-relaxed">
              The goal is not perfection—it's to make an invisible limit visible so you can protect
              it, recover when needed, and work with your brain instead of against it.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/home")}
            className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-medium text-sm hover:bg-[#0B8075]"
          >
            Back to dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
