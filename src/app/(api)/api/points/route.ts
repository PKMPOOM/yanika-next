import prisma from "@/lib/db"
import "dayjs/locale/th"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "admin") {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const { userId, points } = await req.json()

        await prisma.$transaction([
            prisma.pointHistory.create({
                data: {
                    action: "add",
                    amount: points,
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            }),
            prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    totalPoints: {
                        increment: points,
                    },
                },
            }),
        ])

        return NextResponse.json({})
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
