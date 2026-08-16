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

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.perfis = user.perfis as string[];
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
