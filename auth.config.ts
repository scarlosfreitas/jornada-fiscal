import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnApp = request.nextUrl.pathname.startsWith("/app");

      if (isOnApp) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
