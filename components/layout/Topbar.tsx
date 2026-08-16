"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, ArrowRight, Bell, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import { APP_FEATURES } from "./nav-data";
import { ROUTES } from "@/lib/routes";

function getInitials(name?: string | null) {
  const tokens = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (tokens.length === 0) return "?";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
}

interface TopbarProps {
  userName?: string | null;
  userCargo?: string | null;
}

export function Topbar({ userName, userCargo }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = useMemo(() => getInitials(userName), [userName]);
  const displayName = userName?.trim() || "—";

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

  function goToUserMenuItem(href: string) {
    setUserMenuOpen(false);
    router.push(href);
  }

  function handleSignOut() {
    setUserMenuOpen(false);
    signOut({ redirectTo: "/" });
  }

  return (
    <header className="ga-topbar">
      <div className="ga-relative" ref={searchContainerRef}>
        <div className="ga-search">
          <Search size={14} color="#8A91A3" />
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
                  <ArrowRight size={12} color="#2A45D4" strokeWidth={2.2} />
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
        <Bell size={15} />
        <span className="ga-dot-alert" />
      </button>

      <div className="ga-relative" ref={userContainerRef}>
        <button
          type="button"
          className="ga-user"
          onClick={() => setUserMenuOpen((prev) => !prev)}
        >
          <span className="ga-avatar">{initials}</span>
          <span className="ga-stack-2" style={{ gap: 1, textAlign: "left" }}>
            <span className="ga-user-name">{displayName}</span>
            {userCargo && <span className="ga-user-role">{userCargo}</span>}
          </span>
          <ChevronDown size={12} />
        </button>
        {userMenuOpen && (
          <div className="ga-menu" style={{ left: "auto", right: 0, top: 46, width: 200 }}>
            <button
              type="button"
              className="ga-menu-item ga-row"
              onClick={() => goToUserMenuItem(ROUTES.perfil)}
            >
              <User size={14} />
              Perfil
            </button>
            <button
              type="button"
              className="ga-menu-item ga-row"
              onClick={() => goToUserMenuItem(ROUTES.alterarSenha)}
            >
              <KeyRound size={14} />
              Alterar senha
            </button>
            <div className="ga-menu-divider" />
            <button
              type="button"
              className="ga-menu-item ga-row is-danger"
              onClick={handleSignOut}
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
