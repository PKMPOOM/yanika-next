import { AVAILABLEDAYS } from "@/constant/AvailableDateTime";
import type { DayList } from "@/interface/timeslot_interface";
import { formattedUppercase } from "@/lib/formattedUppercase";
import {
  DateTimeMap,
  DayMap,
  NewDays,
  useBookingModalStore,
} from "@/store/BookingModalStore";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

type timeSlot = {
  timeSlot: NewDays[] | undefined;
};

function TimeSelectRow({ timeSlot }: timeSlot) {
  const [startTime, classDuration, setSelectDateTime, selectedDay] =
    useBookingModalStore((state) => [
      state.startTime,
      state.classDuration,
      state.setSelectDateTime,
      state.selectedDay,
    ]);

  const filteredDayAvailable = timeSlot?.filter((item) =>
    AVAILABLEDAYS.some((day) => item.name.includes(day)),
  );

  const handleSelectDateTime = ({
    Day,
    Time,
  }: {
    Day: DayList;
    Time: Dayjs;
  }) => {
    setSelectDateTime({
      Day: Day,
      Time: Time,
    });
  };

  return (
    <div>
      <div
        className={` mb-2 flex items-center  justify-between gap-2 rounded-md border  p-2 outline-none 
      transition-all duration-300 `}
      >
        <p className=" w-1/12 "></p>
        <div className="flex w-11/12 justify-between">
          {Object.keys(DateTimeMap).map((_, index) => {
            const startTime = 9;
            const hours = Math.floor(startTime + index / 2);
            const minutes = index % 2 === 0 ? "00" : "30";
            const time = `${hours}:${minutes}`;

            if (minutes === "00") {
              return (
                <div
                  className=" group relative flex h-5 w-4 justify-center rounded "
                  key={time}
                >
                  {time}
                </div>
              );
            }
          })}
        </div>
      </div>

      {filteredDayAvailable?.map((day) => {
        return (
          <div
            key={day.name}
            style={
              {
                // opacity: selectedDay === day.name ? 1 : 0.2,
              }
            }
            className={` mb-2 flex items-center  justify-between gap-2 rounded-md border p-2 
            outline-none transition-all duration-300 `}
          >
            <p className=" w-1/12 ">{formattedUppercase(day.name)}</p>
            <div
              className={`relative flex w-11/12 items-center justify-between bg-emerald-50`}
            >
              {/* selected bar */}
              {day.name === selectedDay && startTime !== undefined && (
                <div
                  style={{
                    width: `calc(11.5*${classDuration}%)`,
                    marginLeft: `calc(11*${
                      DateTimeMap[startTime.format("H:mm")].index - 1
                    }%)`,
                  }}
                  className=" absolute z-10 h-1 bg-emerald-400"
                ></div>
              )}

              {/* booked Bar */}
              {day.NewTimeSlot.map((timeslot) => (
                <div
                  key={timeslot.id}
                  style={{
                    width: `calc(11*${timeslot.duration}%)`,
                    marginLeft: `calc(11*${
                      DateTimeMap[dayjs(timeslot.start_time).format("H:mm")]
                        .index - 1
                    }%)`,
                  }}
                  className={` absolute left-[4px] z-[5] h-7 rounded border ${
                    timeslot.accept
                      ? "border-rose-500 bg-rose-200"
                      : "border-orange-500 bg-orange-200"
                  } `}
                >
                  {}
                </div>
              ))}

              {/* Table selector */}
              {Object.keys(DateTimeMap).map((item, index) => {
                const hours = DateTimeMap[item].hour;
                const minutes = DateTimeMap[item].m;
                const dayjsToday = DayMap[day.name];

                const currentTime = dayjs()
                  .set("day", dayjsToday)
                  .set("hour", hours)
                  .set("m", minutes);

                const endTime = startTime?.add(classDuration, "hour");

                const isBetweenRange = currentTime.isBetween(
                  startTime,
                  endTime,
                  "m",
                  "[]",
                );

                // const isBooked = day.NewTimeSlot['']
                const AddBG = isBetweenRange && day.name === selectedDay;

                switch (minutes) {
                  case 0:
                    // 00 square mark
                    return (
                      <div
                        key={day.name + index}
                        className=" group relative z-10 flex h-5 w-3 justify-center   "
                        onClick={() => {
                          handleSelectDateTime({
                            Day: day.name,
                            Time: currentTime,
                          });
                        }}
                      >
                        <div
                          key={day.name + index}
                          className={`z-40 w-36 cursor-pointer rounded-sm ${
                            AddBG ? "bg-emerald-400" : "bg-emerald-100"
                          } group-hover:bg-emerald-500`}
                        ></div>
                      </div>
                    );

                  default:
                    // .30 dot mark
                    return (
                      <div
                        key={day.name + index + "tick"}
                        className={`group relative z-30 flex  items-center justify-center  `}
                        onClick={() => {
                          handleSelectDateTime({
                            Day: day.name,
                            Time: currentTime,
                          });
                        }}
                      >
                        <div
                          className={`h-3  w-3 cursor-pointer rounded-full ${
                            AddBG ? "bg-emerald-400" : "bg-emerald-100"
                          } group-hover:bg-emerald-500`}
                        ></div>
                      </div>
                    );
                }
              })}
            </div>
          </div>
        );
      })}
      {/* <pre>{JSON.stringify(filteredDayAvailable, null, 2)}</pre> */}
    </div>
  );
}

export default TimeSelectRow;

// {day.time_slot.map((time) => {
//     const isSelected = SelectedDateTime.some(
//       (item) =>
//         item.day === day.name && item.time === time.start_time,
//     );

//     const formattedTime = timeToRange[time.start_time];
//     const isBooked = time.bookingData !== null;
//     const isRequested = time.requestedClass > 0;
//     const lunchBreak = time.start_time === "twelve_one";

//     return (
//       <div key={time.start_time} className=" h-5  bg-red-500">
//         {/* <pre>{JSON.stringify(time, null, 2)}</pre> */}
//         {formattedTime}
//       </div>
//     );
//   })}
