import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { headers } from "next/headers"

// get single subject information
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        const id = params.id

        if (!session) {
            return new Response("Unauthenticated", { status: 401 })
        }

        const userData = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                totalPoints: true,
                Account: {
                    select: {
                        providerId: true,
                        accessToken: true,
                        refreshToken: true,
                        accessTokenExpiresAt: true,
                        refreshTokenExpiresAt: true,
                        scope: true,
                        idToken: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                TimeSlot: {
                    include: {
                        Subject: {
                            select: {
                                id: true,
                                name: true,
                                grade: true,
                                group_price: true,
                                single_price: true,
                                image_url: true,
                                update_at: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(userData)
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
