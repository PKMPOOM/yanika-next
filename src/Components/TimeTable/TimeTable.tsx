"use client";

import { DayList } from "@/interface/timeslot_interface";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { NewDateTimeMap } from "@/store/BookingModalStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { LuEye } from "react-icons/lu";
import { z } from "zod";
import Loader from "../Global/Loader";
import WeeklyTimeTableCard from "./WeeklyTimeCard";

export type TimeTableResponse = {
  [key in DayList]: TodayClasses[];
};

export type TodayClasses = {
  id: string;
  index: number;
  start_time: Dayjs | Date;
  parsed_start_time: string;
  duration: number;
  dayId: DayList;
  subjectId: string | null;
  userBooked: string[];
  accept: boolean;
  bookingType: "single" | "group";
  totalPrice: number;
  isScheduled: boolean;
  meetingLink: string;
  Subject?: {
    id: string;
    name: string;
    image_url: string;
  };
};

export const todayClassSchema = z.object({
  id: z.string(),
  index: z.number(),
  start_time: z.date(),
  parsed_start_time: z.string(),
  duration: z.number(),
  dayId: z.string(),
  subjectId: z.string().nullable(),
  userBooked: z.array(z.string()),
  accept: z.boolean(),
  bookingType: z.union([z.literal("single"), z.literal("group")]),
  totalPrice: z.number(),
  isScheduled: z.boolean(),
  meetingLink: z.string(),
  subject: z
    .object({
      id: z.string(),
      name: z.string(),
      image_url: z.string(),
    })
    .nullable(),
  Day: z
    .object({
      index: z.number(),
    })
    .nullable(),
});

const daysArray: DayList[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const AVAILABLEDAYS: DayList[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const TimeTable = () => {
  const fetchData = async () => {
    const res = await axios.get<TimeTableResponse>("api/calendar/time_table");

    return res.data;
  };

  const { data: requestClassList } = useQuery({
    queryFn: fetchData,
    queryKey: ["admin_time_table"],
    refetchOnWindowFocus: false,
  });

  if (!requestClassList) {
    return <Loader />;
  }

  const TIMEGRIDHEIGHT = 50;
  const objectKeys = Object.keys(NewDateTimeMap);

  return (
    <div className="">
      <div className="flex w-full justify-end">
        <div className="-top-12 float-right grid w-[95%] grid-cols-7">
          {daysArray.map((day, index) => {
            const isAvailable = AVAILABLEDAYS.includes(day);
            return (
              <Link
                href={`/time_table/${day}`}
                key={day + index}
                className="group flex items-center justify-between overflow-hidden rounded-md px-2 py-1 text-slate-800 hover:bg-slate-50"
              >
                <div>
                  <p>{formattedUppercase(day)}</p>
                  <p className="text-xs text-slate-500">
                    {isAvailable ? "Available" : "Break"}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <LuEye /> <p className="text-xs">View</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex h-[calc(100vh-148px)] flex-col items-start justify-start overflow-y-auto pb-10">
        {/* Time grid lines */}
        {objectKeys.map((time, index) => {
          const dateTimeMap = NewDateTimeMap[time];
          const zero = dateTimeMap.m === 0;
          const isLast = index === objectKeys.length - 1;
          const isBeforeLast = index === objectKeys.length - 2;

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
                {!isLast && (
                  <div
                    className={`flex h-1 w-[95%] grid-cols-7 border-t ${
                      zero ? "border-slate-300" : "border-slate-100"
                    } `}
                  >
                    {daysArray.map((day, index) => {
                      const todayClass = requestClassList[day];
                      const isToday =
                        dayjs().format("dddd").toLowerCase() === day;

                      return (
                        <div
                          key={day + index}
                          style={{
                            minHeight: `${TIMEGRIDHEIGHT}px`,
                            height: `${TIMEGRIDHEIGHT}px`,
                          }}
                          className={`relative w-full border-b border-r ${
                            isBeforeLast &&
                            "before:absolute before:-inset-0 before:block before:h-full before:border-b before:border-slate-400 before:content-['']"
                          } first:border-l ${
                            isToday
                              ? "border-l border-emerald-500 bg-emerald-100"
                              : "bg-white"
                          } `}
                        >
                          {AVAILABLEDAYS.includes(day) && todayClass && (
                            <div className="flex flex-col">
                              {todayClass.map((item) => {
                                const parsedStartTime = dayjs(
                                  item.start_time,
                                ).format("H:m");
                                const eventstart = `${dateTimeMap.hour}:${dateTimeMap.m}`;
                                const CurrentHourEvent =
                                  parsedStartTime === eventstart;

                                if (CurrentHourEvent) {
                                  return (
                                    <WeeklyTimeTableCard
                                      TIMEGRIDHEIGHT={TIMEGRIDHEIGHT}
                                      day={day}
                                      item={item}
                                      key={item.id}
                                    />
                                  );
                                }
                              })}
                            </div>
                          )}
                          {!AVAILABLEDAYS.includes(day) && (
                            <div className="pointer-events-none flex h-full items-center justify-center bg-slate-50">
                              <p className="text-base text-slate-400">Break</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeTable;
