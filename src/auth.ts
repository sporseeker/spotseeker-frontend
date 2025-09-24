import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { NextAuthConfig, Session } from "next-auth";
import type { UserType, UserResponseType } from "@/types/user";
import { AdapterUser } from "next-auth/adapters";
import { ProviderType } from "@/types/login";
import { JWT } from "next-auth/jwt";

import { IApiResponse } from "@/types/response";
import { userLogin } from "./services/auth-service";
import axios from "axios";

declare module "next-auth" {
  interface User extends UserType {}
}

declare module "next-auth/adapters" {
  interface AdapterUser extends UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {}
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      authorize: async (credentials) => {
        try {
          const user = await userLogin(
            typeof credentials.email === "string" ? credentials.email : "",

            typeof credentials.password === "string"
              ? credentials.password
              : "",
          );

          return !!user.data.status ? user.data.data : null;
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { scope: "openid email profile" } },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.phone_no = user.phone_no;
        token.nic = user.nic;
        token.verified = user.verified;
      }
      if (account?.access_token) {
        try {
          const user = await fetchUser(
            account.provider as ProviderType,
            account.access_token,
          );
          if (!!user.status && user.data) {
            // token.id = user.data.username as string;
            token.role = user.data.role;
            token.email = user.data.email;
            token.token = user.data.token;
            token.first_name = user.data.first_name;
            token.last_name = user.data.last_name;
            token.phone_no = user.data.phone_no;
            token.nic = user.data.nic;
            token.verified = user.data.verified;
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
        return token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const userObject: AdapterUser = {
        id: token.id,
        role: token.role,
        token: token.token,
        first_name: token.first_name,
        last_name: token.last_name,
        phone_no: token.phone_no,
        nic: token.nic,
        email: token.email ? token.email : "",
        emailVerified: null,
        verified: token?.verified ?? false,
      };

      session.user = userObject;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = !nextUrl.pathname.startsWith("/auth/signin");
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  cookies: {
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: "spotseeker-next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
} satisfies NextAuthConfig;

const fetchUser = async (type: ProviderType, token: string) => {
  const response = await axios.post<IApiResponse<UserResponseType>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/socialLogin`,
    {
      token,
      provider: type,
    },
    {
      withXSRFToken: true,
    },
  );
  return response.data;
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
