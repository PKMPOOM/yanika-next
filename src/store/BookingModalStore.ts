import { DayList, Days } from "@/interface/timeslot_interface"
import { Dayjs } from "dayjs"
import z from "zod"
import { create } from "zustand"

export const AVAILABLEDAYS: DayList[] = [
    // todo add option for admin to edit their available day
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
]

export const DateTimeMap: {
    [key: string]: { hour: number; m: number; index: number }
} = {
    "9:00": { hour: 9, index: 1, m: 0 },
    "9:30": { hour: 9, index: 1.5, m: 30 },
    "10:00": { hour: 10, index: 2, m: 0 },
    "10:30": { hour: 10, index: 2.5, m: 30 },
    "11:00": { hour: 11, index: 3, m: 0 },
    "11:30": { hour: 11, index: 3.5, m: 30 },
    "12:00": { hour: 12, index: 4, m: 0 },
    "12:30": { hour: 12, index: 4.5, m: 30 },
    "13:00": { hour: 13, index: 5, m: 0 },
    "13:30": { hour: 13, index: 5.5, m: 30 },
    "14:00": { hour: 14, index: 6, m: 0 },
    "14:30": { hour: 14, index: 6.5, m: 30 },
    "15:00": { hour: 15, index: 7, m: 0 },
    "15:30": { hour: 15, index: 7.5, m: 30 },
    "16:00": { hour: 16, index: 8, m: 0 },
    "16:30": { hour: 16, index: 8.5, m: 30 },
    "17:00": { hour: 17, index: 9, m: 0 },
    "17:30": { hour: 17, index: 9.5, m: 30 },
    "18:00": { hour: 18, index: 10, m: 0 },
    "18:30": { hour: 18, index: 10.5, m: 30 },
    "19:00": { hour: 19, index: 11, m: 0 },
    "19:30": { hour: 19, index: 12, m: 30 },
    "20:00": { hour: 20, index: 12.5, m: 0 },
    "20:30": { hour: 20, index: 13, m: 30 },
    "21:00": { hour: 21, index: 13.5, m: 0 },
}

export const NewDateTimeMap: {
    [key: string]: { hour: number; m: number; index: number }
} = {
    "9:00": { hour: 9, index: 0, m: 0 },
    "9:30": { hour: 9, index: 1, m: 30 },
    "10:00": { hour: 10, index: 2, m: 0 },
    "10:30": { hour: 10, index: 3, m: 30 },
    "11:00": { hour: 11, index: 4, m: 0 },
    "11:30": { hour: 11, index: 5, m: 30 },
    "12:00": { hour: 12, index: 6, m: 0 },
    "12:30": { hour: 12, index: 7, m: 30 },
    "13:00": { hour: 13, index: 8, m: 0 },
    "13:30": { hour: 13, index: 9, m: 30 },
    "14:00": { hour: 14, index: 10, m: 0 },
    "14:30": { hour: 14, index: 11, m: 30 },
    "15:00": { hour: 15, index: 12, m: 0 },
    "15:30": { hour: 15, index: 13, m: 30 },
    "16:00": { hour: 16, index: 14, m: 0 },
    "16:30": { hour: 16, index: 15, m: 30 },
    "17:00": { hour: 17, index: 16, m: 0 },
    "17:30": { hour: 17, index: 17, m: 30 },
    "18:00": { hour: 18, index: 18, m: 0 },
    "18:30": { hour: 18, index: 19, m: 30 },
    "19:00": { hour: 19, index: 20, m: 0 },
    "19:30": { hour: 19, index: 21, m: 30 },
    "20:00": { hour: 20, index: 22, m: 0 },
    "20:30": { hour: 20, index: 23, m: 30 },
    "21:00": { hour: 21, index: 24, m: 0 },
}

export const DayMap: { [key: string]: number } = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
    NA: 99,
}

export type classLength = 1 | 1.5 | 2
export type classType = {
    classType: "group" | "single"
    classPrice: number
    subjectID: string
    subjectName?: string
}

export type TimeSlot = {
    id: string
    index: number
    start_time: Dayjs
    dayId:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
        | "NA"
    requestedClass: number
    subjectId: string
    duration: classLength
    parsed_start_time: string
    accept: boolean
    userBooked: string[]
    subject?: {
        id: string
        name: string
    }
}

export type NewDays = {
    id: string
    name:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
        | "NA"
    index: number
    TimeSlot: TimeSlot[]
}

const TimeSlotArraySchema = z.array(Days)
type TimeSlotArray = z.infer<typeof TimeSlotArraySchema>

type errorType =
    | "not_enough_credit"
    | "class_already_passed"
    | "less_than_24_hours"
type state = {
    classDuration: classLength
    modalOpen: boolean
    formStep: 1 | 2
    timeSlotState: TimeSlotArray | undefined
    SelectedClass: classType | undefined
    currentDay: DayList
    addOnStudent: string[]
    startTime: Dayjs | undefined
    selectedDay: DayList | undefined
    isError: {
        isError: boolean
        message: errorType | undefined
    }
}

type Action = {
    setClassDuration: (duration: state["classDuration"]) => void
    setStartTime: (time: state["startTime"]) => void
    setModalOpen: (open: state["modalOpen"]) => void
    setFormStep: (step: state["formStep"]) => void
    setTimeSlotState: (state: state["timeSlotState"]) => void
    setSelectedClass: (state: state["SelectedClass"]) => void
    setSelectedDay: (state: state["selectedDay"]) => void
    setCurrentDay: (state: number) => void
    addAddOnStudent: (state: string) => void
    removeAddOnStudent: (state: string) => void
    clearAddOnStudent: (event: any) => void
    setIsError: (state: state["isError"]) => void
}

export const useBookingModalStore = create<state & Action>((set) => ({
    classDuration: 1,
    setClassDuration: (event) => set(() => ({ classDuration: event })),

    modalOpen: false,
    setModalOpen: (event) => set(() => ({ modalOpen: event })),

    formStep: 1,
    setFormStep: (event) => set(() => ({ formStep: event })),

    timeSlotState: undefined,
    setTimeSlotState: (event) => set(() => ({ timeSlotState: event })),

    SelectedClass: undefined,
    setSelectedClass: (event) => set(() => ({ SelectedClass: event })),

    startTime: undefined,
    setStartTime: (event) => set(() => ({ startTime: event })),

    selectedDay: "monday",
    setSelectedDay: (event) => set(() => ({ selectedDay: event })),

    currentDay: "monday",
    setCurrentDay: (event) => set(() => ({ currentDay: AVAILABLEDAYS[event] })),

    addOnStudent: [],
    addAddOnStudent: (event) =>
        set((state) => {
            const newstate = [...state.addOnStudent, event]

            return { addOnStudent: newstate }
        }),

    removeAddOnStudent: (event) =>
        set((state) => {
            const newstate = state.addOnStudent.filter((item) => item !== event)

            return { addOnStudent: newstate }
        }),

    clearAddOnStudent: (event) => set(() => ({ addAddOnStudent: event })),

    isError: {
        isError: false,
        message: undefined,
    },
    setIsError: (event) => set(() => ({ isError: event })),
}))
