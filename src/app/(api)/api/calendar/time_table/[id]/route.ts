import prisma from "@/lib/db"
import { Days } from "@prisma/client"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

// edit subject information
export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id

        const [bookedUserID] = await prisma.$transaction([
            prisma.timeSlot.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true,
                },
            }),

            prisma.timeSlot.delete({
                where: { id },
            }),
        ])

        if (!bookedUserID?.userId) {
            return new Response("Not found", { status: 404 })
        }

        return NextResponse.json({})
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}

export async function PUT(_: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id

        await prisma.$transaction([
            prisma.timeSlot.update({
                where: { id },
                data: {
                    accept: true,
                },
            }),
        ])

        return NextResponse.json({})
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id

        const todayClass = await prisma.timeSlot.findMany({
            where: {
                dayId: id as Days,
            },
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
                bookingHistory: {
                    include: {
                        payment: true,
                    },
                    take: 1,
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },

            orderBy: {
                Day: {
                    index: "asc",
                },
            },
        })

        const mapped = todayClass.map((item) => {
            const { bookingHistory, ...rest } = item
            return {
                ...rest,
                bookingHistory: bookingHistory[0] ?? null,
            }
        })

        return NextResponse.json([...mapped])
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
