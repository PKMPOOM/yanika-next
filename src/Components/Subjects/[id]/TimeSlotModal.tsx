"use client";

import { Button, Modal, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import WideBTNSpan from "@/Components/Global/WideBTNSpan";
import { timeSlotContext } from "./BookingButton";
import { Days } from "@/interface/timeslot_interface";
import TimeTableRow from "./TimeTableRow";
import { SelectDateTime } from "@/interface/payload_validator";
import ClassRequestSumarry from "./ClassRequestSumarry";

const { Title } = Typography;

function TimeSlotModal() {
  const {
    TimeSlotModalOpen,
    setTimeSlotModalOpen,
    // SelectedClass,
    SelectedDateTime,
    setSelectedDateTime,
    api,
  } = useContext(timeSlotContext);

  const [Loading, setLoading] = useState(false);
  const [TimeSlotState, setTimeSlotState] = useState<TimeSlotArray>([]);
  const [FormSteps, setFormSteps] = useState(1);

  const queryClient = useQueryClient();

  const TimeSlotArray = z.array(Days);

  type TimeSlotArray = z.infer<typeof TimeSlotArray>;

  const fetchSubjectData = async () => {
    const res = await axios.get(`/api/calendar/timeslot`);

    const timeSlotData = TimeSlotArray.parse(res.data.timeSlot);

    return timeSlotData;
  };

  const { data: timeSlotData } = useQuery<Days[]>({
    queryKey: ["Timeslot"],
    queryFn: fetchSubjectData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (timeSlotData) {
      setTimeSlotState(timeSlotData);
    }
  }, [timeSlotData]);

  const onCancel = async () => {
    setTimeSlotModalOpen(false);
    setSelectedDateTime([]);
    setFormSteps(1);
  };

  console.log(SelectedDateTime);

  const requestClass = async () => {
    setLoading(true);

    const newArray: SelectDateTime[] = [];

    SelectedDateTime.forEach((item) => {
      const existingItem = newArray.find((obj) => obj.day === item.day);
      if (existingItem) {
        existingItem.time.push(item.time);
      } else {
        newArray.push({
          day: item.day,
          time: [item.time],
        });
      }
    });

    const Payload = {
      SelectedDateTime: newArray,
      // SelectedClass,
    };

    await axios
      .post("/api/calendar/request-class", {
        data: Payload,
      })
      .then(() => {
        setLoading(false);
        setTimeSlotModalOpen(false);
        setSelectedDateTime([]);
        api.success({
          message: "Class requested",
          description: "Requestion infotmation sent to admin",
          placement: "topRight",
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        api.error({
          message: "Error",
          description: err,
          placement: "topRight",
        });
      });

    queryClient.invalidateQueries(["Timeslot"]);
  };

  return (
    <Modal
      open={TimeSlotModalOpen}
      onCancel={onCancel}
      footer={null}
      // width={"1000px"}
      width={FormSteps === 1 ? "1000px" : "500px"}
    >
      {FormSteps === 1 ? (
        <>
          <Title level={3}>Select date & times</Title>
          <div className=" mb-4 flex items-center gap-2">
            <div className=" h-3 w-3  rounded-full bg-orange-400"></div>
            <div>Pending request by others</div>
          </div>
        </>
      ) : (
        <Title level={3}>Class request sumarry</Title>
      )}

      {FormSteps === 1 ? (
        <TimeTableRow timeSlot={TimeSlotState} />
      ) : (
        <ClassRequestSumarry />
      )}

      <div className=" mt-5 flex w-full justify-end gap-2">
        <Button htmlType="reset" onClick={onCancel} type="text">
          Cancel
        </Button>

        {FormSteps > 1 && (
          <Button
            onClick={() => {
              setFormSteps(1);
            }}
          >
            <WideBTNSpan className=" flex items-center gap-2 px-20 text-white">
              <p>Back</p>
            </WideBTNSpan>
          </Button>
        )}

        {FormSteps === 1 ? (
          <Button
            disabled={SelectedDateTime.length === 0}
            onClick={() => {
              setFormSteps(2);
            }}
          >
            <WideBTNSpan className=" flex items-center gap-2 px-20 text-white">
              <p>Next</p>
            </WideBTNSpan>
          </Button>
        ) : (
          <Button
            loading={Loading}
            onClick={requestClass}
            type="primary"
            disabled={SelectedDateTime.length === 0}
          >
            <WideBTNSpan>Request</WideBTNSpan>
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default TimeSlotModal;
