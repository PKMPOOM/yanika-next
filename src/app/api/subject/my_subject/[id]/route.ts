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

    let response;
    switch (session.user.role) {
      case "admin":
        const allUserCalendar = await prisma.timeSlot.findMany({
          include: {
            subject: {
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
        });
        response = allUserCalendar;
        break;
      case "user":
        const singleUserCalendar = await prisma.timeSlot.findMany({
          where: {
            userId: id,
          },
          include: {
            subject: {
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
        });
        response = singleUserCalendar;
        break;
    }

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
