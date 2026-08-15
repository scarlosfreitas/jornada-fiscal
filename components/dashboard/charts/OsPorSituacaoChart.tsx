"use client";

import "./register";
import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { OsDistribution } from "@/lib/mock/dashboard";
import { CHART_COLORS, CHART_FONT_BODY, OS_SITUATION_COLORS } from "./colors";

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: "circle",
        color: CHART_COLORS.gray700,
        font: { family: CHART_FONT_BODY, size: 12 },
        padding: 12,
      },
    },
    tooltip: { backgroundColor: CHART_COLORS.ink, padding: 10, cornerRadius: 8 },
  },
};

export function OsPorSituacaoChart({ data }: { data: OsDistribution }) {
  return (
    <Doughnut
      data={{
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: OS_SITUATION_COLORS,
            borderWidth: 2,
            borderColor: "#FFFFFF",
            hoverOffset: 6,
          },
        ],
      }}
      options={options}
    />
  );
}
