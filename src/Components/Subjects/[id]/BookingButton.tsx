"use client";

import { Button, notification } from "antd";
import React, { createContext, useState } from "react";
import TimeSlotModal from "./TimeSlotModal";
import type { DayList, TimeList } from "@/interface/timeslot_interface";
import { NotificationInstance } from "antd/es/notification/interface";
type Price = {
  groupPrice: number;
  singlePrice: number;
  subjectID: string;
  subjectName: string;
};

type selectedDateTime = {
  day: DayList;
  time: TimeList;
};

type TimeSlotContext = {
  TimeSlotModalOpen: boolean;
  setTimeSlotModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  SelectedClass: classType;
  setSelectedClass: React.Dispatch<React.SetStateAction<classType>>;
  SelectedDateTime: selectedDateTime[];
  setSelectedDateTime: React.Dispatch<React.SetStateAction<selectedDateTime[]>>;
  api: NotificationInstance;
};

export const timeSlotContext = createContext({} as TimeSlotContext);

type classType = {
  classType: "group" | "single";
  classPrice: number;
  subjectID: string;
  subjectName?: string;
};

function BookingButton({
  groupPrice,
  singlePrice,
  subjectID,
  subjectName,
}: Price) {
  const [api, contextHolder] = notification.useNotification();

  const [TimeSlotModalOpen, setTimeSlotModalOpen] = useState(false);
  const [SelectedClass, setSelectedClass] = useState<classType>({
    classType: "single",
    classPrice: 0,
    subjectID: subjectID,
  });
  const [SelectedDateTime, setSelectedDateTime] = useState<selectedDateTime[]>(
    [],
  );

  const openModal = () => {
    setTimeSlotModalOpen(true);
    setSelectedClass({
      classType: "single",
      classPrice: singlePrice,
      subjectID,
      subjectName: subjectName,
    });
  };

  const contextValue = {
    TimeSlotModalOpen,
    setTimeSlotModalOpen,
    SelectedClass,
    setSelectedClass,
    SelectedDateTime,
    setSelectedDateTime,
    api,
  };

  return (
    <timeSlotContext.Provider value={contextValue}>
      {contextHolder}
      <div className=" flex flex-col gap-4">
        {groupPrice > 0 && (
          <div className=" flex items-center gap-4">
            <Button size="large" type="primary" onClick={openModal}>
              {groupPrice} thb/hour
            </Button>
            <div className=" flex gap-2">
              <p>
                group class{" "}
                <span className=" text-slate-500">(3 or more students)</span>
              </p>
            </div>
          </div>
        )}
        <div className=" flex items-center gap-4">
          <Button size="large" onClick={openModal}>
            {singlePrice} thb/hour
          </Button>
          <p>1-1 class </p>
        </div>
        <TimeSlotModal />
      </div>
    </timeSlotContext.Provider>
  );
}

export default BookingButton;
