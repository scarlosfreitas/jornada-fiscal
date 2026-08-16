import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Entrar — Gertor de Alertas",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect(ROUTES.painel);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--ga-space-6)",
      }}
    >
      <div className="ga-card" style={{ width: "100%", maxWidth: 380 }}>
        <div
          className="ga-card-body"
          style={{ display: "flex", flexDirection: "column", gap: "var(--ga-space-6)" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--ga-space-3)",
              textAlign: "center",
            }}
          >
            <LogoIcon />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span className="ga-page-title">Gertor de Alertas</span>
              <span className="ga-body-sm ga-muted">
                Entre com seu e-mail e senha para acessar a jornada fiscal
              </span>
            </div>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
