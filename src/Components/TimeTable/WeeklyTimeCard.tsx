"use client";

import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import DescValue from "../Global/DescValue";
import { TodayClasses } from "./TimeTable";

type Props = {
  TIMEGRIDHEIGHT: number;
  LEFTOFSET?: number;
  item: TodayClasses;
  day: string;
};

const WeeklyTimeTableCard = ({
  TIMEGRIDHEIGHT,
  item: todayClass,
  day,
  LEFTOFSET,
}: Props) => {
  const customHeight = `${TIMEGRIDHEIGHT * 2 * todayClass.duration}px`;
  const subjectNotFound = todayClass.Subject === null;

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
            <div className="flex w-full gap-2 text-sm">
              <Link
                href={`/time_table/${day}/${todayClass.id}`}
                className={`group flex w-full items-center justify-between gap-2 ${
                  subjectNotFound ? "text-rose-500" : "text-slate-800"
                }`}
              >
                <h1
                  className={`font-semibold transition-all duration-150 ${
                    subjectNotFound
                      ? "group-hover:text-rose-500"
                      : "group-hover:text-emerald-500"
                  }`}
                >
                  {todayClass.Subject ? (
                    todayClass.Subject.name
                  ) : (
                    <span title="Subject Not Found">Not found!</span>
                  )}
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
            </div>
          </div>

          <div // class detail
            className={`flex flex-col gap-2`}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimeTableCard;
