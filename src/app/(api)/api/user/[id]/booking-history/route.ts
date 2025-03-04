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

        const userData = await prisma.user.findUnique({
            where: {
                id: params.id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                TimeSlot: {
                    select: {
                        accept: true,
                        start_time: true,
                        parsed_start_time: true,
                        duration: true,
                        dayId: true,
                        Subject: {
                            select: {
                                name: true,
                            },
                        },
                        totalPrice: true,
                        scheduleDateTime: true,
                    },
                },
            },
        })

        if (!userData) {
            return new Response("User not found", { status: 404 })
        }

        return NextResponse.json(userData)
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
