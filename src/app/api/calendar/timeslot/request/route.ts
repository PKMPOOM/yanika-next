import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // const isAdmin = session.user.role === "admin";
  try {
    const timeSlot = await prisma.day.findMany({
      include: {
        time_slot: {
          orderBy: {
            index: "asc",
          },
          select: {
            id: true,
            available: true,
            start_time: true,
            dayId: true,
            index: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: true,
          },
        },
      },
      orderBy: {
        index: "asc",
      },
    });

    const formattedTimeSlot = timeSlot.map((item) => ({
      ...item,
      time_slot: item.time_slot.map(({ user, subject, _count, ...rest }) => ({
        ...rest,
        selected: false,
        requestedClass: _count.requestedClass,
        bookingData:
          user && subject
            ? {
                user: {
                  id: user?.id,
                  name: user.name,
                },
                subject: {
                  id: subject?.id,
                  name: subject?.name,
                },
              }
            : null,
      })),
    }));

    return NextResponse.json(formattedTimeSlot);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
