"use client"

import { useBookingModalStore } from "@/store/BookingModalStore"
import { Alert } from "antd"
import dayjs, { Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useShallow } from "zustand/react/shallow"

dayjs.extend(utc)
dayjs.extend(timezone)

const ClassRequestSumarry = () => {
    const [SelectedClass, selectedDay, startTime, classDuration, isError] =
        useBookingModalStore(
            useShallow((state) => [
                state.SelectedClass,
                state.selectedDay,
                state.startTime,
                state.classDuration,
                state.isError,
            ])
        )

    if (!SelectedClass) {
        return <>No classs selected</>
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-2 mt-4 flex gap-x-16">
                <div className="flex flex-col text-sm">
                    <p className="text-slate-500">Class booked</p>
                    <p className="text-2xl">{SelectedClass.subjectName}</p>
                    <p className="text-xs text-slate-500">
                        {SelectedClass.classPrice} Credit / hours
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 border-l-[1.5px] border-slate-300 px-4">
                        <p className="text-slate-500">Selected date times</p>
                        <div className="h-[1.5px] w-1/6 bg-slate-300" />
                        <div className="flex flex-col gap-2">
                            <div className=" grid grid-cols-2 gap-2">
                                <p className=" font-semibold">Date:</p>
                                <p>{Capitalize(selectedDay || "")}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <p className=" font-semibold">Time:</p>
                                <p>
                                    {dayjs(startTime).format("H:mm")}-
                                    {dayjs(startTime)
                                        .add(classDuration, "hour")
                                        .format("H:mm")}
                                </p>
                            </div>
                            <div className=" grid grid-cols-2 gap-2">
                                <p className=" font-semibold">Duration:</p>
                                <p>{classDuration} Hour(s)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col border-l-[1.5px] border-slate-300 px-4 text-sm">
                        <p className="text-slate-500"> Total Price</p>

                        <p>
                            <span className="text-lg font-semibold">
                                {`${SelectedClass.classPrice * classDuration} Credit`}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <AlertMessage />
        </div>
    )
}

export default ClassRequestSumarry

const AlertMessage = () => {
    const [SelectedClass, selectedDay, startTime, classDuration, isError] =
        useBookingModalStore(
            useShallow((state) => [
                state.SelectedClass,
                state.selectedDay,
                state.startTime,
                state.classDuration,
                state.isError,
            ])
        )

    if (!selectedDay) return null

    switch (true) {
        case isError.message === "class_already_passed":
            return (
                <Alert
                    message={
                        <p className=" font-semibold text-rose-600">
                            The start time of this class is already passed
                        </p>
                    }
                    description="Please select a different day & time"
                    type="error"
                />
            )
        case isError.message === "less_than_24_hours":
            return (
                <Alert
                    message={
                        <p className=" font-semibold text-rose-600">
                            The start time of this class is within 24 hours from
                            now
                        </p>
                    }
                    description="Please select a different day & time"
                    type="error"
                />
            )
        case isError.message === "not_enough_credit":
            return (
                <Alert
                    message={
                        <p className=" font-semibold text-rose-600">
                            You do not have enough credit to book this class
                        </p>
                    }
                    description="Please top up your credit"
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
                    type="success"
                />
            )
    }
}

const Capitalize = (str: string) => {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
