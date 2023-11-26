import { prisma } from "@/lib/db";
import { Days } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// edit subject information
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    const [bookedUserID] = await prisma.$transaction([
      prisma.newTimeSlot.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      }),

      prisma.newTimeSlot.delete({
        where: { id },
      }),
    ]);

    if (!bookedUserID) {
      return new Response("Not found", { status: 404 });
    }

    const LineUserid = await prisma.user.findUnique({
      where: {
        id: bookedUserID.userId,
      },
      select: {
        accounts: {
          select: {
            providerAccountId: true,
          },
        },
      },
    });

    if (!LineUserid) {
      return new Response("LineUserid Not found", { status: 404 });
    }

    return NextResponse.json(LineUserid.accounts[0].providerAccountId);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const [bookedUserID] = await prisma.$transaction([
      prisma.newTimeSlot.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      }),

      prisma.newTimeSlot.update({
        where: { id },
        data: {
          accept: true,
        },
      }),
    ]);

    if (!bookedUserID) {
      return new Response("Not found", { status: 404 });
    }

    const LineUserid = await prisma.user.findUnique({
      where: {
        id: bookedUserID.userId,
      },
      select: {
        accounts: {
          select: {
            providerAccountId: true,
          },
        },
      },
    });

    if (!LineUserid) {
      return new Response("LineUserid Not found", { status: 404 });
    }

    return NextResponse.json(LineUserid.accounts[0].providerAccountId);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    console.log(id);

    const todayClass = await prisma.newTimeSlot.findMany({
      where: {
        dayId: id as Days,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
        Day: {
          select: {
            index: true,
          },
        },
      },
      orderBy: {
        Day: {
          index: "asc",
        },
      },
    });

    return NextResponse.json([...todayClass]);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
