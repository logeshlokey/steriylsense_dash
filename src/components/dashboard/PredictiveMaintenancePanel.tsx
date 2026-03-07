"use client";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import "react-circular-progressbar/dist/styles.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

interface DatasetRow {
  timestamp?: string;
  uv_intensity_mw_cm2?: number | null;
}

interface PredictiveMaintenancePanelProps {
  dataset: DatasetRow[];
}

const toNumberSafe = (value?: number | null) => (typeof value === "number" ? value : 0);

const PredictiveMaintenancePanel: React.FC<PredictiveMaintenancePanelProps> = ({ dataset }) => {
  const trendData = useMemo(() => {
    if (!dataset || dataset.length === 0) return { labels: [], uvData: [], avgData: [] };

    const uvValues = dataset.map((d) => toNumberSafe(d.uv_intensity_mw_cm2));
    const avgValue = uvValues.length ? uvValues.reduce((a, b) => a + b, 0) / uvValues.length : 0;

    return {
      labels: dataset.map((d, i) => d.timestamp ?? `T${i}`),
      uvData: uvValues,
      avgData: Array(dataset.length).fill(avgValue),
    };
  }, [dataset]);

  const latestUV = toNumberSafe(trendData.uvData[trendData.uvData.length - 1]);
  const baseline = toNumberSafe(trendData.uvData[0]) || 1; // avoid division by zero
  const healthPct = Math.max(0, Math.min(100, (latestUV / baseline) * 100));
  const predictedReplacementDays = Math.ceil(((healthPct - 20) / 100) * 30);

  const chartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: "UV Intensity",
        data: trendData.uvData.map(toNumberSafe),
        borderColor: "rgba(0,255,255,0.8)",
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const gradient = chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(0,255,255,0.3)");
          gradient.addColorStop(1, "rgba(0,0,50,0.05)");
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Average UV",
        data: trendData.avgData.map(toNumberSafe),
        borderColor: "rgba(255,165,0,0.8)",
        borderDash: [5, 5],
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "#f0f0f0", font: { size: 12 } } },
      tooltip: { mode: "nearest", intersect: false },
    },
    interaction: { mode: "nearest" as const, axis: "x" as const, intersect: false },
    scales: {
      y: { ticks: { color: "#f0f0f0", stepSize: 10 }, grid: { color: "#333" } },
      x: { ticks: { color: "#f0f0f0" }, grid: { color: "#333" } },
    },
    animation: { duration: 1000, easing: "easeOutQuart" },
  };

  if (!dataset || dataset.length === 0) {
    return (
      <Card className="p-4 bg-gray-900 text-white text-center">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Predictive Maintenance</h2>
        <p className="text-gray-400">No dataset available to display.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gray-900 text-white hover:shadow-2xl transition-shadow duration-500">
      <h2 className="text-xl font-bold mb-3 text-cyan-400">Predictive Maintenance</h2>
      <div className="flex flex-col xl:flex-row gap-6 items-center">
        <div className="w-32 xl:w-40">
          <CircularProgressbar
            value={healthPct}
            text={`${healthPct.toFixed(0)}%`}
            styles={buildStyles({
              pathColor: healthPct > 80 ? "#00ff00" : healthPct > 50 ? "#ffa500" : "#ff4500",
              textColor: "#f0f0f0",
              trailColor: "#555",
              textSize: "16px",
            })}
          />
          <p className="mt-2 text-center text-sm text-gray-400">
            Predicted replacement: {predictedReplacementDays} days
          </p>
        </div>
        <div className="flex-1 h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 flex-1">
          <h3 className="text-sm font-semibold text-gray-300">Latest UV Intensity</h3>
          <p className="text-lg font-bold text-cyan-400">{latestUV.toFixed(1)} mW/cm²</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 flex-1">
          <h3 className="text-sm font-semibold text-gray-300">Lamp Health Status</h3>
          <p
            className={`text-lg font-bold ${
              healthPct > 80 ? "text-green-400" : healthPct > 50 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {healthPct > 80 ? "Healthy" : healthPct > 50 ? "Warning" : "Urgent"}
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 flex-1">
          <h3 className="text-sm font-semibold text-gray-300">Baseline UV</h3>
          <p className="text-lg font-bold text-orange-400">{toNumberSafe(trendData.avgData[0]).toFixed(1)} mW/cm²</p>
        </div>
      </div>
    </Card>
  );
};

export default PredictiveMaintenancePanel;
