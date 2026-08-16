import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const PERFIS_INICIAIS = [
  "Usuário",
  "Administrador",
  "Cadastrador",
  "Bloqueador de Cadastro",
  "Validador de Cadastro",
];

async function main() {
  for (const nome of PERFIS_INICIAIS) {
    await prisma.perfil.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const perfilAdministrador = await prisma.perfil.findUniqueOrThrow({
    where: { nome: "Administrador" },
  });

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@jornadafiscal.local";
  const senha = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";
  const nome = process.env.SEED_ADMIN_NOME ?? "Administrador";
  const sobrenome = process.env.SEED_ADMIN_SOBRENOME ?? "do Sistema";

  const passwordHash = await bcrypt.hash(senha, 10);

  const administrador = await prisma.usuario.upsert({
    where: { email },
    update: {
      password: passwordHash,
      nome,
      sobrenome,
    },
    create: {
      email,
      password: passwordHash,
      nome,
      sobrenome,
      cargo: "Auditor Fiscal",
      lotacao: "Administração Central",
    },
  });

  await prisma.usuarioPerfil.upsert({
    where: {
      usuarioId_perfilId: {
        usuarioId: administrador.id,
        perfilId: perfilAdministrador.id,
      },
    },
    update: {},
    create: {
      usuarioId: administrador.id,
      perfilId: perfilAdministrador.id,
    },
  });

  console.log(`Perfis iniciais garantidos: ${PERFIS_INICIAIS.join(", ")}`);
  console.log(`Administrador garantido: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
