"use server";

import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: z.string().min(8, "A nova senha deve ter ao menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmação não confere com a nova senha.",
    path: ["confirmPassword"],
  });

export type ChangePasswordField = "currentPassword" | "newPassword" | "confirmPassword";

export type ChangePasswordResult =
  | { success: true; message: string }
  | { success: false; field?: ChangePasswordField; message: string };

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResult> {
  // A identidade nunca vem do cliente: lemos sempre da sessão no servidor.
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Sessão expirada. Entre novamente." };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0] as ChangePasswordField | undefined;
    return { success: false, field, message: issue?.message ?? "Dados inválidos." };
  }

  const { currentPassword, newPassword } = parsed.data;

  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) {
    return { success: false, message: "Sessão expirada. Entre novamente." };
  }

  // A senha atual é sempre conferida antes de qualquer gravação.
  const senhaAtualValida = await verify(usuario.password, currentPassword);
  if (!senhaAtualValida) {
    return {
      success: false,
      field: "currentPassword",
      message: "A senha atual informada está incorreta.",
    };
  }

  // Comparação sempre contra o hash — nunca texto puro contra texto puro.
  const novaIgualAtual = await verify(usuario.password, newPassword);
  if (novaIgualAtual) {
    return {
      success: false,
      field: "newPassword",
      message: "A nova senha deve ser diferente da senha atual.",
    };
  }

  const novoHash = await hash(newPassword);

  await prisma.usuario.update({
    where: { id: userId },
    data: { password: novoHash },
  });

  // Melhoria futura (não implementada agora): encerrar automaticamente a
  // sessão atual após a troca de senha, forçando novo login com a nova senha.

  return { success: true, message: "Senha alterada com sucesso." };
}
