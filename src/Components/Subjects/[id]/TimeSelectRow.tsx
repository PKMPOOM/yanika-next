import {
    DayMap,
    NewDateTimeMap,
    NewDays,
    useBookingModalStore,
} from "@/store/BookingModalStore"
import dayjs, { Dayjs } from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import SelectDateTimeCard from "./SelectDateTimeCard"
import { useShallow } from "zustand/react/shallow"
dayjs.extend(isBetween)

const TIMEGRIDHEIGHT = 40

type TimeSlotProps = {
    timeSlot: NewDays[] | undefined
}

function TimeSelectRow({ timeSlot }: TimeSlotProps) {
    const [startTime, setSelectedDay, setStartTime, currentDay] =
        useBookingModalStore(
            useShallow((state) => [
                state.startTime,
                state.setSelectedDay,
                state.setStartTime,
                state.currentDay,
            ])
        )

    const todayData = timeSlot?.find((item) => item.name.includes(currentDay))

    const setSelectTime = (currentTime: Dayjs) => {
        setStartTime(currentTime)
        setSelectedDay(currentDay)
    }

    return (
        <div
            style={{
                height: `${TIMEGRIDHEIGHT * 9}px`,
                overflowY: "scroll",
            }}
            className="relative pt-2 min-h-[500px]"
        >
            {/* time grid */}
            {Object.keys(NewDateTimeMap).map((time, index) => {
                const dateTimeMap = NewDateTimeMap[time]
                const zero = dateTimeMap.m === 0
                const hours = dateTimeMap.hour
                const minutes = dateTimeMap.m
                const dayjsToday = DayMap[currentDay]

                const currentTime = dayjs()
                    .set("day", dayjsToday)
                    .set("hour", hours)
                    .set("m", minutes)
                    .set("second", 0)

                return (
                    <div
                        key={index}
                        style={{
                            height: `${TIMEGRIDHEIGHT}px`,
                        }}
                        className="group flex w-full justify-end"
                    >
                        <div className="absolute flex h-9 w-full justify-between">
                            <div className="top-2 flex w-[10%]">
                                {zero && (
                                    <p className="flex">
                                        <span>{time.split(":")[0]} </span>

                                        <span className="hidden md:block">
                                            :{time.split(":")[1]} Hrs.
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div
                                className={`group relative box-content w-full cursor-pointer rounded-md border-t-4 transition-all duration-200 ${
                                    zero
                                        ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100"
                                        : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                                }`}
                                onClick={() => {
                                    setSelectTime(currentTime)
                                }}
                            >
                                <div className="hidden h-full items-center justify-center text-emerald-400 group-hover:flex">
                                    {time}
                                </div>

                                {time === dayjs(startTime).format("H:mm") && (
                                    <SelectDateTimeCard
                                        TIMEGRIDHEIGHT={TIMEGRIDHEIGHT}
                                    />
                                )}
                                {todayData?.TimeSlot.map((timeslot) => {
                                    if (
                                        dayjs(timeslot.start_time).format(
                                            "H:mm"
                                        ) === time
                                    ) {
                                        return (
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                key={timeslot.id}
                                                style={{
                                                    width: `100%`,
                                                    top: "-4px",
                                                    height: `${TIMEGRIDHEIGHT * 2 * timeslot.duration}px`,
                                                    right: 0,
                                                }}
                                                className={`absolute top-0 z-5 box-border flex h-7 cursor-not-allowed items-center justify-center rounded-md border-2 ${
                                                    timeslot.accept
                                                        ? "border-white bg-rose-100"
                                                        : "border-white bg-orange-100"
                                                } `}
                                            >
                                                {timeslot.accept ? (
                                                    <p className="text-rose-500">
                                                        {" "}
                                                        Booked
                                                    </p>
                                                ) : (
                                                    <p className="text-orange-500">
                                                        {" "}
                                                        Requested
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TimeSelectRow
