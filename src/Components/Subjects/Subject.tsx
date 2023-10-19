"use client";

import React, { useContext } from "react";
import { subjectListTypes } from "@/interface/interface";
import { Button, Popconfirm, Tag, Typography } from "antd";
import { SubjectPageContext } from "./AllSubjects";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DeleteTwoTone,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../Global/Loader";

const { Paragraph } = Typography;
function Subject({ subject }: { subject: subjectListTypes }) {
  const router = useRouter();
  const { setEditSubjectModalOpen, setActiveSubject } =
    useContext(SubjectPageContext);
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  if (!session) {
    return <Loader />;
  }

  const IsAdmin = session?.user.role === "admin";

  const onDelete = async () => {
    await axios.delete(`/api/subject/${subject.id}`);
    queryClient.invalidateQueries(["SubjectList"]);
  };

  return (
    <div
      onClick={() => {
        router.push(`/subjects/${subject.id}`);
      }}
      className=" flex cursor-pointer 
      flex-col items-start justify-start gap-2 rounded-lg border border-slate-200 p-4 
      shadow-sm transition-all duration-300 hover:shadow-xl "
    >
      <div className=" flex  w-full justify-between">
        <div className=" font-semibold">{subject.name}</div>
        {IsAdmin && (
          <div className=" flex gap-2">
            <Button
              shape="circle"
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setEditSubjectModalOpen(true);
                setActiveSubject(subject.id);
              }}
            />
            <Popconfirm
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              onPopupClick={(e) => {
                e.stopPropagation();
              }}
              title="Delete this subject?"
              description="Are you sure to delete this subject?"
              onConfirm={() => {
                onDelete();
              }}
              okText="Delete"
              okButtonProps={{
                danger: true,
              }}
            >
              <Button
                danger
                shape="circle"
                size="small"
                type="text"
                icon={<DeleteTwoTone twoToneColor="red" />}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </Popconfirm>
          </div>
        )}
      </div>
      <Paragraph
        type="secondary"
        ellipsis={{
          rows: 3,
        }}
      >
        {subject.description}
      </Paragraph>
      <div className=" mt-auto flex flex-wrap gap-y-2">
        {subject.tags?.map((tags, index) => <Tag key={index}>{tags}</Tag>)}
      </div>
    </div>
  );
}

export default Subject;
