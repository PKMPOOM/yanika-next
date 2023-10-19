import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const response = await prisma.requestedClass.findMany({
      orderBy: {
        day: "asc",
      },
    });

    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);

      return new Response("Invalid body", { status: 422 });
    }
    return new Response("Internal server error", { status: 500 });
  }
}
