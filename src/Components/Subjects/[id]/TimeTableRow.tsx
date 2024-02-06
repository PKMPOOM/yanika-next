import type { Days, TimeSlot } from "@/interface/timeslot_interface";
import React, { useContext } from "react";
import { timeSlotContext } from "./BookingButton";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { AVAILABLEDAYS } from "@/constant/AvailableDateTime";

type timeSlot = {
  timeSlot: Days[] | undefined;
};

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

function TimeTableRow({ timeSlot }: timeSlot) {
  const { SelectedDateTime, setSelectedDateTime } = useContext(timeSlotContext);

  const filteredDayAvailable = timeSlot?.filter((item) =>
    AVAILABLEDAYS.some((day) => item.name.includes(day)),
  );

  function handleSelectDateTime(
    isSelected: boolean,
    day: Days,
    time: TimeSlot,
  ) {
    if (!isSelected) {
      setSelectedDateTime((state) => {
        const newstate = [...state];
        newstate.push({
          day: day.name,
          time: time.start_time,
        });

        return newstate;
      });
    } else {
      setSelectedDateTime((state) => {
        const newstate = [...state];
        const thisIndex = newstate.findIndex(
          (item) => item.day === day.name && item.time === time.start_time,
        );

        newstate.splice(thisIndex, 1);

        return newstate;
      });
    }
  }

  console.log(SelectedDateTime);

  return (
    <>
      {filteredDayAvailable?.map((day) => (
        <div
          key={day.name}
          className={` mb-2 flex items-center  justify-between gap-2 rounded-md border  p-2 outline-none 
        transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 `}
        >
          <p className=" w-1/12 ">{formattedUppercase(day.name)}</p>
          <div className=" grid w-11/12 grid-cols-9  gap-2">
            {day.time_slot.map((time) => {
              const isSelected = SelectedDateTime.some(
                (item) =>
                  item.day === day.name && item.time === time.start_time,
              );

              const formattedTime = timeToRange[time.start_time];
              const isBooked = time.bookingData !== null;
              const isRequested = time.requestedClass > 0;
              const lunchBreak = time.start_time === "twelve_one";

              return (
                <div
                  key={time.start_time}
                  onClick={() => {
                    handleSelectDateTime(isSelected, day, time);
                  }}
                  className={`
                    flex cursor-pointer justify-center rounded-md p-2 transition-all duration-150
                    ${
                      !isBooked && !isSelected && !isRequested && !lunchBreak
                        ? "bg-slate-200 hover:border-emerald-300 hover:bg-emerald-300 hover:text-white active:bg-emerald-400"
                        : ""
                    }
                    ${
                      isSelected
                        ? "border bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-400"
                        : ""
                    }
                    ${
                      isBooked ||
                      lunchBreak ||
                      (SelectedDateTime.length > 1 && !isSelected)
                        ? "pointer-events-none"
                        : "pointer-events-auto"
                    }
                    ${
                      lunchBreak
                        ? "border border-rose-500 bg-rose-200 text-rose-400"
                        : ""
                    }
                    ${
                      isBooked || (SelectedDateTime.length > 1 && !isSelected)
                        ? "border border-slate-200 bg-slate-50 text-slate-300"
                        : ""
                    }
                    ${
                      isRequested && !isSelected
                        ? "border border-orange-500 bg-orange-200 hover:border-orange-300 hover:bg-orange-300 hover:text-white active:bg-emerald-400"
                        : ""
                    }
                  `}
                >
                  <p className=" flex justify-center">
                    {time.start_time === "twelve_one" ? "Break" : formattedTime}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export default TimeTableRow;
