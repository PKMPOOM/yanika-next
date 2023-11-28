"use client";

import { Button, Form, Input, Modal, Select } from "antd";
import { useContext, useState } from "react";
import { SubjectPageContext } from "./AllSubjects";

import { gradesOption } from "@/constant/Grades";
import { editSubjectSchema } from "@/interface/payload_validator";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import WideBTNSpan from "../Global/WideBTNSpan";

const FormItemStyle = {
  marginBottom: 8,
};

function NewSubjectModal() {
  const [form] = Form.useForm();
  const {
    CreateSubjectModalOpen,
    setCreateSubjectModalOpen,
    setActiveSubject,
    setEditSubjectModalOpen,
  } = useContext(SubjectPageContext);

  const [Loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onCancel = async () => {
    form.resetFields();
    setCreateSubjectModalOpen(false);
  };

  const createNewSubject = async (data: z.infer<typeof editSubjectSchema>) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/subject", { data });
      onCancel();
      setLoading(false);
      setEditSubjectModalOpen(true);
      setActiveSubject(response.data.id);
      queryClient.invalidateQueries(["SubjectList"]);
    } catch (error) {
      console.log(error);
    }
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

        <div className=" mt-5 flex w-full justify-end gap-2">
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
