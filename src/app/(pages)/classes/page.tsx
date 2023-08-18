"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Loader from "@/Components/Global/Loader";
import type { Dayjs } from "dayjs";
import { Calendar, ConfigProvider } from "antd";
import type { CalendarProps } from "antd";
import themeConfig from "@/theme/themeConfig";
import dayjs from "dayjs";

export default function Classes() {
  const { data: session } = useSession();
  const today = dayjs();

  const [Value, setValue] = useState(today);

  const onSelect = (newValue: Dayjs) => {
    console.log(dayjs(newValue).format("DD-MMM-YYYY"));
    setValue(newValue);
  };

  if (!session?.user) {
    return <Loader />;
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <main className=" min-h-full flex items-center justify-center">
        <div className=" max-w-7xl pt-6 w-full flex gap-4">
          <div className=" w-2/4">
            <Calendar
              value={Value}
              // onPanelChange={onPanelChange}
              onSelect={onSelect}
            />
          </div>
          <div className=" w-2/4">
            <p className=" text-4xl">Welcome {session?.user.name}</p>
          </div>
        </div>
      </main>
    </ConfigProvider>
  );
}
