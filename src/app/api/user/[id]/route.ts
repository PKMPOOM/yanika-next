import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// get single subject information
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const id = params.id;

    if (!session) {
      return new Response("Unauthenticated", { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        accounts: {
          select: {
            provider: true,
            type: true,
            scope: true,
            providerAccountId: true,
          },
        },
        time_slot: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                grade: true,
                group_price: true,
                single_price: true,
                image_url: true,
                update_at: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(userData);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
