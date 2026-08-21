import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface HistoricoColuna {
  key: string;
  label: string;
  field: keyof HistoricoRegistro;
  width: string;
  mono: boolean;
  /** Sempre exibida; não pode ser desmarcada. */
  fixed: boolean;
  /** Participa da comparação que decide se o registro é mantido. */
  compare: boolean;
}

export interface HistoricoRegistro {
  cad_hist_ini: string;
  cad_hist_fim: string;
  cad_reg_est_nome: string;
  cad_reg_fed_nome: string;
  cad_situacao_nome: string;
  cad_razao_social: string;
  cad_nat_jur_nome: string;
  cad_municipio_uf: string;
}

export interface HistoricoCadastral {
  colunas: HistoricoColuna[];
  registros: HistoricoRegistro[];
}

export const HISTORICO_COLUNAS: HistoricoColuna[] = [
  { key: "ini", label: "Data início", field: "cad_hist_ini", width: "150px", mono: true, fixed: true, compare: false },
  { key: "fim", label: "Data fim", field: "cad_hist_fim", width: "150px", mono: true, fixed: false, compare: false },
  { key: "reg_est", label: "Regime estadual", field: "cad_reg_est_nome", width: "170px", mono: false, fixed: false, compare: true },
  { key: "reg_fed", label: "Regime federal", field: "cad_reg_fed_nome", width: "170px", mono: false, fixed: false, compare: true },
  { key: "situacao", label: "Situação", field: "cad_situacao_nome", width: "130px", mono: false, fixed: false, compare: true },
  { key: "razao", label: "Razão social", field: "cad_razao_social", width: "320px", mono: false, fixed: false, compare: true },
  { key: "nat_jur", label: "Natureza jurídica", field: "cad_nat_jur_nome", width: "250px", mono: false, fixed: false, compare: true },
  { key: "municipio", label: "Município", field: "cad_municipio_uf", width: "170px", mono: false, fixed: false, compare: true },
];

/**
 * Consulta as alterações cadastrais do contribuinte na view `analytics.sate_hist_regime`.
 * Módulo server-only com SQL parametrizado via Prisma `$queryRaw`.
 * Retorna `[]` caso o `id` não seja numérico, o contribuinte não tenha registro,
 * ou a view não esteja disponível (código 42P01).
 */
export async function getHistoricoRegime(idContribuinte: string): Promise<HistoricoRegistro[]> {
  let idBigInt: bigint;
  try {
    idBigInt = BigInt(idContribuinte);
  } catch {
    return [];
  }

  try {
    const registros = await prisma.$queryRaw<HistoricoRegistro[]>(Prisma.sql`
      SELECT
        to_char(cad_hist_ini::timestamp, 'DD/MM/YYYY HH24:MI:SS') AS cad_hist_ini,
        to_char(cad_hist_fim::timestamp, 'DD/MM/YYYY HH24:MI:SS') AS cad_hist_fim,
        cad_reg_est_nome,
        cad_reg_fed_nome,
        cad_situacao_nome,
        cad_razao_social,
        cad_nat_jur_nome,
        concat_ws('-', cad_municipio, cad_uf) AS cad_municipio_uf
      FROM analytics.sate_hist_regime
      WHERE cad_id = ${idBigInt}
      -- Qualificado: um ORDER BY não qualificado se ligaria ao alias de saída
      -- (a string formatada DD/MM/YYYY), não à coluna de origem YYYY-MM-DD.
      ORDER BY analytics.sate_hist_regime.cad_hist_ini
    `);

    return registros;
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2010") {
      const codigoPostgres = (erro.meta as { code?: string } | undefined)?.code;
      if (codigoPostgres === "42P01") {
        console.error(
          "[sate-hist-regime] analytics.sate_hist_regime não existe neste ambiente; devolvendo [].",
        );
        return [];
      }
    }
    throw erro;
  }
}
