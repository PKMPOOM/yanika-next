"use client";

import { Button, notification } from "antd";
import React, { createContext, useState } from "react";
import type { DayList, TimeList } from "@/interface/timeslot_interface";
import { NotificationInstance } from "antd/es/notification/interface";
import TimeSelectModal from "./TimeSelectModal";
import { useShallow } from "zustand/react/shallow";
import { classType, useBookingModalStore } from "@/store/BookingModalStore";
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

  SelectedDateTime: selectedDateTime[];
  setSelectedDateTime: React.Dispatch<React.SetStateAction<selectedDateTime[]>>;
  api: NotificationInstance;
  SelectTime: TimeList[] | undefined;
  setSelectTime: React.Dispatch<React.SetStateAction<TimeList[] | undefined>>;
};

export const timeSlotContext = createContext({} as TimeSlotContext);

function BookingButton({
  groupPrice,
  singlePrice,
  subjectID,
  subjectName,
}: Price) {
  const [api, contextHolder] = notification.useNotification();
  const [TimeSlotModalOpen, setTimeSlotModalOpen] = useState(false);

  const [SelectedDateTime, setSelectedDateTime] = useState<selectedDateTime[]>(
    [],
  );
  const [SelectTime, setSelectTime] = useState<TimeList[] | undefined>(
    undefined,
  );

  const [setModalOpen, setSelectedClass] = useBookingModalStore(
    useShallow((state) => [state.setModalOpen, state.setSelectedClass]),
  );

  const openModal = (classType: classType["classType"]) => {
    setModalOpen(true);
    setSelectedClass({
      classType: classType,
      classPrice: classType === "group" ? groupPrice : singlePrice,
      subjectID,
      subjectName: subjectName,
    });
  };

  const contextValue = {
    TimeSlotModalOpen,
    setTimeSlotModalOpen,
    setSelectedClass,
    SelectedDateTime,
    setSelectedDateTime,
    api,
    SelectTime,
    setSelectTime,
  };

  return (
    <timeSlotContext.Provider value={contextValue}>
      {contextHolder}
      <div className="flex flex-col gap-4 rounded-lg border border-emerald-500 bg-emerald-50 p-4">
        <p className="text-lg font-semibold">Book this subject</p>
        {groupPrice > 0 && (
          <div className="flex items-center gap-4">
            <Button
              size="large"
              type="primary"
              onClick={() => openModal("group")}
            >
              {groupPrice} thb/hour
            </Button>
            <div className="flex gap-2">
              <p>
                group class{" "}
                <span className="text-slate-500">(3 or more students)</span>
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            size="large"
            onClick={() => openModal("single")}
            type={groupPrice > 0 ? "default" : "primary"}
          >
            {singlePrice} thb/hour
          </Button>
          <p>1-1 class </p>
        </div>
        <TimeSelectModal />
      </div>
    </timeSlotContext.Provider>
  );
}

export default BookingButton;
