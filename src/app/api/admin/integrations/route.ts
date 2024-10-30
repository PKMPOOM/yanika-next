import { prisma } from "@/lib/db";
import "dayjs/locale/th";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const integrationData = await prisma.integrations.findUnique({
      where: {
        id: "main_app",
      },
      include: {
        GoogleToken: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!integrationData) {
      return new Response("Integration Data Not Found", { status: 404 });
    }

    console.log(integrationData);

    return NextResponse.json(integrationData);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
