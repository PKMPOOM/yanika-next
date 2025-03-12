"use client";
import { TimeSlot } from "@/interface/timeslot_interface";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import { LuExternalLink } from "react-icons/lu";
import z from "zod";

type timeSlot = z.infer<typeof TimeSlot>;

type Props = {
  formattedTime: string;
  time: timeSlot;
  isBooked: boolean;
  isRequested: boolean;
  dayID: string;
};

const TimeRequestCard = ({
  dayID,
  formattedTime,
  isBooked,
  isRequested,
  time,
}: Props) => {
  const scheduleSelectedTime = async () => {
    console.log(time.id);
  };

  return (
    <div className={`group/card flex items-center gap-2 rounded-sm border p-2 `}>
      <p className=" w-1/12 text-sm text-slate-800">{formattedTime} Hrs.</p>

      <div className=" w-full">
        {isBooked && (
          <div className=" flex items-center gap-2 ">
            <Link
              href={`/time_table/${dayID}/${time.id}`}
              style={{
                width: "100%",
              }}
            >
              <div className=" group rounded-sm border border-emerald-300 bg-emerald-50 p-2">
                <div className=" flex flex-col ">
                  <p className=" flex justify-between">
                    <span className="text-md font-semibold  text-slate-800 group-hover:text-emerald-500">
                      {time.bookingData?.user?.name}
                    </span>
                    <span className=" -translate-x-1 transition-all duration-150 group-hover:translate-x-0 group-hover:text-emerald-500">
                      <LuExternalLink />
                    </span>
                  </p>

                  <p className=" flex items-center justify-between overflow-y-hidden text-sm font-semibold text-slate-600  group-hover:text-emerald-500 ">
                    <span>{time.bookingData?.subject?.name}</span>
                  </p>
                </div>
              </div>
            </Link>
            <Button
              onClick={() => {
                scheduleSelectedTime();
              }}
            >
              Schedule
            </Button>
          </div>
        )}

        {isRequested && (
          <div className=" group flex cursor-pointer items-baseline gap-3 rounded-sm border border-orange-300 bg-orange-100  p-2 text-black transition-all duration-300 hover:bg-orange-400">
            <p className=" text-xl group-hover:text-white">
              {time.requestedClass}
            </p>
            <p className=" text-xs text-slate-500 group-hover:text-white">
              {time.requestedClass > 1 ? "Requests" : "Request"}
            </p>
          </div>
        )}

        {!isRequested && !isBooked && (
          <div className=" group flex cursor-pointer items-baseline gap-3 rounded-sm border border-slate-300 bg-slate-100 p-2 text-black  opacity-25 transition-all duration-300 hover:bg-slate-400 hover:opacity-100">
            <p className=" text-xl group-hover:text-white">
              {time.requestedClass}
            </p>
            <p className=" text-xs text-slate-500 group-hover:text-white">
              {time.requestedClass > 1 ? "Requests" : "Request"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeRequestCard;
