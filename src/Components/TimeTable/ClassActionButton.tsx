"use client";

import { Button } from "antd";
import { useState } from "react";
import { acceptClass } from "./api";
import { TodayClasses } from "./TimeTable";
import { useQueryClient } from "@tanstack/react-query";

const ClassActionButton = ({ todayClass }: { todayClass: TodayClasses }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const acceptThisClass = async (id: string) => {
    setLoading(true);
    await acceptClass(id);
    setLoading(false);
    queryClient.invalidateQueries({
      queryKey: ["todayClass", todayClass.dayId],
    });
  };

  return (
    <Button
      loading={loading}
      type="primary"
      onClick={() => {
        acceptThisClass(todayClass.id);
      }}
      block
    >
      <span className="px-5">Accept this class</span>
    </Button>
  );
};

export default ClassActionButton;
