"use client"

import { formattedUppercase } from "@/lib/formattedUppercase"
import { useBookingModalStore } from "@/store/BookingModalStore"
import { Alert } from "antd"
import dayjs, { Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useShallow } from "zustand/react/shallow"

dayjs.extend(utc)
dayjs.extend(timezone)

const ClassRequestSumarry = () => {
    const [SelectedClass, selectedDay, startTime, classDuration] =
        useBookingModalStore(
            useShallow((state) => [
                state.SelectedClass,
                state.selectedDay,
                state.startTime,
                state.classDuration,
            ])
        )

    if (!SelectedClass) {
        return <>No classs selected</>
    }

    return (
        <div className="flex flex-col gap-2">
            <AlertMessage startTime={startTime} selectedDay={selectedDay} />

            <div className="mb-2 mt-4 flex gap-x-16">
                <div className="flex flex-col text-sm">
                    <p className="text-slate-500">Class booked</p>
                    <p className="text-2xl">{SelectedClass.subjectName}</p>
                    <p>
                        Type: {formattedUppercase(SelectedClass.classType)}
                        class
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 border-l-[1.5px] border-slate-300 px-4">
                        <p className="text-slate-500">Selected date times</p>
                        <div className="h-[1.5px] w-1/6 bg-slate-300" />
                        <div className="flex flex-col gap-0">
                            <p>{selectedDay}</p>
                            {classDuration} Hours
                            <div>
                                {dayjs(startTime).format("H:mm")}-
                                {dayjs(startTime)
                                    .add(classDuration, "hour")
                                    .format("H:mm")}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col border-l-[1.5px] border-slate-300 px-4 text-sm">
                        <p className="text-slate-500"> Price</p>

                        <p>
                            <span className="text-lg font-semibold">
                                {SelectedClass.classPrice * classDuration} Thb
                            </span>
                        </p>
                        <p className="text-xs text-slate-500">
                            {SelectedClass.classPrice} Thb / hours (
                            {SelectedClass.classType} class )
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClassRequestSumarry

type AlertMessageProps = {
    startTime: Dayjs | undefined
    selectedDay: string | undefined
}
const AlertMessage = ({ startTime, selectedDay }: AlertMessageProps) => {
    const isTimePassed = dayjs().isAfter(dayjs(startTime), "m")
    const lessThan24HourBook = dayjs(startTime).diff(dayjs(), "hour") <= 24

    if (!selectedDay) return null

    switch (true) {
        case isTimePassed:
            return (
                <Alert
                    message={
                        <p className=" font-semibold ">
                            This class will schedule for
                            <span className=" text-rose-600">{` next ${Capitalize(selectedDay)}`}</span>
                        </p>
                    }
                    description="Because the start time of this class is already passed"
                    type="error"
                />
            )
        case lessThan24HourBook:
            return (
                <Alert
                    message={
                        <p className=" font-semibold ">
                            This class will schedule for
                            <span className=" text-rose-600">{` next ${Capitalize(selectedDay)}`}</span>
                        </p>
                    }
                    description="Because the start time of this class is within 24 hours from now"
                    type="error"
                />
            )
        default:
            return (
                <Alert
                    message={
                        <p className=" font-semibold ">
                            This class will schedule for
                            <span className=" text-emerald-600">{` this ${Capitalize(selectedDay)}`}</span>
                        </p>
                    }
                    // description=""
                    type="success"
                />
            )
    }
}

const Capitalize = (str: string) => {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
