import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { userSubscriptions } from "./schema";
import { eq } from "drizzle-orm";
import { redis } from "./redis";

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [Google, GitHub],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      try {
        const userPlanCache = await redis.get(`userPlan_${user.id}`);
        if(userPlanCache) return session;
        const existingSubscription = await db.select()
          .from(userSubscriptions)
          .where(eq(userSubscriptions.userId, user.id));
        if (existingSubscription.length === 0) {
          await db.insert(userSubscriptions).values({
            userId: user.id,
            subscriptionId: 1,
            startDate: new Date(), // Current date
            endDate: null, // Far-future date
          });
        }
      } catch (error) {
        console.log("Error Setting up token", error);
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login', // Custom sign-in page
    error: '/error', // Error page
  }
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth, signOut
} = NextAuth(authConfig);