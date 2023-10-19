import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { requestClassSchema } from "@/interface/payload_validator";
import type { DayList } from "@/interface/timeslot_interface";

type requestDBschema = {
  day: DayList;
  timeSlotId: string;
  subjectId: string;
  userId: string;
}[];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data } = await req.json();
  const userID = session.user.id;

  try {
    const { SelectedClass, SelectedDateTime } = requestClassSchema.parse(data);

    let POSTData: requestDBschema = [];

    SelectedDateTime.forEach((item) => {
      item.time.forEach((time) => {
        const data = {
          day: item.day,
          timeSlotId: `${item.day}_${time}`,
          subjectId: SelectedClass.subjectID,
          userId: userID,
        };
        POSTData.push(data);
      });
    });

    await prisma.requestedClass.createMany({
      data: POSTData,
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);

      return new Response("Bad request", { status: 400 });
    }
    console.log(error);

    return new Response("Internal server error", { status: 500 });
  }
}
