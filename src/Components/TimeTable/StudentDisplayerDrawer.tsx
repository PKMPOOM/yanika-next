"use client"

import { Drawer } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { getUserBookingHistory } from "./api"

type Props = {
    email: string
    userID: string | null
}

const StudentDisplayerDrawer = ({ email, userID }: Props) => {
    const { data: userData } = getUserBookingHistory(userID)

    const [open, setOpen] = useState(false)
    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    return (
        <>
            <span
                onClick={showDrawer}
                className="hover:underline cursor-pointer"
            >
                {email}
            </span>
            <Drawer
                width={800}
                title={`${userData?.name}`}
                onClose={onClose}
                open={open}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2"></h1>
                    <p className="text-gray-600">{userData?.email}</p>
                </div>
                <div className=" flex flex-col gap-4">
                    {userData?.TimeSlot.map((timeSlot, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-lg font-semibold">
                                    {dayjs(timeSlot.start_time).format(
                                        "dddd, MMMM d, YYYY"
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {timeSlot.parsed_start_time} -{" "}
                                    {dayjs(timeSlot.start_time).format("HH:mm")}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-emerald-500 font-medium">
                                        {timeSlot.Subject?.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Duration: {timeSlot.duration} hour
                                        {timeSlot.duration > 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="text-green-600 font-semibold">
                                    {timeSlot.totalPrice}
                                    <span className=" text-black font-normal ml-2">
                                        Credit(s)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </>
    )
}

export default StudentDisplayerDrawer
