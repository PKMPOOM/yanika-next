"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Loader from "@/Components/Global/Loader";
import type { Dayjs } from "dayjs";
import { Calendar } from "antd";
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
    <main className=" flex min-h-full items-center justify-center">
      <div className=" flex w-full max-w-7xl gap-4 pt-6">
        <div className=" w-2/4">
          <Calendar value={Value} onSelect={onSelect} />
        </div>
        <div className=" w-2/4">
          <p className=" text-4xl">Welcome {session?.user.name}</p>
        </div>
      </div>
    </main>
  );
}
