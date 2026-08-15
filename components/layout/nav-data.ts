import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons/types";
import { PainelIcon } from "@/components/icons/PainelIcon";
import { RegrasIcon } from "@/components/icons/RegrasIcon";
import { MonitoramentoIcon } from "@/components/icons/MonitoramentoIcon";
import { ContribuintesIcon } from "@/components/icons/ContribuintesIcon";
import { OrdensServicoIcon } from "@/components/icons/OrdensServicoIcon";
import { RelatoriosIcon } from "@/components/icons/RelatoriosIcon";
import { ConfiguracoesIcon } from "@/components/icons/ConfiguracoesIcon";

export interface NavChild {
  key: string;
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  /** Valor estático do protótipo — virá de dados reais em change futura. */
  badge?: number;
  divider?: boolean;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { key: "painel", label: "Painel", href: "/dashboard", icon: PainelIcon },
  {
    key: "regras",
    label: "Regras",
    href: "/regras/regras-de-alerta",
    icon: RegrasIcon,
    badge: 12,
    children: [
      { key: "regras_lista", label: "Regras de alerta", href: "/regras/regras-de-alerta" },
      { key: "gerados", label: "Alertas gerados", href: "/regras/alertas-gerados" },
    ],
  },
  {
    key: "monit",
    label: "Monitoramento",
    href: "/monitoramento",
    icon: MonitoramentoIcon,
    badge: 7,
  },
  {
    key: "contrib",
    label: "Contribuintes",
    href: "/contribuintes/historico",
    icon: ContribuintesIcon,
    children: [
      { key: "hist", label: "Histórico", href: "/contribuintes/historico" },
      { key: "sit", label: "Situação cadastral", href: "/contribuintes/situacao-cadastral" },
    ],
  },
  {
    key: "os",
    label: "Ordens de serviço",
    href: "/ordens-de-servico",
    icon: OrdensServicoIcon,
    badge: 248,
    divider: true,
  },
  { key: "rel", label: "Relatórios", href: "/relatorios", icon: RelatoriosIcon },
  {
    key: "conf",
    label: "Configurações",
    href: "/configuracoes/usuarios",
    icon: ConfiguracoesIcon,
    children: [
      { key: "usuarios", label: "Usuários", href: "/configuracoes/usuarios" },
      { key: "perfis", label: "Perfis e permissões", href: "/configuracoes/perfis" },
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
  { key: "painel", label: "Painel operacional", path: "Operações / Painel", module: "painel", href: "/dashboard" },
  { key: "regras", label: "Regras de alerta", path: "Regras / Regras de alerta", module: "regras", href: "/regras/regras-de-alerta" },
  { key: "gerados", label: "Alertas gerados", path: "Regras / Alertas gerados", module: "regras", href: "/regras/alertas-gerados" },
  { key: "monit", label: "Monitoramento", path: "Operações / Monitoramento", module: "monitoramento", href: "/monitoramento" },
  { key: "hist", label: "Histórico do contribuinte", path: "Relacionamento / Contribuinte / Histórico", module: "contribuinte", href: "/contribuintes/historico" },
  { key: "osi", label: "OS de intervenção", path: "Operações / Ordens de serviço", module: "os", href: "/ordens-de-servico" },
  { key: "usuarios", label: "Usuários", path: "Configurações / Usuários", module: "config", href: "/configuracoes/usuarios" },
  { key: "perfis", label: "Perfis de acesso", path: "Configurações / Perfis e permissões", module: "config", href: "/configuracoes/perfis" },
];
