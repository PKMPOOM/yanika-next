import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { randomUUID } from "crypto"
import { headers } from "next/headers"
import { ZodError } from "zod"

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return new Response("Unauthenticated", { status: 401 })
    }

    const { data } = await req.json()
    const userID = session.user.id
    const email = session.user.email

    try {
        const {
            classDuration,
            parsed_start_time,
            startTime,
            selectedDay,
            SelectedClass,
        } = data

        await prisma.timeSlot.create({
            data: {
                id: randomUUID(),
                start_time: startTime,
                parsed_start_time: parsed_start_time,
                duration: classDuration,
                userBooked: [email ? email : userID],
                bookingType: SelectedClass.classType,
                totalPrice: SelectedClass.classPrice * classDuration,
                user: {
                    connect: {
                        id: userID,
                    },
                },
                Day: {
                    connect: {
                        id: selectedDay,
                    },
                },
                Subject: {
                    connect: {
                        id: SelectedClass.subjectID,
                    },
                },
            },
        })

        return new Response("OK", { status: 200 })
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Bad request", { status: 400 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
