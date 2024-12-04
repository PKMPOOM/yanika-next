"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import { TimeSlot } from "@/store/BookingModalStore";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { find } from "lodash-es";
import { useSession } from "next-auth/react";

export default function Classes() {
  const { data: session } = useSession();

  const fetchData = async () => {
    const res = await axios.get(`/api/subject/my_subject/${session?.user.id}`);

    return res.data;
  };

  const { data: todayClass } = useQuery<TimeSlot[]>({
    queryFn: fetchData,
    queryKey: ["myClassCalendar"],
    refetchOnWindowFocus: false,
  });

  if (!session?.user) {
    return <Loader />;
  }

  if (!todayClass) {
    return <Loader />;
  }

  const dateCellRender = (value: Dayjs) => {
    const thisDay = find(todayClass, function (o) {
      const isPassed = dayjs().isAfter(dayjs(o?.start_time));

      const startTime = isPassed
        ? dayjs(o?.start_time).add(7, "day")
        : dayjs(o?.start_time);

      return dayjs(value).isSame(startTime, "date");
    });

    const todayClassesData = todayClass.filter((o) => {
      const isPassed = dayjs().isAfter(dayjs(o?.start_time));

      const startTime = isPassed
        ? dayjs(o?.start_time).add(7, "day")
        : dayjs(o?.start_time);

      return dayjs(value).isSame(startTime, "date");
    });

    if (todayClassesData) {
      return (
        <div>
          {todayClassesData.map((classData) => (
            <div
              key={classData.id}
              className="cursor-pointer bg-red-300"
              onClick={() => {
                console.log(thisDay);
              }}
            >
              {classData.parsed_start_time} : {classData.subject?.name}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <Container>
      {`${session.user.role} mode`}
      <Calendar
        // value={Value}
        // onSelect={onSelect}
        cellRender={(current, info) => {
          if (info.type === "date") return dateCellRender(current);
          return info.originNode;
        }}
      />
    </Container>
  );
}
