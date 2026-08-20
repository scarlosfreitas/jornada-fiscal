import "server-only";

import { lerFonteOu } from "@/lib/fontes";
import { contribuinteDetalhe } from "@/lib/routes";

/**
 * Contribuintes para a busca da barra superior. Lê `contribuintes.json` de
 * `FONTES_DIR` e cai nos dados fictícios abaixo (extraídos de
 * references/design/Dashboard.html) quando o arquivo não existe.
 *
 * `import "server-only"`: a busca roda no servidor (app/app/actions.ts) justamente
 * para que a base não vá inteira para o navegador. Client components importam
 * daqui apenas `type`s.
 */

export type SituacaoCadastral = "ativo" | "monitorado" | "suspenso" | "baixado";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export interface Contribuinte {
  id: string;
  nome: string;
  cnpj: string;
  ie: string;
  situacao: SituacaoCadastral;
  socio: string;
  contador: string;
}

export interface ContribuinteResult {
  id: string;
  nome: string;
  cnpjIe: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  href: string;
}

export const SITUACAO_CADASTRAL: Record<SituacaoCadastral, { label: string; badgeVariant: BadgeVariant }> = {
  ativo: { label: "Ativo", badgeVariant: "success" },
  monitorado: { label: "Monitorado", badgeVariant: "warning" },
  suspenso: { label: "Suspenso", badgeVariant: "danger" },
  baixado: { label: "Baixado", badgeVariant: "neutral" },
};

const CONTRIBUINTES: Contribuinte[] = [
  { id: "c1", nome: "Metalúrgica Andrade S/A", cnpj: "12.884.310/0001-45", ie: "110.482.331", situacao: "ativo", socio: "Roberto Andrade", contador: "Contábil Vega" },
  { id: "c2", nome: "Transportes Vale Norte Ltda", cnpj: "08.417.552/0001-09", ie: "110.771.204", situacao: "monitorado", socio: "Sônia Vale", contador: "Escritório Duarte" },
  { id: "c3", nome: "Frigorífico Boa Serra Ltda", cnpj: "21.009.744/0001-72", ie: "110.338.960", situacao: "ativo", socio: "Élio Serra", contador: "Contábil Vega" },
  { id: "c4", nome: "Cerâmica Ipê Ltda", cnpj: "33.712.008/0001-18", ie: "110.905.417", situacao: "suspenso", socio: "Marta Ipê", contador: "Assessoria Prisma" },
  { id: "c5", nome: "Distribuidora Sanmar S/A", cnpj: "07.554.901/0001-63", ie: "110.220.878", situacao: "ativo", socio: "Caio Sanmar", contador: "Escritório Duarte" },
  { id: "c6", nome: "Agro Ponta Verde Ltda", cnpj: "45.118.223/0001-30", ie: "110.664.052", situacao: "baixado", socio: "Helena Ponta", contador: "Contábil Aurora" },
  { id: "c7", nome: "Comercial Rio Claro ME", cnpj: "19.640.775/0001-84", ie: "110.517.639", situacao: "monitorado", socio: "Tiago Rio", contador: "Assessoria Prisma" },
  { id: "c8", nome: "Têxtil Vale do Sol Ltda", cnpj: "28.301.466/0001-27", ie: "110.843.775", situacao: "ativo", socio: "Rosa do Sol", contador: "Contábil Aurora" },
];

const RECENTES_IDS = ["c2", "c1", "c5", "c8"];

function toResult(c: Contribuinte): ContribuinteResult {
  const { label, badgeVariant } = SITUACAO_CADASTRAL[c.situacao];
  return {
    id: c.id,
    nome: c.nome,
    cnpjIe: `${c.cnpj} · ${c.ie}`,
    badgeLabel: label,
    badgeVariant,
    href: contribuinteDetalhe(c.id),
  };
}

async function todos(): Promise<Contribuinte[]> {
  return lerFonteOu("contribuintes", CONTRIBUINTES);
}

export async function getContribuintesRecentes(): Promise<ContribuinteResult[]> {
  const contribuintes = await todos();
  /* Os "recentes" do protótipo são uma lista fixa de ids; um payload real pode não
     trazê-los, então o que faltar simplesmente não aparece. */
  return RECENTES_IDS.map((id) => contribuintes.find((c) => c.id === id))
    .filter((c): c is Contribuinte => c !== undefined)
    .map(toResult);
}

export async function searchContribuintes(query: string): Promise<ContribuinteResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return getContribuintesRecentes();
  const contribuintes = await todos();
  return contribuintes
    .filter((c) => `${c.nome} ${c.cnpj} ${c.socio} ${c.contador}`.toLowerCase().includes(q))
    .map(toResult);
}
