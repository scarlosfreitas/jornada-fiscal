export const MENU = [
  { label: "Regras de aviso", href: "#regras" },
  { label: "Timeline", href: "#timeline" },
  { label: "Plataforma de dados", href: "#plataforma" },
  { label: "Operações", href: "#operacoes" },
] as const;

export const HERO_STATS = [
  { value: "16 eventos", label: "na jornada de um contribuinte" },
  { value: "4 fontes", label: "monitoradas em tempo real" },
  { value: "3 níveis", label: "de aviso, alerta e intervenção" },
] as const;

export const SOURCES = [
  {
    tag: "DFe",
    title: "DFe",
    desc: "Emissão de notas, manifestos e documentos sensíveis monitorados na origem.",
    chips: ["NFe", "NFCe", "MDFe", "DIMP"],
  },
  {
    tag: "RSIM",
    title: "RedeSim",
    desc: "Alterações societárias e de regime capturadas no momento do registro.",
    chips: ["Abertura", "Regime", "Sócios"],
  },
  {
    tag: "SATE",
    title: "Cadastro no SATE",
    desc: "Endereço, contador, administrador e situação cadastral sob vigilância.",
    chips: ["Endereço", "Contador", "Situação"],
  },
  {
    tag: "OPEN",
    title: "Dados abertos",
    desc: "Cruzamento com bases públicas para reforçar indícios e vínculos.",
    chips: ["Sócios", "Grupos", "Sanções"],
  },
] as const;

interface TimelineEvent {
  date: string;
  title: string;
  level: "gray" | "yellow" | "red";
  doc?: string;
}

export const TIMELINE: TimelineEvent[] = [
  { date: "01/01/2020", title: "Abertura de cadastro", level: "gray" },
  { date: "01/03/2020", title: "Troca de endereço", level: "gray" },
  {
    date: "01/05/2020",
    title: "Abertura de MPF",
    level: "yellow",
    doc: "MPF 321321.651651/2103213-01",
  },
  { date: "01/07/2020", title: "Verificação in loco", level: "yellow" },
  { date: "01/09/2020", title: "Visita do contribuinte", level: "gray" },
  {
    date: "01/10/2020",
    title: "Auto de Infração de embaraço",
    level: "red",
    doc: "AI 321321.651651/2103213-01",
  },
];

export const TIMELINE_TAG_LABEL: Record<(typeof TIMELINE)[number]["level"], string> = {
  gray: "Cadastro",
  yellow: "Fiscalização",
  red: "Autuação",
};

export const TIMELINE_BULLETS = [
  "Alterações cadastrais, fiscalizações e autuações na mesma régua cronológica.",
  "Documentos anexados abrem direto do evento — MPF, TIF e autos de infração.",
  "Fotos de verificação in loco e transcrições de atendimento com controle de sigilo.",
  "Filtro por tipo de evento para ver um recorte ou o conjunto completo.",
] as const;

export const PIPELINE = [
  { stage: "origem", name: "SATE Oracle", role: "Base transacional do cadastro", accent: false },
  { stage: "streaming", name: "Kafka", role: "Captura de eventos em tempo real", accent: false },
  { stage: "object store", name: "MinIO", role: "Armazenamento bruto e versionado", accent: false },
  { stage: "table format", name: "Iceberg", role: "Tabelas analíticas com histórico", accent: true },
  { stage: "query", name: "Trino", role: "Consulta federada e performática", accent: false },
  { stage: "BI", name: "Superset", role: "Painéis e exploração visual", accent: false },
  { stage: "ciência", name: "JupyterLab", role: "Modelos e investigações ad hoc", accent: false },
] as const;

export const PLATFORM_NOTES = [
  "Camadas desacopladas — nenhuma dependência de fornecedor único",
  "Histórico completo preservado para auditoria e reprocessamento",
  "Mesma base alimenta painéis, alertas e ciência de dados",
] as const;

export const OPS_CARDS = [
  { value: "248", label: "ordens de serviço no ciclo atual", tone: "primary" as const },
  { value: "31", label: "vistorias em trânsito no mês", tone: "info" as const },
  { value: "18", label: "vistorias em estabelecimento", tone: "success" as const },
  { value: "6", label: "operações conjuntas em curso", tone: "warning" as const },
] as const;
