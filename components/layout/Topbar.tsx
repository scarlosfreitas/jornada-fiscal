"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { BellIcon } from "@/components/icons/BellIcon";
import { ChevronIcon } from "@/components/icons/ChevronIcon";
import { APP_FEATURES } from "./nav-data";

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userContainerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APP_FEATURES;
    return APP_FEATURES.filter((feature) =>
      `${feature.label} ${feature.path} ${feature.module}`.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        userContainerRef.current &&
        !userContainerRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
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
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <header className="ga-topbar">
      <div className="ga-relative" ref={searchContainerRef}>
        <div className="ga-search">
          <SearchIcon />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Buscar funcionalidade — ex. regras, monitoramento, OS"
          />
          <span className="ga-search-kbd">⌘K</span>
        </div>
        {searchOpen && (
          <div
            className="ga-menu"
            style={{ left: 0, right: "auto", top: 44, width: 420, maxHeight: 340, overflow: "auto" }}
          >
            <div className="ga-row-between" style={{ padding: "8px 10px 6px" }}>
              <span className="ga-overline">Funcionalidades</span>
              <span
                className="ga-caption"
                style={{ cursor: "pointer" }}
                onClick={() => setSearchOpen(false)}
              >
                esc
              </span>
            </div>
            {results.map((feature) => (
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
                  <ArrowRightIcon />
                </span>
                <span className="ga-stack-2 ga-grow" style={{ gap: 2, minWidth: 0 }}>
                  <span className="ga-cell-primary">{feature.label}</span>
                  <span className="ga-caption ga-truncate">{feature.path}</span>
                </span>
                <span className="ga-chip ga-mono ga-none">{feature.module}</span>
              </button>
            ))}
            {results.length === 0 && (
              <div className="ga-body-sm ga-muted" style={{ padding: "14px 10px 16px" }}>
                Nenhuma funcionalidade encontrada.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ga-topbar-spacer" />

      <button type="button" className="ga-icon-btn">
        <BellIcon />
        <span className="ga-dot-alert" />
      </button>

      <div className="ga-relative" ref={userContainerRef}>
        <button
          type="button"
          className="ga-user"
          onClick={() => setUserMenuOpen((prev) => !prev)}
        >
          <span className="ga-avatar">AR</span>
          <span className="ga-stack-2" style={{ gap: 1, textAlign: "left" }}>
            <span className="ga-user-name">Ana Ribeiro</span>
            <span className="ga-user-role">Coordenação</span>
          </span>
          <ChevronIcon />
        </button>
        {userMenuOpen && (
          <div className="ga-menu" style={{ left: "auto", right: 0, top: 46, width: 200 }}>
            <button type="button" className="ga-menu-item">
              Meu perfil
            </button>
            <div className="ga-menu-divider" />
            <button type="button" className="ga-menu-item is-danger">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
