import {
  DayMap,
  NewDateTimeMap,
  NewDays,
  useBookingModalStore,
} from "@/store/BookingModalStore";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import SelectDateTimeCard from "./SelectDateTimeCard";
dayjs.extend(isBetween);

const TIMEGRIDHEIGHT = 40;

type TimeSlotProps = {
  timeSlot: NewDays[] | undefined;
};

function TimeSelectRow({ timeSlot }: TimeSlotProps) {
  const [startTime, setSelectedDay, setStartTime, currentDay] =
    useBookingModalStore((state) => [
      state.startTime,
      state.setSelectedDay,
      state.setStartTime,
      state.currentDay,
    ]);

  const todayData = timeSlot?.find((item) => item.name.includes(currentDay));

  const setSelectTime = (currentTime: Dayjs) => {
    setStartTime(currentTime);
    setSelectedDay(currentDay);
  };

  return (
    <div
      style={{
        height: `${TIMEGRIDHEIGHT * 9}px`,
        overflowY: "scroll",
      }}
      className=" relative pt-2"
    >
      {/* time grid */}
      {Object.keys(NewDateTimeMap).map((time, index) => {
        const dateTimeMap = NewDateTimeMap[time];
        const zero = dateTimeMap.m === 0;
        const hours = dateTimeMap.hour;
        const minutes = dateTimeMap.m;
        const dayjsToday = DayMap[currentDay];

        const currentTime = dayjs()
          .set("day", dayjsToday)
          .set("hour", hours)
          .set("m", minutes)
          .set("second", 0);

        // const newData = todayData?.NewTimeSlot.map((item) => {
        //   const startTime = dayjs(item.start_time);
        //   const endTime = startTime.add(item.duration, "hour");

        //   const isBetween = currentTime.isBetween(
        //     startTime,
        //     endTime,
        //     "hour",
        //     "[]",
        //   );

        //   return {
        //     isBetween,
        //     startTime,
        //     endTime,
        //     currentTime,
        //   };
        // });

        return (
          <div
            key={index}
            style={{
              height: `${TIMEGRIDHEIGHT}px`,
            }}
            className="group flex  w-full justify-end  "
          >
            <div className=" absolute flex h-8 w-full justify-between ">
              <div className=" top-2 flex w-[10%] -translate-y-[10px] ">
                {zero && (
                  <p className=" flex gap-1">
                    <span>{time} </span>
                    <span className="hidden lg:block">Hrs.</span>
                  </p>
                )}
              </div>
              <div
                className={` group relative box-content w-full cursor-pointer rounded-md border-t-4   ${
                  zero
                    ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                }`}
                onClick={() => {
                  setSelectTime(currentTime);
                }}
              >
                {time === dayjs(startTime).format("H:mm") && (
                  <SelectDateTimeCard TIMEGRIDHEIGHT={TIMEGRIDHEIGHT} />
                )}
                {todayData?.NewTimeSlot.map((timeslot) => {
                  if (dayjs(timeslot.start_time).format("H:mm") === time) {
                    return (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        key={timeslot.id}
                        style={{
                          width: `100%`,
                          top: "-4px",
                          height: `${TIMEGRIDHEIGHT * 2 * timeslot.duration}px`,
                          right: 0,
                        }}
                        className={` absolute top-0 z-[5] flex h-7 cursor-not-allowed items-center justify-center rounded border ${
                          timeslot.accept
                            ? "border-rose-500 bg-rose-200"
                            : "border-orange-500 bg-orange-200"
                        } `}
                      >
                        {timeslot.accept ? <p> Booked</p> : <p> Requested</p>}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  // return (
  //   <div
  //     style={{
  //       height: `${TIMEGRIDHEIGHT * 9}px`,
  //       overflowY: "scroll",
  //     }}
  //     className=" relative pt-2"
  //   >
  //     {/* time grid */}
  //     {Object.keys(NewDateTimeMap).map((time, index) => {
  //       const dateTimeMap = NewDateTimeMap[time];
  //       const zero = dateTimeMap.m === 0;
  //       const hours = dateTimeMap.hour;
  //       const minutes = dateTimeMap.m;
  //       const dayjsToday = DayMap[currentDay];

  //       const currentTime = dayjs()
  //         .set("day", dayjsToday)
  //         .set("hour", hours)
  //         .set("m", minutes);

  //       return (
  //         <div
  //           key={index}
  //           style={{
  //             height: `${TIMEGRIDHEIGHT}px`,
  //           }}
  //           className="group flex  w-full justify-end  "
  //         >
  //           <div className=" absolute flex h-8 w-full justify-between ">
  //             <div className=" top-2 flex w-[10%] -translate-y-[10px] ">
  //               {zero && (
  //                 <p className=" flex gap-1">
  //                   <span>{time} </span>
  //                   <span className="hidden lg:block">Hrs.</span>
  //                 </p>
  //               )}
  //             </div>
  //             <div
  //               className={` group relative box-content w-full cursor-pointer rounded-md border-t-4   ${
  //                 zero
  //                   ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100"
  //                   : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
  //               }`}
  //               onClick={() => {
  //                 setSelectTime(currentTime);
  //               }}
  //             >
  //               {time === dayjs(startTime).format("H:mm") && (
  //                 <SelectDateTimeCard TIMEGRIDHEIGHT={TIMEGRIDHEIGHT} />
  //               )}

  //               {todayData?.NewTimeSlot.map((timeslot) => {
  //                 if (dayjs(timeslot.start_time).format("H:mm") === time) {
  //                   return (
  //                     <div
  //                       onClick={(e) => e.stopPropagation()}
  //                       key={timeslot.id}
  //                       style={{
  //                         width: `100%`,
  //                         top: "-4px",
  //                         height: `${TIMEGRIDHEIGHT * 2 * timeslot.duration}px`,
  //                         right: 0,
  //                       }}
  //                       className={` absolute top-0 z-[5] flex h-7 cursor-not-allowed items-center justify-center rounded border ${
  //                         timeslot.accept
  //                           ? "border-rose-500 bg-rose-200"
  //                           : "border-orange-500 bg-orange-200"
  //                       } `}
  //                     >
  //                       {timeslot.accept ? <p> Booked</p> : <p> Requested</p>}
  //                     </div>
  //                   );
  //                 }
  //               })}
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}

export default TimeSelectRow;
