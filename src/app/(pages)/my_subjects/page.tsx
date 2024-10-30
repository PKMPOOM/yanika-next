import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { Button, Empty } from "antd";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { EyeOutlined } from "@ant-design/icons";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Asia/Bangkok";

export default async function MySubjects() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <Loader />;
  }

  if (session?.user.role === "admin") {
    return redirect("/subjects");
  }

  const myBookedSuybject = await prisma.timeSlot.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subject: {
        select: {
          description: true,
          grade: true,
          image_url: true,
          tags: true,
          name: true,
        },
      },
    },
    orderBy: {
      Day: {
        index: "asc",
      },
    },
  });

  return (
    <Container>
      {myBookedSuybject.length === 0 ? (
        <div>
          <Empty />
        </div>
      ) : (
        <div className=" flex flex-col gap-3">
          {myBookedSuybject.map((timeSlot) => {
            const isAccept = timeSlot.accept === true;
            const isPassed = dayjs().isAfter(dayjs(timeSlot.start_time));

            let startTime = isPassed
              ? dayjs(timeSlot.start_time).add(7, "day")
              : dayjs(timeSlot.start_time);
            let endTime = startTime.add(timeSlot.duration, "hour");

            return (
              <div
                key={timeSlot.id}
                className={` rounded-md border  p-3 ${
                  isAccept
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-orange-500 bg-orange-50"
                }`}
              >
                {/* status */}
                <div className=" flex items-baseline gap-2 text-sm">
                  <p className="">Status: </p>
                  <p
                    className={`${
                      isAccept ? "text-emerald-500" : "text-orange-500"
                    } font-semibold `}
                  >
                    {isAccept ? "Accepted" : " Reviewing"}
                  </p>
                </div>

                {/* class detail */}
                <div className=" mt-4 flex items-start justify-between gap-2">
                  <div className="flex flex-col  items-baseline justify-between text-base  text-slate-800">
                    <p className=" font-semibold">{timeSlot.subject?.name}</p>
                    <div className=" text-sm">
                      <p className="">
                        {dayjs.tz(timeSlot.start_time, tz).format("dddd H:mm")}{" "}
                        Hrs.
                      </p>
                      <p>
                        <span className=" font-semibold">
                          {timeSlot.totalPrice} THB{" "}
                        </span>
                        {timeSlot.duration} Hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" mt-4 flex">
                  <Link
                    href={`/subjects/${timeSlot.subjectId}`}
                    style={{ width: "100%" }}
                  >
                    <Button block icon={<EyeOutlined />}>
                      Subject
                    </Button>
                  </Link>
                </div>

                {timeSlot.isScheduled && timeSlot.meetingLink && (
                  <div className=" mt-3 flex flex-col gap-1 rounded border border-emerald-500 bg-emerald-100 p-2 text-sm">
                    {` Next class on 
                    ${dayjs.tz(startTime, tz).format("DD MMM H:mm")}  - ${dayjs
                      .tz(endTime, tz)
                      .format("H:mm")}`}
                    <Link
                      href={timeSlot.meetingLink}
                      target="_blank"
                      style={{ width: "100%" }}
                    >
                      <Button block>Join with Google meet </Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
