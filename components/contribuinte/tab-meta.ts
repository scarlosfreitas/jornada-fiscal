import type { ContribuinteTab } from "@/lib/routes";

export interface TabMeta {
  /** Rótulo na barra de abas. */
  label: string;
  /** Último item da trilha "Contribuinte / …". */
  crumb: string;
  title: string;
  subtitle: string;
  /** Texto de apoio da busca, nas abas que a possuem. */
  searchPlaceholder: string;
}

/** Metadados das sete abas, transcritos de references/design/Contribuinte.html. */
export const TAB_META: Record<ContribuinteTab, TabMeta> = {
  "linha-do-tempo": {
    label: "Linha do tempo",
    crumb: "Linha do tempo",
    title: "Linha do tempo do contribuinte",
    subtitle: "Eventos ocorridos ao longo do tempo",
    searchPlaceholder: "Buscar evento, processo ou documento",
  },
  "situacao-cadastral": {
    label: "Situação cadastral",
    crumb: "Situação atual",
    title: "Situação atual",
    subtitle: "Posição cadastral atual",
    searchPlaceholder: "Buscar campo cadastral",
  },
  historico: {
    label: "Histórico",
    crumb: "Histórico",
    title: "Histórico do contribuinte",
    subtitle: "Alterações cadastrais ao longo do tempo",
    searchPlaceholder: "Buscar razão social, regime ou situação",
  },
  recolhimentos: {
    label: "Recolhimentos",
    crumb: "Recolhimentos",
    title: "Recolhimentos",
    subtitle: "Recolhimentos por código de receita",
    searchPlaceholder: "Buscar código de receita",
  },
  "entrega-declaracoes": {
    label: "Entrega de declarações",
    crumb: "Declarações",
    title: "Entrega de declarações",
    subtitle: "Entregas em diversos períodos",
    searchPlaceholder: "Buscar declaração",
  },
  "valores-declarados": {
    label: "Valores declarados",
    crumb: "Valores declarados",
    title: "Valores declarados",
    subtitle: "Acompanhamento de valores declarados",
    searchPlaceholder: "Buscar rubrica",
  },
  "emissao-documentos": {
    label: "Emissão de documentos",
    crumb: "Emissão de documentos",
    title: "Emissão de documentos",
    subtitle: "Lista de emissão de documentos",
    searchPlaceholder: "Buscar tipo de documento",
  },
};
