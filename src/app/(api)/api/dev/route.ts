import prisma from "@/lib/db"
import { stripeService } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest) {
    return NextResponse.json({ message: "Hello, world!" })
}
