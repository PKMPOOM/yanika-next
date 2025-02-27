import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"
import { customSession } from "better-auth/plugins"
import { systemRoles } from "@/interface/interface"

const prisma = new PrismaClient()
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    // session: {
    //     fields: {
    //         expiresAt: "expires", // e.g., "expires_at" or your existing field name
    //         token: "sessionToken", // e.g., "session_token" or your existing field name
    //     },
    // },
    // accounts: {
    //     fields: {
    //         accountId: "providerAccountId",
    //         refreshToken: "refresh_token",
    //         accessToken: "access_token",
    //         accessTokenExpiresAt: "access_token_expires",
    //         idToken: "id_token",
    //     },
    // },

    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    plugins: [
        customSession(async ({ user, session }) => {
            return {
                user: {
                    role: "user" as systemRoles,
                    ...user,
                },
                session,
            }
        }),
    ],
})
