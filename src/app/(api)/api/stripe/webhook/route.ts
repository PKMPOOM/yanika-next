import prisma from "@/lib/db"
import { stripeService } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string
    const sig = request.headers.get("stripe-signature")
    const rawBody = await request.text()

    if (!sig || !rawBody) {
        return NextResponse.json(
            { error: "Missing signature or body" },
            { status: 400 }
        )
    }

    const event = await stripeService.verifyWebhook(
        rawBody,
        sig,
        endpointSecret
    )

    const FIXED_PRICE = 20000

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object
            const customerEmail = session.customer_details?.email
            const paymentStatus = session.payment_status
            const createAt = session.created
            const amount_total = session.amount_total
            const totalPoints = amount_total ? amount_total / FIXED_PRICE : 0
            const paymentId = session.id

            // add points to user by user email
            try {
                if (customerEmail && paymentStatus === "paid") {
                    await addPointsToUser(customerEmail, totalPoints)
                }
            } catch (error) {
                console.error("Webhook error:", error)
                return NextResponse.json(
                    { error: "Webhook handler failed" },
                    { status: 500 }
                )
            }

        default:
            // Acknowledge receipt of unknown event types
            return NextResponse.json({ message: "Received" }, { status: 200 })
    }
}

const addPointsToUser = async (email: string, points: number) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            totalPoints: {
                increment: points,
            },
        },
    })

    await prisma.pointHistory.create({
        data: {
            action: "add",
            amount: points,
            User: {
                connect: {
                    id: user.id,
                },
            },
        },
    })
}

// const handleCheckoutSessionCompleted = async ({
//     metadata,
//     name,
//     email,
//     paymentLink,
//     invoiceId,
// }: completedSessionPayload) => {
//     const bookingHistory = await prisma.bookingHistory.findMany({
//         where: {
//             timeSlotId: metadata.timeSlotId,
//         },
//     })

//     if (bookingHistory.length === 0) {
//         throw new Error("Booking history not found")
//     }

//     let invoiceUrl = ""
//     if (invoiceId) {
//         const url = await stripeService.getInvoiceUrl(invoiceId)
//         invoiceUrl = url as string
//     }

//     const bookingHistoryId = bookingHistory[0].id

//     await prisma.bookingHistory.update({
//         where: {
//             id: bookingHistoryId,
//         },
//         data: {
//             status: "paid",
//             payment: {
//                 update: {
//                     status: "paid",
//                     customerEmail: email,
//                     customerName: name,
//                     paymentLink: paymentLink,
//                     stripeInvoiceId: invoiceId,
//                     hostedInvoiceUrl: invoiceUrl,
//                 },
//             },
//         },
//     })
// }

export async function GET(_: NextRequest) {
    return NextResponse.json({ message: "Hello, world!" })
}
