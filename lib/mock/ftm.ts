/**
 * Catálogo da ontologia FollowTheMoney (FtM): schemas (`ftm_schema`), propriedades
 * (`ftm_property`) e tipos de ação (`ftm_action`) usados pelo motor de regras de alerta.
 *
 * Seed extraído de references/design/FtMEntidades.html, FtMPropriedade.html e
 * FtMTiposAcao.html (os três protótipos compartilham o mesmo catálogo) e conferido
 * contra references/domain/data-model-regra.md (§4, dicionário de tabelas) e
 * references/domain/seed-regra.md (§2 a §9). Onde protótipo e domínio divergiram,
 * o domínio prevaleceu — ver notas nas seções abaixo.
 *
 * Não há tabelas `ftm_*` em prisma/schema.prisma ainda — nada aqui é persistido.
 * Os leitores (`getSchemas`, `getProperties`, `getActions`) já têm assinatura de
 * leitura real; quando o banco existir, viram `async` sem mudar os componentes.
 */

export type FtmStatus = "EM_TESTE" | "ATIVA" | "SUSPENSA" | "ARQUIVADA";

export const FTM_STATUS_LABEL: Record<FtmStatus, { label: string; cls: string }> = {
  EM_TESTE: { label: "Em teste", cls: "ga-badge-warning" },
  ATIVA: { label: "Ativa", cls: "ga-badge-success" },
  SUSPENSA: { label: "Suspensa", cls: "ga-badge-danger" },
  ARQUIVADA: { label: "Arquivada", cls: "ga-badge-neutral" },
};

/** Ids de `ftm_property_type`, conferidos contra data-model-regra.md / seed-regra.md §2. */
export const PROPERTY_TYPES: Record<number, { name: string; label: string }> = {
  1: { name: "string", label: "Texto" },
  2: { name: "number", label: "Numérico decimal" },
  3: { name: "integer", label: "Inteiro" },
  4: { name: "boolean", label: "Booleano" },
  5: { name: "date", label: "Data" },
  6: { name: "timestamp", label: "Data e hora" },
  7: { name: "identifier", label: "Identificador / observável" },
  8: { name: "entity", label: "Referência a entidade" },
  9: { name: "address", label: "Endereço" },
  10: { name: "phone", label: "Telefone" },
  11: { name: "email", label: "E-mail" },
  12: { name: "currency", label: "Moeda" },
};

export type FtmSeverity = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export const SEVERITY_LABEL: Record<FtmSeverity, { label: string; cls: string }> = {
  BAIXA: { label: "Baixa", cls: "ga-level-gray" },
  MEDIA: { label: "Média", cls: "ga-level-gray" },
  ALTA: { label: "Alta", cls: "ga-level-yellow" },
  CRITICA: { label: "Crítica", cls: "ga-level-red" },
};

/** Situação das regras que usam um schema como alvo — mesmo domínio de RULE_STATUS em lib/mock/regras.ts. */
export const RULE_BADGE: Record<string, { label: string; cls: string }> = {
  ATIVA: { label: "Ativa", cls: "ga-badge-success" },
  EM_TESTE: { label: "Em teste", cls: "ga-badge-warning" },
  RASCUNHO: { label: "Rascunho", cls: "ga-badge-neutral" },
  INATIVA: { label: "Inativa", cls: "ga-badge-neutral" },
  ARQUIVADA: { label: "Arquivada", cls: "ga-badge-neutral" },
};

export interface FtmSchema {
  id: number;
  /** Nome técnico (`ftm_schema.schema_name`). */
  name: string;
  parent: number | null;
  /** Rótulo na interface (`ftm_schema.schema_label`). */
  label: string;
  /** `ftm_schema.is_edge` — aresta com vigência (true) ou entidade (false). */
  edge: boolean;
  desc: string;
}

/**
 * `ftm_schema` — 14 schemas, conferidos nome a nome contra seed-regra.md §5.
 * `rules` é apenas a contagem estática do protótipo (schemas sem regra alvo cadastrada
 * no protótipo); a contagem real exibida nas telas usa `TARGET_RULES` abaixo.
 */
export const SCHEMAS: FtmSchema[] = [
  { id: 1, name: "Thing", parent: null, label: "Objeto base", edge: false, desc: "Entidade raiz de todos os objetos do sistema" },
  { id: 2, name: "LegalEntity", parent: 1, label: "Pessoa jurídica / física", edge: false, desc: "Entidade com personalidade e identificação fiscal" },
  { id: 3, name: "Person", parent: 2, label: "Pessoa física", edge: false, desc: "Pessoa natural identificada por CPF" },
  { id: 4, name: "Company", parent: 2, label: "Empresa / contribuinte", edge: false, desc: "Pessoa jurídica inscrita no CNPJ e no cadastro estadual" },
  { id: 5, name: "PublicBody", parent: 2, label: "Órgão público", edge: false, desc: "Entidades governamentais e administração direta" },
  { id: 6, name: "FiscalDocument", parent: 1, label: "Documento fiscal eletrônico", edge: false, desc: "NF-e, NFC-e, CT-e, MDF-e, NFCom, NF3e" },
  { id: 7, name: "TaxDeclaration", parent: 1, label: "Declaração fiscal", edge: false, desc: "Escriturações e declarações (PGDASD, EFD, DSTDA)" },
  { id: 8, name: "CadastralEvent", parent: 1, label: "Evento cadastral", edge: false, desc: "Eventos da REDESIM e alterações cadastrais do SATE" },
  { id: 9, name: "EconomicEvent", parent: 1, label: "Operação econômica", edge: false, desc: "Recolhimentos, DIMP, extratos e transações financeiras" },
  { id: 10, name: "AccountingService", parent: 1, label: "Serviço contábil", edge: true, desc: "Vínculo entre contribuinte e contador com vigência" },
  { id: 11, name: "Ownership", parent: 1, label: "Participação societária", edge: true, desc: "Vínculo societário entre empresa e sócio com cotas e vigência" },
  { id: 12, name: "Directorship", parent: 1, label: "Administração", edge: true, desc: "Cargo de administrador exercido por pessoa física" },
  { id: 13, name: "Representation", parent: 1, label: "Representação legal", edge: true, desc: "Vínculo de procurador ou representante outorgado" },
  { id: 14, name: "TaxResponsibility", parent: 1, label: "Responsabilidade tributária", edge: true, desc: "Vínculo de corresponsabilidade fiscal apurada" },
];

export interface FtmProperty {
  id: number;
  /** Id de FtmSchema — schema proprietário. */
  schemaId: number;
  /** Nome técnico em camelCase (`ftm_property.property_name`). */
  name: string;
  label: string;
  /** Id de PROPERTY_TYPES. */
  typeId: number;
  /** Id de FtmSchema de destino, quando typeId === 8 (entity). */
  targetSchemaId: number | null;
  multi: boolean;
  observable: boolean;
  status: FtmStatus;
  desc: string;
}

/**
 * `ftm_property` — 70 entradas. Propriedades 1–65 conferidas contra seed-regra.md §6:
 * nome, schema, tipo, destino, multi e observável batem; a SITUAÇÃO das propriedades
 * `riskScore` (id 11) e `receiverPixKey` (id 50) diverge — o protótipo mostra
 * EM_TESTE, mas o domínio lista ambas como ATIVA — o domínio prevaleceu.
 * Propriedades 66–70 (`agent`, `principal`, `eventCode`, `eventDate`, `website`) não
 * estão em seed-regra.md §6 (a tabela do domínio para até o id 65); mantidas como no
 * protótipo por não haver divergência a resolver, apenas ausência de cobertura.
 */
export const PROPERTIES: FtmProperty[] = [
  { id: 1, schemaId: 1, name: "name", label: "Nome principal", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Nome principal ou razão social do objeto" },
  { id: 2, schemaId: 1, name: "description", label: "Descrição", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Descrição complementar do objeto" },
  { id: 3, schemaId: 1, name: "country", label: "País", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Código de país ISO (padrão BRA)" },
  { id: 4, schemaId: 2, name: "taxNumber", label: "CNPJ / CPF", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Identificador fiscal principal do contribuinte ou pessoa física" },
  { id: 5, schemaId: 2, name: "stateRegistration", label: "Inscrição Estadual (IE)", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Inscrição estadual junto à SEFAZ" },
  { id: 6, schemaId: 2, name: "status", label: "Situação cadastral", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "HABILITADO, SUSPENSO, CANCELADO, BAIXADO, INAPTO" },
  { id: 7, schemaId: 2, name: "address", label: "Endereço completo", typeId: 9, targetSchemaId: null, multi: true, observable: true, status: "ATIVA", desc: "Logradouro, número, bairro e município" },
  { id: 8, schemaId: 2, name: "phone", label: "Telefone de contato", typeId: 10, targetSchemaId: null, multi: true, observable: true, status: "ATIVA", desc: "Telefone de contato cadastrado" },
  { id: 9, schemaId: 2, name: "email", label: "E-mail de contato", typeId: 11, targetSchemaId: null, multi: true, observable: true, status: "ATIVA", desc: "Endereço de correio eletrônico" },
  { id: 10, schemaId: 2, name: "jurisdiction", label: "UF / jurisdição", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "UF da circunscrição fiscal" },
  { id: 11, schemaId: 2, name: "riskScore", label: "Pontuação de risco", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Score de risco fiscal apurado (0 a 100)" },
  { id: 12, schemaId: 3, name: "birthDate", label: "Data de nascimento", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Data de nascimento da pessoa física" },
  { id: 13, schemaId: 3, name: "motherName", label: "Nome da mãe", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Nome da mãe para conferência cadastral" },
  { id: 14, schemaId: 3, name: "crc", label: "Registro no CRC", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Registro no Conselho Regional de Contabilidade" },
  { id: 15, schemaId: 3, name: "occupation", label: "Ocupação principal", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Ocupação ou profissão declarada" },
  { id: 16, schemaId: 4, name: "incorporationDate", label: "Data de abertura", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Data de constituição na Junta Comercial" },
  { id: 17, schemaId: 4, name: "tempoAberturaDias", label: "Dias desde a abertura", typeId: 3, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Dias decorridos desde a constituição" },
  { id: 18, schemaId: 4, name: "capital", label: "Capital social", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Capital social integralizado" },
  { id: 19, schemaId: 4, name: "regimeEstadual", label: "Regime estadual", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "NORMAL, SUBSTITUTO, ISENTO" },
  { id: 20, schemaId: 4, name: "regimeFederal", label: "Regime federal", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "SIMPLES_NACIONAL, LUCRO_PRESUMIDO, REAL" },
  { id: 21, schemaId: 4, name: "cnaePrincipal", label: "CNAE principal", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Código de atividade econômica principal" },
  { id: 22, schemaId: 4, name: "cnaeSecundario", label: "CNAE secundário", typeId: 7, targetSchemaId: null, multi: true, observable: true, status: "ATIVA", desc: "Atividades econômicas secundárias" },
  { id: 23, schemaId: 4, name: "faturamento12m", label: "Faturamento acumulado 12M", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Saídas acumuladas nos últimos 12 meses" },
  { id: 24, schemaId: 4, name: "compras12m", label: "Compras acumuladas 12M", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Entradas acumuladas nos últimos 12 meses" },
  { id: 25, schemaId: 4, name: "dimp3m", label: "Movimentação DIMP 3M", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Cartão/PIX declarado na DIMP nos últimos 3 meses" },
  { id: 26, schemaId: 4, name: "accountant", label: "Contador responsável", typeId: 8, targetSchemaId: 3, multi: false, observable: false, status: "ATIVA", desc: "Contador vinculado como responsável técnico" },
  { id: 27, schemaId: 4, name: "shareholders", label: "Quadro de sócios (QSA)", typeId: 8, targetSchemaId: 2, multi: true, observable: false, status: "ATIVA", desc: "Sócios e acionistas com participação" },
  { id: 28, schemaId: 4, name: "directors", label: "Administradores", typeId: 8, targetSchemaId: 3, multi: true, observable: false, status: "ATIVA", desc: "Administradores e diretores estatutários" },
  { id: 29, schemaId: 6, name: "documentType", label: "Modelo do documento", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "NFE, NFCE, CTE, MDFE, NFCOM, NF3E" },
  { id: 30, schemaId: 6, name: "accessKey", label: "Chave de acesso", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Chave de 44 dígitos do documento" },
  { id: 31, schemaId: 6, name: "date", label: "Data e hora de emissão", typeId: 6, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Timestamp de autorização do documento" },
  { id: 32, schemaId: 6, name: "amount", label: "Valor total da nota", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Valor total bruto do documento fiscal" },
  { id: 33, schemaId: 6, name: "taxAmount", label: "Valor do ICMS", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "ICMS próprio destacado" },
  { id: 34, schemaId: 6, name: "taxAmountST", label: "Valor do ICMS-ST", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "ICMS retido por substituição tributária" },
  { id: 35, schemaId: 6, name: "cfop", label: "CFOP predominante", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Código Fiscal de Operações e Prestações" },
  { id: 36, schemaId: 6, name: "naturezaOperacao", label: "Natureza da operação", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Descrição da natureza da operação fiscal" },
  { id: 37, schemaId: 6, name: "emitter", label: "Emitente", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa emitente do documento fiscal" },
  { id: 38, schemaId: 6, name: "receiver", label: "Destinatário", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa destinatária do documento fiscal" },
  { id: 39, schemaId: 6, name: "transporter", label: "Transportador", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa responsável pelo transporte da carga" },
  { id: 40, schemaId: 7, name: "declarationType", label: "Tipo de declaração", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "PGDASD, EFD_ICMS_IPI, DSTDA" },
  { id: 41, schemaId: 7, name: "period", label: "Período de apuração", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Mês/ano de apuração (AAAA-MM)" },
  { id: 42, schemaId: 7, name: "deliveredAt", label: "Data da entrega", typeId: 6, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Data e hora da transmissão" },
  { id: 43, schemaId: 7, name: "debitoDeclarado", label: "Total de débitos", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Débitos de ICMS declarados no período" },
  { id: 44, schemaId: 7, name: "creditoDeclarado", label: "Total de créditos", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Créditos de ICMS aproveitados" },
  { id: 45, schemaId: 7, name: "icmsRecolher", label: "ICMS a recolher", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Saldo devedor apurado" },
  { id: 46, schemaId: 7, name: "declarant", label: "Contribuinte declarante", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa que transmitiu a declaração" },
  { id: 47, schemaId: 9, name: "eventType", label: "Tipo de operação", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "RECOLHIMENTO_DARE, DIMP_PIX, DIMP_CARTAO" },
  { id: 48, schemaId: 9, name: "eventDate", label: "Data da operação", typeId: 6, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Data da transação financeira" },
  { id: 49, schemaId: 9, name: "amount", label: "Valor da operação", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Valor transacionado" },
  { id: 50, schemaId: 9, name: "receiverPixKey", label: "Chave PIX destino", typeId: 7, targetSchemaId: null, multi: false, observable: true, status: "ATIVA", desc: "Chave PIX receptora da transferência" },
  { id: 51, schemaId: 9, name: "party", label: "Contribuinte titular", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Contribuinte vinculado à movimentação" },
  { id: 52, schemaId: 10, name: "client", label: "Empresa cliente", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa que contratou o serviço contábil" },
  { id: 53, schemaId: 10, name: "accountant", label: "Profissional contábil", typeId: 8, targetSchemaId: 3, multi: false, observable: false, status: "ATIVA", desc: "Contador responsável técnico" },
  { id: 54, schemaId: 10, name: "startDate", label: "Início da responsabilidade", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Início do vínculo contábil" },
  { id: 55, schemaId: 10, name: "endDate", label: "Fim da responsabilidade", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Término / rescisão do vínculo" },
  { id: 56, schemaId: 11, name: "asset", label: "Empresa investida", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa na qual o titular detém participação" },
  { id: 57, schemaId: 11, name: "owner", label: "Sócio / titular", typeId: 8, targetSchemaId: 2, multi: false, observable: false, status: "ATIVA", desc: "Sócio pessoa física ou jurídica" },
  { id: 58, schemaId: 11, name: "percentage", label: "Percentual de participação", typeId: 2, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Percentual de cotas no capital social" },
  { id: 59, schemaId: 11, name: "startDate", label: "Início da participação", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Ingresso no quadro societário" },
  { id: 60, schemaId: 11, name: "endDate", label: "Saída da sociedade", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Retirada / cessão das cotas" },
  { id: 61, schemaId: 12, name: "organization", label: "Empresa administrada", typeId: 8, targetSchemaId: 4, multi: false, observable: false, status: "ATIVA", desc: "Empresa sob administração" },
  { id: 62, schemaId: 12, name: "director", label: "Administrador", typeId: 8, targetSchemaId: 3, multi: false, observable: false, status: "ATIVA", desc: "Pessoa física investida no cargo" },
  { id: 63, schemaId: 12, name: "role", label: "Cargo / qualificação", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Sócio-administrador, diretor" },
  { id: 64, schemaId: 12, name: "startDate", label: "Início do mandato", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Investidura no cargo" },
  { id: 65, schemaId: 12, name: "endDate", label: "Fim do mandato", typeId: 5, targetSchemaId: null, multi: false, observable: false, status: "ATIVA", desc: "Destituição ou término do mandato" },
  { id: 66, schemaId: 13, name: "agent", label: "Procurador", typeId: 8, targetSchemaId: 3, multi: false, observable: false, status: "EM_TESTE", desc: "Pessoa física outorgada" },
  { id: 67, schemaId: 13, name: "principal", label: "Outorgante", typeId: 8, targetSchemaId: 2, multi: false, observable: false, status: "EM_TESTE", desc: "Empresa ou pessoa que outorga poderes" },
  { id: 68, schemaId: 8, name: "eventCode", label: "Código do evento", typeId: 1, targetSchemaId: null, multi: false, observable: false, status: "SUSPENSA", desc: "Código REDESIM/SATE do evento cadastral" },
  { id: 69, schemaId: 8, name: "eventDate", label: "Data do evento", typeId: 6, targetSchemaId: null, multi: false, observable: false, status: "SUSPENSA", desc: "Data do protocolo do evento" },
  { id: 70, schemaId: 2, name: "website", label: "Site institucional", typeId: 1, targetSchemaId: null, multi: true, observable: false, status: "ARQUIVADA", desc: "Substituída por canais de contato normalizados" },
];

export interface FtmAction {
  id: number;
  code: string;
  name: string;
  desc: string;
  integration: string;
  severity: FtmSeverity;
  /** Parâmetros esperados, separados por vírgula (`ftm_action` não normaliza em tabela própria no protótipo). */
  params: string;
  rules: number;
  fires: number;
  /** Disponível no editor de regras. */
  enabled: boolean;
}

/** `ftm_action` — 7 tipos, conferidos contra seed-regra.md §9 (códigos, nomes e descrições). */
export const ACTIONS: FtmAction[] = [
  { id: 1, code: "INDICACAO_TELA", name: "Indicação em tela", desc: "Destaca o contribuinte com badge amarelo no painel operacional.", integration: "Painel", severity: "MEDIA", params: "mensagem, cor", rules: 4, fires: 1284, enabled: true },
  { id: 2, code: "ALERTA_TELEGRAM", name: "Alerta no Telegram", desc: "Dispara notificação imediata via bot para o canal de plantão fiscal.", integration: "Telegram Bot", severity: "ALTA", params: "canal, mensagem", rules: 5, fires: 412, enabled: true },
  { id: 3, code: "GERAR_OS", name: "Gerar ordem de serviço", desc: "Cria automaticamente uma OS de intervenção fiscal com tipo e prazo.", integration: "OS de intervenção", severity: "ALTA", params: "tipo_intervencao, mensagem, prazo", rules: 3, fires: 188, enabled: true },
  { id: 4, code: "FLAG_MALHA", name: "Retenção em malha fiscal", desc: "Atribui pontuação de risco e suspende autorização automática no SATE.", integration: "SATE", severity: "CRITICA", params: "score_risco, motivo", rules: 4, fires: 97, enabled: true },
  { id: 5, code: "EMAIL", name: "Notificação por e-mail", desc: "Envia relatório circunstanciado para a coordenadoria responsável.", integration: "SMTP", severity: "MEDIA", params: "setor, assunto, anexo", rules: 2, fires: 340, enabled: true },
  { id: 6, code: "PRODOC", name: "Abertura de PRODOC", desc: "Autua processo administrativo eletrônico no sistema Prodoc.", integration: "Prodoc", severity: "ALTA", params: "assunto, interessado", rules: 1, fires: 26, enabled: true },
  { id: 7, code: "ADD_TO_WATCHLIST", name: "Inclusão em watchlist", desc: "Inclui o observável do evento em uma lista, com justificativa automática.", integration: "ftm_list", severity: "MEDIA", params: "list_code, item_reason_in", rules: 0, fires: 0, enabled: false },
];

/** Operador de regra → tipos de propriedade compatíveis (matriz `ftm_operator_type`, seed-regra.md §3/§4). */
export const OPERATORS_BY_TYPE: Record<string, { label: string; types: number[] }> = {
  EQUAL: { label: "= igual a", types: [1, 2, 3, 4, 5, 6, 7, 11, 12] },
  NOT_EQUAL: { label: "!= diferente de", types: [1, 2, 3, 4, 5, 6, 7, 11, 12] },
  GREATER_THAN: { label: "> maior que", types: [2, 3, 5, 6] },
  GREATER_THAN_OR_EQUAL: { label: ">= maior ou igual", types: [2, 3, 5, 6] },
  LESS_THAN: { label: "< menor que", types: [2, 3, 5, 6] },
  LESS_THAN_OR_EQUAL: { label: "<= menor ou igual", types: [2, 3, 5, 6] },
  BETWEEN: { label: "entre (faixa)", types: [2, 3, 5, 6] },
  IN: { label: "em conjunto literal", types: [1, 2, 3, 7, 12] },
  NOT_IN: { label: "não em conjunto", types: [1, 2, 3, 7, 12] },
  IN_LIST: { label: "na watchlist", types: [1, 7, 9, 10, 11] },
  NOT_IN_LIST: { label: "não na watchlist", types: [1, 7, 9, 10, 11] },
  CONTAINS: { label: "contém texto", types: [1, 9, 11] },
  STARTS_WITH: { label: "começa com", types: [1, 9, 11] },
  ENDS_WITH: { label: "termina com", types: [1, 9, 11] },
  EXISTS: { label: "preenchido", types: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  NOT_EXISTS: { label: "vazio / ausente", types: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
};

/** Regras que usam um schema como `target_schema_id` — código e situação, ver lib/mock/regras.ts. */
export const TARGET_RULES: Record<number, Array<{ code: string; status: string }>> = {
  6: [
    { code: "NFE_0001", status: "ATIVA" },
    { code: "CTE_0007", status: "INATIVA" },
    { code: "NFE_0008", status: "ARQUIVADA" },
    { code: "NFE_0011", status: "EM_TESTE" },
  ],
  4: [
    { code: "CAD_0002", status: "ATIVA" },
    { code: "DIMP_0003", status: "ATIVA" },
    { code: "END_0006", status: "RASCUNHO" },
    { code: "CAD_0011", status: "EM_TESTE" },
  ],
  7: [{ code: "EFD_0004", status: "EM_TESTE" }],
  9: [{ code: "PIX_0005", status: "EM_TESTE" }],
  3: [{ code: "CTB_0012", status: "RASCUNHO" }],
  11: [{ code: "SOC_0013", status: "RASCUNHO" }],
};

/** Tópico Kafka e chave de partição de ingestão por schema — schemas fora deste mapa não têm ingestão associada. */
export const INGESTION_TOPICS: Record<number, { topic: string; partitionKey: string }> = {
  6: { topic: "dfe.nfe.events", partitionKey: "accessKey" },
  4: { topic: "sate.cadastro.events", partitionKey: "cnpj_raiz" },
  7: { topic: "sped.declaracao.events", partitionKey: "declarant.taxNumber" },
  9: { topic: "dimp.operacao.events", partitionKey: "party.taxNumber" },
  8: { topic: "redesim.evento.events", partitionKey: "protocolo" },
};

/** Quantidade de regras que referenciam cada propriedade — id de FtmProperty → contagem de usos. */
export const PROPERTY_USES: Record<number, number> = {
  4: 6, 14: 2, 18: 2, 21: 2, 25: 1, 27: 2, 30: 1, 32: 4, 35: 2, 37: 3, 38: 3, 50: 2,
  7: 1, 6: 2, 17: 2, 20: 2, 42: 1, 47: 1, 51: 1, 26: 1, 28: 1, 40: 1,
};

export function schemaById(id: number): FtmSchema | undefined {
  return SCHEMAS.find((s) => s.id === id);
}

/** Ancestrais de um schema, do pai imediato até a raiz. */
export function ancestorsOf(schemaId: number): FtmSchema[] {
  const out: FtmSchema[] = [];
  let current = schemaById(schemaId);
  while (current && current.parent !== null) {
    const parent = schemaById(current.parent);
    if (!parent) break;
    out.push(parent);
    current = parent;
  }
  return out;
}

export function depthOf(schemaId: number): number {
  return ancestorsOf(schemaId).length;
}

/** Propriedades declaradas diretamente no schema — recebe o estado corrente, não o seed. */
export function ownPropertiesOf(props: FtmProperty[], schemaId: number): FtmProperty[] {
  return props.filter((p) => p.schemaId === schemaId);
}

/** Propriedades herdadas de todos os ancestrais, cada uma anotada com o schema de origem. */
export function inheritedPropertiesOf(
  props: FtmProperty[],
  schemaId: number,
): Array<FtmProperty & { originSchemaName: string }> {
  return ancestorsOf(schemaId).flatMap((ancestor) =>
    props
      .filter((p) => p.schemaId === ancestor.id)
      .map((p) => ({ ...p, originSchemaName: ancestor.name })),
  );
}

export function getSchemas(): FtmSchema[] {
  return SCHEMAS;
}

export function getProperties(): FtmProperty[] {
  return PROPERTIES;
}

export function getActions(): FtmAction[] {
  return ACTIONS;
}
