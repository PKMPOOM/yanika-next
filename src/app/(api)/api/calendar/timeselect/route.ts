import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const timeSlot = await prisma.day.findMany({
            include: {
                TimeSlot: true,
            },
            orderBy: {
                index: "asc",
            },
        })

        return NextResponse.json([...timeSlot])
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
