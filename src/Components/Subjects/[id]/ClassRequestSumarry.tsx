"use client";

import { formattedUppercase } from "@/lib/formattedUppercase";
import { useBookingModalStore } from "@/store/BookingModalStore";
import { Button, Form, Input } from "antd";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";

const ClassRequestSumarry = () => {
  const [SelectedClass, selectedDay, startTime, classDuration] =
    useBookingModalStore((state) => [
      state.SelectedClass,
      state.selectedDay,
      state.startTime,
      state.classDuration,
    ]);

  if (!SelectedClass) {
    return <>No classs selected</>;
  }

  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
  };

  return (
    <div className=" flex flex-col gap-4 ">
      <div className=" mb-2 mt-4  flex gap-x-16 ">
        <div className=" flex flex-col  text-sm">
          <p className=" text-slate-500">Class booked</p>
          <p className=" text-2xl">{SelectedClass.subjectName}</p>
          <p>Type: {formattedUppercase(SelectedClass.classType)} class</p>
        </div>
        <div className=" flex flex-col gap-4">
          <div className="  flex flex-col gap-2 border-l-[1.5px] border-slate-300 px-4">
            <p className=" text-slate-500">Selected date times</p>
            <div className=" h-[1.5px] w-1/6 bg-slate-300"></div>
            <div className=" flex flex-col gap-0">
              <p>{selectedDay}</p>
              {classDuration} Hours
              <div>
                {dayjs(startTime).format("H:mm")}-
                {dayjs(startTime).add(classDuration, "hour").format("H:mm")}
              </div>
            </div>
          </div>

          <div className=" flex flex-col border-l-[1.5px] border-slate-300 px-4 text-sm">
            <p className=" text-slate-500"> Price</p>

            <p>
              <span className=" text-lg font-semibold">
                {SelectedClass.classPrice * classDuration} Thb
              </span>
            </p>
            <p className=" text-xs text-slate-500">
              {SelectedClass.classPrice} Thb / hours ({SelectedClass.classType}{" "}
              class )
            </p>
          </div>
        </div>
      </div>
      {SelectedClass.classType === "group" && (
        <div className=" w-full ">
          {/* 
          //todo add basicform and push students list to store 
          //todo add each submit have email validation
           */}
          <div className=" my-3 flex flex-col gap-2">
            <div className=" flex items-center justify-between  gap-2">
              <p className=" text-sm">mockemail@gmail.com</p>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                type="primary"
              />
            </div>
            <div className=" flex items-center justify-between  gap-2">
              <p className=" text-sm">mockemail@gmail.com</p>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                type="primary"
              />
            </div>
            <div className=" flex items-center justify-between  gap-2">
              <p className=" text-sm">mockemail@gmail.com</p>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                type="primary"
              />
            </div>
          </div>
          <Form name="test" onFinish={onFinish}>
            <Form.Item
              rules={[
                { required: true, message: "email cannot be blank" },
                {
                  pattern: /\w{5,}@gmail.com$/gm,
                  message: "Please use gmail",
                },
              ]}
              name={"student_name"}
            >
              <div className=" flex gap-2 bg-red-50">
                <Input placeholder="email" />
                <Button htmlType="submit" type="primary">
                  Add
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      )}

      <div>
        notes
        <Input.TextArea />
      </div>
    </div>
  );
};

export default ClassRequestSumarry;
