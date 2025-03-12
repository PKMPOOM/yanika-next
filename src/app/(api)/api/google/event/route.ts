import { auth2Client } from "@/lib/GoogleUtils"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { stripeService } from "@/lib/stripe"
import dayjs, { Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { google } from "googleapis"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { ZodError } from "zod"

dayjs.extend(utc)
dayjs.extend(timezone)

type RequestSchema = {
    timeSlotId: string
    subjectId: string
    start_time: Dayjs
    class_duration: number
    students: string[]
    isPassed: boolean
    subject_name: string
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return new Response("Unauthenticated", { status: 401 })
    }

    if (session.user.role !== "admin") {
        return new Response("Unauthorized", { status: 401 })
    }

    const {
        class_duration,
        students,
        start_time,
        isPassed,
        subject_name,
        timeSlotId,
    }: RequestSchema = await req.json()

    const subject = await prisma.timeSlot.findUnique({
        where: {
            id: timeSlotId,
        },
        include: {
            Subject: true,
        },
    })

    if (!subject?.Subject?.stripe_price_id) {
        return new Response("Price id not found", { status: 404 })
    }

    // create booking history
    const bookingHistory = await prisma.bookingHistory.create({
        data: {
            amount: subject.totalPrice,
            status: "pending",
            userId: session.user.id,
            payment: {
                create: {
                    amount: subject.totalPrice,
                    amountDue: subject.totalPrice,
                    status: "pending",
                    priceId: subject.Subject.stripe_price_id,
                    userId: session.user.id,
                    paymentLink: "creating",
                },
            },
        },
    })

    try {
        const paymentLink = await stripeService.createPaymentLink({
            productId: subject.Subject.stripe_price_id,
            timeSlotId: timeSlotId,
            userId: session.user.id,
            amount: subject.duration,
        })

        const tokenResponse = await prisma.googleToken.findFirst({
            where: {
                integrationsId: "main_app",
            },
            select: {
                refresh_token: true,
                access_token: true,
            },
        })

        if (!tokenResponse) {
            return new Response("Can't connect to Google account", {
                status: 500,
            })
        }

        const { refresh_token, access_token } = tokenResponse

        const startTime = isPassed
            ? dayjs(start_time).add(7, "day")
            : dayjs(start_time)
        const endTime = startTime.add(class_duration, "hour")

        auth2Client.setCredentials({
            refresh_token: refresh_token,
            access_token: access_token,
        })

        const calendar = google.calendar({
            version: "v3",
            auth: auth2Client,
        })

        const response = await calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            sendUpdates: "all",
            requestBody: {
                summary: `${subject_name} class`,
                description: `🎓 Welcome to your ${subject_name} class session!
                              📌 IMPORTANT: Please complete payment before class

                              ================================================
                              💳 Payment Link: ${paymentLink.url}

                              Instructions:
                              1. Click the payment link above to complete payment
                              2. Join the meeting using the Google Meet link at scheduled time
                              3. Have your learning materials ready

                              Look forward to seeing you in class!`,
                start: {
                    dateTime: startTime.toISOString(),
                },
                end: {
                    dateTime: endTime.toISOString(),
                },
                conferenceData: {
                    createRequest: {
                        requestId: uuid(),
                    },
                },
                attendees: students.map((student) => ({ email: student })),
            },
        })

        if (response.status === 200) {
            await prisma.timeSlot.update({
                where: {
                    id: timeSlotId,
                },
                data: {
                    isScheduled: true,
                    meetingLink: response.data.hangoutLink,
                    eventID: response.data.id,
                    start_time: dayjs(
                        response.data.start?.dateTime
                    ).toISOString(),
                    scheduleDateTime: dayjs(
                        response.data.start?.dateTime
                    ).toISOString(),
                    bookingHistory: {
                        connect: {
                            id: bookingHistory.id,
                        },
                    },
                },
            })
            // add payment link to payment
            await prisma.payment.update({
                where: {
                    bookingHistoryId: bookingHistory.id,
                },
                data: {
                    paymentLink: paymentLink.url,
                },
            })
        } else {
            // delete booking history if event creation fails
            await prisma.bookingHistory.delete({
                where: {
                    id: bookingHistory.id,
                },
            })
        }

        return NextResponse.json({ data: "Event created successfully" })
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Bad request", { status: 400 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
