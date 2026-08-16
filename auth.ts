import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut, unstable_update: updateSession } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const usuario = await prisma.usuario.findUnique({
          where: { email },
          include: { perfis: { include: { perfil: true } } },
        });

        if (!usuario) {
          return null;
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);
        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id,
          name: `${usuario.nome} ${usuario.sobrenome}`,
          email: usuario.email,
          image: usuario.image,
          perfis: usuario.perfis.map((up) => up.perfil.nome),
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
      }
      // Permite que a Server Action de "meu perfil" (fora do fluxo de login)
      // atualize nome/e-mail/imagem já refletidos na sessão JWT corrente,
      // via `updateSession()` — sem isso o token só mudaria em um novo login.
      if (trigger === "update" && session) {
        const updatedUser = session.user as
          | { name?: string | null; email?: string | null; image?: string | null }
          | undefined;
        if (updatedUser?.name !== undefined) token.name = updatedUser.name;
        if (updatedUser?.email !== undefined) token.email = updatedUser.email;
        if (updatedUser?.image !== undefined) token.picture = updatedUser.image;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.perfis = token.perfis;
      return session;
    },
  },
});
