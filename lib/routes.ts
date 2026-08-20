export const APP_BASE = "/app";
export const LOGIN_ROUTE = "/login";

export const ROUTES = {
  painel: APP_BASE,
  regrasDeAlerta: `${APP_BASE}/regras/regras-de-alerta`,
  alertasGerados: `${APP_BASE}/regras/alertas-gerados`,
  alertasListas: `${APP_BASE}/alertas/listas`,
  monitoramento: `${APP_BASE}/monitoramento`,
  contribuinteLinhaDoTempo: `${APP_BASE}/contribuintes/linha-do-tempo`,
  contribuinteHistorico: `${APP_BASE}/contribuintes/historico`,
  contribuinteSituacaoCadastral: `${APP_BASE}/contribuintes/situacao-cadastral`,
  contribuinteRecolhimentos: `${APP_BASE}/contribuintes/recolhimentos`,
  contribuinteEntregaDeclaracoes: `${APP_BASE}/contribuintes/entrega-declaracoes`,
  contribuinteValoresDeclarados: `${APP_BASE}/contribuintes/valores-declarados`,
  contribuinteEmissaoDocumentos: `${APP_BASE}/contribuintes/emissao-documentos`,
  ordensDeServicoMinhas: `${APP_BASE}/ordens-de-servico/minhas`,
  ordensDeServicoGestao: `${APP_BASE}/ordens-de-servico/gestao`,
  relatorios: `${APP_BASE}/relatorios`,
  relatoriosEmpresasAbertas: `${APP_BASE}/relatorios/empresas-abertas`,
  relatoriosReativacoes: `${APP_BASE}/relatorios/reativacoes`,
  relatoriosAcumuladoresCredito: `${APP_BASE}/relatorios/acumuladores-credito`,
  relatoriosCreditosApuracao: `${APP_BASE}/relatorios/creditos-apuracao`,
  operadorCiencia: `${APP_BASE}/operador/ciencia`,
  operadorTif: `${APP_BASE}/operador/tif`,
  operadorAutoEmbaraco: `${APP_BASE}/operador/auto-embaraco`,
  operadorAutoPrincipal: `${APP_BASE}/operador/auto-principal`,
  configuracoesUsuarios: `${APP_BASE}/configuracoes/usuarios`,
  configuracoesPerfis: `${APP_BASE}/configuracoes/perfis`,
  perfil: `${APP_BASE}/profile`,
  alterarSenha: `${APP_BASE}/change-password`,
} as const;

export function regraDetalhe(codigo: string) {
  return `${APP_BASE}/regras/${codigo}`;
}

export function contribuinteDetalhe(id: string) {
  return `${APP_BASE}/contribuintes/${id}`;
}

/** Abas da ficha do contribuinte, na ordem em que aparecem na barra de abas. */
export const CONTRIBUINTE_TABS = [
  "linha-do-tempo",
  "situacao-cadastral",
  "historico",
  "recolhimentos",
  "entrega-declaracoes",
  "valores-declarados",
  "emissao-documentos",
] as const;

export type ContribuinteTab = (typeof CONTRIBUINTE_TABS)[number];

export function contribuinteTab(id: string, tab: ContribuinteTab) {
  return `${APP_BASE}/contribuintes/${id}/${tab}`;
}
