import { auth2Client } from "@/lib/GoogleUtils";
import { prisma } from "@/lib/db";
import dayjs, { Dayjs } from "dayjs";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

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
    subjectId,
    start_time,
    isPassed,
    subject_name,
    timeSlotId,
  }: RequestSchema = await req.json();

  try {
    const tokenResponse = await prisma.googleToken.findFirst({
      where: {
        integrationsId: "main_app",
      },
      select: {
        refresh_token: true,
      },
    });

    if (!tokenResponse) {
      return new Response("Can't connect to Google account", { status: 500 });
    }

    const { refresh_token } = tokenResponse;

    let startTime = isPassed
      ? dayjs(start_time).add(7, "day")
      : dayjs(start_time);
    let endTime = startTime.add(class_duration, "hour");

    console.log({
      startTime: startTime.format("DD MMM YYYY H:mm"),
      endTime: endTime.format("DD MMM YYYY H:mm"),
    });

    console.log({
      class_duration,
      students,
      subjectId,
      start_time,
      isPassed,
      subject_name,
      timeSlotId,
    });

    auth2Client.setCredentials({ refresh_token: refresh_token });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: auth2Client,
      calendarId: "primary",
      conferenceDataVersion: 1,

      requestBody: {
        summary: `${subject_name} class with Kru Meen`,
        description: "test event crete by API",
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
      await prisma.newTimeSlot.update({
        where: {
          id: timeSlotId,
        },
        data: {
          isScheduled: true,
          meetingLink: response.data.hangoutLink,
        },
      });
    }

    // response.data.hangoutLink

    // return NextResponse.json({});
    return NextResponse.json({ data: response.data });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(JSON.stringify(error, null, 2));
      return new Response("Bad request", { status: 400 });
    }
    console.log(JSON.stringify(error, null, 2));
    return new Response("Internal server error", { status: 500 });
  }
}
