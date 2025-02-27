import Container from "@/Components/Global/Container"
import ClassActionButton from "@/Components/TimeTable/ClassActionButton"
import StudentDisplayerDrawer from "@/Components/TimeTable/StudentDisplayerDrawer"
import { TodayClasses } from "@/Components/TimeTable/TimeTable"
import { DayList, Days } from "@/interface/timeslot_interface"
import { prisma } from "@/lib/db"
import { formattedUppercase } from "@/lib/formattedUppercase"
import {
    BookOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    PushpinOutlined,
    TagOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons"
import { Breadcrumb, Button, Card, ConfigProvider, Divider, Tag } from "antd"
import dayjs from "dayjs"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LuExternalLink } from "react-icons/lu"
import { SiGooglemeet } from "react-icons/si"

type PageProps = {
    params: {
        id: string
        day: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { id } = params

    const data = await prisma.timeSlot.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            index: true,
            start_time: true,
            parsed_start_time: true,
            duration: true,
            dayId: true,
            subjectId: true,
            userBooked: true,
            accept: true,
            bookingType: true,
            totalPrice: true,
            isScheduled: true,
            scheduleDateTime: true,
            meetingLink: true,
            eventID: true,
            userId: true,
            Subject: {
                select: {
                    id: true,
                    name: true,
                    image_url: true,
                    grade: true,
                    tags: true,
                },
            },
            Day: {
                select: {
                    index: true,
                },
            },
            bookingHistory: {
                take: 1,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    payment: true,
                },
            },
        },
    })

    if (!data) {
        redirect("/404")
    }

    const userData = await prisma.user.findUnique({
        where: {
            email: data.userBooked[0],
        },
        select: {
            id: true,
            email: true,
            name: true,
            TimeSlot: {
                select: {
                    accept: true,
                    start_time: true,
                    parsed_start_time: true,
                    duration: true,
                    dayId: true,
                    Subject: {
                        select: {
                            name: true,
                        },
                    },
                    totalPrice: true,
                    scheduleDateTime: true,
                },
            },
        },
    })

    console.log(userData)

    const { bookingHistory, ...rest } = data

    const ClassData = {
        ...rest,
        bookingHistory: bookingHistory[0] ?? null,
    }

    const classHours = `${dayjs(ClassData.start_time).format("H:mm")}-${dayjs(
        ClassData.start_time
    )
        .add(ClassData.duration, "hour")
        .format("H:mm")} Hrs.`

    const isAccept = ClassData.accept
    const subjectNotFound = ClassData.Subject === null
    const isPaid = ClassData.bookingHistory?.status === "paid"

    return (
        <Container>
            <div className="flex flex-col">
                <div className="mb-4 flex justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link href="/">
                                        <HomeOutlined /> Dashboard
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link href="/time_table">Time Table</Link>
                                ),
                            },
                            {
                                title: (
                                    <Link
                                        href={`/time_table/${ClassData.dayId}`}
                                    >
                                        {formattedUppercase(ClassData.dayId)}
                                    </Link>
                                ),
                            },
                            {
                                title: classHours,
                            },
                        ]}
                    />
                </div>

                <div className="container mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8">
                    <Card
                        actions={[
                            <div className="px-3">
                                {ClassData.meetingLink && (
                                    <Link
                                        href={ClassData.meetingLink}
                                        target="_blank"
                                    >
                                        <ConfigProvider
                                            theme={{
                                                token: {
                                                    colorPrimary: "#1677ff",
                                                },
                                            }}
                                        >
                                            <Button
                                                icon={<SiGooglemeet />}
                                                type="primary"
                                                block
                                            >
                                                <span className="px-5">
                                                    Open Google Meet
                                                </span>
                                            </Button>
                                        </ConfigProvider>
                                    </Link>
                                )}
                            </div>,
                        ]}
                    >
                        <div className="mb-4 flex justify-between">
                            <div className="flex flex-col">
                                <h1
                                    className={`text-3xl font-bold ${
                                        isAccept
                                            ? "text-emerald-500"
                                            : "text-orange-500"
                                    }`}
                                >
                                    {isAccept
                                        ? "Class Accepted"
                                        : "Not yet accept"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {isAccept
                                        ? "You have accepted this class"
                                        : "You have not accepted this class"}
                                </p>
                            </div>
                            {ClassData.accept ? (
                                <div className="px-3">
                                    {/* <Button type="primary" danger block>
                                        <span className="px-5">
                                            Cancel this class
                                        </span>
                                    </Button> */}
                                </div>
                            ) : (
                                <div className="px-3">
                                    <ClassActionButton
                                        classId={ClassData.id}
                                        dayId={ClassData.dayId}
                                    />
                                </div>
                            )}
                        </div>
                        <Divider className="my-4" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <BookOutlined className="text-muted-foreground h-5 w-5" />
                                    {ClassData.Subject ? (
                                        <Link
                                            href={`/subjects/${ClassData.subjectId}`}
                                            className={`group flex w-full items-center gap-2 ${
                                                subjectNotFound
                                                    ? "text-rose-500"
                                                    : "text-slate-800"
                                            }`}
                                        >
                                            <h1
                                                className={`font-semibold transition-all duration-150 group-hover:text-emerald-500`}
                                            >
                                                {ClassData.Subject.name}
                                            </h1>
                                            <div
                                                className={`-translate-x-1 transition-all duration-150 group-hover:translate-x-0 ${
                                                    subjectNotFound
                                                        ? "group-hover:text-rose-500"
                                                        : "group-hover:text-emerald-500"
                                                }`}
                                            >
                                                <LuExternalLink />
                                            </div>
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-muted-foreground h-5 w-5" />
                                    <span>
                                        {dayjs(ClassData.start_time).format(
                                            "dddd, MMM MM, YYYY"
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined className="text-muted-foreground h-5 w-5" />
                                    <span>
                                        {classHours} - {ClassData.duration} hour
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PushpinOutlined className="text-muted-foreground h-5 w-5" />
                                    <span>Online Session</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-muted-foreground h-5 w-5" />
                                    <span>
                                        {ClassData.userBooked.map((user) => (
                                            <StudentDisplayerDrawer
                                                email={user}
                                                userData={userData}
                                            />
                                        ))}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrophyOutlined className="text-muted-foreground h-5 w-5" />
                                    <span>
                                        {ClassData.Subject?.grade.replace(
                                            /_/g,
                                            " "
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TagOutlined className="text-muted-foreground h-5 w-5" />
                                    {ClassData.Subject?.tags.map(
                                        (tag, index) => (
                                            <Tag key={index}>{tag}</Tag>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="mb-8 "
                        title={
                            <div className="flex items-center justify-between">
                                <div>Payment Details</div>
                                <div className=" bottom-2 right-2 flex items-center gap-2 text-sm ">
                                    {isPaid ? (
                                        <div className="bg-emerald-500 px-2 py-1 text-white font-normal rounded-md">
                                            Paid
                                        </div>
                                    ) : (
                                        <div className="bg-orange-500 px-2 py-1 text-white font-normal rounded-md">
                                            Unpaid
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <div className=" space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span>Total Amount</span>
                                </div>
                                <span className="text-xl font-bold">
                                    ${ClassData.totalPrice}
                                </span>
                            </div>
                        </div>
                        <Divider className="my-4" />
                        <div className="text-muted-foreground text-sm text-slate-500">
                            <p>Booking Type: {ClassData.bookingType}</p>
                            <p>Booking ID: {ClassData.id}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </Container>
    )
}

export default Page
