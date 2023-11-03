"use client";

import Loader from "@/Components/Global/Loader";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

  const dateCellRender = (value: Dayjs) => {
    const test = dayjs().isSame(value, "date");
    return (
      <div className={`${test ? "bg-red-100" : ""}`}>
        <pre>{JSON.stringify(test)}</pre>
      </div>
    );
  };

  return (
    <main className=" flex min-h-full items-center justify-center">
      <div className=" flex w-full max-w-7xl gap-4 pt-6">
        <div className=" w-3/4">
          <Calendar
            value={Value}
            onSelect={onSelect}
            cellRender={(current, info) => {
              if (info.type === "date") return dateCellRender(current);
              return info.originNode;
            }}
          />
        </div>
        <div className=" w-1/4">
          <p className=" text-4xl">Welcome {session?.user.name}</p>
        </div>
      </div>
    </main>
  );
}
