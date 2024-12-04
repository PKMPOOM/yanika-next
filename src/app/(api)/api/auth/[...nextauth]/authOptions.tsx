import type { DefaultSession, NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcrypt";
import { systemRoles } from "@/interface/interface";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: systemRoles;
    } & DefaultSession["user"];
  }

  interface User {
    role: systemRoles;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: systemRoles;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      const db_user = user;

      if (user) {
        token.id = db_user.id;
        token.role = db_user.role;
      }

      if (trigger === "update" && session?.email) {
        token.email = session.email;
      }

      return token;
    },
    session: ({ session, token }) => {
      const { email, name, picture, role, id } = token;

      if (token) {
        session.user.id = id;
        session.user.name = name;
        session.user.email = email;
        session.user.image = picture;
        session.user.role = role;
      }

      return session;
    },
  },
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signIn",
  },
};
