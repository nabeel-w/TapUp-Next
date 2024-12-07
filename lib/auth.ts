import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [Google, GitHub],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session;
    }
  },
  pages: {
    signIn: '/auth/login', // Custom sign-in page
    error: '/auth/error', // Error page
  }
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth, signOut
} = NextAuth(authConfig);