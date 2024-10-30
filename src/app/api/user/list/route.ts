import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// get single user information
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthenticated", { status: 401 });
    }

    const userList = await prisma.user.findMany({
      where: {
        role: "user",
      },
      select: {
        id: true,
        name: true,
        image: true,
        accounts: {
          select: {
            provider: true,
          },
        },
        email: true,
      },
    });

    const addKeyedResponse = userList.map((user, index) => ({
      ...user,
      key: index,
    }));

    return NextResponse.json(addKeyedResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
