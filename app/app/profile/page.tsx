import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Meu perfil — Gertor de Alertas",
};

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // O layout de `/app` já redireciona para a tela de entrada quando não há
  // sessão; esse `notFound` é apenas defensivo caso a sessão exista mas o
  // registro correspondente já não exista mais na base.
  if (!userId) {
    notFound();
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      nome: true,
      sobrenome: true,
      email: true,
      telefone: true,
      image: true,
    },
  });

  if (!usuario) {
    notFound();
  }

  return (
    <>
      <div className="ga-page-head">
        <div className="ga-page-head-text">
          <div className="ga-breadcrumb">
            <span>Conta</span>
            <span>/</span>
            <span className="is-current">Meu perfil</span>
          </div>
          <h1 className="ga-page-title">Meu perfil</h1>
          <span className="ga-page-subtitle">
            Visualize e atualize seus dados cadastrais
          </span>
        </div>
      </div>

      <div className="ga-card" style={{ maxWidth: 640 }}>
        <div className="ga-card-body">
          <ProfileForm initialData={usuario} />
        </div>
      </div>
    </>
  );
}
