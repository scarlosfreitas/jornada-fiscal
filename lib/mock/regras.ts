/**
 * Dados mock das Regras de alerta, extraídos de references/design/FtMRegras.html
 * e conferidos contra references/domain/data-model-regra.md (§5, AST Zod) e
 * references/domain/seed-regra.md (§10, NFE_0001/CAD_0002/DIMP_0003).
 * Não há persistência real ainda (sem prisma/schema.prisma) — quando existir,
 * getRegras/getRegra viram async e passam a consultar o banco; a assinatura já
 * é a de uma leitura real, e os componentes de apresentação não mudam.
 */

export type FtmRuleStatus = "RASCUNHO" | "EM_TESTE" | "ATIVA" | "INATIVA" | "ERRO" | "ARQUIVADA";

export const RULE_STATUS: Record<FtmRuleStatus, { label: string; cls: string; dot: string }> = {
  RASCUNHO: { label: "Rascunho", cls: "ga-badge-neutral", dot: "#8A91A3" },
  EM_TESTE: { label: "Em teste", cls: "ga-badge-warning", dot: "#B45309" },
  ATIVA: { label: "Ativa", cls: "ga-badge-success", dot: "#12855C" },
  INATIVA: { label: "Inativa", cls: "ga-badge-neutral", dot: "#8A91A3" },
  ERRO: { label: "Erro", cls: "ga-badge-danger", dot: "#C2321F" },
  ARQUIVADA: { label: "Arquivada", cls: "ga-badge-neutral", dot: "#C9CDD8" },
};

export type FtmSchemaTarget = "FiscalDocument" | "Company" | "TaxDeclaration" | "EconomicEvent";

export const SCHEMA_TARGET_LABEL: Record<FtmSchemaTarget, string> = {
  FiscalDocument: "Documento Fiscal Eletrônico",
  Company: "Empresa / Contribuinte",
  TaxDeclaration: "Declaração Fiscal",
  EconomicEvent: "Operação Econômica",
};

/** Ids de ftm_property_type usados pelos caminhos e operadores abaixo. */
export const PROPERTY_TYPE_LABEL: Record<number, string> = {
  1: "Texto",
  2: "Numérico Decimal",
  3: "Inteiro",
  4: "Booleano",
  5: "Data",
  6: "Data e Hora",
  7: "Identificador / Observável",
  8: "Referência a Entidade",
  9: "Endereço",
  10: "Telefone",
  11: "E-mail",
};

export type FtmOperatorCode =
  | "EQUAL"
  | "NOT_EQUAL"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "IN"
  | "NOT_IN"
  | "IN_LIST"
  | "NOT_IN_LIST"
  | "CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "EXISTS"
  | "NOT_EXISTS"
  | "BETWEEN";

export interface FtmOperatorMeta {
  label: string;
  /** Ids de ftm_property_type compatíveis com este operador. */
  types: number[];
  /** Se o operador exige valor constante. */
  requiresValue: boolean;
  /** Se o operador exige seleção de watchlist. */
  requiresList: boolean;
}

export const OPERATORS: Record<FtmOperatorCode, FtmOperatorMeta> = {
  EQUAL: { label: "= igual a", types: [1, 2, 3, 4, 5, 6, 7, 11, 12], requiresValue: true, requiresList: false },
  NOT_EQUAL: { label: "!= diferente de", types: [1, 2, 3, 4, 5, 6, 7, 11, 12], requiresValue: true, requiresList: false },
  GREATER_THAN: { label: "> maior que", types: [2, 3, 5, 6], requiresValue: true, requiresList: false },
  GREATER_THAN_OR_EQUAL: { label: ">= maior ou igual", types: [2, 3, 5, 6], requiresValue: true, requiresList: false },
  LESS_THAN: { label: "< menor que", types: [2, 3, 5, 6], requiresValue: true, requiresList: false },
  LESS_THAN_OR_EQUAL: { label: "<= menor ou igual", types: [2, 3, 5, 6], requiresValue: true, requiresList: false },
  IN: { label: "em conjunto literal", types: [1, 2, 3, 7, 12], requiresValue: true, requiresList: false },
  NOT_IN: { label: "não em conjunto", types: [1, 2, 3, 7, 12], requiresValue: true, requiresList: false },
  IN_LIST: { label: "na watchlist", types: [1, 7, 9, 10, 11], requiresValue: false, requiresList: true },
  NOT_IN_LIST: { label: "não na watchlist", types: [1, 7, 9, 10, 11], requiresValue: false, requiresList: true },
  CONTAINS: { label: "contém texto", types: [1, 9, 11], requiresValue: true, requiresList: false },
  STARTS_WITH: { label: "começa com", types: [1, 9, 11], requiresValue: true, requiresList: false },
  ENDS_WITH: { label: "termina com", types: [1, 9, 11], requiresValue: true, requiresList: false },
  EXISTS: { label: "preenchido", types: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], requiresValue: false, requiresList: false },
  NOT_EXISTS: { label: "vazio / ausente", types: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], requiresValue: false, requiresList: false },
  BETWEEN: { label: "entre (faixa)", types: [2, 3, 5, 6], requiresValue: true, requiresList: false },
};

export interface FtmPropertyPath {
  path: string;
  label: string;
  /** Id de ftm_property_type. */
  typeId: number;
}

export const PATHS_BY_SCHEMA: Record<FtmSchemaTarget, FtmPropertyPath[]> = {
  FiscalDocument: [
    { path: "documentType", label: "Modelo do documento", typeId: 1 },
    { path: "accessKey", label: "Chave de acesso", typeId: 7 },
    { path: "date", label: "Data de emissão", typeId: 6 },
    { path: "amount", label: "Valor total da nota", typeId: 2 },
    { path: "taxAmount", label: "Valor do ICMS", typeId: 2 },
    { path: "cfop", label: "CFOP predominante", typeId: 7 },
    { path: "emitter.taxNumber", label: "Emitente · CNPJ", typeId: 7 },
    { path: "emitter.status", label: "Emitente · situação cadastral", typeId: 1 },
    { path: "emitter.cnaePrincipal", label: "Emitente · CNAE principal", typeId: 7 },
    { path: "emitter.tempoAberturaDias", label: "Emitente · dias de abertura", typeId: 3 },
    { path: "emitter.accountant.crc", label: "Emitente · contador · CRC", typeId: 7 },
    { path: "emitter.accountant.taxNumber", label: "Emitente · contador · CPF", typeId: 7 },
    { path: "emitter.shareholders.taxNumber", label: "Emitente · sócios · CPF/CNPJ", typeId: 7 },
    { path: "receiver.taxNumber", label: "Destinatário · CNPJ", typeId: 7 },
    { path: "receiver.tempoAberturaDias", label: "Destinatário · dias de abertura", typeId: 3 },
    { path: "receiver.status", label: "Destinatário · situação cadastral", typeId: 1 },
    { path: "receiver.address", label: "Destinatário · endereço", typeId: 9 },
    { path: "transporter.taxNumber", label: "Transportador · CNPJ", typeId: 7 },
  ],
  Company: [
    { path: "taxNumber", label: "CNPJ", typeId: 7 },
    { path: "status", label: "Situação cadastral", typeId: 1 },
    { path: "capital", label: "Capital social", typeId: 2 },
    { path: "tempoAberturaDias", label: "Dias desde a abertura", typeId: 3 },
    { path: "regimeFederal", label: "Regime federal", typeId: 1 },
    { path: "regimeEstadual", label: "Regime estadual", typeId: 1 },
    { path: "cnaePrincipal", label: "CNAE principal", typeId: 7 },
    { path: "faturamento12m", label: "Faturamento 12M", typeId: 2 },
    { path: "compras12m", label: "Compras 12M", typeId: 2 },
    { path: "dimp3m", label: "Movimentação DIMP 3M", typeId: 2 },
    { path: "address", label: "Endereço completo", typeId: 9 },
    { path: "riskScore", label: "Pontuação de risco", typeId: 2 },
    { path: "accountant.crc", label: "Contador · CRC", typeId: 7 },
    { path: "accountant.taxNumber", label: "Contador · CPF", typeId: 7 },
    { path: "shareholders.taxNumber", label: "Sócios (QSA) · CPF/CNPJ", typeId: 7 },
    { path: "directors.taxNumber", label: "Administradores · CPF", typeId: 7 },
  ],
  TaxDeclaration: [
    { path: "declarationType", label: "Tipo de declaração", typeId: 1 },
    { path: "period", label: "Período de apuração", typeId: 1 },
    { path: "deliveredAt", label: "Data da entrega", typeId: 6 },
    { path: "debitoDeclarado", label: "Total de débitos", typeId: 2 },
    { path: "creditoDeclarado", label: "Total de créditos", typeId: 2 },
    { path: "icmsRecolher", label: "ICMS a recolher", typeId: 2 },
    { path: "declarant.taxNumber", label: "Declarante · CNPJ", typeId: 7 },
    { path: "declarant.regimeFederal", label: "Declarante · regime federal", typeId: 1 },
  ],
  EconomicEvent: [
    { path: "eventType", label: "Tipo de operação", typeId: 1 },
    { path: "eventDate", label: "Data da operação", typeId: 6 },
    { path: "amount", label: "Valor da operação", typeId: 2 },
    { path: "receiverPixKey", label: "Chave PIX destino", typeId: 7 },
    { path: "party.taxNumber", label: "Titular · CNPJ", typeId: 7 },
    { path: "party.regimeFederal", label: "Titular · regime federal", typeId: 1 },
  ],
};

/** Watchlists referenciáveis pelas condições IN_LIST/NOT_IN_LIST — ver lib/mock/listas.ts. */
export const RULE_LISTS = [
  { id: 101, code: "LST_CNPJ_NOTEIRAS" },
  { id: 102, code: "LST_CONTADORES_ALVO_OP_CADEADO" },
  { id: 103, code: "LST_SOCIOS_LARANJAS_CONHECIDOS" },
  { id: 104, code: "LST_CNAES_BEBIDAS_COMBUSTIVEIS" },
  { id: 105, code: "LST_ENDERECOS_VIRTUAIS_RISCO" },
  { id: 106, code: "LST_CHAVES_PIX_SUSPEITAS" },
];

export type FtmActionType = "INDICACAO_TELA" | "ALERTA_TELEGRAM" | "GERAR_OS" | "FLAG_MALHA" | "EMAIL" | "PRODOC";

export const ACTION_TYPE_LABEL: Record<FtmActionType, { label: string; cls: string }> = {
  INDICACAO_TELA: { label: "Indicação em tela", cls: "" },
  ALERTA_TELEGRAM: { label: "Telegram", cls: "ga-chip-info" },
  GERAR_OS: { label: "Gerar OS", cls: "ga-chip-primary" },
  FLAG_MALHA: { label: "Flag de malha", cls: "ga-chip-warning" },
  EMAIL: { label: "E-mail", cls: "" },
  PRODOC: { label: "Prodoc", cls: "ga-chip-primary" },
};

export type FtmSeverity = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export interface FtmActionTrigger {
  id: string;
  type: FtmActionType;
  severity: FtmSeverity;
  /** JSON literal dos parâmetros da ação (ftm_action.params). */
  params: string;
}

/** Condição atômica ou grupo lógico da árvore AST (all/any/not). */
export type FtmConditionNode =
  | {
      id: string;
      kind: "cond";
      path: string;
      operator: FtmOperatorCode;
      value: string;
      listId: number;
    }
  | {
      id: string;
      kind: "all" | "any" | "not";
      children: FtmConditionNode[];
    };

export interface FtmRuleVersion {
  version: number;
  range: string;
  author: string;
  vigente: boolean;
}

export interface FtmRule {
  id: string;
  code: string;
  name: string;
  desc: string;
  schema: FtmSchemaTarget;
  version: number;
  priority: number;
  status: FtmRuleStatus;
  conditionCount: number;
  actionsSummary: FtmActionType[];
  alertCount: number;
  vigenciaInicio: string;
  vigenciaFim: string;
  osGeradas: number;
  tree: FtmConditionNode;
  actions: FtmActionTrigger[];
  versions: FtmRuleVersion[];
}

const RULES: FtmRule[] = [
  {
    id: "NFE_0001",
    code: "NFE_0001",
    name: "NFe de alto valor com contador alvo de investigação",
    desc: "Notas expressivas emitidas por empresa vinculada a contador investigado, destinadas a estabelecimento recém-aberto.",
    schema: "FiscalDocument",
    version: 3,
    priority: 900,
    status: "ATIVA",
    conditionCount: 3,
    actionsSummary: ["GERAR_OS", "ALERTA_TELEGRAM"],
    alertCount: 128,
    vigenciaInicio: "01/07/26",
    vigenciaFim: "—",
    osGeradas: 11,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "amount", operator: "GREATER_THAN", value: "50000.00", listId: 102 },
        { id: "c2", kind: "cond", path: "emitter.accountant.crc", operator: "IN_LIST", value: "", listId: 102 },
        { id: "c3", kind: "cond", path: "receiver.tempoAberturaDias", operator: "LESS_THAN", value: "60", listId: 102 },
      ],
    },
    actions: [
      { id: "a1", type: "GERAR_OS", severity: "ALTA", params: '{"tipo_intervencao":"VISTORIA_TRANSITO"}' },
      { id: "a2", type: "ALERTA_TELEGRAM", severity: "ALTA", params: '{"canal":"PLANTAO_FISCAL"}' },
    ],
    versions: [
      { version: 3, range: "01/07/26 → vigente", author: "Ana Ribeiro", vigente: true },
      { version: 2, range: "12/04/26 → 30/06/26", author: "Ana Ribeiro", vigente: false },
      { version: 1, range: "02/02/26 → 11/04/26", author: "Administrador", vigente: false },
    ],
  },
  {
    id: "CAD_0002",
    code: "CAD_0002",
    name: "Alteração societária com ingresso de sócio laranja",
    desc: "Alteração cadastral no SATE/RedeSIM que inclui sócio da lista de interpostas pessoas.",
    schema: "Company",
    version: 2,
    priority: 850,
    status: "ATIVA",
    conditionCount: 2,
    actionsSummary: ["FLAG_MALHA", "ALERTA_TELEGRAM"],
    alertCount: 41,
    vigenciaInicio: "15/06/26",
    vigenciaFim: "—",
    osGeradas: 4,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "shareholders.taxNumber", operator: "IN_LIST", value: "", listId: 103 },
        { id: "c2", kind: "cond", path: "capital", operator: "GREATER_THAN", value: "100000.00", listId: 101 },
      ],
    },
    actions: [
      { id: "a1", type: "FLAG_MALHA", severity: "CRITICA", params: '{"score_risco":95}' },
      { id: "a2", type: "ALERTA_TELEGRAM", severity: "ALTA", params: '{"canal":"COFIS_CADASTRO"}' },
    ],
    versions: [],
  },
  {
    id: "DIMP_0003",
    code: "DIMP_0003",
    name: "Faturamento DIMP incompatível com Simples Nacional",
    desc: "Movimentação de cartão/PIX em 3 meses excede o teto proporcional do regime.",
    schema: "Company",
    version: 1,
    priority: 700,
    status: "ATIVA",
    conditionCount: 2,
    actionsSummary: ["FLAG_MALHA"],
    alertCount: 67,
    vigenciaInicio: "12/04/26",
    vigenciaFim: "31/12/26",
    osGeradas: 7,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "regimeFederal", operator: "EQUAL", value: "SIMPLES_NACIONAL", listId: 101 },
        { id: "c2", kind: "cond", path: "dimp3m", operator: "GREATER_THAN", value: "1200000.00", listId: 101 },
      ],
    },
    actions: [{ id: "a1", type: "FLAG_MALHA", severity: "ALTA", params: '{"score_risco":75}' }],
    versions: [],
  },
  {
    id: "EFD_0004",
    code: "EFD_0004",
    name: "Omissão de EFD por dois períodos consecutivos",
    desc: "Contribuinte obrigado sem transmissão da escrituração em dois períodos seguidos.",
    schema: "TaxDeclaration",
    version: 1,
    priority: 600,
    status: "EM_TESTE",
    conditionCount: 3,
    actionsSummary: ["INDICACAO_TELA", "EMAIL"],
    alertCount: 0,
    vigenciaInicio: "02/08/26",
    vigenciaFim: "—",
    osGeradas: 0,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "declarationType", operator: "EQUAL", value: "EFD_ICMS_IPI", listId: 101 },
        { id: "c2", kind: "cond", path: "deliveredAt", operator: "NOT_EXISTS", value: "", listId: 101 },
        { id: "c3", kind: "cond", path: "declarant.regimeFederal", operator: "NOT_EQUAL", value: "SIMPLES_NACIONAL", listId: 101 },
      ],
    },
    actions: [
      { id: "a1", type: "INDICACAO_TELA", severity: "MEDIA", params: "{}" },
      { id: "a2", type: "EMAIL", severity: "MEDIA", params: '{"setor":"COFIS_DECLARACOES"}' },
    ],
    versions: [],
  },
  {
    id: "PIX_0005",
    code: "PIX_0005",
    name: "Recebimento PIX sem emissão de NFC-e",
    desc: "Chave PIX suspeita recebendo créditos diários sem documento fiscal correspondente.",
    schema: "EconomicEvent",
    version: 1,
    priority: 780,
    status: "EM_TESTE",
    conditionCount: 4,
    actionsSummary: ["FLAG_MALHA", "GERAR_OS"],
    alertCount: 0,
    vigenciaInicio: "10/08/26",
    vigenciaFim: "—",
    osGeradas: 0,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "eventType", operator: "EQUAL", value: "DIMP_PIX", listId: 101 },
        { id: "c2", kind: "cond", path: "amount", operator: "GREATER_THAN", value: "20000.00", listId: 101 },
        {
          id: "g2",
          kind: "any",
          children: [
            { id: "c3", kind: "cond", path: "receiverPixKey", operator: "IN_LIST", value: "", listId: 106 },
            { id: "c4", kind: "cond", path: "party.taxNumber", operator: "IN_LIST", value: "", listId: 101 },
          ],
        },
      ],
    },
    actions: [
      { id: "a1", type: "FLAG_MALHA", severity: "ALTA", params: '{"score_risco":80}' },
      { id: "a2", type: "GERAR_OS", severity: "ALTA", params: '{"tipo_intervencao":"VISTORIA_ESTABELECIMENTO"}' },
    ],
    versions: [],
  },
  {
    id: "END_0006",
    code: "END_0006",
    name: "Endereço de fachada com concentração de inaptas",
    desc: "Empresa registrada em endereço da lista de coworkings e endereços virtuais de risco.",
    schema: "Company",
    version: 1,
    priority: 500,
    status: "RASCUNHO",
    conditionCount: 2,
    actionsSummary: ["INDICACAO_TELA"],
    alertCount: 0,
    vigenciaInicio: "—",
    vigenciaFim: "—",
    osGeradas: 0,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "address", operator: "IN_LIST", value: "", listId: 105 },
        { id: "c2", kind: "cond", path: "status", operator: "NOT_EQUAL", value: "BAIXADO", listId: 101 },
      ],
    },
    actions: [{ id: "a1", type: "INDICACAO_TELA", severity: "BAIXA", params: "{}" }],
    versions: [],
  },
  {
    id: "CTE_0007",
    code: "CTE_0007",
    name: "CT-e sem NF-e vinculada em 48 horas",
    desc: "Prestação de transporte sem documento de mercadoria correspondente na janela.",
    schema: "FiscalDocument",
    version: 4,
    priority: 820,
    status: "INATIVA",
    conditionCount: 3,
    actionsSummary: ["ALERTA_TELEGRAM"],
    alertCount: 0,
    vigenciaInicio: "05/12/25",
    vigenciaFim: "31/03/26",
    osGeradas: 1,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "documentType", operator: "EQUAL", value: "CTE", listId: 101 },
        { id: "c2", kind: "cond", path: "amount", operator: "GREATER_THAN", value: "10000.00", listId: 101 },
        { id: "c3", kind: "cond", path: "emitter.status", operator: "NOT_EQUAL", value: "HABILITADO", listId: 101 },
      ],
    },
    actions: [{ id: "a1", type: "ALERTA_TELEGRAM", severity: "MEDIA", params: '{"canal":"PLANTAO_FISCAL"}' }],
    versions: [],
  },
  {
    id: "NFE_0008",
    code: "NFE_0008",
    name: "NFe com CFOP incompatível com o CNAE do emitente",
    desc: "Regra substituída pela NFE_0011 — mantida apenas para auditoria histórica.",
    schema: "FiscalDocument",
    version: 2,
    priority: 400,
    status: "ARQUIVADA",
    conditionCount: 3,
    actionsSummary: ["PRODOC"],
    alertCount: 0,
    vigenciaInicio: "20/01/26",
    vigenciaFim: "30/06/26",
    osGeradas: 2,
    tree: {
      id: "g1",
      kind: "all",
      children: [
        { id: "c1", kind: "cond", path: "cfop", operator: "IN", value: "5102,6102", listId: 101 },
        { id: "c2", kind: "cond", path: "emitter.cnaePrincipal", operator: "NOT_IN_LIST", value: "", listId: 104 },
        { id: "c3", kind: "cond", path: "amount", operator: "GREATER_THAN", value: "1000.00", listId: 101 },
      ],
    },
    actions: [{ id: "a1", type: "PRODOC", severity: "MEDIA", params: '{"assunto":"CFOP_INCOMPATIVEL"}' }],
    versions: [],
  },
];

export function getRegras(): FtmRule[] {
  return RULES;
}

export function getRegra(codigo: string): FtmRule | undefined {
  return RULES.find((r) => r.code === codigo);
}

/** Regra em branco usada pelo formulário de criação (`/app/regras/nova`) — nunca é persistida em RULES. */
export function createRegraDraft(): FtmRule {
  return {
    id: "",
    code: "",
    name: "",
    desc: "",
    schema: "FiscalDocument",
    version: 1,
    priority: 100,
    status: "RASCUNHO",
    conditionCount: 0,
    actionsSummary: [],
    alertCount: 0,
    vigenciaInicio: "—",
    vigenciaFim: "—",
    osGeradas: 0,
    tree: { id: "g1", kind: "all", children: [] },
    actions: [],
    versions: [],
  };
}
