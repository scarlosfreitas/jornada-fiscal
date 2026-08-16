export const APP_BASE = "/app";

export const ROUTES = {
  painel: APP_BASE,
  regrasDeAlerta: `${APP_BASE}/regras/regras-de-alerta`,
  alertasGerados: `${APP_BASE}/regras/alertas-gerados`,
  monitoramento: `${APP_BASE}/monitoramento`,
  contribuinteHistorico: `${APP_BASE}/contribuintes/historico`,
  contribuinteSituacaoCadastral: `${APP_BASE}/contribuintes/situacao-cadastral`,
  ordensDeServico: `${APP_BASE}/ordens-de-servico`,
  relatorios: `${APP_BASE}/relatorios`,
  configuracoesUsuarios: `${APP_BASE}/configuracoes/usuarios`,
  configuracoesPerfis: `${APP_BASE}/configuracoes/perfis`,
  perfil: `${APP_BASE}/profile`,
  alterarSenha: `${APP_BASE}/change-password`,
} as const;

export function regraDetalhe(codigo: string) {
  return `${APP_BASE}/regras/${codigo}`;
}
