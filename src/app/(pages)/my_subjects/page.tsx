import Container from "@/Components/Global/Container"
import Loader from "@/Components/Global/Loader"
// import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/authOptions"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { EyeOutlined } from "@ant-design/icons"
import { Subject, TimeSlot } from "@prisma/client"
import { Button, Empty } from "antd"
import dayjs, { Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

dayjs.extend(utc)
dayjs.extend(timezone)
const tz = "Asia/Bangkok"

export default async function MySubjects() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return <Loader />
    }

    if (session?.user.role === "admin") {
        return redirect("/subjects")
    }

    const myBookedSuybject = await prisma.timeSlot.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            Subject: true,
        },
        orderBy: {
            Day: {
                index: "asc",
            },
        },
    })

    return (
        <Container>
            <div className="flex flex-col gap-4">
                {myBookedSuybject.length === 0 ? (
                    <div>
                        <Empty />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 ">
                        {[...myBookedSuybject, ...myBookedSuybject].map(
                            (timeSlot) => {
                                const isAccept = timeSlot.accept === true
                                const isPassed = dayjs().isAfter(
                                    dayjs(timeSlot.start_time)
                                )

                                let startTime = isPassed
                                    ? dayjs(timeSlot.start_time).add(7, "day")
                                    : dayjs(timeSlot.start_time)
                                let endTime = startTime.add(
                                    timeSlot.duration,
                                    "hour"
                                )

                                return (
                                    <UserSubjectsDetail
                                        timeSlot={timeSlot}
                                        isAccept={isAccept}
                                        isPassed={isPassed}
                                        subject={timeSlot.Subject}
                                        startTime={startTime}
                                        endTime={endTime}
                                    />
                                )
                            }
                        )}
                    </div>
                )}

                {/* <div className="flex flex-col gap-3 overflow-y-scroll">
                    {[...myBookedSuybject, ...myBookedSuybject].map(
                        (timeSlot) => {
                            const isAccept = timeSlot.accept === true
                            const isPassed = dayjs().isAfter(
                                dayjs(timeSlot.start_time)
                            )

                            let startTime = isPassed
                                ? dayjs(timeSlot.start_time).add(7, "day")
                                : dayjs(timeSlot.start_time)
                            let endTime = startTime.add(
                                timeSlot.duration,
                                "hour"
                            )

                            return (
                                <UserSubjectsDetail
                                    timeSlot={timeSlot}
                                    isAccept={isAccept}
                                    isPassed={isPassed}
                                    subject={timeSlot.Subject}
                                    startTime={startTime}
                                    endTime={endTime}
                                />
                            )
                        }
                    )}
                </div> */}
            </div>
        </Container>
    )
}

type UserSubjectsDetailProps = {
    timeSlot: TimeSlot
    isAccept: boolean
    isPassed: boolean
    subject: Subject | null
    startTime: Dayjs
    endTime: Dayjs
}

const UserSubjectsDetail = ({
    timeSlot,
    isAccept,
    isPassed,
    subject,
    startTime,
    endTime,
}: UserSubjectsDetailProps) => {
    return (
        <div
            key={timeSlot.id}
            className={`rounded-md border p-3 ${
                isAccept
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-orange-500 bg-orange-50"
            }`}
        >
            <div className="flex items-baseline gap-2 text-sm">
                <p className="">Status: </p>
                <p
                    className={`${
                        isAccept ? "text-emerald-500" : "text-orange-500"
                    } font-semibold`}
                >
                    {isAccept ? "Accepted" : " Reviewing"}
                </p>
            </div>

            <div className="mt-4 flex items-start justify-between gap-2">
                <div className="flex flex-col items-baseline justify-between text-base text-slate-800">
                    <p className="font-semibold">{subject?.name}</p>
                    <div className="text-sm">
                        <p className="">
                            {dayjs
                                .tz(timeSlot.start_time, tz)
                                .format("dddd H:mm")}{" "}
                            Hrs.
                        </p>
                        <p>
                            <span className="font-semibold">
                                {timeSlot.totalPrice} Credit
                            </span>
                            {timeSlot.duration} Hours
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex">
                <Link
                    href={`/subjects/${timeSlot.subjectId}`}
                    style={{ width: "100%" }}
                >
                    <Button block icon={<EyeOutlined />}>
                        Subject
                    </Button>
                </Link>
            </div>

            {timeSlot.isScheduled && timeSlot.meetingLink && !isPassed && (
                <div className="mt-3 flex flex-col gap-1 rounded-sm border border-emerald-500 bg-emerald-100 p-2 text-sm">
                    {` Next class on 
                    ${dayjs.tz(startTime, tz).format("DD MMM H:mm")}  - ${dayjs
                        .tz(endTime, tz)
                        .format("H:mm")}`}
                    <Link
                        href={timeSlot.meetingLink}
                        target="_blank"
                        style={{ width: "100%" }}
                    >
                        <Button block>Join with Google meet </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
