"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

interface ShellSearchContextValue {
  /** Aciona o gatilho registrado pela Topbar — abre a busca de contribuinte com o campo focado. */
  abrirBuscaContribuinte: () => void;
  /** Chamado pela Topbar para registrar o gatilho de abertura da sua própria busca. */
  registrarAbertura: (fn: () => void) => void;
}

const ShellSearchContext = createContext<ShellSearchContextValue | null>(null);

/**
 * Ponto de coordenação entre Sidebar e Topbar, componentes de cliente irmãos
 * sob app/app/layout.tsx (componente de servidor). A Topbar registra como abrir
 * sua própria busca; a Sidebar aciona esse gatilho sem conhecer sua implementação.
 */
export function ShellSearchProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<() => void>(() => {});

  const registrarAbertura = useCallback((fn: () => void) => {
    handlerRef.current = fn;
  }, []);

  const abrirBuscaContribuinte = useCallback(() => {
    handlerRef.current();
  }, []);

  return (
    <ShellSearchContext.Provider value={{ abrirBuscaContribuinte, registrarAbertura }}>
      {children}
    </ShellSearchContext.Provider>
  );
}

export function useShellSearch(): ShellSearchContextValue {
  const ctx = useContext(ShellSearchContext);
  if (!ctx) {
    throw new Error("useShellSearch deve ser usado dentro de um ShellSearchProvider");
  }
  return ctx;
}
