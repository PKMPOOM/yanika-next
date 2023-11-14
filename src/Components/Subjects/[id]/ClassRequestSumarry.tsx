"use client";

import { formattedUppercase } from "@/lib/formattedUppercase";
import { useBookingModalStore } from "@/store/BookingModalStore";
import { Button, Form, Input, Space } from "antd";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";

const ClassRequestSumarry = () => {
  const [
    SelectedClass,
    selectedDay,
    startTime,
    classDuration,
    addOnStudent,
    removeAddOnStudent,
    addAddOnStudent,
  ] = useBookingModalStore((state) => [
    state.SelectedClass,
    state.selectedDay,
    state.startTime,
    state.classDuration,

    state.addOnStudent,
    state.removeAddOnStudent,
    state.addAddOnStudent,
  ]);

  const [form] = Form.useForm();

  if (!SelectedClass) {
    return <>No classs selected</>;
  }

  const onFinish = (values: any) => {
    const { student_email } = values;
    const isExisted = addOnStudent.includes(student_email);
    if (isExisted) {
      console.log("error");
    } else {
      addAddOnStudent(student_email);
      form.resetFields();
    }
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
            {addOnStudent.length > 0 ? (
              addOnStudent.map((student_email) => (
                <div
                  key={student_email}
                  className=" flex items-center justify-between  gap-2"
                >
                  <p className=" text-sm">{student_email}</p>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    type="primary"
                    onClick={() => {
                      removeAddOnStudent(student_email);
                    }}
                  />
                </div>
              ))
            ) : (
              <div>Class group require at least 2 more students</div>
            )}
          </div>

          <Form form={form} onFinish={onFinish}>
            <Form.Item
              rules={[
                { required: true, message: "email cannot be blank" },
                {
                  pattern: /\w{4,}@gmail.com$/gm,
                  message: "Please use gmail",
                },
                () => ({
                  validator(_, value) {
                    const isExisted = addOnStudent.includes(value);
                    if (!isExisted) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("This email is already added"),
                    );
                  },
                }),
              ]}
              name={"student_email"}
            >
              <Space.Compact block>
                <Input placeholder="email" />
                <Button htmlType="submit" type="primary">
                  Add
                </Button>
              </Space.Compact>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ClassRequestSumarry;
