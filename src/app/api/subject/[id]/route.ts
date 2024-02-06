import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// edit subject information
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const data = await req.json();
    const {
      subject_name,
      tags,
      description,
      single_price,
      group_price,
      grade,
      blockNoteData,
    } = data;

    await prisma.subject.update({
      where: {
        id: id,
      },
      data: {
        name: subject_name,
        description: description,
        course_outline: blockNoteData,
        grade: grade,
        group_price: (group_price && group_price) || 0,
        single_price,
        tags: tags,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

// get single subject information
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const subject = await prisma.subject.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ subject: subject }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

// delete single subject information
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    await prisma.subject.delete({
      where: {
        id,
      },
    });

    return new Response("DELETED", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
