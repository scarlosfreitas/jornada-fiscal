import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { contribuinteDetalhe } from "@/lib/routes";

/**
 * Consulta de entidade sobre `analytics.consulta_entidade` — base analítica
 * somente leitura, fora do `schema=public` gerenciado pelo Prisma (ver
 * openspec/changes/consulta-entidade/design.md, decisão 1). O acesso é sempre
 * via SQL bruto parametrizado.
 *
 * `import "server-only"`: a consulta roda a partir de app/app/actions.ts para
 * que a base nunca trafegue para o navegador. Client components importam
 * daqui apenas `type`s.
 */

export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export interface ContribuinteResult {
  id: string;
  nome: string;
  cnpjIe: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  href: string;
}

interface LinhaEntidade {
  cad_id: bigint;
  cnpj: string | null;
  cpf: string | null;
  ie: string | null;
  nome: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  situacao_nome: string | null;
}

const LIMITE_RESULTADOS = 10;
const LIMITE_RECENTES = 5;
const LIMITE_CANDIDATOS_SEMELHANCA = 500;
const TAMANHO_MINIMO_TERMO = 3;

/* --------------------------------------------------------------------------
   Normalização do texto digitado
   -------------------------------------------------------------------------- */

/**
 * Remove acentos por decomposição Unicode (NFD) e descarte dos diacríticos —
 * suficiente para os acentos do português, e consistente com `f_unaccent`
 * (wrapper de `unaccent()`) usado para gerar `search_index` no banco.
 */
function removerAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function normalizar(texto: string): string {
  return removerAcentos(texto.toLowerCase()).replace(/\s+/g, " ").trim();
}

function extrairDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

function extrairTermos(normalizado: string): string[] {
  return normalizado
    .split(" ")
    .filter((termo) => termo.length >= TAMANHO_MINIMO_TERMO);
}

/** Escapa `\`, `%` e `_` para uso seguro dentro de um `LIKE ... ESCAPE '\'`. */
function escaparCoringasLike(valor: string): string {
  return valor.replace(/[\\%_]/g, (caractere) => `\\${caractere}`);
}

/* --------------------------------------------------------------------------
   Formatação de exibição
   -------------------------------------------------------------------------- */

function agrupar(digitos: string, tamanhos: number[], separador: string): string {
  let resto = digitos;
  const grupos: string[] = [];
  for (const tamanho of tamanhos) {
    grupos.push(resto.slice(0, tamanho));
    resto = resto.slice(tamanho);
  }
  return grupos.join(separador) + resto;
}

function mascaraCnpj(digitos: string): string {
  if (digitos.length !== 14) return digitos;
  return `${agrupar(digitos.slice(0, 8), [2, 3, 3], ".")}/${digitos.slice(8, 12)}-${digitos.slice(12)}`;
}

function mascaraCpf(digitos: string): string {
  if (digitos.length !== 11) return digitos;
  return `${agrupar(digitos.slice(0, 9), [3, 3, 3], ".")}-${digitos.slice(9)}`;
}

/** IE não tem um formato único por estado; agrupa em blocos de 3 a partir da
 * esquerda, a mesma convenção já usada nos dados fictícios do protótipo. */
function mascaraIe(digitos: string): string {
  const grupos = digitos.match(/.{1,3}/g) ?? [digitos];
  return grupos.join(".");
}

function linhaIdentificacao(cnpj: string | null, cpf: string | null, ie: string | null): string {
  const partes: string[] = [];
  if (cnpj) {
    partes.push(`CNPJ ${mascaraCnpj(cnpj)}`);
  } else if (cpf) {
    partes.push(`CPF ${mascaraCpf(cpf)}`);
  }
  if (ie && ie.trim() !== "") {
    partes.push(`IE ${mascaraIe(ie)}`);
  }
  return partes.join(" · ");
}

function nomeExibicao(linha: LinhaEntidade): string {
  return linha.razao_social ?? linha.nome ?? linha.nome_fantasia ?? "";
}

function formatarSituacao(situacao: string | null): string {
  if (!situacao) return "Ativo";
  const lower = situacao.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function badgeVariantParaSituacao(situacao: string | null, hasIe: boolean): BadgeVariant {
  if (!situacao) return hasIe ? "success" : "neutral";
  const s = situacao.toUpperCase();
  if (s.includes("ATIVO") || s.includes("HABILITADO")) return "success";
  if (s.includes("SUSPENSO") || s.includes("PARALISADO") || s.includes("PROCEDIMENTO")) return "warning";
  if (s.includes("BAIXADO") || s.includes("CANCELADO") || s.includes("INAPTO") || s.includes("NULO")) return "danger";
  return "neutral";
}

function montarResultado(linha: LinhaEntidade): ContribuinteResult {
  const id = linha.cad_id.toString();
  const hasIe = Boolean(linha.ie && linha.ie.trim() !== "");
  const badgeLabel = linha.situacao_nome
    ? formatarSituacao(linha.situacao_nome)
    : (hasIe ? "Ativo" : "Não inscrito");
  const badgeVariant = badgeVariantParaSituacao(linha.situacao_nome, hasIe);

  return {
    id,
    nome: nomeExibicao(linha),
    cnpjIe: linhaIdentificacao(linha.cnpj, linha.cpf, linha.ie),
    badgeLabel,
    badgeVariant,
    href: contribuinteDetalhe(id),
  };
}

/* --------------------------------------------------------------------------
   Acesso à base analítica
   -------------------------------------------------------------------------- */

/**
 * `analytics.consulta_entidade` pode não existir em quem clonou o repositório
 * sem a carga analítica (ver design.md, Risks). Trata a relação ausente como
 * "sem resultados", registrando o motivo no log do servidor sem derrubar a
 * barra superior. Nenhum log inclui documento ou razão social — só o código
 * de erro do Postgres.
 */
async function comFallbackParaListaVazia<T>(consulta: () => Promise<T[]>): Promise<T[]> {
  try {
    return await consulta();
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2010") {
      const codigoPostgres = (erro.meta as { code?: string } | undefined)?.code;
      if (codigoPostgres === "42P01") {
        console.error(
          "[consulta-entidade] analytics.consulta_entidade não existe neste ambiente; devolvendo lista vazia.",
        );
        return [];
      }
    }
    throw erro;
  }
}

async function consultarDocumentoExato(digitos: string, apenasInscritos = true): Promise<LinhaEntidade[]> {
  if (!digitos) return [];
  const filtroInscritos = apenasInscritos
    ? Prisma.sql`AND (ie IS NOT NULL AND ie <> '')`
    : Prisma.empty;

  return prisma.$queryRaw<LinhaEntidade[]>(Prisma.sql`
    SELECT cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome
    FROM analytics.consulta_entidade
    WHERE (cnpj = ${digitos} OR cpf = ${digitos} OR ie = ${digitos})
      ${filtroInscritos}
    ORDER BY cad_id
    LIMIT ${LIMITE_RESULTADOS}
  `);
}

/**
 * Três faixas de casamento numa consulta só (ver design.md, decisão 2):
 * 1. documento exato (cnpj/cpf/ie) — sempre presente, nunca sujeito ao teto;
 * 2. prefixo de `search_index`;
 * 3. "contém" — todos os termos combinados por E, candidatos limitados a
 *    `LIMITE_CANDIDATOS_SEMELHANCA` antes de ordenar por semelhança.
 * Deduplicada por `cad_id` (a mesma entidade pode casar em mais de uma
 * faixa), priorizando a faixa mais forte e, dentro dela, a maior semelhança;
 * `cad_id` desfaz empates de forma estável.
 */
async function consultarComTexto(
  normalizado: string,
  termos: string[],
  digitos: string,
  apenasInscritos = true,
): Promise<LinhaEntidade[]> {
  const condicaoExata = digitos
    ? Prisma.sql`(cnpj = ${digitos} OR cpf = ${digitos} OR ie = ${digitos})`
    : Prisma.sql`false`;

  const filtroInscritos = apenasInscritos
    ? Prisma.sql`AND (ie IS NOT NULL AND ie <> '')`
    : Prisma.empty;

  const condicaoContem = Prisma.join(
    termos.map(
      (termo) => Prisma.sql`search_index LIKE ${`%${escaparCoringasLike(termo)}%`} ESCAPE '\\'`,
    ),
    " AND ",
  );

  return prisma.$queryRaw<LinhaEntidade[]>(Prisma.sql`
    WITH exato AS (
      SELECT cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome,
             0 AS tier, 1::real AS sim
      FROM analytics.consulta_entidade
      WHERE ${condicaoExata}
        ${filtroInscritos}
    ),
    prefixo AS (
      SELECT cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome,
             1 AS tier, 1::real AS sim
      FROM analytics.consulta_entidade
      WHERE search_index LIKE ${`${escaparCoringasLike(normalizado)}%`} ESCAPE '\\'
        ${filtroInscritos}
    ),
    candidatos AS (
      SELECT cad_id
      FROM analytics.consulta_entidade
      WHERE ${condicaoContem}
        ${filtroInscritos}
      LIMIT ${LIMITE_CANDIDATOS_SEMELHANCA}
    ),
    contem AS (
      SELECT e.cad_id, e.cnpj, e.cpf, e.ie, e.nome, e.razao_social, e.nome_fantasia, e.situacao_nome,
             2 AS tier, similarity(e.search_index, ${normalizado}) AS sim
      FROM candidatos c
      JOIN analytics.consulta_entidade e ON e.cad_id = c.cad_id
    ),
    unificado AS (
      SELECT * FROM exato
      UNION ALL
      SELECT * FROM prefixo
      UNION ALL
      SELECT * FROM contem
    ),
    dedup AS (
      SELECT DISTINCT ON (cad_id)
        cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome, tier, sim
      FROM unificado
      ORDER BY cad_id, tier ASC, sim DESC
    )
    SELECT cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome
    FROM dedup
    ORDER BY tier ASC, sim DESC, cad_id ASC
    LIMIT ${LIMITE_RESULTADOS}
  `);
}

/* --------------------------------------------------------------------------
   API do módulo
   -------------------------------------------------------------------------- */

/**
 * Consulta de entidade com texto digitado. Assume `textoBruto` não vazio —
 * quem chama decide, com o texto vazio, ler os recentes em vez disto (ver
 * app/app/actions.ts).
 */
export async function buscarEntidades(
  textoBruto: string,
  usuarioId: string,
  apenasInscritos = true,
): Promise<ContribuinteResult[]> {
  const normalizado = normalizar(textoBruto);
  const digitos = extrairDigitos(normalizado);
  const termos = extrairTermos(normalizado);

  if (termos.length === 0) {
    // Só ruído após o descarte de termos curtos: comporta-se como consulta
    // sem texto, exceto quando o texto é um documento exato (spec: "Texto
    // composto apenas de ruído" / "Termos com menos de 3 caracteres").
    const exatos = await comFallbackParaListaVazia(() =>
      consultarDocumentoExato(digitos, apenasInscritos),
    );
    if (exatos.length > 0) return exatos.map(montarResultado);
    return getContribuintesRecentes(usuarioId, apenasInscritos);
  }

  const linhas = await comFallbackParaListaVazia(() =>
    consultarComTexto(normalizado, termos, digitos, apenasInscritos),
  );
  return linhas.map(montarResultado);
}

/** Até `LIMITE_RECENTES` fichas abertas mais recentemente pelo usuário, do mais
 * recente para o mais antigo. `cad_id` sem entidade correspondente na base
 * analítica é omitido. */
export async function getContribuintesRecentes(
  usuarioId: string,
  apenasInscritos = true,
): Promise<ContribuinteResult[]> {
  const acessos = await prisma.contribuinteAcesso.findMany({
    where: { usuarioId },
    orderBy: { acessadoEm: "desc" },
    take: LIMITE_RECENTES,
    select: { cadId: true },
  });
  if (acessos.length === 0) return [];

  const ids = acessos.map((acesso) => acesso.cadId);
  const filtroInscritos = apenasInscritos
    ? Prisma.sql`AND (ie IS NOT NULL AND ie <> '')`
    : Prisma.empty;

  const linhas = await comFallbackParaListaVazia(() =>
    prisma.$queryRaw<LinhaEntidade[]>(Prisma.sql`
      SELECT cad_id, cnpj, cpf, ie, nome, razao_social, nome_fantasia, situacao_nome
      FROM analytics.consulta_entidade
      WHERE cad_id IN (${Prisma.join(ids)})
        ${filtroInscritos}
    `),
  );
  const linhaPorId = new Map(linhas.map((linha) => [linha.cad_id.toString(), linha]));

  return ids
    .map((id) => linhaPorId.get(id.toString()))
    .filter((linha): linha is LinhaEntidade => linha !== undefined)
    .map(montarResultado);
}

/**
 * Registra a abertura da ficha de `cadId` pelo usuário: upsert por
 * `(usuarioId, cadId)`, atualizando `acessadoEm` quando já existia (ver
 * design.md, decisão 5). Falhas não sobem — quem chama decide não deixar
 * isso impedir a apresentação da ficha.
 */
export async function registrarAcessoContribuinte(usuarioId: string, cadId: string): Promise<void> {
  const cadIdBigInt = BigInt(cadId);
  await prisma.contribuinteAcesso.upsert({
    where: { usuarioId_cadId: { usuarioId, cadId: cadIdBigInt } },
    create: {
      usuarioId,
      cadId: cadIdBigInt,
      acessadoEm: new Date(),
      criadoPor: usuarioId,
      atualizadoPor: usuarioId,
    },
    update: {
      acessadoEm: new Date(),
      atualizadoPor: usuarioId,
    },
  });
}
