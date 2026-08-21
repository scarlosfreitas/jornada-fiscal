"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, Bell, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import type { ContribuinteResult } from "@/lib/consulta-entidade";
import { buscarContribuintes } from "@/app/app/actions";
import { Switch } from "@/components/ftm/Switch";
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
  /** Lista inicial, resolvida no servidor pelo layout. */
  recentes: ContribuinteResult[];
}

export function Topbar({ userName, userCargo, recentes }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [apenasInscritos, setApenasInscritos] = useState(true);
  const [hits, setHits] = useState<ContribuinteResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = useMemo(() => getInitials(userName), [userName]);
  const displayName = userName?.trim() || "—";

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userContainerRef = useRef<HTMLDivElement>(null);

  const buscando = query.trim() !== "";
  const resultsHeading = buscando ? "Resultados" : "Contribuintes recentes";
  /* Sem busca ativa, a lista é a do servidor; não precisa de estado. */
  const results = buscando ? hits : recentes;

  /* A consulta vai ao servidor (ver app/app/actions.ts), então é adiada enquanto a
     pessoa digita. `pedido` descarta resposta que chega fora de ordem. */
  const pedidoRef = useRef(0);
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setHits([]);
      return;
    }

    const pedido = ++pedidoRef.current;
    const timer = setTimeout(async () => {
      const encontrados = await buscarContribuintes(q, apenasInscritos);
      if (pedido === pedidoRef.current) setHits(encontrados);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, apenasInscritos]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
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

  function goToContribuinte(href: string) {
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
      <div className="ga-row" style={{ alignItems: "center", gap: 14 }}>
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
              placeholder="Buscar contribuinte — CNPJ, CPF, IE, razão social ou nome fantasia"
            />
          </div>
          {searchOpen && (
            <div
              className="ga-menu"
              style={{ left: 0, right: "auto", top: 44, width: 420, maxHeight: 340, overflow: "auto" }}
            >
              <div className="ga-row-between" style={{ padding: "8px 10px 6px" }}>
                <span className="ga-overline">{resultsHeading}</span>
                <span
                  className="ga-caption"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSearchOpen(false)}
                >
                  esc
                </span>
              </div>
              {results.map((contribuinte) => (
                <button
                  key={contribuinte.id}
                  type="button"
                  className="ga-menu-item ga-row"
                  onClick={() => goToContribuinte(contribuinte.href)}
                >
                  <span
                    className="ga-avatar ga-none"
                    style={{
                      width: 30,
                      height: 30,
                      fontSize: 11,
                      background: "var(--ga-primary-50)",
                      color: "var(--ga-primary-600)",
                      border: "1px solid var(--ga-primary-200)",
                    }}
                  >
                    {getInitials(contribuinte.nome)}
                  </span>
                  <span className="ga-stack-2 ga-grow" style={{ gap: 2, minWidth: 0 }}>
                    <span className="ga-cell-primary ga-truncate">{contribuinte.nome}</span>
                    <span className="ga-cell-meta ga-truncate">{contribuinte.cnpjIe}</span>
                  </span>
                  <span className={`ga-badge ga-none ga-badge-${contribuinte.badgeVariant}`}>
                    {contribuinte.badgeLabel}
                  </span>
                </button>
              ))}
              {results.length === 0 && buscando && (
                <div className="ga-body-sm ga-muted" style={{ padding: "14px 10px 16px" }}>
                  Nenhum contribuinte encontrado para &ldquo;{query}&rdquo;.
                </div>
              )}
              {results.length === 0 && !buscando && (
                <div className="ga-body-sm ga-muted" style={{ padding: "14px 10px 16px" }}>
                  Digite CNPJ, CPF, inscrição estadual, razão social ou nome fantasia para buscar.
                </div>
              )}
            </div>
          )}
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Switch
            on={apenasInscritos}
            onToggle={() => setApenasInscritos((prev) => !prev)}
            label="Consultar apenas inscritos"
          />
          <span className="ga-body-sm ga-muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
            Apenas inscritos
          </span>
        </label>
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
