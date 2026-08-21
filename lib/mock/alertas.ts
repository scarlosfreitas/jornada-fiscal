/**
 * Dados mock dos Alertas gerados, extraídos de references/design/AlertasGerados.html.
 * Os códigos de regra foram trocados de REG-00xx (protótipo original, sem cadastro
 * de regras por trás) para os códigos FtM cadastrados em lib/mock/regras.ts, para
 * que "Ver regra de origem" resolva de fato — ver design.md da change
 * page-regra-lista, seção Risks.
 * Não há persistência real ainda (sem prisma/schema.prisma) — quando existir,
 * getAlertas vira async e passa a consultar o banco; a assinatura já é a de uma
 * leitura real, e os componentes de apresentação não mudam.
 */

export type AlertLevel = "amarelo" | "vermelho" | "cinza";

export const ALERT_LEVEL_LABEL: Record<AlertLevel, { label: string; cls: string }> = {
  amarelo: { label: "Indicação em tela", cls: "ga-level-yellow" },
  vermelho: { label: "Alerta", cls: "ga-level-red" },
  cinza: { label: "Intervenção", cls: "ga-level-gray" },
};

export type AlertChannel = "tela" | "telegram" | "email" | "prodoc" | "pessoal";

export const ALERT_CHANNEL_LABEL: Record<AlertChannel, { label: string; cls: string }> = {
  tela: { label: "Tela do sistema", cls: "" },
  telegram: { label: "Telegram", cls: "ga-chip-info" },
  email: { label: "E-mail", cls: "" },
  prodoc: { label: "Prodoc", cls: "ga-chip-primary" },
  pessoal: { label: "Pessoal", cls: "ga-chip-warning" },
};

export const ALERT_CHANNEL_ORDER: AlertChannel[] = ["tela", "telegram", "email", "prodoc", "pessoal"];

export type AlertTargetKind = "grupo" | "cnpj" | "socio";

export const ALERT_TARGET_LABEL: Record<AlertTargetKind, { tag: string; cls: string }> = {
  grupo: { tag: "GE", cls: "ga-chip-primary" },
  cnpj: { tag: "CNPJ", cls: "ga-chip-info" },
  socio: { tag: "SÓC", cls: "ga-chip-warning" },
};

export interface GeneratedAlert {
  id: string;
  date: string;
  time: string;
  level: AlertLevel;
  ruleCode: string;
  channels: AlertChannel[];
  targetKind: AlertTargetKind;
  name: string;
  doc: string;
}

const ALERTS: GeneratedAlert[] = [
  { id: "g1", date: "13/08/26", time: "09:41", level: "vermelho", ruleCode: "NFE_0001", channels: ["telegram", "tela"], targetKind: "cnpj", name: "Transportes Vale Norte", doc: "08.417.552/0001-09" },
  { id: "g2", date: "13/08/26", time: "08:57", level: "cinza", ruleCode: "PIX_0005", channels: ["prodoc"], targetKind: "grupo", name: "Grupo Serra Holdings", doc: "6 CNPJ vinculados" },
  { id: "g3", date: "13/08/26", time: "08:12", level: "amarelo", ruleCode: "END_0006", channels: ["tela"], targetKind: "cnpj", name: "Comercial Nova Aurora ME", doc: "52.884.101/0001-77" },
  { id: "g4", date: "12/08/26", time: "18:20", level: "vermelho", ruleCode: "CTE_0007", channels: ["telegram", "email"], targetKind: "cnpj", name: "Metalúrgica Andrade S/A", doc: "12.884.310/0001-45" },
  { id: "g5", date: "12/08/26", time: "16:04", level: "cinza", ruleCode: "PIX_0005", channels: ["prodoc", "pessoal"], targetKind: "socio", name: "Helena Braga Sotero", doc: "CPF 214.***.***-08" },
  { id: "g6", date: "12/08/26", time: "11:36", level: "amarelo", ruleCode: "END_0006", channels: ["tela"], targetKind: "cnpj", name: "Frigorífico Boa Serra", doc: "21.009.744/0001-71" },
  { id: "g7", date: "11/08/26", time: "19:02", level: "vermelho", ruleCode: "CAD_0002", channels: ["telegram"], targetKind: "grupo", name: "Grupo Ponta Verde Agro", doc: "4 CNPJ vinculados" },
  { id: "g8", date: "11/08/26", time: "09:15", level: "cinza", ruleCode: "DIMP_0003", channels: ["email", "prodoc"], targetKind: "cnpj", name: "Distribuidora Sanmar", doc: "07.554.901/0001-16" },
];

export function getAlertas(): GeneratedAlert[] {
  return ALERTS;
}
