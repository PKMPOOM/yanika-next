import { systemRoles } from "@/interface/interface"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { customSession } from "better-auth/plugins"
import prisma from "./db"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

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
            const role = await getUserRole(user.email)
            return {
                user: {
                    role: role as systemRoles,
                    ...user,
                },
                session,
            }
        }),
    ],
})

const getUserRole = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    return user?.role
}
