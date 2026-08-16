import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfis: string[];
    } & DefaultSession["user"];
  }

  interface User {
    perfis?: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    perfis: string[];
  }
}
