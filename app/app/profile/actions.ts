"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth, updateSession } from "@/auth";
import { prisma } from "@/lib/db";
import { ROUTES } from "@/lib/routes";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Perfil de acesso não é editável aqui — esse schema propositalmente não
// declara nenhum campo relacionado a perfil de acesso, então qualquer valor
// desse tipo presente no FormData é descartado por não fazer parte do shape.
// Alterar o próprio perfil de acesso só é possível pela tela administrativa
// de usuários (fora do escopo desta tela de autoatendimento).
const profileFieldsSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  sobrenome: z.string().trim().min(1, "Informe o sobrenome."),
  email: z.string().trim().min(1, "Informe o e-mail.").email("Informe um e-mail válido."),
  telefone: z
    .string()
    .trim()
    .max(30, "Telefone muito longo.")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_BYTES, "A imagem deve ter no máximo 2 MB.")
  .refine(
    (file) => Object.prototype.hasOwnProperty.call(ALLOWED_IMAGE_TYPES, file.type),
    "Formato de imagem não suportado. Use JPEG, PNG ou WebP.",
  );

type ProfileFieldErrors = Partial<
  Record<"nome" | "sobrenome" | "email" | "telefone" | "image", string>
>;

export interface ProfileActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ProfileFieldErrors;
  data?: {
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string | null;
    image: string | null;
  };
}

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  // A identidade a ser atualizada vem sempre da sessão no servidor — nunca de
  // um id enviado pelo cliente. Isso elimina a classe de bug "IDOR" por
  // construção: o formulário não envia nem a action lê nenhum campo de id.
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { status: "error", message: "Sessão expirada. Entre novamente para continuar." };
  }

  const parsed = profileFieldsSchema.safeParse({
    nome: formData.get("nome"),
    sobrenome: formData.get("sobrenome"),
    email: formData.get("email"),
    telefone: formData.get("telefone"),
  });

  if (!parsed.success) {
    const fieldErrors: ProfileFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ProfileFieldErrors | undefined;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { status: "error", message: "Revise os campos destacados.", fieldErrors };
  }

  const { nome, sobrenome, email, telefone } = parsed.data;

  let newImagePath: string | undefined;
  const rawImage = formData.get("image");
  if (rawImage instanceof File && rawImage.size > 0) {
    const imageResult = imageFileSchema.safeParse(rawImage);
    if (!imageResult.success) {
      return {
        status: "error",
        message: "Revise a imagem selecionada.",
        fieldErrors: { image: imageResult.error.issues[0]?.message },
      };
    }

    const file = imageResult.data;
    const extension = ALLOWED_IMAGE_TYPES[file.type];
    const fileName = `${userId}-${Date.now()}-${randomUUID()}.${extension}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    // O arquivo antigo não é removido do disco nesta primeira versão — ver
    // "Riscos" em design.md.
    newImagePath = `/uploads/avatars/${fileName}`;
  }

  const emailOwner = await prisma.usuario.findUnique({
    where: { email },
    select: { id: true },
  });
  if (emailOwner && emailOwner.id !== userId) {
    return {
      status: "error",
      message: "Este e-mail já está em uso por outra pessoa cadastrada.",
      fieldErrors: { email: "E-mail já em uso." },
    };
  }

  try {
    const updated = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome,
        sobrenome,
        email,
        telefone: telefone ?? null,
        ...(newImagePath ? { image: newImagePath } : {}),
      },
      select: { nome: true, sobrenome: true, email: true, telefone: true, image: true },
    });

    // Mantém a sessão JWT corrente sincronizada — sem isso, nome/iniciais na
    // barra superior só mudariam em um novo login.
    await updateSession({
      user: {
        name: `${updated.nome} ${updated.sobrenome}`,
        email: updated.email,
        image: updated.image,
      },
    });

    revalidatePath(ROUTES.perfil);
    revalidatePath("/app", "layout");

    return {
      status: "success",
      message: "Dados atualizados com sucesso.",
      data: updated,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "Este e-mail já está em uso por outra pessoa cadastrada.",
        fieldErrors: { email: "E-mail já em uso." },
      };
    }
    throw error;
  }
}
