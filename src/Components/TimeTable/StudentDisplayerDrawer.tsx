"use client"

import React, { useState } from "react"
import { Button, Drawer } from "antd"
import { Days } from "@prisma/client"
import dayjs from "dayjs"

type UserData = {
    id: string
    TimeSlot: {
        Subject: {
            name: string
        } | null
        start_time: Date
        parsed_start_time: string
        duration: number
        dayId: Days
        accept: boolean
        totalPrice: number
        scheduleDateTime: Date | null
    }[]
    name: string | null
    email: string | null
} | null

type Props = {
    email: string
    userData: UserData
}

const StudentDisplayerDrawer = ({ email, userData }: Props) => {
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
                    <h1 className="text-3xl font-bold mb-2">
                        {userData?.name}'s Schedule
                    </h1>
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
                                    {dayjs(timeSlot.scheduleDateTime).format(
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
                                    ฿{timeSlot.totalPrice}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
            </Drawer>
        </>
    )
}

export default StudentDisplayerDrawer
