"use client";

import { DayList } from "@/interface/timeslot_interface";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { LuEye } from "react-icons/lu";
import Container from "../Global/Container";
import Loader from "../Global/Loader";
import TimeTableCard from "./TimeTableCard";

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
  subject: {
    id: string;
    name: string;
    image_url: string;
  } | null;
  Day: {
    index: number;
  } | null;
};

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

  const TIMEGRIDHEIGHT = 120;

  return (
    <Container>
      <div className=" relative mt-6 flex h-[calc(100vh-200px)] flex-col items-end ">
        {/* table header */}
        <div className=" absolute -top-12  grid w-[95%]  grid-cols-7 ">
          {daysArray.map((day, index) => {
            const isAvailable = AVAILABLEDAYS.includes(day);
            return (
              <Link
                href={`/time_table/${day}`}
                key={day + index}
                className="group flex items-center justify-between overflow-hidden rounded-md px-2 py-1 text-slate-800 hover:bg-slate-50 "
              >
                <div>
                  <p>{formattedUppercase(day)}</p>
                  <p className=" text-xs text-slate-500">
                    {isAvailable ? "Available" : "Break"}
                  </p>
                </div>
                <div className=" flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <LuEye /> <p className=" text-xs">View</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Class list */}
        <div className=" absolute  grid w-[95%]  grid-cols-7  ">
          {/* Day container grid */}
          {daysArray.map((day, index) => {
            const todayClass = requestClassList[day];
            const isToday = dayjs().format("dddd").toLowerCase() === day;
            return (
              <div
                key={day + index}
                style={{
                  height: `${TIMEGRIDHEIGHT * 9}px`,
                }}
                className=" w-full overflow-hidden border-r first:border-l"
              >
                {isToday && (
                  <div
                    style={{
                      width: `calc(${(100 / 7).toFixed(2)}% - 1px)`,
                    }}
                    className="absolute z-10 h-full border-2 border-emerald-300 bg-emerald-50/50 "
                  ></div>
                )}

                {AVAILABLEDAYS.includes(day) && todayClass && (
                  <div className=" flex flex-col ">
                    {todayClass.map((item) => {
                      return (
                        <TimeTableCard
                          TIMEGRIDHEIGHT={TIMEGRIDHEIGHT}
                          day={day}
                          item={item}
                          key={item.id}
                        />
                      );
                    })}
                  </div>
                )}

                {!AVAILABLEDAYS.includes(day) && (
                  <div
                    style={{
                      height: `${TIMEGRIDHEIGHT * 9 - 16}px`,
                    }}
                    className=" flex flex-col  p-2"
                  >
                    <div className=" inset-0 z-20 flex h-full flex-col items-center justify-center rounded-md border border-slate-400 bg-slate-50">
                      <p className="text-3xl">Break</p>
                      <div className=" text-xs">Adjust available days</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time grid lines */}
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              style={{
                marginBottom: `${TIMEGRIDHEIGHT}px`,
              }}
              className="group relative flex w-full justify-end "
            >
              <div className=" absolute flex w-full">
                <div className=" top-2 flex w-[5%] -translate-y-[10px]">
                  <p>{index + 9} Hrs.</p>
                </div>
                <div className=" bottom-0 h-1 w-[95%] border-t border-slate-300  "></div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default TimeTable;
