import { ZodError } from "zod";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: { persistSession: false },
  },
);

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const formData = await req.formData();
    const file = formData.get("file");

    if (file instanceof Blob) {
      const fileName = id + "/" + file.name;
      const buffer = await file.arrayBuffer();

      const { data, error } = await supabase.storage
        .from("subject_image")
        .upload(fileName, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        return NextResponse.json({ error }, { status: 500 });
      }

      const Url = `https://kgjimzdelnpigevgscbx.supabase.co/storage/v1/object/public/subject_image/${data.path}`;

      await prisma.subject.update({
        where: {
          id,
        },
        data: {
          image_url: Url,
        },
      });

      return NextResponse.json({ Url: Url }, { status: 200 });
    }

    return new Response("Invalid file", { status: 422 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.error("Internal server error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
