import prisma from "@/lib/db"
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

        if (!session) {
            return new Response("Unauthenticated", { status: 401 })
        }

        const userId = session.user.id

        const pointsHistory = await prisma.pointHistory.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(pointsHistory)
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
