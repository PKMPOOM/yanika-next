import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { groupBy } from "lodash-es"
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return new Response("Unauthenticated", { status: 401 })
    }

    if (session.user.role !== "admin") {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const response = await prisma.timeSlot.findMany({
            include: {
                Subject: {
                    select: {
                        id: true,
                        name: true,
                        image_url: true,
                    },
                },
                Day: {
                    select: {
                        index: true,
                    },
                },
            },
            orderBy: {
                Day: {
                    index: "asc",
                },
            },
        })

        const groupedResponse = groupBy(response, (e) => e.dayId)

        return NextResponse.json(groupedResponse)
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
