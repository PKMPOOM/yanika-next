"use client";

import React, { useContext } from "react";
import { timeSlotContext } from "./BookingButton";
import Link from "next/link";
import { formattedUppercase } from "@/lib/formattedUppercase";

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

const ClassRequestSumarry = () => {
  const { SelectedClass, SelectedDateTime } = useContext(timeSlotContext);
  const hours = SelectedDateTime.length;
  return (
    <div className=" mb-8 mt-4  flex gap-x-16 ">
      <div className=" flex flex-col  text-sm">
        <p className=" text-slate-500">Class booked</p>
        <p className=" text-2xl">{SelectedClass.subjectName}</p>
        <Link href={`/subjects/${SelectedClass.subjectID}`} target="_blank">
          View Subject detail
        </Link>
      </div>
      <div className=" flex flex-col gap-4">
        <div className="  flex flex-col gap-2 border-l-[1.5px] border-slate-300 px-4">
          <p className=" text-slate-500">Selected date times</p>
          <div className=" h-[1.5px] w-1/6 bg-slate-300"></div>
          <div className=" flex flex-col gap-0">
            {SelectedDateTime.map(({ day, time }) => (
              <div className=" text-lg font-semibold" key={`${day + time}`}>
                {formattedUppercase(day)} {timeToRange[time]} Hrs.
              </div>
            ))}
          </div>
        </div>

        <div className=" flex flex-col border-l-[1.5px] border-slate-300 px-4 text-sm">
          <p className=" text-slate-500"> Price</p>

          <p>
            <span className=" text-lg font-semibold">
              {" "}
              {SelectedClass.classPrice * hours} Thb
            </span>
          </p>
          <p className=" text-xs text-slate-500">
            {SelectedClass.classPrice} Thb / hours ({SelectedClass.classType}{" "}
            class )
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassRequestSumarry;
