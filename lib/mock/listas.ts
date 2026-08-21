/**
 * Dados mock das Listas (watchlists de observáveis), extraídos de
 * references/design/FtMLista.html e conferidos contra
 * references/domain/data-model-regra.md (§4, ftm_list/ftm_list_item) e
 * references/domain/seed-regra.md (§7-8).
 * Não há persistência real ainda (sem prisma/schema.prisma) — quando existir,
 * getListas/getLista viram async e passam a consultar o banco; a assinatura já
 * é a de uma leitura real, e os componentes de apresentação não mudam.
 */

export type FtmListStatus = "ATIVA" | "EM_TESTE" | "SUSPENSA" | "ARQUIVADA";

export const LIST_STATUS_LABEL: Record<FtmListStatus, { label: string; cls: string }> = {
  ATIVA: { label: "Ativa", cls: "ga-badge-success" },
  EM_TESTE: { label: "Em teste", cls: "ga-badge-warning" },
  SUSPENSA: { label: "Suspensa", cls: "ga-badge-neutral" },
  ARQUIVADA: { label: "Arquivada", cls: "ga-badge-neutral" },
};

export interface FtmObservable {
  id: number;
  /** Schema.propriedade de origem (ftm_property). */
  path: string;
  label: string;
  /** Id de ftm_property_type. */
  typeId: number;
  placeholder: string;
}

export const OBSERVABLES: FtmObservable[] = [
  { id: 4, path: "LegalEntity.taxNumber", label: "CNPJ / CPF", typeId: 7, placeholder: "04123456000178" },
  { id: 5, path: "LegalEntity.stateRegistration", label: "Inscrição Estadual (IE)", typeId: 7, placeholder: "030123456" },
  { id: 7, path: "LegalEntity.address", label: "Endereço completo", typeId: 9, placeholder: "Av. FAB, 1000 - Macapá - AP" },
  { id: 8, path: "LegalEntity.phone", label: "Telefone de contato", typeId: 10, placeholder: "96 99999-0000" },
  { id: 9, path: "LegalEntity.email", label: "E-mail de contato", typeId: 11, placeholder: "contato@empresa.com.br" },
  { id: 14, path: "Person.crc", label: "Registro no CRC", typeId: 7, placeholder: "AP-004512/O" },
  { id: 21, path: "Company.cnaePrincipal", label: "CNAE principal", typeId: 7, placeholder: "4723-7/00" },
  { id: 22, path: "Company.cnaeSecundario", label: "CNAE secundário", typeId: 7, placeholder: "4681-8/01" },
  { id: 30, path: "FiscalDocument.accessKey", label: "Chave de acesso", typeId: 7, placeholder: "1626080412..." },
  { id: 35, path: "FiscalDocument.cfop", label: "CFOP predominante", typeId: 7, placeholder: "5102" },
  { id: 50, path: "EconomicEvent.receiverPixKey", label: "Chave PIX destino", typeId: 7, placeholder: "96981411414" },
];

export interface FtmListItem {
  id: number;
  value: string;
  reasonIn: string;
  reasonOut: string | null;
  validFrom: string;
  validTo: string | null;
}

export interface FtmListConsumer {
  ruleCode: string;
  path: string;
  operator: "IN_LIST" | "NOT_IN_LIST";
}

export interface FtmList {
  id: number;
  code: string;
  name: string;
  desc: string;
  observableId: number;
  status: FtmListStatus;
  items: FtmListItem[];
  consumers: FtmListConsumer[];
}

const LISTS: FtmList[] = [
  {
    id: 101,
    code: "LST_CNPJ_NOTEIRAS",
    name: "CNPJs suspeitos de empresas noteiras",
    desc: "Empresas com indícios de emissão de documentos inidôneos sem circulação real de mercadorias.",
    observableId: 4,
    status: "ATIVA",
    items: [
      { id: 1, value: "04123456000178", reasonIn: "Operação Cadeado Fiscal — Dossiê CEPAF 2026/04", reasonOut: null, validFrom: "01/07/2026", validTo: null },
      { id: 2, value: "05987654000133", reasonIn: "Mandado Fiscal MPF-2026-881", reasonOut: null, validFrom: "01/07/2026", validTo: null },
      { id: 3, value: "03111222000199", reasonIn: "Inquérito Policial Civil 441/2025", reasonOut: "Regularização fiscal comprovada com vistorias", validFrom: "01/01/2026", validTo: "30/06/2026" },
    ],
    consumers: [
      { ruleCode: "PIX_0005", path: "party.taxNumber", operator: "IN_LIST" },
      { ruleCode: "NFE_0009", path: "emitter.taxNumber", operator: "IN_LIST" },
      { ruleCode: "CTE_0010", path: "receiver.taxNumber", operator: "IN_LIST" },
    ],
  },
  {
    id: 102,
    code: "LST_CONTADORES_ALVO_OP_CADEADO",
    name: "Contadores alvo de investigação fiscal",
    desc: "Profissionais contábeis investigados por abertura em massa de empresas fantasmas.",
    observableId: 14,
    status: "ATIVA",
    items: [
      { id: 4, value: "AP-004512/O", reasonIn: "Responsável por 12 empresas inaptas por inexistência de fato", reasonOut: null, validFrom: "01/07/2026", validTo: null },
      { id: 5, value: "PA-009821/O", reasonIn: "Investigação COFIS/NUSEG — Operação Carga Fantasma", reasonOut: null, validFrom: "01/07/2026", validTo: null },
    ],
    consumers: [{ ruleCode: "NFE_0001", path: "emitter.accountant.crc", operator: "IN_LIST" }],
  },
  {
    id: 103,
    code: "LST_SOCIOS_LARANJAS_CONHECIDOS",
    name: "CPFs de sócios laranjas / interpostas pessoas",
    desc: "Pessoas físicas sem capacidade econômico-financeira usadas em quadros societários fraudulentos.",
    observableId: 4,
    status: "ATIVA",
    items: [
      { id: 6, value: "12345678900", reasonIn: "Sócio formal em 18 empresas sem declaração de renda correspondente", reasonOut: null, validFrom: "01/07/2026", validTo: null },
      { id: 7, value: "98765432100", reasonIn: "Beneficiário de programas sociais figurando com capital de R$ 5M", reasonOut: null, validFrom: "01/07/2026", validTo: null },
    ],
    consumers: [
      { ruleCode: "CAD_0002", path: "shareholders.taxNumber", operator: "IN_LIST" },
      { ruleCode: "CAD_0011", path: "directors.taxNumber", operator: "IN_LIST" },
    ],
  },
  {
    id: 104,
    code: "LST_CNAES_BEBIDAS_COMBUSTIVEIS",
    name: "CNAEs com regime especial de ST",
    desc: "Setores econômicos com regimes tributários especiais e acompanhamento intensivo.",
    observableId: 21,
    status: "ATIVA",
    items: [
      { id: 8, value: "4723-7/00", reasonIn: "Comércio varejista de bebidas", reasonOut: null, validFrom: "01/07/2026", validTo: null },
      { id: 9, value: "4681-8/01", reasonIn: "Comércio atacadista de combustíveis e lubrificantes", reasonOut: null, validFrom: "01/07/2026", validTo: null },
    ],
    consumers: [{ ruleCode: "NFE_0008", path: "emitter.cnaePrincipal", operator: "NOT_IN_LIST" }],
  },
  {
    id: 105,
    code: "LST_ENDERECOS_VIRTUAIS_RISCO",
    name: "Endereços de fachada / coworkings suspeitos",
    desc: "Endereços que concentram dezenas de empresas inaptas ou com irregularidades fiscais.",
    observableId: 7,
    status: "ATIVA",
    items: [
      { id: 10, value: "Av. FAB, 1000 - Sala 12, Macapá - AP", reasonIn: "Endereço com 42 empresas registradas sem espaço físico", reasonOut: null, validFrom: "01/07/2026", validTo: null },
    ],
    consumers: [{ ruleCode: "END_0006", path: "address", operator: "IN_LIST" }],
  },
  {
    id: 106,
    code: "LST_CHAVES_PIX_SUSPEITAS",
    name: "Chaves PIX vinculadas a operações atípicas",
    desc: "Chaves PIX utilizadas para recebimentos de vendas sem emissão de NFC-e.",
    observableId: 50,
    status: "EM_TESTE",
    items: [
      { id: 11, value: "96981411414", reasonIn: "Chave PIX vinculada a CNPJ cancelado recebendo créditos diários", reasonOut: null, validFrom: "01/07/2026", validTo: null },
    ],
    consumers: [{ ruleCode: "PIX_0005", path: "receiverPixKey", operator: "IN_LIST" }],
  },
  {
    id: 107,
    code: "LST_IE_BAIXADAS_REATIVACAO",
    name: "IEs baixadas com pedido de reativação",
    desc: "Inscrições baixadas por inexistência de fato com pedido de reativação em análise.",
    observableId: 5,
    status: "SUSPENSA",
    items: [],
    consumers: [],
  },
];

export function getListas(): FtmList[] {
  return LISTS;
}

export function getLista(codigo: string): FtmList | undefined {
  return LISTS.find((l) => l.code === codigo);
}

/** Lista em branco usada pelo formulário de criação (`/app/alertas/nova`) — nunca é persistida em LISTS. */
export function createListaDraft(): FtmList {
  return {
    id: 0,
    code: "",
    name: "",
    desc: "",
    observableId: OBSERVABLES[0].id,
    status: "EM_TESTE",
    items: [],
    consumers: [],
  };
}
