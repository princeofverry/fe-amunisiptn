import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuthApiHandler } from "@/http/auth/get-user";
import { loginApiHandler } from "@/http/auth/login";
import { User as Auth } from "@/types/user/user";
import { LoginType } from "@/validators/auth/login-validator";

declare module "next-auth" {
  interface User {
    id: string;
    token?: string;
  }

  interface Session {
    user: Auth;
    access_token: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as LoginType;
        if (!email || !password) return null;

        try {
          const res = await loginApiHandler({ email, password });
          if (!res?.user) return null;
          const user = {
            id: res.user.id,
            token: res.token,
          };

          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      // Intercept purely front-end fields on session update and store them in the JWT token
      if (trigger === "update" && session?.user) {
        token.userOverrides = {
          ...(token.userOverrides as any || {}),
          ...session.user,
        };
      }

      if (user) {
        token.access_token = (user as any).token;
        token.sub = String((user as any).id);
      }
      return token;
    },
    session: async ({ session, token }) => {
      const access_token = token.access_token as string;
      const auth = await getAuthApiHandler(access_token);

      // Merge fresh backend data with any front-end only overrides (like province, city) we stored
      const overrides = (token.userOverrides as any) || {};
      const mergedUser = { ...auth, ...overrides };

      return { ...session, user: mergedUser, access_token };
    },
  },
};

const authHandler = NextAuth(authOptions);
export default authHandler;
