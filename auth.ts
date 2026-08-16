import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "@node-rs/argon2";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/db";
import { cargoVigente } from "@/lib/cargo-vigente";

const credentialsSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut, unstable_update: updateSession } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { identifier, password } = parsed.data;

        // Aceita e-mail ou nome de usuário como identificador: a heurística
        // simples (contém "@") evita duas consultas e é suficiente porque
        // "@" nunca é um caractere válido em usr_username.
        const usuario = await prisma.usuario.findUnique({
          where: identifier.includes("@") ? { email: identifier } : { username: identifier },
          include: {
            perfis: { where: { vigenciaFim: null }, include: { perfil: true } },
            cargos: { where: { vigenciaFim: null }, include: { cargo: true } },
          },
        });

        if (!usuario) {
          return null;
        }

        const senhaValida = await verify(usuario.password, password);
        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          image: usuario.image,
          perfis: usuario.perfis.map((up) => up.perfil.nome),
          cargo: cargoVigente(usuario.cargos),
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.perfis = user.perfis as string[];
        token.cargo = (user as { cargo?: string | null }).cargo ?? null;
      }
      // Permite que a Server Action de "meu perfil" (fora do fluxo de login)
      // atualize nome/e-mail/imagem/cargo já refletidos na sessão JWT
      // corrente, via `updateSession()` — sem isso o token só mudaria em um
      // novo login.
      if (trigger === "update" && session) {
        const updatedUser = session.user as
          | { name?: string | null; email?: string | null; image?: string | null; cargo?: string | null }
          | undefined;
        if (updatedUser?.name !== undefined) token.name = updatedUser.name;
        if (updatedUser?.email !== undefined) token.email = updatedUser.email;
        if (updatedUser?.image !== undefined) token.picture = updatedUser.image;
        if (updatedUser?.cargo !== undefined) token.cargo = updatedUser.cargo;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.perfis = token.perfis;
      session.user.cargo = token.cargo;
      return session;
    },
  },
});
