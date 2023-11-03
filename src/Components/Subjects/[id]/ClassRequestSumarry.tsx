"use client";

import { formattedUppercase } from "@/lib/formattedUppercase";
import { useBookingModalStore } from "@/store/BookingModalStore";
import { Input } from "antd";
import dayjs from "dayjs";

const ClassRequestSumarry = () => {
  const [SelectedClass, selectedDay, startTime, classDuration] =
    useBookingModalStore((state) => [
      state.SelectedClass,
      state.selectedDay,
      state.startTime,
      state.classDuration,
    ]);
  if (!SelectedClass) {
    return <>No classs selected</>;
  }
  return (
    <div className=" flex flex-col gap-4 ">
      <div className=" mb-8 mt-4  flex gap-x-16 ">
        <div className=" flex flex-col  text-sm">
          <p className=" text-slate-500">Class booked</p>
          <p className=" text-2xl">{SelectedClass.subjectName}</p>
          <p>Type: {formattedUppercase(SelectedClass.classType)} class</p>
        </div>
        <div className=" flex flex-col gap-4">
          <div className="  flex flex-col gap-2 border-l-[1.5px] border-slate-300 px-4">
            <p className=" text-slate-500">Selected date times</p>
            <div className=" h-[1.5px] w-1/6 bg-slate-300"></div>
            <div className=" flex flex-col gap-0">
              <p>{selectedDay}</p>
              {classDuration} Hours
              <div>
                {dayjs(startTime).format("H:mm")}-
                {dayjs(startTime).add(classDuration, "hour").format("H:mm")}
              </div>
              {/* {SelectedDateTime.map(({ day, time }) => (
                <div className=" text-lg font-semibold" key={`${day + time}`}>
                  {formattedUppercase(day)} {timeToRange[time]} Hrs.
                </div>
              ))} */}
            </div>
          </div>

          <div className=" flex flex-col border-l-[1.5px] border-slate-300 px-4 text-sm">
            <p className=" text-slate-500"> Price</p>

            <p>
              <span className=" text-lg font-semibold">
                {" "}
                {SelectedClass.classPrice * classDuration} Thb
              </span>
            </p>
            <p className=" text-xs text-slate-500">
              {SelectedClass.classPrice} Thb / hours ({SelectedClass.classType}{" "}
              class )
            </p>
          </div>
        </div>
      </div>
      <div>
        notes
        <Input.TextArea />
      </div>
    </div>
  );
};

export default ClassRequestSumarry;
