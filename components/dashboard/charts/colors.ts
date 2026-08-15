/**
 * Chart.js desenha em <canvas> e não aceita var(--ga-*): precisa de cores
 * concretas. Este módulo espelha os tokens de app/gestor-alertas.css — ele
 * é a fonte da verdade; se os tokens mudarem lá, atualize aqui também.
 */

export const CHART_COLORS = {
  primary600: "#2A45D4",
  primary200: "#C3CDF9",
  ink: "#151A2E",
  success: "#12855C",
  warning: "#B45309",
  danger: "#C2321F",
  info: "#1E63C9",
  amarelo: "#E8A317",
  gray400: "#8A91A3",
  gray200: "#E4E6EC",
  gray700: "#333A4A",
};

export const LEVEL_COLORS = {
  alerta: CHART_COLORS.danger,
  indicacao: CHART_COLORS.amarelo,
  intervencao: CHART_COLORS.gray400,
};

/** Alinhado à ordem de labels de OsDistribution: Aberta, Solicitada, Delegada, Concluída, Rejeitada, Decaída */
export const OS_SITUATION_COLORS = [
  CHART_COLORS.primary600,
  CHART_COLORS.warning,
  CHART_COLORS.info,
  CHART_COLORS.success,
  CHART_COLORS.danger,
  CHART_COLORS.gray400,
];

export const RULES_BAR_COLOR = CHART_COLORS.primary600;
export const RULES_BAR_HOVER_COLOR = "#1E33A8";

export const CHART_FONT_BODY = "IBM Plex Sans";
export const CHART_FONT_MONO = "IBM Plex Mono";
