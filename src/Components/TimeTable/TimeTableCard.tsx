"use client";

import { DateTimeMap } from "@/store/BookingModalStore";
import { useQueryClient } from "@tanstack/react-query";
import { Button, ConfigProvider } from "antd";
import axios from "axios";
import dayjs, { type Dayjs } from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import DescValue from "../Global/DescValue";
import { TodayClasses } from "./TimeTable";
import { GoogleOutlined } from "@ant-design/icons";

type RequestSchema = {
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
  singleDay?: boolean;
};

const TimeTableCard = ({
  TIMEGRIDHEIGHT,
  item,
  day,
  LEFTOFSET,
  singleDay = false,
}: Props) => {
  const [AcceptLoading, setAcceptLoading] = useState(false);
  const topOfset =
    TIMEGRIDHEIGHT *
      (DateTimeMap[dayjs(item.start_time).format("H:mm")].index - 1) +
    "px";

  const queryClient = useQueryClient();

  const heigthOfset = `${TIMEGRIDHEIGHT * item.duration - 16}px`;
  const width = `calc(${(100 / 7).toFixed(2)}% - 16px)`;

  const isAccept = item.accept;

  const acceptClass = async (id: string) => {
    setAcceptLoading(true);
    try {
      await axios.put(`/api/calendar/time_table/${id}`);
      queryClient.invalidateQueries(["todayClass", day]);
      setAcceptLoading(false);
    } catch (error) {
      console.log(error);
      setAcceptLoading(false);
    }
  };
  const isPassed = dayjs().isAfter(dayjs(item.start_time));

  const scheduleClass = async (params: RequestSchema) => {
    const response = await axios.post("/api/google/event", {
      ...params,
    });

    console.log(response);
    queryClient.invalidateQueries(["todayClass", day]);
  };

  // console.log(dayjs().isAfter(dayjs(item.start_time)));

  return (
    <div
      key={item.id}
      style={{
        width: singleDay ? "94%" : width,
        top: topOfset,
        height: heigthOfset,
        left: LEFTOFSET && `${LEFTOFSET}px`,
      }}
      className="absolute z-10 flex overflow-hidden p-2"
    >
      <div
        className={`relative flex w-full flex-col gap-2 overflow-hidden rounded  border  p-2 text-slate-900 ${
          item.accept
            ? "border-emerald-500 bg-emerald-50"
            : "border-orange-500 bg-orange-50"
        }`}
      >
        <Link href={`/time_table/${day}/${item.id}`} className=" ">
          <div
            className={`group flex items-center justify-between overflow-y-hidden font-semibold text-slate-900 ${
              isAccept ? "hover:text-emerald-500" : "hover:text-orange-500"
            }`}
          >
            <div>{item.subject?.name}</div>
            <div className=" -translate-x-1 transition-all duration-150 group-hover:translate-x-0 ">
              <LuExternalLink />
            </div>
          </div>
        </Link>

        {singleDay ? (
          <div className=" flex flex-col gap-2 text-sm ">
            <div className=" flex gap-2">
              <p>Students</p>
              <ul>
                {item.userBooked.map((user, index) => (
                  <li key={user}>
                    {index + 1}. {user}
                  </li>
                ))}
              </ul>
            </div>

            <DescValue
              textSize="sm"
              keyValue="Duration"
              value={`${item.duration} Hours`}
            />
            <Link
              href={`/subjects/${item.subjectId}`}
              target="_blank"
              className=" group flex items-center gap-2 text-slate-800"
            >
              <p className=" group-hover:text-emerald-500">Subject Details</p>
              <div className=" -translate-x-1 transition-all duration-150 group-hover:translate-x-0 group-hover:text-emerald-500">
                <LuExternalLink />
              </div>
            </Link>
          </div>
        ) : (
          <div className=" text-xs">{item.userBooked.length} student</div>
        )}

        {/* settings */}
        {singleDay && !isAccept && (
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button danger>Reject</Button>
            <Button
              loading={AcceptLoading}
              type="primary"
              onClick={() => {
                acceptClass(item.id);
              }}
            >
              Accept
            </Button>
          </div>
        )}

        {singleDay && isAccept && !item.isScheduled && (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 ">
            <p className=" text-sm"> Schedule for</p>
            <Button
              onClick={() => {
                scheduleClass({
                  class_duration: item.duration,
                  isPassed,
                  students: item.userBooked,
                  subjectId: item.subjectId!,
                  start_time: item.start_time as Dayjs,
                  subject_name: item.subject?.name!,
                  timeSlotId: item.id,
                });
              }}
            >
              {isPassed ? (
                <>next {dayjs(item.start_time).format("dddd on H:mm")}</>
              ) : (
                <> {dayjs(item.start_time).format("dddd H:mm")}</>
              )}
            </Button>
          </div>
        )}

        {singleDay && isAccept && item.isScheduled && (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-sm">
            <div className=" flex gap-1">
              <p className=" "> Scheduled on</p>
              {isPassed ? (
                <p>next {dayjs(item.start_time).format("dddd on H:mm")}</p>
              ) : (
                <p> {dayjs(item.start_time).format("dddd H:mm")}</p>
              )}
            </div>
            <Link href={item.meetingLink} target="_blank">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#1677ff",
                  },
                }}
              >
                <Button icon={<GoogleOutlined />} type="primary">
                  Open Google Meet
                </Button>
              </ConfigProvider>
            </Link>

            <Button danger>Cancel this class</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTableCard;
