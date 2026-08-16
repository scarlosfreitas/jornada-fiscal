"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword, type ChangePasswordField } from "@/app/app/change-password/actions";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
  disabled: boolean;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  disabled,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="ga-field">
      <label htmlFor={id} className="ga-label">
        {label}
      </label>
      <div className="ga-relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          className={`ga-input ga-input-has-toggle${error ? " is-invalid" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          required
        />
        <button
          type="button"
          className="ga-input-toggle"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <span className="ga-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ChangePasswordField, string>>>({});

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        if (result.field) {
          setErrors({ [result.field]: result.message });
        }
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      resetForm();
    } catch {
      toast.error("Não foi possível alterar a senha. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ga-form-section" noValidate>
      <PasswordField
        id="currentPassword"
        label="Senha atual"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
        error={errors.currentPassword}
        disabled={isSubmitting}
      />

      <PasswordField
        id="newPassword"
        label="Nova senha"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
        error={errors.newPassword}
        disabled={isSubmitting}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar nova senha"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        error={errors.confirmPassword}
        disabled={isSubmitting}
      />

      <button type="submit" className="ga-btn ga-btn-primary ga-btn-lg" disabled={isSubmitting}>
        {isSubmitting ? "Alterando…" : "Alterar senha"}
      </button>
    </form>
  );
}
