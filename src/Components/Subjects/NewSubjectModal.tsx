"use client";

import { Button, Form, Input, Modal, Select } from "antd";
import React, { useContext, useState } from "react";
import { SubjectPageContext } from "./AllSubjects";

import WideBTNSpan from "../Global/WideBTNSpan";
import axios from "axios";
import { gradesOption } from "@/constant/Grades";
import { z } from "zod";
import { editSubjectSchema } from "@/interface/payload_validator";
import { useQueryClient } from "@tanstack/react-query";

const FormItemStyle = {
  marginBottom: 8,
};

function NewSubjectModal() {
  const [form] = Form.useForm();
  const { CreateSubjectModalOpen, setCreateSubjectModalOpen } =
    useContext(SubjectPageContext);

  const [Loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onCancel = async () => {
    form.resetFields();
    setCreateSubjectModalOpen(false);
  };

  const createNewSubject = async (data: z.infer<typeof editSubjectSchema>) => {
    setLoading(true);
    await axios
      .post("/api/subject", { data })
      .then(() => {
        onCancel();
        setLoading(false);
      })
      .finally(() => {
        queryClient.invalidateQueries(["SubjectList"]);
      });
  };

  return (
    <Modal open={CreateSubjectModalOpen} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        layout="vertical"
        onFinish={createNewSubject}
        requiredMark={"optional"}
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "Subject name cannot be empty",
            },
          ]}
          name={"subject_name"}
          style={FormItemStyle}
          label="Subject Name"
        >
          <Input placeholder="Subject Name" />
        </Form.Item>

        <Form.Item
          name={"grade"}
          style={FormItemStyle}
          label="Grade"
          rules={[
            {
              required: true,
              message: "Please select grade for this subject",
            },
          ]}
        >
          <Select showSearch options={gradesOption} />
        </Form.Item>

        <div className=" flex gap-2 justify-end w-full mt-5">
          <Button htmlType="reset" onClick={onCancel} type="text">
            Cancel
          </Button>
          <Button loading={Loading} htmlType="submit" type="primary">
            <WideBTNSpan>Create</WideBTNSpan>
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default NewSubjectModal;
