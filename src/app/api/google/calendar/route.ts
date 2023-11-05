import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getToken } from "@/lib/GoogleUtils";
import dayjs from "dayjs";
import axios from "axios";

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

    if (res?.status === 200 && tokens) {
      console.log(JSON.stringify({ tokens }, null, 2));

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      );
      console.log(response.data.email);

      await prisma.$transaction([
        prisma.googleToken.upsert({
          where: {
            integrationsId: "main_app",
          },
          update: {
            email: response.data.email,
            refresh_token: tokens.refresh_token!,
            id_token: tokens.id_token!,
            scope: tokens.scope!,
            token_type: tokens.token_type!,
            access_token: tokens.access_token!,
            expire_at: dayjs(tokens.expiry_date!).toDate(),
          },
          create: {
            refresh_token: tokens.refresh_token!,
            id_token: tokens.id_token!,
            scope: tokens.scope!,
            token_type: tokens.token_type!,
            access_token: tokens.access_token!,
            expire_at: dayjs(tokens.expiry_date!).toDate(),
            email: response.data.email,
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
        }),
        prisma.integrations.update({
          where: {
            id: "main_app",
          },
          data: {
            GoogleCalendarConnect: true,
          },
        }),
      ]);
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
