import type { EventoCategoria } from "@/lib/mock/contribuinte-detalhe";

export interface CategoriaInfo {
  label: string;
  chipVariant: "" | "primary" | "info" | "warning";
  dot: string;
}

/**
 * Rótulo e cor de cada categoria de evento da linha do tempo — apresentação, não
 * dado de contribuinte. Fica aqui, e não no módulo de dados, porque a aba é um
 * client component: importar um valor de `lib/mock/contribuinte-detalhe` arrastaria
 * o módulo inteiro para o bundle do navegador junto com os dados que ele carrega.
 */
export const CATEGORIAS: Record<EventoCategoria, CategoriaInfo> = {
  cadastro: { label: "Cadastro", chipVariant: "primary", dot: "#2A45D4" },
  fiscal: { label: "Fiscalização", chipVariant: "info", dot: "#1E63C9" },
  autuacao: { label: "Autuação", chipVariant: "", dot: "#C2321F" },
  prazo: { label: "Prazo", chipVariant: "warning", dot: "#B45309" },
  contato: { label: "Contato", chipVariant: "", dot: "#12855C" },
};
