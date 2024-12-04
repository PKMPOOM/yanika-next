import { prisma } from "@/lib/db";
import "dayjs/locale/th";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { auth2Client } from "@/lib/GoogleUtils";
import { google } from "googleapis";
import { deleteGoogleIntegration, getGoogleIntegration } from "./service";

export async function GET() {
  try {
    const integrationData = await getGoogleIntegration();

    if (!integrationData) {
      return new Response("Integration Data Not Found", { status: 404 });
    }

    return NextResponse.json(integrationData);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid body", { status: 422 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

// DELETE TOKEN INTEGRATIONS
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const isExist = await prisma.googleToken.findFirst({
      where: {
        integrationsId: "main_app",
      },
    });

    if (!isExist) {
      return new Response("Can't find Google integration", { status: 404 });
    }

    await deleteGoogleIntegration();

    return NextResponse.json({ data: "success" });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}

// check if google calendar is connected
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthenticated", { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  const tokenResponse = await prisma.googleToken.findFirst({
    where: {
      integrationsId: "main_app",
    },
  });

  if (!tokenResponse) {
    return new Response("Can't find Google integration", { status: 404 });
  }
  const { refresh_token, access_token } = tokenResponse;

  // check with google api if the calendar is connected
  auth2Client.setCredentials({
    refresh_token: refresh_token,
    access_token: access_token,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: auth2Client,
  });

  try {
    await calendar.calendarList.list();
  } catch (error) {
    console.log(error);
    await deleteGoogleIntegration();
    return NextResponse.json({ data: false }, { status: 500 });
  }

  return NextResponse.json({ data: true });
}
