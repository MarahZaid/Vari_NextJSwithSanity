import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "./sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "./sanity/lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();
        if (!email || !password) return null;

        const customer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email });
        if (!customer || !customer.passwordHash) return null;

        const isValid = await bcrypt.compare(password, customer.passwordHash);
        if (!isValid) return null;

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          isAdmin: !!customer.isAdmin,
          points: customer.points || 0,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.points = user.points;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.points = token.points;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});