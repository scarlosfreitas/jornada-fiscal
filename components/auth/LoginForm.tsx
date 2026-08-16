"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.painel;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setHasError(false);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setHasError(true);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ga-form-section" noValidate>
      <div className="ga-field">
        <label htmlFor="email" className="ga-label">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`ga-input${hasError ? " is-invalid" : ""}`}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="ga-field">
        <label htmlFor="password" className="ga-label">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={`ga-input${hasError ? " is-invalid" : ""}`}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          disabled={isSubmitting}
          required
        />
        {hasError && (
          <span className="ga-field-error" role="alert">
            E-mail ou senha incorretos.
          </span>
        )}
      </div>

      <button type="submit" className="ga-btn ga-btn-primary ga-btn-lg" disabled={isSubmitting}>
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
