"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { APP_FEATURES, NAV_ITEMS, type NavChild } from "./nav-data";
import { ROUTES } from "@/lib/routes";

/**
 * O índice da aplicação (`/app`) casa só por igualdade — um `startsWith`
 * deixaria "Painel" aceso em qualquer outra tela. Os demais itens casam por
 * prefixo, para que subpáginas de uma tela mantenham o item pai destacado.
 * `matchExtra` cobre rotas de detalhe fora do prefixo da listagem (ex.:
 * `/app/regras/{codigo}` para o item "Regras").
 */
function isRouteActive(pathname: string, href: string, matchExtra?: (pathname: string) => boolean): boolean {
  if (href === ROUTES.painel) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`) || !!matchExtra?.(pathname);
}

function isChildActive(pathname: string, child: NavChild): boolean {
  return isRouteActive(pathname, child.href, child.matchExtra);
}

function findActiveParentKey(pathname: string): string | null {
  const parent = NAV_ITEMS.find((item) => item.children?.some((child) => isChildActive(pathname, child)));
  return parent?.key ?? null;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  // Overrides explícitos do usuário para grupos; grupos sem override seguem
  // o padrão (aberto quando a rota atual corresponde a um subitem).
  const [groupOverrides, setGroupOverrides] = useState<Record<string, boolean>>({});
  const activeParentKey = findActiveParentKey(pathname);

  const [featQuery, setFeatQuery] = useState("");
  const [featSearchOpen, setFeatSearchOpen] = useState(false);
  const featSearchRef = useRef<HTMLDivElement>(null);

  const featResults = useMemo(() => {
    const q = featQuery.trim().toLowerCase();
    if (!q) return APP_FEATURES;
    return APP_FEATURES.filter((feature) =>
      `${feature.label} ${feature.path} ${feature.module}`.toLowerCase().includes(q),
    );
  }, [featQuery]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFeatSearchOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (featSearchRef.current && !featSearchRef.current.contains(e.target as Node)) {
        setFeatSearchOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  function goToFeature(href: string) {
    setFeatSearchOpen(false);
    setFeatQuery("");
    router.push(href);
  }

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
          const isActive = !hasChildren && isRouteActive(pathname, item.href);

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
                  <ChevronDown className="ga-nav-arrow" />
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
                      aria-current={isChildActive(pathname, child) ? "page" : undefined}
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
        {!collapsed && (
          <div className="ga-relative" ref={featSearchRef}>
            <div className="ga-sidebar-search">
              <Search width={13} height={13} color="rgba(255,255,255,.5)" style={{ flex: "none" }} />
              <input
                value={featQuery}
                onChange={(e) => {
                  setFeatQuery(e.target.value);
                  setFeatSearchOpen(true);
                }}
                onFocus={() => setFeatSearchOpen(true)}
                placeholder="Busca funcionalidade"
                aria-label="Busca funcionalidade"
              />
            </div>
            {featSearchOpen && (
              <div
                className="ga-menu"
                style={{ left: 0, right: "auto", bottom: 46, top: "auto", width: 320, maxHeight: 320, overflow: "auto" }}
              >
                <div className="ga-row-between" style={{ padding: "8px 10px 6px" }}>
                  <span className="ga-overline">Funcionalidades</span>
                  <span
                    className="ga-caption"
                    style={{ cursor: "pointer" }}
                    onClick={() => setFeatSearchOpen(false)}
                  >
                    esc
                  </span>
                </div>
                {featResults.map((feature) => (
                  <button
                    key={feature.key}
                    type="button"
                    className="ga-menu-item ga-row"
                    onClick={() => goToFeature(feature.href)}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        border: "1px solid var(--ga-primary-200)",
                        background: "var(--ga-primary-50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                      }}
                    >
                      <ArrowRight size={12} color="#2A45D4" strokeWidth={2.2} />
                    </span>
                    <span className="ga-stack-2 ga-grow" style={{ gap: 2, minWidth: 0 }}>
                      <span className="ga-cell-primary">{feature.label}</span>
                      <span className="ga-caption ga-truncate">{feature.path}</span>
                    </span>
                  </button>
                ))}
                {featResults.length === 0 && (
                  <div className="ga-body-sm ga-muted" style={{ padding: "14px 10px 16px" }}>
                    Nenhuma funcionalidade encontrada.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className="ga-nav-item"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <Menu className="ga-nav-icon" />
          <span className="ga-nav-label">Recolher menu</span>
        </button>
      </div>
    </aside>
  );
}
