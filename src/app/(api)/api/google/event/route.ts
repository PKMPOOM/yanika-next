import { auth2Client } from "@/lib/GoogleUtils";
import { prisma } from "@/lib/db";
import dayjs, { Dayjs } from "dayjs";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { stripe } from "@/lib/stripe";

dayjs.extend(utc);
dayjs.extend(timezone);

type RequestSchema = {
  timeSlotId: string;
  subjectId: string;
  start_time: Dayjs;
  class_duration: number;
  students: string[];
  isPassed: boolean;
  subject_name: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthenticated", { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    class_duration,
    students,
    start_time,
    isPassed,
    subject_name,
    timeSlotId,
  }: RequestSchema = await req.json();

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: "price_1QocgpQ2QiWoxqcrKq3rXYA8", // Must be a pre-created Stripe Price ID
        quantity: 1,
      },
    ],
    invoice_creation: {
      enabled: true,
    },
  });


  try {
    const tokenResponse = await prisma.googleToken.findFirst({
      where: {
        integrationsId: "main_app",
      },
      select: {
        refresh_token: true,
        access_token: true,
      },
    });

    if (!tokenResponse) {
      return new Response("Can't connect to Google account", { status: 500 });
    }

    const { refresh_token, access_token } = tokenResponse;

    const startTime = isPassed
      ? dayjs(start_time).add(7, "day")
      : dayjs(start_time);
    const endTime = startTime.add(class_duration, "hour");

    auth2Client.setCredentials({
      refresh_token: refresh_token,
      access_token: access_token,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: auth2Client,
    });

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: `${subject_name} class`,
        description: `Payment Link: ${paymentLink.url}`,
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
        conferenceData: {
          createRequest: {
            requestId: uuid(),
          },
        },
        attendees: students.map((student) => ({ email: student })),
      },
    });

    if (response.status === 200) {
      await prisma.timeSlot.update({
        where: {
          id: timeSlotId,
        },
        data: {
          isScheduled: true,
          meetingLink: response.data.hangoutLink,
          eventID: response.data.id,
          start_time: dayjs(response.data.start?.dateTime).toISOString(),
          scheduleDateTime: dayjs(response.data.start?.dateTime).toISOString(),
          // bookingHistory: {
          //   create: {
          //     amount: 1,
          //     status: "pending",
          //     userId: session.user.id,
          //     payment: {
          //       create: {
          //         amount: 0,
          //         status: "pending",
          //         priceId: "price_1QocgpQ2QiWoxqcrKq3rXYA8",
          //         userId: session.user.id,
          //       },
          //     },
          //   },
          // },
        },
      });
    }

    return NextResponse.json({ data: "response.data" });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Bad request", { status: 400 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
