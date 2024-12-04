"use client";

import { Button } from "antd";
import { scheduleGoogleMeet } from "./api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { TodayClasses } from "./TimeTable";
import { ScheduleGoogleMeetRequestSchema } from "./SingleDayTimeCard";

const ClassActionButton = ({ todayClass }: { todayClass: TodayClasses }) => {
  const [scheduleEventLoading, setScheduleEventLoading] = useState(false);
  const queryClient = useQueryClient();
  const isDayPassed = dayjs().isAfter(dayjs(todayClass.start_time), "day");

  const handleScheduleGoogleMeet = async (
    params: ScheduleGoogleMeetRequestSchema,
  ) => {
    setScheduleEventLoading(true);
    try {
      await scheduleGoogleMeet(params);

      queryClient.invalidateQueries({
        queryKey: ["todayClass", todayClass.dayId],
      });
    } catch (error) {
      console.log(error);
    }
    setScheduleEventLoading(false);
  };

  return (
    <Button
      loading={scheduleEventLoading}
      type="primary"
      onClick={() => {
        handleScheduleGoogleMeet({
          timeSlotId: todayClass.id,
          subjectId: todayClass.subjectId!,
          start_time: todayClass.start_time as Dayjs,
          class_duration: todayClass.duration,
          students: todayClass.userBooked,
          isPassed: isDayPassed,
          subject_name: todayClass.Subject?.name!,
        });
      }}
      block
    >
      <span className="px-5">Accept this class</span>
    </Button>
  );
};

export default ClassActionButton;
