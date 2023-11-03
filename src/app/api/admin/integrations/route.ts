import { auth2Client } from "@/lib/GoogleUtils";
import { prisma } from "@/lib/db";
import axios from "axios";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import "dayjs/locale/th";

export async function GET() {
  try {
    let accessToken;

    const integrationData = await prisma.integrations.findFirst({
      where: {
        id: "main_app",
      },
      include: {
        GoogleToken: true,
      },
    });

    if (!integrationData) {
      return new Response("Integration Data Not Found", { status: 404 });
    }

    const { GoogleToken, ...rest } = integrationData;

    if (!GoogleToken) {
      return new Response("Can't connect to Google account", { status: 500 });
    }

    const isTokenExpired = dayjs().isAfter(dayjs(GoogleToken.expire_at));
    // dayjs(parseInt(GoogleToken.expiry_date)),

    if (isTokenExpired) {
      auth2Client.setCredentials({
        refresh_token: GoogleToken.refresh_token,
      });
      const { res } = await auth2Client.getAccessToken();

      const { access_token, token_type, id_token, expiry_date, refresh_token } =
        res?.data;

      accessToken = access_token;

      await prisma.integrations.update({
        where: { id: "main_app" },
        data: {
          GoogleToken: {
            update: {
              access_token: access_token,
              expiry_date: expiry_date.toString(),
              id_token: id_token,
              token_type: token_type,
              refresh_token: refresh_token,
              expire_at: dayjs(expiry_date).toISOString(),
            },
          },
        },
      });
    }

    accessToken = GoogleToken?.access_token;

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const resData = {
      googleAuthUserData: response.data,
      integrationData: rest,
    };

    return NextResponse.json(resData);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
