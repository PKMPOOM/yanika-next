"use client";

import { Button, Modal, Radio, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

import WideBTNSpan from "@/Components/Global/WideBTNSpan";
import { NewDays, useBookingModalStore } from "@/store/BookingModalStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TimeSelectRow from "./TimeSelectRow";
import dayjs from "dayjs";
import ClassRequestSumarry from "./ClassRequestSumarry";
import { timeSlotContext } from "./BookingButton";
const { Title } = Typography;

function TimeSelectModal() {
  const [
    modalOpen,
    setModalOpen,
    setClassDuration,
    classDuration,
    setSelectDateTime,
    startTime,
    selectedDay,
    SelectedClass,
    formStep,
    setFormStep,
    setStartTime,
  ] = useBookingModalStore((state) => [
    state.modalOpen,
    state.setModalOpen,
    state.setClassDuration,
    state.classDuration,
    state.setSelectDateTime,
    state.startTime,
    state.selectedDay,
    state.SelectedClass,
    state.formStep,
    state.setFormStep,
    state.setStartTime,
  ]);
  const [Loading, setLoading] = useState(false);
  const [TimeSlotState, setTimeSlotState] = useState<NewDays[]>([]);
  const { api } = useContext(timeSlotContext);

  const queryClient = useQueryClient();

  const fetchSubjectData = async () => {
    const res = await axios.get(`/api/calendar/timeselect`);

    return res.data;
  };

  const { data: timeSlotData } = useQuery<NewDays[]>({
    queryKey: ["Timeselect"],
    queryFn: fetchSubjectData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (timeSlotData) {
      setTimeSlotState(timeSlotData);
    }
  }, [timeSlotData]);

  const onCancel = async () => {
    setModalOpen(false);
    setFormStep(1);
    setClassDuration(1);
    setStartTime(undefined);
    setSelectDateTime({
      Day: undefined,
      Time: undefined,
    });
  };

  const requestClass = async () => {
    console.log({
      startTime,
      classDuration,
      selectedDay,
      parsed_start_time: dayjs(startTime).format("H:mm"),
      SelectedClass,
    });

    setLoading(true);

    const Payload = {
      startTime,
      classDuration,
      selectedDay,
      parsed_start_time: dayjs(startTime).format("H:mm"),
      SelectedClass,
    };

    await axios
      .post("/api/calendar/request-class", {
        data: Payload,
      })
      .then(() => {
        onCancel();
        api.success({
          message: "Class requested",
          description: "Requestion infotmation sent to admin",
          placement: "topRight",
        });
      })
      .catch((err) => {
        console.log(err);
        api.error({
          message: "Error",
          description: err,
          placement: "topRight",
        });
      });

    setLoading(false);
    queryClient.invalidateQueries(["Timeselect"]);
  };

  if (!timeSlotData) {
    return null;
  }

  return (
    <Modal
      open={modalOpen}
      onCancel={onCancel}
      //   onCancel={onCancel}
      footer={null}
      width={formStep === 1 ? "1000px" : "500px"}
    >
      <div className=" mb-4 flex  flex-col items-start  sm:flex-row sm:items-center sm:gap-4">
        <Title level={3}>Select date & times</Title>
        <div className=" flex gap-2">
          <div className="flex items-center gap-2">
            <div className=" h-3 w-3  rounded-full bg-orange-400"></div>
            <div>Request</div>
          </div>
          <div className="flex items-center gap-2">
            <div className=" h-3 w-3  rounded-full bg-rose-400"></div>
            <div>Booked</div>
          </div>
        </div>
      </div>

      <div className=" flex flex-col gap-3">
        {formStep === 1 ? (
          <>
            <div className=" flex flex-col justify-between gap-2">
              <div className=" flex flex-col gap-2 rounded-md  border bg-slate-50/50  p-2">
                <p>Class Duration</p>
                <Radio.Group
                  defaultValue={classDuration}
                  onChange={(e) => setClassDuration(e.target.value)}
                >
                  <div className=" flex flex-col gap-2 sm:flex-row">
                    <Radio value={1}>1 Hour</Radio>
                    <Radio value={1.5}>1.30 Hours</Radio>
                    <Radio value={2}>2 Hours</Radio>
                  </div>
                </Radio.Group>
              </div>
            </div>
            <TimeSelectRow timeSlot={TimeSlotState} />
          </>
        ) : (
          <ClassRequestSumarry />
        )}
      </div>

      <div className=" mt-5 flex w-full flex-col justify-between gap-2 sm:flex-row">
        <Button htmlType="reset" onClick={onCancel} type="text">
          Cancel
        </Button>

        <div className=" flex flex-col gap-2 sm:flex-row">
          {formStep > 1 && (
            <Button
              onClick={() => {
                setFormStep(1);
              }}
            >
              <WideBTNSpan className=" flex items-center gap-2 px-20 text-white">
                <p>Back</p>
              </WideBTNSpan>
            </Button>
          )}

          {formStep === 1 ? (
            <Button
              disabled={startTime === undefined}
              onClick={() => {
                setFormStep(2);
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
              // disabled={SelectedDateTime.length === 0}
            >
              <WideBTNSpan>Request</WideBTNSpan>
            </Button>
          )}
        </div>
      </div>
    </Modal>
    // <Modal
    //   open={modalOpen}
    //   onCancel={onCancel}
    //   //   onCancel={onCancel}
    //   footer={null}
    //   width={formStep === 1 ? "1000px" : "500px"}
    // >
    //   <Title level={3}>Select date & times</Title>

    //   <div className=" flex flex-col gap-3">
    //     {formStep === 1 ? (
    //       <>
    //         <div className=" flex justify-between">
    //           <div className=" flex gap-2 rounded-md  border bg-slate-50/50  p-2">
    //             <p>Class Duration</p>
    //             <Radio.Group
    //               defaultValue={classDuration}
    //               onChange={(e) => setClassDuration(e.target.value)}
    //             >
    //               <Radio value={1}>1 Hour</Radio>
    //               <Radio value={1.5}>1.30 Hours</Radio>
    //               <Radio value={2}>2 Hours</Radio>
    //             </Radio.Group>
    //           </div>
    //           <div>
    //             <div className="flex items-center gap-2">
    //               <div className=" h-3 w-3  rounded-full bg-orange-400"></div>
    //               <div>Request by others</div>
    //             </div>
    //             <div className="flex items-center gap-2">
    //               <div className=" h-3 w-3  rounded-full bg-rose-400"></div>
    //               <div>Booked by others</div>
    //             </div>
    //           </div>
    //         </div>
    //         <TimeSelectRow timeSlot={TimeSlotState} />
    //       </>
    //     ) : (
    //       <ClassRequestSumarry />
    //     )}
    //   </div>

    //   <div className=" mt-5 flex w-full justify-end gap-2">
    //     <Button htmlType="reset" onClick={onCancel} type="text">
    //       Cancel
    //     </Button>

    //     {formStep > 1 && (
    //       <Button
    //         onClick={() => {
    //           setFormStep(1);
    //         }}
    //       >
    //         <WideBTNSpan className=" flex items-center gap-2 px-20 text-white">
    //           <p>Back</p>
    //         </WideBTNSpan>
    //       </Button>
    //     )}

    //     {formStep === 1 ? (
    //       <Button
    //         // disabled={SelectedDateTime.length === 0}
    //         onClick={() => {
    //           setFormStep(2);
    //         }}
    //       >
    //         <WideBTNSpan className=" flex items-center gap-2 px-20 text-white">
    //           <p>Next</p>
    //         </WideBTNSpan>
    //       </Button>
    //     ) : (
    //       <Button
    //         loading={Loading}
    //         onClick={requestClass}
    //         type="primary"
    //         // disabled={SelectedDateTime.length === 0}
    //       >
    //         <WideBTNSpan>Request</WideBTNSpan>
    //       </Button>
    //     )}
    //   </div>
    // </Modal>
  );
}

export default TimeSelectModal;
