"use client"

import { Button, Modal, Typography } from "antd"
import { useContext, useEffect, useState } from "react"

import WideBTNSpan from "@/Components/Global/WideBTNSpan"
import { NewDays, useBookingModalStore } from "@/store/BookingModalStore"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import dayjs from "dayjs"
import { timeSlotContext } from "./BookingButton"
import ClassRequestSumarry from "./ClassRequestSumarry"
import DaySelectionButton from "./DaySelectionButton"
import TimeSelectRow from "./TimeSelectRow"
import { useShallow } from "zustand/react/shallow"
import { getUserPoints } from "@/service/user"
import { useSession } from "@/lib/auth-client"

const { Title } = Typography

function TimeSelectModal() {
    const queryClient = useQueryClient()

    const [
        modalOpen,
        setModalOpen,
        setClassDuration,
        classDuration,
        startTime,
        selectedDay,
        SelectedClass,
        formStep,
        setFormStep,
        setStartTime,
        addOnStudent,
        clearAddOnStudent,
        setSelectedDay,
        isError,
        setIsError,
    ] = useBookingModalStore(
        useShallow((state) => [
            state.modalOpen,
            state.setModalOpen,
            state.setClassDuration,
            state.classDuration,
            state.startTime,
            state.selectedDay,
            state.SelectedClass,
            state.formStep,
            state.setFormStep,
            state.setStartTime,
            state.addOnStudent,
            state.clearAddOnStudent,
            state.setSelectedDay,
            state.isError,
            state.setIsError,
        ])
    )

    const [Loading, setLoading] = useState(false)
    // const [DisableBookButton, setDisableBookButton] = useState(false)
    const [TimeSlotState, setTimeSlotState] = useState<NewDays[]>([])
    const { api } = useContext(timeSlotContext)
    const { data: session } = useSession()
    const { data: points } = getUserPoints(session?.user.id)

    const fetchSubjectData = async () => {
        const res = await axios.get(`/api/calendar/timeselect`)
        return res.data
    }

    const { data: timeSlotData } = useQuery<NewDays[]>({
        queryKey: ["Timeselect"],
        queryFn: fetchSubjectData,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (timeSlotData) {
            setTimeSlotState(timeSlotData)
        }
    }, [timeSlotData])

    useEffect(() => {
        const isTimePassed = dayjs().isAfter(dayjs(startTime), "m")
        const lessThan24HourBook = dayjs(startTime).diff(dayjs(), "hour") <= 24

        if (SelectedClass && points) {
            const totalBookedPrice = SelectedClass.classPrice * classDuration
            const haveEnoughCredit = points.totalPoints >= totalBookedPrice

            switch (true) {
                case !isTimePassed && !lessThan24HourBook && haveEnoughCredit:
                    setIsError({
                        isError: false,
                        message: undefined,
                    })
                    break
                case isTimePassed:
                    setIsError({
                        isError: true,
                        message: "class_already_passed",
                    })
                    break
                case lessThan24HourBook:
                    setIsError({
                        isError: true,
                        message: "less_than_24_hours",
                    })
                    break
                case !haveEnoughCredit:
                    setIsError({
                        isError: true,
                        message: "not_enough_credit",
                    })
                    break
            }
        }
    }, [formStep, points, SelectedClass, startTime])

    const onCancel = async () => {
        setSelectedDay(undefined)
        setModalOpen(false)
        setFormStep(1)
        setClassDuration(1)
        setStartTime(undefined)
        clearAddOnStudent([])
    }

    const onScheduleClass = async () => {
        setLoading(true)
        const Payload = {
            startTime,
            classDuration,
            selectedDay,
            parsed_start_time: dayjs(startTime).format("H:mm"),
            SelectedClass,
            addOnStudent, //todo pass add-on to google cal invitation
        }

        try {
            await axios.post("/api/calendar/request-class", {
                data: Payload,
            })
            api.success({
                message: "Class scheduled",
                description: "Class scheduled successfully",
                placement: "topRight",
            })
            onCancel()
            queryClient.invalidateQueries({
                queryKey: ["Timeselect"],
            })
            queryClient.invalidateQueries({
                queryKey: ["userPoints", session?.user.id],
            })
        } catch (err) {
            console.log(err)
            api.error({
                message: "Error",
                description: err as string,
                placement: "topRight",
            })
        }

        setLoading(false)
    }

    if (!timeSlotData) {
        return null
    }

    return (
        <Modal
            open={modalOpen}
            onCancel={onCancel}
            style={{ top: 20, maxWidth: "1000px" }}
            footer={null}
            width={formStep === 1 ? "100%" : "500px"}
        >
            <div className="mb-4 flex flex-col items-start sm:flex-row sm:items-center sm:gap-4">
                <Title level={3}>Select date & times</Title>
                {formStep === 1 && (
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                            <div>Request</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                            <div>Booked</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {formStep === 1 ? (
                    <>
                        <div className="mb-4 flex gap-2">
                            <DaySelectionButton />
                        </div>
                        <TimeSelectRow timeSlot={TimeSlotState} />
                    </>
                ) : (
                    <ClassRequestSumarry />
                )}
            </div>

            <div className="mt-5 flex w-full flex-col justify-between gap-2 sm:flex-row">
                <Button htmlType="reset" onClick={onCancel} type="text">
                    Cancel
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">
                    {formStep > 1 && (
                        <Button
                            onClick={() => {
                                setFormStep(1)
                            }}
                        >
                            <WideBTNSpan className="flex items-center gap-2 px-20 text-white">
                                <p>Back</p>
                            </WideBTNSpan>
                        </Button>
                    )}

                    {formStep === 1 ? (
                        <Button
                            disabled={startTime === undefined}
                            onClick={() => {
                                setFormStep(2)
                            }}
                        >
                            <WideBTNSpan className="flex items-center gap-2 px-20 text-white">
                                <p>Next</p>
                            </WideBTNSpan>
                        </Button>
                    ) : (
                        <Button
                            disabled={isError.isError}
                            // disabled={DisableBookButton}
                            loading={Loading}
                            onClick={onScheduleClass}
                            type="primary"
                        >
                            <WideBTNSpan>Schedule a class</WideBTNSpan>
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default TimeSelectModal
