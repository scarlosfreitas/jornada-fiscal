import {
  LayoutDashboard,
  Bell,
  Activity,
  Users,
  ClipboardList,
  BarChart3,
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
    key: "regras",
    label: "Regras",
    href: ROUTES.regrasDeAlerta,
    icon: Bell,
    badge: 12,
    children: [
      { key: "regras_lista", label: "Regras de alerta", href: ROUTES.regrasDeAlerta },
      { key: "gerados", label: "Alertas gerados", href: ROUTES.alertasGerados },
    ],
  },
  {
    key: "monit",
    label: "Monitoramento",
    href: ROUTES.monitoramento,
    icon: Activity,
    badge: 7,
  },
  {
    key: "contrib",
    label: "Contribuintes",
    href: ROUTES.contribuinteHistorico,
    icon: Users,
    children: [
      { key: "hist", label: "Histórico", href: ROUTES.contribuinteHistorico },
      { key: "sit", label: "Situação cadastral", href: ROUTES.contribuinteSituacaoCadastral },
    ],
  },
  {
    key: "os",
    label: "Ordens de serviço",
    href: ROUTES.ordensDeServico,
    icon: ClipboardList,
    badge: 248,
    divider: true,
  },
  { key: "rel", label: "Relatórios", href: ROUTES.relatorios, icon: BarChart3 },
  {
    key: "conf",
    label: "Configurações",
    href: ROUTES.configuracoesUsuarios,
    icon: Settings,
    children: [
      { key: "usuarios", label: "Usuários", href: ROUTES.configuracoesUsuarios },
      { key: "perfis", label: "Perfis e permissões", href: ROUTES.configuracoesPerfis },
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
  { key: "painel", label: "Painel operacional", path: "Operações / Painel", module: "painel", href: ROUTES.painel },
  { key: "regras", label: "Regras de alerta", path: "Regras / Regras de alerta", module: "regras", href: ROUTES.regrasDeAlerta },
  { key: "gerados", label: "Alertas gerados", path: "Regras / Alertas gerados", module: "regras", href: ROUTES.alertasGerados },
  { key: "monit", label: "Monitoramento", path: "Operações / Monitoramento", module: "monitoramento", href: ROUTES.monitoramento },
  { key: "hist", label: "Histórico do contribuinte", path: "Relacionamento / Contribuinte / Histórico", module: "contribuinte", href: ROUTES.contribuinteHistorico },
  { key: "osi", label: "OS de intervenção", path: "Operações / Ordens de serviço", module: "os", href: ROUTES.ordensDeServico },
  { key: "usuarios", label: "Usuários", path: "Configurações / Usuários", module: "config", href: ROUTES.configuracoesUsuarios },
  { key: "perfis", label: "Perfis de acesso", path: "Configurações / Perfis e permissões", module: "config", href: ROUTES.configuracoesPerfis },
];
