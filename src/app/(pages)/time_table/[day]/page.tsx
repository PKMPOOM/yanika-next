"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import { TodayClasses } from "@/Components/TimeTable/TimeTable";
import SingleDayTimeTableCard from "@/Components/TimeTable/SingleDayTimeCard";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { NewDateTimeMap } from "@/store/BookingModalStore";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    day: string;
  };
}

const SingleDayPage = ({ params }: PageProps) => {
  const { data: session } = useSession();
  const { day: dayID } = params;

  const fetcher = async () => {
    const res = await axios.get(`/api/calendar/time_table/${dayID}`);

    return res.data;
  };

  const { data: todayClass } = useQuery<TodayClasses[]>({
    queryFn: fetcher,
    queryKey: ["todayClass", dayID],
    refetchOnWindowFocus: false,
  });

  const TIMEGRIDHEIGHT = 50;

  if (!session) {
    return <Loader />;
  }

  if (session.user.role === "user") {
    redirect("/subjects");
  }

  if (!todayClass) {
    return <Loader />;
  }

  const objectKeys = Object.keys(NewDateTimeMap);

  return (
    <Container>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> Dashboard
                </Link>
              ),
            },
            {
              title: <Link href="/time_table">Time Table</Link>,
            },
            {
              title: <>{formattedUppercase(dayID)}</>,
            },
          ]}
        />
      </div>

      <div className="relative mt-6 flex h-[calc(100vh-200px)] flex-col items-start">
        {objectKeys.map((time, index) => {
          const dateTimeMap = NewDateTimeMap[time];
          const zero = dateTimeMap.m === 0;

          return (
            <div
              key={dateTimeMap.hour + index}
              style={{
                minHeight: `${TIMEGRIDHEIGHT}px`,
                height: `${TIMEGRIDHEIGHT}px`,
                boxSizing: "border-box",
              }}
              className="group/box relative flex w-full justify-end"
            >
              <div className="flex w-full">
                <div className="top-2 flex w-[5%] -translate-y-[10px] group-first/box:translate-y-0">
                  {zero && (
                    <p className="flex">
                      <span>{time}</span>
                    </p>
                  )}
                </div>
                <div
                  className={`flex h-1 w-[95%] grid-cols-7 border-t ${zero ? "border-slate-300" : "border-slate-200"
                    } `}
                >
                  {todayClass.map((item) => {
                    const parsedStartTime = dayjs(item.start_time).format(
                      "H:m",
                    );
                    const eventstart = `${dateTimeMap.hour}:${dateTimeMap.m}`;
                    const CurrentHourEvent = parsedStartTime === eventstart;

                    if (CurrentHourEvent) {
                      return (
                        <SingleDayTimeTableCard
                          TIMEGRIDHEIGHT={TIMEGRIDHEIGHT}
                          day={dayID}
                          item={item}
                          key={item.id}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default SingleDayPage;
