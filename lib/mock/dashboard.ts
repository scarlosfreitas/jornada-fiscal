/**
 * Dados mock do Painel operacional, extraídos de references/design/Dashboard.html.
 * Não há persistência real ainda (sem prisma/schema.prisma) — quando existir,
 * getDashboardData vira async e passa a consultar o banco; a assinatura por
 * período já é a de uma leitura real, e os componentes de apresentação não mudam.
 */

export const PERIODS = ["7d", "30d", "90d"] as const;

export type Period = (typeof PERIODS)[number];

/** Lê o período do parâmetro de consulta, caindo no padrão quando ausente ou inválido. */
export function parsePeriod(value: string | string[] | undefined): Period {
  return typeof value === "string" && (PERIODS as readonly string[]).includes(value)
    ? (value as Period)
    : "7d";
}

export type KpiVariant = "primary" | "warning" | "danger" | "success";

export interface KpiCard {
  label: string;
  value: string;
  delta: string;
  variant: KpiVariant;
}

export interface SeriesByLevel {
  labels: string[];
  alerta: number[];
  indicacao: number[];
  intervencao: number[];
}

export interface OsDistribution {
  labels: string[];
  values: number[];
}

export interface RuleRank {
  code: string;
  count: number;
}

export interface ChannelRow {
  label: string;
  chipVariant: "" | "info" | "primary" | "warning";
  hint: string;
  value: string;
  pct: string;
  color: string;
}

export interface AlertRow {
  time: string;
  level: "Alerta" | "Indicação" | "Intervenção";
  levelClass: "ga-level-red" | "ga-level-yellow" | "ga-level-gray";
  name: string;
  doc: string;
  ruleCode: string;
}

export interface MonitoringRow {
  code: string;
  desc: string;
  scope: string;
  level: string;
  levelClass: "ga-level-red" | "ga-level-yellow" | "ga-level-gray";
  osCount: number;
}

export interface DashboardData {
  period: Period;
  periodLabel: string;
  kpis: KpiCard[];
  alertsByLevel: SeriesByLevel;
  osDistribution: OsDistribution;
  topRules: RuleRank[];
  channels: ChannelRow[];
  recentAlerts: AlertRow[];
  activeMonitorings: MonitoringRow[];
  updatedLabel: string;
}

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "últimos 7 dias",
  "30d": "últimos 30 dias",
  "90d": "últimos 90 dias",
};

const KPI_LABELS = ["Alertas gerados", "Monitoramentos ativos", "OS em aberto", "Efetivação das intervenções"];
const KPI_VARIANTS: KpiVariant[] = ["primary", "warning", "danger", "success"];

const KPI_VALUES_BY_PERIOD: Record<Period, string[]> = {
  "7d": ["92", "7", "24", "86%"],
  "30d": ["387", "7", "61", "88%"],
  "90d": ["1.152", "9", "214", "84%"],
};

const KPI_DELTA_BY_PERIOD: Record<Period, string[]> = {
  "7d": ["+18% vs. semana anterior", "2 desabilitados", "9 fora do prazo", "meta 85%"],
  "30d": ["+12% vs. mês anterior", "2 desabilitados", "14 fora do prazo", "meta 85%"],
  "90d": ["+9% vs. trimestre anterior", "2 desabilitados", "23 fora do prazo", "meta 85%"],
};

const SERIES_BY_PERIOD: Record<Period, SeriesByLevel> = {
  "7d": {
    labels: ["09/08", "10/08", "11/08", "12/08", "13/08", "14/08", "15/08"],
    alerta: [6, 4, 9, 7, 11, 8, 12],
    indicacao: [14, 11, 16, 13, 18, 15, 17],
    intervencao: [3, 2, 4, 5, 3, 6, 4],
  },
  "30d": {
    labels: ["sem 1", "sem 2", "sem 3", "sem 4"],
    alerta: [38, 44, 51, 57],
    indicacao: [92, 88, 101, 96],
    intervencao: [18, 21, 24, 27],
  },
  "90d": {
    labels: ["jun", "jul", "ago"],
    alerta: [142, 168, 190],
    indicacao: [356, 381, 402],
    intervencao: [64, 72, 88],
  },
};

const OS_DISTRIBUTION: OsDistribution = {
  labels: ["Aberta", "Solicitada", "Delegada", "Concluída", "Rejeitada", "Decaída"],
  values: [9, 12, 7, 24, 5, 4],
};

const TOP_RULES: RuleRank[] = [
  { code: "REG-0068", count: 57 },
  { code: "REG-0071", count: 44 },
  { code: "REG-0064", count: 31 },
  { code: "REG-0059", count: 22 },
  { code: "REG-0055", count: 14 },
  { code: "REG-0047", count: 9 },
];

const CHANNELS: ChannelRow[] = [
  { label: "Tela do sistema", chipVariant: "", hint: "indicação passiva", value: "412", pct: "100%", color: "var(--ga-primary-600)" },
  { label: "Telegram", chipVariant: "info", hint: "alerta imediato", value: "188", pct: "46%", color: "var(--ga-info)" },
  { label: "Prodoc", chipVariant: "primary", hint: "via processo", value: "96", pct: "23%", color: "var(--ga-primary-200)" },
  { label: "E-mail", chipVariant: "", hint: "resumo diário", value: "74", pct: "18%", color: "var(--ga-gray-400)" },
  { label: "Pessoal", chipVariant: "warning", hint: "contato direto", value: "21", pct: "5%", color: "var(--ga-warning)" },
];

const RECENT_ALERTS: AlertRow[] = [
  { time: "09:41", level: "Alerta", levelClass: "ga-level-red", name: "Transportes Vale Norte", doc: "08.417.552/0001-09", ruleCode: "REG-0068" },
  { time: "08:57", level: "Intervenção", levelClass: "ga-level-gray", name: "Grupo Serra Holdings", doc: "6 CNPJ vinculados", ruleCode: "REG-0064" },
  { time: "08:12", level: "Indicação", levelClass: "ga-level-yellow", name: "Comercial Nova Aurora ME", doc: "52.884.101/0001-77", ruleCode: "REG-0071" },
  { time: "07:44", level: "Alerta", levelClass: "ga-level-red", name: "Metalúrgica Andrade S/A", doc: "12.884.310/0001-45", ruleCode: "REG-0059" },
  { time: "07:20", level: "Intervenção", levelClass: "ga-level-gray", name: "Helena Braga Sotero", doc: "CPF 214.***.***-08", ruleCode: "REG-0064" },
  { time: "06:58", level: "Indicação", levelClass: "ga-level-yellow", name: "Frigorífico Boa Serra", doc: "21.009.744/0001-71", ruleCode: "REG-0071" },
];

const ACTIVE_MONITORINGS: MonitoringRow[] = [
  { code: "MON-0038", desc: "Pendência documental acima de 5 dias", scope: "Documentos · 9 empresas", level: "Cinza", levelClass: "ga-level-gray", osCount: 11 },
  { code: "MON-0035", desc: "Preventivas sem apontamento no prazo", scope: "Ordens de serviço · 31", level: "Cinza", levelClass: "ga-level-gray", osCount: 7 },
  { code: "MON-0041", desc: "Contratos vencendo em 30 dias", scope: "Contratos · 22 empresas", level: "Vermelho", levelClass: "ga-level-red", osCount: 3 },
  { code: "MON-0031", desc: "Inadimplência acima de 15 dias", scope: "Financeiro · 6 empresas", level: "Vermelho", levelClass: "ga-level-red", osCount: 2 },
  { code: "MON-0042", desc: "Empresas recém-cadastradas sem OS", scope: "Cadastro · 14 empresas", level: "Amarelo", levelClass: "ga-level-yellow", osCount: 0 },
];

export function getDashboardData(period: Period): DashboardData {
  const values = KPI_VALUES_BY_PERIOD[period];
  const deltas = KPI_DELTA_BY_PERIOD[period];

  return {
    period,
    periodLabel: PERIOD_LABELS[period],
    kpis: KPI_LABELS.map((label, i) => ({
      label,
      value: values[i],
      delta: deltas[i],
      variant: KPI_VARIANTS[i],
    })),
    alertsByLevel: SERIES_BY_PERIOD[period],
    osDistribution: OS_DISTRIBUTION,
    topRules: TOP_RULES,
    channels: CHANNELS,
    recentAlerts: RECENT_ALERTS,
    activeMonitorings: ACTIVE_MONITORINGS,
    updatedLabel: "atualizado há 4 min",
  };
}
