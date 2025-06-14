// This is not edge safe. This config runs on the central servers
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  events:{
    async linkAccount({user}) {
      await db.user.update({
        where: {id: user.id},
        data:{ emailVerified: new Date()}
      }) 
    }
  },
  callbacks: {
    async session({ token, session }) {
      if(token.sub && session.user) 
        session.user.id = token.sub;
      return session
    },
    async jwt({ token }) {
      if(!token.sub) return token;
      
      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;

      return token
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db as any),
  session: { strategy: "jwt" },
  ...authConfig,
})