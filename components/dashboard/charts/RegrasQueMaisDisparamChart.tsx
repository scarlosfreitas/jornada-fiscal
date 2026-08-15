"use client";

import "./register";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { RuleRank } from "@/lib/mock/dashboard";
import { CHART_COLORS, CHART_FONT_BODY, CHART_FONT_MONO, RULES_BAR_COLOR, RULES_BAR_HOVER_COLOR } from "./colors";

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: CHART_COLORS.ink,
      padding: 10,
      cornerRadius: 8,
      titleFont: { family: CHART_FONT_BODY, size: 12 },
      bodyFont: { family: CHART_FONT_MONO, size: 12 },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { color: CHART_COLORS.gray200 },
      ticks: { color: CHART_COLORS.gray400, font: { family: CHART_FONT_MONO, size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: CHART_COLORS.gray200 },
      border: { display: false },
      ticks: { color: CHART_COLORS.gray400, font: { family: CHART_FONT_MONO, size: 11 }, padding: 8 },
    },
  },
};

export function RegrasQueMaisDisparamChart({ data }: { data: RuleRank[] }) {
  return (
    <Bar
      data={{
        labels: data.map((rule) => rule.code),
        datasets: [
          {
            data: data.map((rule) => rule.count),
            backgroundColor: RULES_BAR_COLOR,
            hoverBackgroundColor: RULES_BAR_HOVER_COLOR,
            borderRadius: 6,
            maxBarThickness: 34,
          },
        ],
      }}
      options={options}
    />
  );
}
