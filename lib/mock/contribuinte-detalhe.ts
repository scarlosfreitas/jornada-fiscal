import "server-only";

import { lerFonteOu } from "@/lib/fontes";

/**
 * Ficha do contribuinte. Cada `getX` lê o payload correspondente de `FONTES_DIR`
 * (ver lib/fontes/index.ts) e, quando o arquivo não existe, cai nos dados
 * fictícios transcritos de references/design/Contribuinte.html que estão abaixo.
 *
 * O `import "server-only"` no topo é deliberado: os payloads reais trazem dado de
 * contribuinte protegido por sigilo fiscal, e este módulo nunca pode ser bundlado
 * para o navegador. Componentes de cliente devem importar daqui apenas `type`s —
 * um `import` de valor a partir de um client component vira erro de build.
 *
 * Por ora as funções IGNORAM o `id`: a ficha é a mesma para qualquer contribuinte.
 *
 * A aba Histórico não usa este módulo — ver `lib/sate-hist-regime.ts`.
 */

export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

/* --------------------------------------------------------------------------
   Identidade
   -------------------------------------------------------------------------- */

export interface ContribuinteBadge {
  label: string;
  variant: BadgeVariant;
}

export interface ContribuinteFicha {
  iniciais: string;
  razaoSocial: string;
  cnpj: string;
  ie: string;
  grupoEconomico: string;
  badges: ContribuinteBadge[];
}

const FICHA: ContribuinteFicha = {
  iniciais: "MA",
  razaoSocial: "Metalúrgica Andrade S/A",
  cnpj: "12.884.310/0001-45",
  ie: "07.302.118-4",
  grupoEconomico: "Serra Holdings",
  badges: [
    { label: "Situação ativa", variant: "success" },
    { label: "2 alertas abertos", variant: "danger" },
    { label: "Regime: lucro presumido", variant: "neutral" },
  ],
};

export async function getContribuinteFicha(id: string): Promise<ContribuinteFicha> {
  void id;
  return lerFonteOu("contribuinte-ficha", FICHA);
}

/* --------------------------------------------------------------------------
   Linha do tempo
   -------------------------------------------------------------------------- */

export type EventoCategoria = "cadastro" | "fiscal" | "autuacao" | "prazo" | "contato";

/* O rótulo e a cor de cada categoria são apresentação e vivem em
   components/contribuinte/categorias.ts — este módulo só carrega dado. */

export interface EventoTimeline {
  date: string;
  title: string;
  categoria?: EventoCategoria;
  doc?: string;
  photos?: boolean;
  transcript?: boolean;
  sigilo?: string;
  today?: boolean;
  future?: boolean;
  warning?: string;
}

export interface Foto {
  slot: string;
  caption: string;
}

export interface LinhaDoTempo {
  eventos: EventoTimeline[];
  fotos: Foto[];
  transcricao: string;
  transcricaoMeta: string;
}

const PROC = "321321.651651/2103213-01";

const EVENTOS: EventoTimeline[] = [
  { date: "01/01/2020", title: "Abertura de cadastro", categoria: "cadastro" },
  { date: "01/02/2020", title: "Suspensão cadastral", categoria: "cadastro" },
  { date: "01/03/2020", title: "Troca de endereço", categoria: "cadastro" },
  { date: "01/05/2020", title: "Abertura de MPF", categoria: "fiscal", doc: `MPF ${PROC}` },
  { date: "01/06/2020", title: "Emissão de TIF", categoria: "fiscal", doc: `TIF ${PROC}` },
  { date: "01/07/2020", title: "Verificação in loco", categoria: "fiscal", photos: true },
  { date: "01/08/2020", title: "Ciência do TIF", categoria: "fiscal", doc: `TIF ${PROC}` },
  { date: "01/09/2020", title: "Visita do contribuinte", categoria: "contato", transcript: true, sigilo: "restrito" },
  { date: "15/09/2020", title: "Fim do prazo do TIF", categoria: "prazo", doc: `TIF ${PROC}` },
  { date: "01/10/2020", title: "Emissão de Auto de Infração de embaraço", categoria: "autuacao", doc: `AI ${PROC}` },
  { date: "01/11/2020", title: "Ciência do Auto de Infração de embaraço", categoria: "autuacao", doc: `AI ${PROC}` },
  { date: "15/11/2020", title: "Troca de contador", categoria: "cadastro" },
  { date: "01/12/2020", title: "Emissão de Auto de Infração de principal", categoria: "autuacao", doc: `AI ${PROC}` },
  { date: "01/01/2021", title: "Ciência do Auto de Infração de principal", categoria: "autuacao", doc: `AI ${PROC}` },
  { date: "01/01/2021", title: "Troca de regime do Simples Nacional pela RedeSim", categoria: "cadastro" },
  { date: "01/02/2021", title: "Reativação cadastral", categoria: "cadastro" },
  { date: "19/08/2026", title: "Hoje", today: true },
  { date: "01/03/2022", title: "Prazo final do MPF", categoria: "prazo", future: true, warning: "Prazo do MPF anterior à data de algum ato" },
  { date: "01/04/2022", title: "Fim do prazo de Ciência da Notificação do TIF", categoria: "prazo", future: true },
  { date: "01/05/2022", title: "Prazo previsto para Auto de Embaraço", categoria: "prazo", future: true },
  { date: "01/06/2022", title: "Prazo previsto para Auto Principal", categoria: "prazo", future: true },
];

const FOTOS: Foto[] = [
  { slot: "foto 01 — fachada", caption: "Fachada do estabelecimento na Av. das Indústrias, 1.240 — placa de identificação visível." },
  { slot: "foto 02 — pátio", caption: "Pátio de carga com dois caminhões em operação no momento da verificação." },
  { slot: "foto 03 — galpão", caption: "Galpão anexo não constante do cadastro, com estoque de bobinas." },
  { slot: "foto 04 — linha 4", caption: "Equipamento da linha 4 sem lacre de aferição, objeto do TIF." },
];

const TRANSCRICAO =
  "O responsável informou que a mudança de endereço do galpão anexo não foi comunicada por desconhecimento da obrigação acessória, comprometeu-se a regularizar o cadastro em 15 dias e a apresentar as notas de entrada das bobinas estocadas. Alegou dificuldade de acesso ao sistema com o certificado digital vencido.";

export async function getLinhaDoTempo(id: string): Promise<LinhaDoTempo> {
  void id;
  return lerFonteOu("linha-do-tempo", {
    eventos: EVENTOS,
    fotos: FOTOS,
    transcricao: TRANSCRICAO,
    transcricaoMeta: "Atendimento presencial · registrado por Ana Ribeiro em 01/09/2020",
  });
}

/* --------------------------------------------------------------------------
   Situação cadastral
   -------------------------------------------------------------------------- */

export interface CampoHistoricoRow {
  date: string;
  value: string;
  meta: string;
}

export interface CampoCadastral {
  label: string;
  value: string;
  mono: boolean;
  since: string;
  rows?: CampoHistoricoRow[];
}

const CAMPOS: CampoCadastral[] = [
  { label: "CNPJ", value: "12.884.310/0001-45", mono: true, since: "" },
  { label: "Inscrição estadual", value: "07.302.118-4", mono: true, since: "" },
  { label: "Razão social", value: "Metalúrgica Andrade S/A", mono: false, since: "" },
  { label: "Data de abertura", value: "01/01/2020", mono: true, since: "há 6 anos e 7 meses" },
  { label: "Capital social", value: "4.500.000,00", mono: true, since: "" },
  {
    label: "Endereço",
    value: "Av. das Indústrias, 1.240 — Distrito Industrial",
    mono: false,
    since: "há 6 anos e 5 meses",
    rows: [
      { date: "01/03/2020", value: "Av. das Indústrias, 1.240 — Distrito Industrial", meta: "Alteração via RedeSim" },
      { date: "01/01/2020", value: "Rua Bento Carvalho, 88 — Centro", meta: "Endereço de abertura" },
    ],
  },
  {
    label: "Contador",
    value: "Contabilidade Ipê ME — CRC 1SP-045.882",
    mono: false,
    since: "há 5 anos e 9 meses",
    rows: [
      { date: "15/11/2020", value: "Contabilidade Ipê ME — CRC 1SP-045.882", meta: "Troca de contador" },
      { date: "01/01/2020", value: "Escritório Almeida & Cia", meta: "Contador de abertura" },
    ],
  },
  { label: "Administrador", value: "Helena Braga Sotero — CPF 214.***.***-08", mono: false, since: "" },
  {
    label: "Situação cadastral",
    value: "Ativa",
    mono: false,
    since: "há 5 anos e 6 meses",
    rows: [
      { date: "01/02/2021", value: "Ativa — reativação cadastral", meta: "Processo 4410.221/2021" },
      { date: "01/02/2020", value: "Suspensa", meta: "Suspensão por omissão de declarações" },
      { date: "01/01/2020", value: "Ativa", meta: "Abertura" },
    ],
  },
  {
    label: "Regime estadual",
    value: "Débito e crédito — apuração mensal",
    mono: false,
    since: "há 5 anos e 7 meses",
    rows: [
      { date: "01/01/2021", value: "Débito e crédito — apuração mensal", meta: "Exclusão do Simples Nacional" },
      { date: "01/01/2020", value: "Simples Nacional", meta: "Opção na abertura" },
    ],
  },
  {
    label: "Regime federal",
    value: "Lucro presumido",
    mono: false,
    since: "há 5 anos e 7 meses",
    rows: [
      { date: "01/01/2021", value: "Lucro presumido", meta: "Troca de regime pela RedeSim" },
      { date: "01/01/2020", value: "Simples Nacional", meta: "Opção na abertura" },
    ],
  },
];

export async function getSituacaoCadastral(id: string): Promise<CampoCadastral[]> {
  void id;
  return lerFonteOu("situacao-cadastral", CAMPOS);
}

/* --------------------------------------------------------------------------
   Tabelas simples: recolhimentos, declarações e documentos emitidos
   -------------------------------------------------------------------------- */

export interface TabelaSimplesRow {
  code: string;
  desc: string;
  /** Valor principal por coluna de período. */
  cells: string[];
  /** Valor secundário por coluna, quando houver (só em documentos emitidos). */
  sub?: string[];
}

export interface TabelaSimples {
  columns: string[];
  rows: TabelaSimplesRow[];
}

const RECOLHIMENTOS: TabelaSimples = {
  columns: ["Código", "Mês", "Mês -1", "Mês -2", "Média 3 meses", "Média 6 meses", "Média ano"],
  rows: [
    { code: "1010", desc: "ICMS normal", cells: ["123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00"] },
    { code: "1412", desc: "ICMS substituição tributária", cells: ["123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00"] },
    { code: "1920", desc: "ICMS diferencial de alíquota", cells: ["123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00", "123.123,00"] },
  ],
};

const DECLARACOES: TabelaSimples = {
  columns: ["Código", "Mês", "Mês -1", "Mês -2", "Total 3 meses", "Total 6 meses", "Total ano"],
  rows: [
    { code: "PGDASD", desc: "Simples Nacional", cells: ["1", "1", "1", "3", "6", "12"] },
    { code: "EFD", desc: "EFD ICMS/IPI", cells: ["1", "1", "1", "3", "6", "12"] },
    { code: "DSTDA", desc: "Declaração de substituição tributária", cells: ["1", "1", "1", "3", "6", "12"] },
  ],
};

const DOCUMENTOS: TabelaSimples = {
  columns: ["Tipo", "Mês", "Mês -1", "Mês -2", "Média 3 meses", "Média 6 meses", "Média ano"],
  rows: [
    { code: "NFe", desc: "Nota fiscal eletrônica", cells: ["10.000", "10.000", "10.000", "10.000", "10.000", "10.000"], sub: ["1.482.300", "1.510.940", "1.436.120", "1.476.450", "1.462.880", "1.455.210"] },
    { code: "NFCe", desc: "Nota fiscal de consumidor", cells: ["10.000", "10.000", "10.000", "10.000", "10.000", "10.000"], sub: ["318.740", "322.100", "309.560", "316.800", "314.220", "311.980"] },
    { code: "MDFe", desc: "Manifesto de documentos fiscais", cells: ["10.000", "10.000", "10.000", "10.000", "10.000", "10.000"], sub: ["1.402.660", "1.428.310", "1.377.940", "1.402.970", "1.396.480", "1.388.050"] },
    { code: "DIMP", desc: "Informações de meios de pagamento", cells: ["10.000", "10.000", "10.000", "10.000", "10.000", "10.000"], sub: ["274.510", "281.220", "268.930", "274.880", "272.640", "270.310"] },
  ],
};

export async function getRecolhimentos(id: string): Promise<TabelaSimples> {
  void id;
  return lerFonteOu("recolhimentos", RECOLHIMENTOS);
}

export async function getDeclaracoes(id: string): Promise<TabelaSimples> {
  void id;
  return lerFonteOu("declaracoes", DECLARACOES);
}

export async function getDocumentosEmitidos(id: string): Promise<TabelaSimples> {
  void id;
  return lerFonteOu("documentos-emitidos", DOCUMENTOS);
}

/* --------------------------------------------------------------------------
   Valores declarados
   -------------------------------------------------------------------------- */

export type PeriodoValores = "12m" | "ano" | "esp";

export interface Rubrica {
  code: string;
  desc: string;
}

export interface ValoresDeclarados {
  rubricas: Rubrica[];
  /** Períodos disponíveis, do mais recente ao mais antigo. */
  periodos: string[];
  /** Quantidade de colunas de período por intervalo escolhido. */
  colunasPorIntervalo: Record<PeriodoValores, number>;
  /** Valor de cada célula da matriz (constante no protótipo). */
  valorCelula: string;
}

const RUBRICAS: Rubrica[] = [
  { code: "VL_TOT_DEBITOS", desc: "Valor total dos débitos por “Saídas e prestações com débito do imposto”" },
  { code: "VL_AJ_DEBITOS", desc: "Valor total dos ajustes a débito decorrentes do documento fiscal" },
  { code: "VL_TOT_AJ_DEBITOS", desc: "Valor total de “Ajustes a débito”" },
  { code: "VL_ESTORNOS_CRED", desc: "Valor total de ajustes “Estornos de créditos”" },
  { code: "VL_TOT_CREDITOS", desc: "Valor total dos créditos por “Entradas e aquisições com crédito do imposto”" },
  { code: "VL_AJ_CREDITOS", desc: "Valor total dos ajustes a crédito decorrentes do documento fiscal" },
  { code: "VL_TOT_AJ_CREDITOS", desc: "Valor total de “Ajustes a crédito”" },
  { code: "VL_ESTORNOS_DEB", desc: "Valor total de ajustes “Estornos de débitos”" },
  { code: "VL_SLD_CREDOR_ANT", desc: "Valor total de “Saldo credor do período anterior”" },
  { code: "VL_SLD_APURADO", desc: "Valor do saldo devedor apurado" },
  { code: "VL_TOT_DED", desc: "Valor total de “Deduções”" },
  { code: "VL_ICMS_RECOLHER", desc: "Valor total de “ICMS a recolher (11-12)”" },
  { code: "VL_SLD_CREDOR_TRANSPORTAR", desc: "Valor total de “Saldo credor a transportar para o período seguinte”" },
  { code: "DEB_ESP", desc: "Valores recolhidos ou a recolher, extra-apuração" },
];

const PERIODOS = ["ago/26", "jul/26", "jun/26", "mai/26", "abr/26", "mar/26", "fev/26", "jan/26", "dez/25", "nov/25", "out/25", "set/25", "ago/25"];

export async function getValoresDeclarados(id: string): Promise<ValoresDeclarados> {
  void id;
  return lerFonteOu("valores-declarados", {
    rubricas: RUBRICAS,
    periodos: PERIODOS,
    colunasPorIntervalo: { "12m": 13, ano: 8, esp: 12 },
    valorCelula: "10.000,00",
  });
}
