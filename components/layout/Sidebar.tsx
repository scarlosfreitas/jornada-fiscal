"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { ChevronIcon } from "@/components/icons/ChevronIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { NAV_ITEMS } from "./nav-data";

function findActiveParentKey(pathname: string): string | null {
  const parent = NAV_ITEMS.find((item) =>
    item.children?.some((child) => child.href === pathname),
  );
  return parent?.key ?? null;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  // Overrides explícitos do usuário para grupos; grupos sem override seguem
  // o padrão (aberto quando a rota atual corresponde a um subitem).
  const [groupOverrides, setGroupOverrides] = useState<Record<string, boolean>>({});
  const activeParentKey = findActiveParentKey(pathname);

  function isGroupOpen(key: string) {
    return groupOverrides[key] ?? key === activeParentKey;
  }

  function toggleGroup(key: string) {
    setGroupOverrides((prev) => ({ ...prev, [key]: !isGroupOpen(key) }));
  }

  return (
    <aside className="ga-sidebar" data-collapsed={collapsed}>
      <div className="ga-sidebar-brand">
        <div className="ga-sidebar-logo">
          <LogoIcon />
        </div>
        <div className="ga-sidebar-brand-text">
          <span className="ga-sidebar-name">Gertor de Alertas</span>
          <span className="ga-sidebar-sub">operações</span>
        </div>
      </div>

      <nav className="ga-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = isGroupOpen(item.key);
          const isActive = !hasChildren && pathname === item.href;

          return (
            <div key={item.key}>
              {hasChildren ? (
                <button
                  type="button"
                  className="ga-nav-item"
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(item.key)}
                >
                  <Icon className="ga-nav-icon" />
                  <span className="ga-nav-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ga-nav-badge">{item.badge}</span>
                  )}
                  <ChevronIcon className="ga-nav-arrow" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="ga-nav-item"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="ga-nav-icon" />
                  <span className="ga-nav-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ga-nav-badge">{item.badge}</span>
                  )}
                </Link>
              )}

              {hasChildren && isOpen && !collapsed && (
                <div className="ga-nav-group">
                  {item.children!.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      className="ga-nav-subitem"
                      aria-current={pathname === child.href ? "page" : undefined}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}

              {item.divider && <div className="ga-nav-divider" />}
            </div>
          );
        })}
      </nav>

      <div className="ga-sidebar-footer">
        <button
          type="button"
          className="ga-nav-item"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <MenuIcon className="ga-nav-icon" />
          <span className="ga-nav-label">Recolher menu</span>
        </button>
      </div>
    </aside>
  );
}
