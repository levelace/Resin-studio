import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";
import { isAdminEmail } from "./utils";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email & password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;
      return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  );
}

const isProd = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      // The __Secure- cookie name prefix is only allowed when secure=true, which
      // requires HTTPS. On a plain-HTTP dev server the browser silently drops the
      // cookie, so we only use the prefix in production.
      name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub;
        token.role = (user as { role?: string }).role ?? "customer";
      }
      if (token.email && isAdminEmail(token.email)) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "customer";
      }
      return session;
    },
  },
};
