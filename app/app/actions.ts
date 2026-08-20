"use server";

import { auth } from "@/auth";
import {
  getContribuintesRecentes,
  searchContribuintes,
  type ContribuinteResult,
} from "@/lib/mock/contribuintes";

/**
 * Busca de contribuinte da barra superior.
 *
 * Roda no servidor de propósito: os payloads de contribuinte vêm de `fontes/` e
 * trazem dado real protegido por sigilo fiscal. Filtrar no cliente exigiria enviar
 * a base inteira para o navegador — era o que a Topbar fazia enquanto os dados eram
 * fictícios. Aqui só os resultados da consulta trafegam.
 */
export async function buscarContribuintes(query: string): Promise<ContribuinteResult[]> {
  // Server action é um endpoint público: sem sessão, não devolve nada.
  const session = await auth();
  if (!session) return [];

  const q = query.trim();
  return q ? await searchContribuintes(q) : await getContribuintesRecentes();
}
