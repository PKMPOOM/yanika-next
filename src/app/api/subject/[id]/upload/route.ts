import { prisma } from "@/lib/db";
import { ZodError } from "zod";
import { createSubjectSchema } from "@/interface/payload_validator";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  try {
    const id = params.id;

    return new Response("Success create new subject", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
}
