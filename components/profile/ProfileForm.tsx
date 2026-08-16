"use client";

import { useActionState, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { updateProfile, type ProfileActionState } from "@/app/app/profile/actions";

const initialProfileActionState: ProfileActionState = { status: "idle" };

interface ProfileFormInitialData {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string | null;
  image: string | null;
}

function getInitials(nome: string, sobrenome: string) {
  const first = nome.trim().charAt(0) ?? "";
  const last = sobrenome.trim().charAt(0) ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
}

export function ProfileForm({ initialData }: { initialData: ProfileFormInitialData }) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialProfileActionState,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reflete os dados mais recentes: os valores salvos com sucesso (retornados
  // pela Server Action) têm prioridade sobre os dados originais carregados no
  // servidor, para a tela mostrar o resultado imediatamente após salvar.
  const currentData = state.status === "success" && state.data ? state.data : initialData;

  const initials = useMemo(
    () => getInitials(currentData.nome, currentData.sobrenome),
    [currentData.nome, currentData.sobrenome],
  );

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  const avatarImage = previewUrl ?? currentData.image;

  return (
    <form action={formAction} className="ga-form-section" noValidate>
      <div className="ga-field">
        <span className="ga-label">Foto de perfil</span>
        <div className="ga-row" style={{ gap: "var(--ga-space-4)", alignItems: "center" }}>
          <span
            className="ga-avatar"
            style={{ width: 64, height: 64, fontSize: 20, overflow: "hidden" }}
          >
            {avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar enviado por upload local, fora do domínio de next/image
              <img
                src={avatarImage}
                alt="Foto de perfil"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </span>
          <div className="ga-stack-2" style={{ gap: 6 }}>
            <button
              type="button"
              className="ga-btn ga-btn-secondary ga-btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              <Camera size={14} />
              Trocar foto
            </button>
            <span className="ga-field-hint">JPEG, PNG ou WebP, até 2 MB.</span>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={isPending}
              style={{ display: "none" }}
            />
            {state.fieldErrors?.image && (
              <span className="ga-field-error" role="alert">
                {state.fieldErrors.image}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ga-form-grid">
        <div className="ga-field">
          <label htmlFor="nome" className="ga-label">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className={`ga-input${state.fieldErrors?.nome ? " is-invalid" : ""}`}
            defaultValue={currentData.nome}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.nome && (
            <span className="ga-field-error" role="alert">
              {state.fieldErrors.nome}
            </span>
          )}
        </div>

        <div className="ga-field">
          <label htmlFor="sobrenome" className="ga-label">
            Sobrenome
          </label>
          <input
            id="sobrenome"
            name="sobrenome"
            type="text"
            className={`ga-input${state.fieldErrors?.sobrenome ? " is-invalid" : ""}`}
            defaultValue={currentData.sobrenome}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.sobrenome && (
            <span className="ga-field-error" role="alert">
              {state.fieldErrors.sobrenome}
            </span>
          )}
        </div>

        <div className="ga-field ga-col-span-2">
          <label htmlFor="email" className="ga-label">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`ga-input${state.fieldErrors?.email ? " is-invalid" : ""}`}
            defaultValue={currentData.email}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.email && (
            <span className="ga-field-error" role="alert">
              {state.fieldErrors.email}
            </span>
          )}
        </div>

        <div className="ga-field ga-col-span-2">
          <label htmlFor="telefone" className="ga-label">
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            className={`ga-input${state.fieldErrors?.telefone ? " is-invalid" : ""}`}
            defaultValue={currentData.telefone ?? ""}
            disabled={isPending}
          />
          {state.fieldErrors?.telefone && (
            <span className="ga-field-error" role="alert">
              {state.fieldErrors.telefone}
            </span>
          )}
        </div>
      </div>

      {/*
        Perfil de acesso não é editável aqui — a tela propositalmente não tem
        nenhum campo de seleção de perfil de acesso (nem leitura, nem
        escolha). Alterar o próprio perfil de acesso só é possível pela tela
        administrativa de usuários, uma operação distinta desta.
      */}

      {state.status === "error" && state.message && !state.fieldErrors && (
        <span className="ga-field-error" role="alert">
          {state.message}
        </span>
      )}

      {state.status === "success" && state.message && (
        <div className="ga-row" style={{ gap: 8, color: "var(--ga-success)" }} role="status">
          <CheckCircle2 size={16} />
          <span className="ga-body-sm">{state.message}</span>
        </div>
      )}

      <button type="submit" className="ga-btn ga-btn-primary ga-btn-lg" disabled={isPending}>
        {isPending ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}
