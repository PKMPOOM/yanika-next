import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

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
            _count: true,
            // requestedClass: {
            //   orderBy: {
            //     requestAt: "asc",
            //   },
            //   include: {
            //     subject: {
            //       select: {
            //         name: true,
            //         id: true,
            //       },
            //     },
            //     User: {
            //       select: {
            //         name: true,
            //         email: true,
            //         id: true,
            //       },
            //     },
            //   },
            // },
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
                },
                subject: {
                  id: subject?.id,
                },
              }
            : null,
      })),
    }));

    return NextResponse.json({ timeSlot: formattedTimeSlot }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
