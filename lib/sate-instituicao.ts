import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface Instituicao {
  cad_id?: bigint;
  cad_cnpj?: string | null;
  cad_cpf?: string | null;
  cad_nire?: string | null;
  cad_ie?: string | null;
  cad_insc_suframa?: string | null;
  cad_razao_social?: string | null;
  cad_nome_fantasia?: string | null;
  cad_nat_jur_id?: number | null;
  cad_nat_jur_nome?: string | null;
  cad_reg_est_id?: number | null;
  cad_reg_est_nome?: string | null;
  cad_reg_fed_id?: number | null;
  cad_reg_fed_nome?: string | null;
  cad_situacao_id?: number | null;
  cad_situacao_nome?: string | null;
  cad_dt_inicio?: Date | string | null;
  cad_estab_id?: number | null;
  cad_estab_nome?: string | null;
  cad_origem_id?: number | null;
  cad_origem_nome?: string | null;
  cad_capital_social?: number | string | null;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  cpf_cnpj?: string | null;
  inscricao_estadual?: string | null;
  tipo?: string | null;
  situacao_cadastral?: string | null;
  dt_situacao_cadastral?: string | null;
  motivo_situacao_cadastral?: string | null;
  ind_atividade?: string | null;
}

interface LinhaInstituicao extends Instituicao {}

/**
 * Consulta os dados do contribuinte na view `analytics.sate_instituicao`.
 * Módulo server-only com SQL parametrizado via Prisma `$queryRaw`.
 * Retorna `null` caso o registro não exista ou a view não esteja disponível (código 42P01).
 */
export async function getInstituicao(idContribuinte: string): Promise<Instituicao | null> {
  let idBigInt: bigint;
  try {
    idBigInt = BigInt(idContribuinte);
  } catch {
    return null;
  }

  try {
    const linhas = await prisma.$queryRaw<LinhaInstituicao[]>(Prisma.sql`
      SELECT 
        cad_id,
        cad_cnpj,
        cad_cpf,
        cad_nire,
        cad_ie,
        cad_insc_suframa,
        cad_razao_social,
        cad_nome_fantasia,
        cad_nat_jur_id,
        cad_nat_jur_nome,
        cad_reg_est_id,
        cad_reg_est_nome,
        cad_reg_fed_id,
        cad_reg_fed_nome,
        cad_situacao_id,
        cad_situacao_nome,
        cad_dt_inicio,
        cad_estab_id,
        cad_estab_nome,
        cad_origem_id,
        cad_origem_nome,
        cad_capital_social,
        cad_razao_social AS razao_social,
        cad_nome_fantasia AS nome_fantasia,
        COALESCE(cad_cnpj, cad_cpf) AS cpf_cnpj,
        cad_ie AS inscricao_estadual,
        cad_estab_nome AS tipo,
        cad_situacao_nome AS situacao_cadastral,
        to_char(cad_dt_inicio, 'DD/MM/YYYY') AS dt_situacao_cadastral,
        NULL::text AS motivo_situacao_cadastral,
        NULL::text AS ind_atividade
      FROM analytics.sate_instituicao
      WHERE cad_id = ${idBigInt}
      LIMIT 1
    `);

    if (!linhas || linhas.length === 0) {
      return null;
    }

    return linhas[0];
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2010") {
      const codigoPostgres = (erro.meta as { code?: string } | undefined)?.code;
      if (codigoPostgres === "42P01") {
        console.error(
          "[sate-instituicao] analytics.sate_instituicao não existe neste ambiente; devolvendo null.",
        );
        return null;
      }
    }
    throw erro;
  }
}
