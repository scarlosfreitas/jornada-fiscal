import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfis: string[];
      cargo: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    perfis?: string[];
    cargo?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    perfis: string[];
    cargo: string | null;
  }
}
