"use client";

import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Badge, Button, ConfigProvider } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import { SiGooglemeet } from "react-icons/si";
import DescValue from "../Global/DescValue";
import { TodayClasses } from "./TimeTable";
import { acceptClass, rejectClass, scheduleGoogleMeet } from "./api";

export type ScheduleGoogleMeetRequestSchema = {
  timeSlotId: string;
  subjectId: string;
  start_time: Dayjs;
  class_duration: number;
  students: string[];
  isPassed: boolean;
  subject_name: string;
};

type Props = {
  TIMEGRIDHEIGHT: number;
  LEFTOFSET?: number;
  item: TodayClasses;
  day: string;
};

const SingleDayTimeTableCard = ({
  TIMEGRIDHEIGHT,
  item: todayClass,
  day,
  LEFTOFSET,
}: Props) => {
  const [AcceptLoading, setAcceptLoading] = useState(false);
  const [ScheduleEventLoading, setScheduleEventLoading] = useState(false);
  const queryClient = useQueryClient();
  const customHeight = `${TIMEGRIDHEIGHT * 2 * todayClass.duration}px`;
  const isAccept = todayClass.accept;
  const isDayPassed = dayjs().isAfter(dayjs(todayClass.start_time), "day");
  const subjectNotFound = !todayClass.Subject;

  const handleAcceptClass = async (id: string) => {
    setAcceptLoading(true);
    try {
      await acceptClass(id);

      queryClient.invalidateQueries({
        queryKey: ["todayClass", day],
      });

      setAcceptLoading(false);
    } catch (error) {
      console.log(error);
      setAcceptLoading(false);
    }
  };

  const handleRejectClass = async (id: string) => {
    setAcceptLoading(true);
    try {
      await rejectClass(id);

      queryClient.invalidateQueries({
        queryKey: ["todayClass", day],
      });

      setAcceptLoading(false);
    } catch (error) {
      console.log(error);
      setAcceptLoading(false);
    }
  };

  const handleScheduleGoogleMeet = async (
    params: ScheduleGoogleMeetRequestSchema,
  ) => {
    setScheduleEventLoading(true);
    try {
      await scheduleGoogleMeet(params);

      queryClient.invalidateQueries({
        queryKey: ["todayClass", day],
      });
    } catch (error) {
      console.log(error);
    }
    setScheduleEventLoading(false);
  };

  return (
    <div
      key={todayClass.id}
      style={{
        width: "100%",
        height: customHeight,
        left: LEFTOFSET && `${LEFTOFSET}px`,
      }}
      className="z-10 flex"
    >
      <div className="box-border flex min-h-full flex-1 p-1">
        <div
          className={`relative box-border flex w-full flex-1 flex-col gap-2 overflow-hidden rounded-md border p-2 text-slate-900 shadow-md ${
            todayClass.accept
              ? "border-emerald-500 bg-emerald-50"
              : "border-orange-500 bg-orange-50"
          }`}
        >
          <div className="flex justify-between">
            <h1 className="font-semibold">
              {subjectNotFound ? (
                <span title="Subject Not Found">Subject Not found</span>
              ) : (
                todayClass.Subject?.name
              )}
            </h1>
          </div>

          <div // class detail
            className={`"flex-col" flex gap-2`}
          >
            <DescValue
              textSize="sm"
              keyValue={<ClockCircleOutlined />}
              value={`${todayClass.duration} Hours`}
            />
            <DescValue
              textSize="sm"
              keyValue={
                <Badge size="small" count={todayClass.userBooked.length}>
                  <UserOutlined />
                </Badge>
              }
              value={
                <div className="font-medium">
                  {todayClass.userBooked.map((user) => (
                    <div key={user}>{user}</div>
                  ))}
                </div>
              }
            />
          </div>

          <div className="flex gap-2 text-sm">
            {!subjectNotFound && (
              <Link
                href={`/subjects/${todayClass.subjectId}`}
                target="_blank"
                className="group flex items-center gap-2 text-slate-800"
              >
                <p className="group-hover:text-emerald-500">Subject Details</p>
                <div className="-translate-x-1 transition-all duration-150 group-hover:translate-x-0 group-hover:text-emerald-500">
                  <LuExternalLink />
                </div>
              </Link>
            )}

            <Link
              href={`/time_table/${day}/${todayClass.id}`}
              className="group flex items-center gap-2 text-slate-800"
            >
              <p className="group-hover:text-emerald-500">Class Details</p>
              <div className="-translate-x-1 transition-all duration-150 group-hover:translate-x-0 group-hover:text-emerald-500">
                <LuExternalLink />
              </div>
            </Link>
          </div>

          {!isAccept && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                danger
                onClick={() => {
                  handleRejectClass(todayClass.id);
                }}
              >
                Reject
              </Button>
              <Button
                loading={AcceptLoading}
                type="primary"
                onClick={() => {
                  handleAcceptClass(todayClass.id);
                }}
              >
                <span className="px-5">Accept</span>
              </Button>
            </div>
          )}

          {isAccept && !todayClass.isScheduled && (
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <p className="text-sm"> Schedule for</p>
              <Button
                loading={ScheduleEventLoading}
                onClick={() => {
                  handleScheduleGoogleMeet({
                    class_duration: todayClass.duration,
                    isPassed: isDayPassed,
                    students: todayClass.userBooked,
                    subjectId: todayClass.subjectId!,
                    start_time: todayClass.start_time as Dayjs,
                    subject_name: todayClass.Subject?.name!,
                    timeSlotId: todayClass.id,
                  });
                }}
              >
                {isDayPassed ? (
                  <>
                    next {dayjs(todayClass.start_time).format("dddd on H:mm")}
                  </>
                ) : (
                  <> {dayjs(todayClass.start_time).format("dddd H:mm")}</>
                )}
              </Button>
            </div>
          )}

          {isAccept && todayClass.isScheduled && (
            <div className="absolute bottom-2 right-2 flex items-center gap-2 text-sm">
              <div className="flex gap-1">
                {isDayPassed ? (
                  <p>
                    {`Next week ${dayjs(todayClass.start_time)
                      .add(7, "day")
                      .format("DD MMM | H:mm")}-${dayjs(todayClass.start_time)
                      .add(7, "day")
                      .add(todayClass.duration, "hour")
                      .format("H:mm")}`}
                  </p>
                ) : (
                  <p>
                    {`${dayjs(todayClass.start_time).format("DD MMM | H:mm")}-${dayjs(
                      todayClass.start_time,
                    )
                      .add(todayClass.duration, "hour")
                      .format("H:mm")}`}
                  </p>
                )}
              </div>
              <Link href={todayClass.meetingLink} target="_blank">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#1677ff",
                    },
                  }}
                >
                  <Button icon={<SiGooglemeet />} type="primary">
                    Google Meet
                  </Button>
                </ConfigProvider>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDayTimeTableCard;
