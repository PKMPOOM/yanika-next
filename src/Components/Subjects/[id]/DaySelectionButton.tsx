import { Button, Segmented } from "antd";
import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useBookingModalStore } from "@/store/BookingModalStore";
import { AVAILABLEDAYS } from "@/constant/AvailableDateTime";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { DayList } from "@/interface/timeslot_interface";
import Container from "@/Components/Global/Container";

export default function DaySelectionButton() {
  const [currentDay, setCurrentDay] = useBookingModalStore((state) => [
    state.currentDay,
    state.setCurrentDay,
  ]);

  return (
    <div className=" w-full">
      <Container nopadding margin={false}>
        <div className="hidden w-full items-center justify-start gap-4 sm:flex ">
          <Segmented
            onChange={(e) => setCurrentDay(AVAILABLEDAYS.indexOf(e as DayList))}
            value={currentDay}
            options={AVAILABLEDAYS.map((day) => ({
              value: day,
              label: formattedUppercase(day),
            }))}
          />
        </div>
        <div className="flex w-full items-center justify-center gap-4 sm:hidden ">
          <Button
            disabled={currentDay === "monday"}
            icon={<LeftOutlined />}
            shape="circle"
            onClick={() => {
              if (currentDay) {
                setCurrentDay(AVAILABLEDAYS.indexOf(currentDay) - 1);
              }
            }}
          />
          <p className=" w-36 text-center text-lg font-semibold">
            {currentDay ? formattedUppercase(currentDay) : "no day selected"}
          </p>
          <Button
            disabled={currentDay === "saturday"}
            icon={<RightOutlined />}
            shape="circle"
            onClick={() => {
              if (currentDay) {
                setCurrentDay(AVAILABLEDAYS.indexOf(currentDay) + 1);
              }
            }}
          />
        </div>
      </Container>
    </div>
  );
}
