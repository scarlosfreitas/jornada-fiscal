"use client";

import "./register";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { SeriesByLevel } from "@/lib/mock/dashboard";
import { CHART_COLORS, CHART_FONT_BODY, CHART_FONT_MONO, LEVEL_COLORS } from "./colors";

const options: ChartOptions<"line"> = {
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

export function AlertasPorDiaChart({ data }: { data: SeriesByLevel }) {
  return (
    <Line
      data={{
        labels: data.labels,
        datasets: [
          {
            label: "Alerta",
            data: data.alerta,
            borderColor: LEVEL_COLORS.alerta,
            backgroundColor: "rgba(194,50,31,.10)",
            tension: 0.35,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: LEVEL_COLORS.alerta,
          },
          {
            label: "Indicação",
            data: data.indicacao,
            borderColor: LEVEL_COLORS.indicacao,
            backgroundColor: "rgba(232,163,23,.10)",
            tension: 0.35,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: LEVEL_COLORS.indicacao,
          },
          {
            label: "Intervenção",
            data: data.intervencao,
            borderColor: LEVEL_COLORS.intervencao,
            backgroundColor: "rgba(138,145,163,.10)",
            tension: 0.35,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: LEVEL_COLORS.intervencao,
          },
        ],
      }}
      options={options}
    />
  );
}
