import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Download, Share2 } from "lucide-react";

export function WeeklyReport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [isGenerated, setIsGenerated] = useState(false);

  // Generate unique abstract shape from mock weekly data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 300 * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = "300px";
    canvas.style.height = "300px";
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);

    // Mock weekly bandwidth data (7 days, multiple readings per day)
    const weekData = Array.from({ length: 7 }, () =>
      Array.from({ length: 12 }, () => Math.random() * 100)
    );

    // Generate organic shape based on data
    const centerX = 150;
    const centerY = 150;
    const points = 24;

    ctx.beginPath();

    // Create gradient based on average bandwidth
    const avgBandwidth = weekData.flat().reduce((a, b) => a + b, 0) / weekData.flat().length;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120);

    if (avgBandwidth < 40) {
      gradient.addColorStop(0, "#2DD4BF");
      gradient.addColorStop(1, "#0D9488");
    } else if (avgBandwidth < 60) {
      gradient.addColorStop(0, "#FBBF24");
      gradient.addColorStop(1, "#D97706");
    } else if (avgBandwidth < 80) {
      gradient.addColorStop(0, "#FB923C");
      gradient.addColorStop(1, "#EA580C");
    } else {
      gradient.addColorStop(0, "#EF4444");
      gradient.addColorStop(1, "#B91C1C");
    }

    // Draw organic blob
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const dataIndex = Math.floor((i / points) * weekData.flat().length);
      const dataValue = weekData.flat()[dataIndex] || 50;
      const radius = 50 + (dataValue / 100) * 70;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use quadratic curves for smooth organic shape
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const prevDataValue = weekData.flat()[Math.floor(((i - 1) / points) * weekData.flat().length)] || 50;
        const prevRadius = 50 + (prevDataValue / 100) * 70;
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;

        const cpX = (prevX + x) / 2;
        const cpY = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
      }
    }

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add subtle noise texture
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 300;
      const y = Math.random() * 300;
      ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
      ctx.fillRect(x, y, 1, 1);
    }

    setIsGenerated(true);
  }, []);

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `headspace-weekly-${new Date().toISOString().split("T")[0]}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Mock stats
  const stats = {
    avgBandwidth: 58,
    peakLoad: 87,
    optimalHours: 42,
    interventionsUsed: 12,
  };

  return (
    <div className="relative h-screen w-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-sm uppercase tracking-wider">Weekly Report</h2>
        <button onClick={handleShare}>
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="text-xs text-gray-500 mb-1">Feb 27 - Mar 6, 2026</div>
          <h1 className="text-2xl">Your Cognitive Portrait</h1>
        </motion.div>

        {/* Generated Data Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isGenerated ? 1 : 0, scale: isGenerated ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <canvas
            ref={canvasRef}
            className="rounded-3xl shadow-2xl"
            style={{ width: 300, height: 300 }}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="grid grid-cols-2 gap-4 w-full max-w-sm"
        >
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stats.avgBandwidth}%</div>
            <div className="text-xs text-gray-600">Avg Bandwidth</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stats.peakLoad}%</div>
            <div className="text-xs text-gray-600">Peak Load</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stats.optimalHours}h</div>
            <div className="text-xs text-gray-600">Optimal Hours</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stats.interventionsUsed}</div>
            <div className="text-xs text-gray-600">Interventions</div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleShare}
          className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-full text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Portrait
        </motion.button>
      </div>
    </div>
  );
}
