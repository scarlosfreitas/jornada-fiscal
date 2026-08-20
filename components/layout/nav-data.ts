import {
  LayoutDashboard,
  Bell,
  Users,
  ClipboardList,
  BarChart3,
  Gavel,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export interface NavChild {
  key: string;
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Valor estático do protótipo — virá de dados reais em change futura. */
  badge?: number;
  divider?: boolean;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { key: "painel", label: "Painel", href: ROUTES.painel, icon: LayoutDashboard },
  {
    key: "alertas",
    label: "Gestão de Alertas",
    href: ROUTES.regrasDeAlerta,
    icon: Bell,
    badge: 12,
    children: [
      { key: "regras", label: "Regras", href: ROUTES.regrasDeAlerta },
      { key: "listas", label: "Listas", href: ROUTES.alertasListas },
      { key: "alertas_lista", label: "Alertas", href: ROUTES.alertasGerados },
    ],
  },
  {
    key: "os",
    label: "Ordens de Serviço",
    href: ROUTES.ordensDeServicoGestao,
    icon: ClipboardList,
    badge: 248,
    children: [
      { key: "minhas_os", label: "Minhas OS", href: ROUTES.ordensDeServicoMinhas },
      { key: "gestao_os", label: "Gestão de OS", href: ROUTES.ordensDeServicoGestao },
    ],
  },
  {
    key: "contrib",
    label: "Contribuinte",
    href: ROUTES.contribuinteLinhaDoTempo,
    icon: Users,
    children: [
      { key: "linha_tempo", label: "Linha do Tempo", href: ROUTES.contribuinteLinhaDoTempo },
      { key: "sit", label: "Situação Cadastral", href: ROUTES.contribuinteSituacaoCadastral },
      { key: "hist", label: "Histórico", href: ROUTES.contribuinteHistorico },
      { key: "rec", label: "Recolhimentos", href: ROUTES.contribuinteRecolhimentos },
      { key: "dec", label: "Entrega de Declarações", href: ROUTES.contribuinteEntregaDeclaracoes },
      { key: "val", label: "Valores Declarados", href: ROUTES.contribuinteValoresDeclarados },
      { key: "doc", label: "Emissão de Documentos", href: ROUTES.contribuinteEmissaoDocumentos },
    ],
  },
  {
    key: "rel",
    label: "Relatórios",
    href: ROUTES.relatoriosEmpresasAbertas,
    icon: BarChart3,
    divider: true,
    children: [
      { key: "emp_abertas", label: "Empresas abertas", href: ROUTES.relatoriosEmpresasAbertas },
      { key: "reativacoes", label: "Reativações", href: ROUTES.relatoriosReativacoes },
      { key: "acum_credito", label: "Acumuladores de Crédito", href: ROUTES.relatoriosAcumuladoresCredito },
      { key: "cred_apuracao", label: "Créditos do Apuração", href: ROUTES.relatoriosCreditosApuracao },
    ],
  },
  {
    key: "operador",
    label: "Operador",
    href: ROUTES.operadorCiencia,
    icon: Gavel,
    children: [
      { key: "ciencia", label: "Ciência", href: ROUTES.operadorCiencia },
      { key: "tif", label: "TIF", href: ROUTES.operadorTif },
      { key: "embaraco", label: "Auto de Embaraço", href: ROUTES.operadorAutoEmbaraco },
      { key: "principal", label: "Auto Principal", href: ROUTES.operadorAutoPrincipal },
    ],
  },
  {
    key: "conf",
    label: "Configuração",
    href: ROUTES.configuracoesUsuarios,
    icon: Settings,
    children: [
      { key: "usuarios", label: "Usuários", href: ROUTES.configuracoesUsuarios },
      { key: "perfis", label: "Perfil de Acesso", href: ROUTES.configuracoesPerfis },
    ],
  },
];

export interface AppFeature {
  key: string;
  label: string;
  path: string;
  module: string;
  href: string;
}

export const APP_FEATURES: AppFeature[] = [
  { key: "painel", label: "Painel", path: "Painel", module: "painel", href: ROUTES.painel },
  { key: "regras", label: "Regras", path: "Gestão de Alertas / Regras", module: "alertas", href: ROUTES.regrasDeAlerta },
  { key: "listas", label: "Listas", path: "Gestão de Alertas / Listas", module: "alertas", href: ROUTES.alertasListas },
  { key: "alertas", label: "Alertas", path: "Gestão de Alertas / Alertas", module: "alertas", href: ROUTES.alertasGerados },
  { key: "minhas_os", label: "Minhas OS", path: "Ordens de Serviço / Minhas OS", module: "os", href: ROUTES.ordensDeServicoMinhas },
  { key: "gestao_os", label: "Gestão de OS", path: "Ordens de Serviço / Gestão de OS", module: "os", href: ROUTES.ordensDeServicoGestao },
  { key: "linha_tempo", label: "Linha do Tempo", path: "Contribuinte / Linha do Tempo", module: "contribuinte", href: ROUTES.contribuinteLinhaDoTempo },
  { key: "sit", label: "Situação Cadastral", path: "Contribuinte / Situação Cadastral", module: "contribuinte", href: ROUTES.contribuinteSituacaoCadastral },
  { key: "hist", label: "Histórico", path: "Contribuinte / Histórico", module: "contribuinte", href: ROUTES.contribuinteHistorico },
  { key: "rec", label: "Recolhimentos", path: "Contribuinte / Recolhimentos", module: "contribuinte", href: ROUTES.contribuinteRecolhimentos },
  { key: "dec", label: "Entrega de Declarações", path: "Contribuinte / Entrega de Declarações", module: "contribuinte", href: ROUTES.contribuinteEntregaDeclaracoes },
  { key: "val", label: "Valores Declarados", path: "Contribuinte / Valores Declarados", module: "contribuinte", href: ROUTES.contribuinteValoresDeclarados },
  { key: "doc", label: "Emissão de Documentos", path: "Contribuinte / Emissão de Documentos", module: "contribuinte", href: ROUTES.contribuinteEmissaoDocumentos },
  { key: "emp_abertas", label: "Empresas abertas", path: "Relatórios / Empresas abertas", module: "relatorios", href: ROUTES.relatoriosEmpresasAbertas },
  { key: "reativacoes", label: "Reativações", path: "Relatórios / Reativações", module: "relatorios", href: ROUTES.relatoriosReativacoes },
  { key: "acum_credito", label: "Acumuladores de Crédito", path: "Relatórios / Acumuladores de Crédito", module: "relatorios", href: ROUTES.relatoriosAcumuladoresCredito },
  { key: "cred_apuracao", label: "Créditos do Apuração", path: "Relatórios / Créditos do Apuração", module: "relatorios", href: ROUTES.relatoriosCreditosApuracao },
  { key: "ciencia", label: "Ciência", path: "Operador / Ciência", module: "operador", href: ROUTES.operadorCiencia },
  { key: "tif", label: "TIF", path: "Operador / TIF", module: "operador", href: ROUTES.operadorTif },
  { key: "embaraco", label: "Auto de Embaraço", path: "Operador / Auto de Embaraço", module: "operador", href: ROUTES.operadorAutoEmbaraco },
  { key: "principal", label: "Auto Principal", path: "Operador / Auto Principal", module: "operador", href: ROUTES.operadorAutoPrincipal },
  { key: "usuarios", label: "Usuários", path: "Configuração / Usuários", module: "config", href: ROUTES.configuracoesUsuarios },
  { key: "perfis", label: "Perfil de Acesso", path: "Configuração / Perfil de Acesso", module: "config", href: ROUTES.configuracoesPerfis },
];
