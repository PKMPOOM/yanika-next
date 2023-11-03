import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getToken } from "@/lib/GoogleUtils";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { code } = await req.json();
    const { res, tokens } = await getToken(code);

    if (!session) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (session?.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    if (res?.status === 200 && tokens && session) {
      await prisma.googleToken.upsert({
        where: {
          integrationsId: "main_app",
        },
        update: {},
        create: {
          refresh_token: tokens.refresh_token!,
          expiry_date: tokens.expiry_date?.toString()!,
          id_token: tokens.id_token!,
          scope: tokens.scope!,
          token_type: tokens.token_type!,
          access_token: tokens.access_token!,
          expire_at: dayjs(tokens.expiry_date!).toDate(),
          Integrations: {
            connectOrCreate: {
              where: {
                id: "main_app",
              },
              create: {
                id: "main_app",
              },
            },
          },
        },
      });
    }

    return NextResponse.json({});
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
