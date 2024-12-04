"use client";

import Loader from "@/Components/Global/Loader";
import { AVAILABLEDAYS } from "@/constant/AvailableDateTime";
import { DayList, Days } from "@/interface/timeslot_interface";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { z } from "zod";

const timeToRange = {
  nine_ten: "09-10",
  ten_eleven: "10-11",
  eleven_twelve: "11-12",
  twelve_one: "12-13",
  one_two: "13-14",
  two_three: "14-15",
  three_four: "15-16",
  four_five: "16-17",
  five_six: "17-18",
  NA: "NA",
};

const ClassesRequest = () => {
  type Days = z.infer<typeof Days>;

  const fetchData = async () => {
    const res = await axios.get("api/calendar/timeslot/request");

    return res.data;
  };

  const { data: requestClassList } = useQuery<Days[]>({
    queryFn: fetchData,
    queryKey: ["classRequest"],
    refetchOnWindowFocus: false,
  });

  if (!requestClassList) {
    return <Loader />;
  }

  //todo add elipse dropdown menu => remove booked
  //todo clickable request list

  const dayjsDictionary: { [key: number]: DayList } = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {requestClassList?.map((day) => {
        const today = dayjsDictionary[dayjs().get("d")] === day.name;
        return (
          <div
            key={day.name}
            className={`mb-2 flex flex-col items-start justify-start gap-2 rounded-md p-2 outline-none transition-all duration-300 ${
              today
                ? "border-2 border-emerald-400 bg-emerald-100 shadow-md shadow-emerald-200"
                : "border hover:border-emerald-300 hover:bg-emerald-50"
            } ${
              AVAILABLEDAYS.includes(day.name)
                ? ""
                : "pointer-events-none bg-slate-50"
            }`}
          >
            <div className="w-full">
              <Link href={`/time_table/${day.name}`}>
                <p className="group flex items-center justify-between font-semibold text-slate-800 transition-all duration-150 hover:text-emerald-400">
                  <span>{formattedUppercase(day.name)}</span>
                  <span className="-translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                    <LuExternalLink />
                  </span>
                </p>{" "}
              </Link>
            </div>

            {AVAILABLEDAYS.includes(day.name) ? (
              <div className="flex w-full flex-col gap-2">
                {day.time_slot.map((time) => {
                  const formattedTime = timeToRange[time.start_time];
                  const isBooked = time.bookingData !== null;
                  const isRequested = time.requestedClass > 0;

                  return (
                    <div
                      key={time.id}
                      className={`group/card flex h-[100px] flex-col gap-2 rounded border bg-white p-2`}
                    >
                      <p className="text-sm text-slate-800"> {formattedTime}</p>

                      {isBooked && (
                        <Link href={`/time_table/${day.name}/${time.id}`}>
                          {/* <Link href={`/time_table/${time.id}`}> */}
                          <div className="group rounded border border-emerald-300 bg-emerald-50 p-2">
                            <div className="flex flex-col">
                              <span className="text-md font-semibold text-slate-800 group-hover:text-emerald-500">
                                {time.bookingData?.user?.name}
                              </span>

                              <p className="flex items-center justify-between overflow-y-hidden text-sm font-semibold text-slate-600 group-hover:text-emerald-500">
                                <span>{time.bookingData?.subject?.name}</span>
                                <span className="-translate-x-1 transition-all duration-150 group-hover:translate-x-0">
                                  <LuExternalLink />
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}

                      {isRequested && (
                        <Link href={`/time_table/${day.name}/${time.id}`}>
                          <div className="group cursor-pointer rounded border border-orange-300 bg-orange-100 p-2 text-black transition-all duration-300 hover:bg-orange-400">
                            <p className="text-xl group-hover:text-white">
                              {time.requestedClass}
                            </p>
                            <p className="text-xs text-slate-500 group-hover:text-white">
                              {time.requestedClass > 1 ? "Requests" : "Request"}
                            </p>
                          </div>
                        </Link>
                      )}

                      {!isRequested && !isBooked && (
                        <Link href={`/time_table/${day.name}/${time.id}`}>
                          <div className="group cursor-pointer rounded border border-slate-300 bg-slate-100 p-2 text-black opacity-25 transition-all duration-300 hover:bg-slate-400 hover:opacity-100">
                            <p className="text-xl group-hover:text-white">
                              {time.requestedClass}
                            </p>
                            <p className="text-xs text-slate-500 group-hover:text-white">
                              {time.requestedClass > 1 ? "Requests" : "Request"}
                            </p>
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-start justify-start">
                <p className="text-3xl">Break</p>
                <div className="text-xs">Adjust available days</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClassesRequest;
