import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/change-password/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Alterar senha — Gertor de Alertas",
};

export default function ChangePasswordPage() {
  return (
    <>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <h1 className="ga-page-title">Alterar senha</h1>
          <span className="ga-page-subtitle">
            Confirme sua senha atual e defina uma nova senha de acesso.
          </span>
        </div>
      </div>

      <div className="ga-card" style={{ maxWidth: 480 }}>
        <div className="ga-card-body">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}
