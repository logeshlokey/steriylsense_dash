"use client";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RootCausePanelProps {
  dataset: any[];
}

const RootCausePanel: React.FC<RootCausePanelProps> = ({ dataset }) => {
  // Safe function to calculate % change
  const safePercentChange = (current: number | undefined, previous: number | undefined) => {
    if (current === undefined || previous === undefined || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate contributions for the last two time points
  const contributions = useMemo(() => {
    if (!dataset || dataset.length < 2) return [];
    const latest = dataset[dataset.length - 1];
    const prev = dataset[dataset.length - 2];

    return [
      { name: "Humidity", value: safePercentChange(latest.humidity_percent, prev.humidity_percent) },
      { name: "UV Intensity", value: safePercentChange(latest.uv_intensity_mw_cm2, prev.uv_intensity_mw_cm2) },
      { name: "Occupancy", value: safePercentChange(latest.room_occupied, prev.room_occupied) },
      { name: "Contamination", value: safePercentChange(latest.contamination_score, prev.contamination_score) },
    ];
  }, [dataset]);

  // Radar chart data
  const chartData = {
    labels: contributions.map((c) => c.name),
    datasets: [
      {
        label: "Contribution %",
        data: contributions.map((c) => Math.abs(c.value)),
        backgroundColor: "rgba(255, 99, 132, 0.3)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: contributions.map((c) => (c.value > 0 ? "#ff4d6d" : "#4db8ff")),
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointHoverBorderColor: "#fff",
        pointHoverBackgroundColor: contributions.map((c) => (c.value > 0 ? "#ff4d6d" : "#4db8ff")),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Radar chart options
  const chartOptions: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#f0f0f0", font: { size: 14, weight: "bold" } },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const val = contributions[context.dataIndex]?.value ?? 0;
            return `${context.label}: ${val > 0 ? "↑" : "↓"} ${Math.abs(val).toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: { color: "#555" },
        grid: { color: "#333" },
        pointLabels: { color: "#f0f0f0", font: { size: 12, weight: "bold" } },
        min: 0,
        ticks: {
          color: "#f0f0f0",
          stepSize: 10,
        },
      },
    },
    animation: { duration: 1000, easing: "easeOutQuart" },
  };

  // Handle empty dataset case
  if (!dataset || dataset.length < 2) {
    return (
      <Card className="p-4 bg-gray-900 text-white text-center">
        <h2 className="text-xl font-bold text-purple-400 mb-2">Root Cause Analysis</h2>
        <p className="text-gray-400">Not enough data to calculate contributions.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gray-900 text-white hover:shadow-2xl transition-shadow duration-500">
      <h2 className="text-xl font-bold mb-4 text-purple-400">Root Cause Analysis</h2>

      {/* Radar Chart */}
      <div className="max-w-lg mx-auto">
        <Radar data={chartData} options={chartOptions} />
      </div>

      {/* Contribution Cards */}
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        {contributions.map((c) => (
          <div
            key={c.name}
            className={`bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 w-36 text-center`}
          >
            <h3 className="text-sm font-semibold text-gray-300">{c.name}</h3>
            <p className={`text-lg font-bold ${c.value > 0 ? "text-red-400" : "text-blue-400"}`}>
              {c.value > 0 ? "↑" : "↓"} {Math.abs(c.value).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {/* Summary Text */}
      <p className="mt-4 text-sm text-gray-400 text-center">
        Summary: Contamination changed due to{" "}
        {contributions
          .map((c) => `${c.value > 0 ? "↑" : "↓"} ${c.name} (${Math.abs(c.value).toFixed(1)}%)`)
          .join(", ")}
        .
      </p>
    </Card>
  );
};

export default RootCausePanel;
