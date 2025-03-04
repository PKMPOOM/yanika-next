import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

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

        let response
        switch (session.user.role) {
            case "admin":
                const allUserCalendar = await prisma.timeSlot.findMany({
                    select: {
                        accept: true,
                        Day: true,
                        bookingType: true,
                        duration: true,
                        id: true,
                        start_time: true,
                        parsed_start_time: true,

                        Subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },

                    orderBy: {
                        Day: {
                            index: "asc",
                        },
                    },
                })
                response = allUserCalendar
                break
            case "user":
                const singleUserCalendar = await prisma.timeSlot.findMany({
                    where: {
                        userId: id,
                    },
                    include: {
                        Subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        Day: {
                            index: "asc",
                        },
                    },
                })
                response = singleUserCalendar
                break
        }

        return NextResponse.json(response)
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
