import { prisma } from "@/lib/db"
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

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object

            if (!session.metadata?.timeSlotId || !session.metadata?.userId) {
                return NextResponse.json(
                    { error: "Missing metadata" },
                    { status: 400 }
                )
            }

            try {
                await handleCheckoutSessionCompleted({
                    metadata: {
                        timeSlotId: session.metadata?.timeSlotId,
                        userId: session.metadata?.userId,
                    },
                    name: session.customer_details?.name ?? "",
                    email: session.customer_details?.email ?? "",
                    invoiceId:
                        typeof session.invoice === "string"
                            ? session.invoice
                            : undefined,
                })
                return NextResponse.json(
                    { message: "success" },
                    { status: 200 }
                )
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

type completedSessionPayload = {
    metadata: {
        timeSlotId: string
        userId: string
    }
    name: string
    email: string
    paymentLink?: string
    invoiceId?: string
}

const handleCheckoutSessionCompleted = async ({
    metadata,
    name,
    email,
    paymentLink,
    invoiceId,
}: completedSessionPayload) => {
    const bookingHistory = await prisma.bookingHistory.findMany({
        where: {
            timeSlotId: metadata.timeSlotId,
        },
    })

    if (bookingHistory.length === 0) {
        throw new Error("Booking history not found")
    }

    let invoiceUrl = ""
    if (invoiceId) {
        const url = await stripeService.getInvoiceUrl(invoiceId)
        invoiceUrl = url as string
    }

    const bookingHistoryId = bookingHistory[0].id

    await prisma.bookingHistory.update({
        where: {
            id: bookingHistoryId,
        },
        data: {
            status: "paid",
            payment: {
                update: {
                    status: "paid",
                    customerEmail: email,
                    customerName: name,
                    paymentLink: paymentLink,
                    stripeInvoiceId: invoiceId,
                    hostedInvoiceUrl: invoiceUrl,
                },
            },
        },
    })
}

export async function GET(_: NextRequest) {
    return NextResponse.json({ message: "Hello, world!" })
}
