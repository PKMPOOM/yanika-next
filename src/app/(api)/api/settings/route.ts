import prisma from "@/lib/db"
import "dayjs/locale/th"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(req: Request) {
    try {
        const { email, id } = await req.json()

        await prisma.user.update({
            where: {
                id,
            },
            data: {
                email: email,
            },
        })

        return NextResponse.json({})
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
