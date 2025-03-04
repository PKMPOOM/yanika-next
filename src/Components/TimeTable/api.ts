import { formattedUppercase } from "@/lib/formattedUppercase"
import axios from "axios"
import { TodayClasses } from "./TimeTable"
import { Dayjs } from "dayjs"
import { useQuery } from "@tanstack/react-query"
import { Days } from "@prisma/client"

export type RequestSchema = {
    timeSlotId: string
    subjectId: string
    start_time: Dayjs
    class_duration: number
    students: string[]
    isPassed: boolean
    subject_name: string
}

export const acceptClass = async (id: string) => {
    await axios.put(`/api/calendar/time_table/${id}`, {
        reason: "accepted",
    })
}

export const rejectClass = async (id: string) => {
    await axios.put(`/api/calendar/time_table/${id}`, {
        reason: "reject",
    })
}

export const deleteClass = async (id: string) => {
    await axios.delete(`/api/calendar/time_table/${id}`)
}

export const scheduleGoogleMeet = async (params: RequestSchema) => {
    await axios.post("/api/google/event", {
        ...params,
    })
}

export const lineNotification = async (
    userLineId: string,
    item: TodayClasses,
    reason: string
) => {
    await axios.post(`/api/calendar/line/${userLineId}`, {
        subjectName: item.Subject?.name,
        day: formattedUppercase(item.dayId),
        startTime: item.parsed_start_time,
        reason: reason,
    })
}

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

export const getUserBookingHistory = (userID: string | null) => {
    const fetcher = async () => {
        const res = await axios.get<UserData>(
            `/api/user/${userID}/booking-history`
        )
        return res.data
    }

    return useQuery({
        queryKey: ["userBookingHistory", userID],
        queryFn: fetcher,
        enabled: !!userID,
    })
}
