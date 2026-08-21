"use server";

import { auth } from "@/auth";
import {
  buscarEntidades,
  getContribuintesRecentes,
  type ContribuinteResult,
} from "@/lib/consulta-entidade";

/**
 * Busca de contribuinte da barra superior, sobre `analytics.consulta_entidade`.
 *
 * Roda no servidor de propósito: a base analítica traz dado real protegido por
 * sigilo fiscal. Filtrar no cliente exigiria enviar a base inteira para o
 * navegador. Aqui só os resultados da consulta trafegam.
 */
export async function buscarContribuintes(query: string): Promise<ContribuinteResult[]> {
  // Server action é um endpoint público: sem sessão, não devolve nada.
  const session = await auth();
  if (!session?.user?.id) return [];

  const q = query.trim();
  return q ? await buscarEntidades(q, session.user.id) : await getContribuintesRecentes(session.user.id);
}
