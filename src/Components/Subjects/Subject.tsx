"use client";

import React, { useContext } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { subjectListTypes } from "@/interface/interface";
import { Button, Tag } from "antd";
import { SubjectPageContext } from "./AllSubjects";
function Subject({ subject }: { subject: subjectListTypes }) {
  const { setEditSubjectModalOpen, setActiveSubject } =
    useContext(SubjectPageContext);
  return (
    <div
      onClick={() => {
        console.log("click on card");
      }}
      className=" cursor-pointer hover:shadow-md shadow-sm transition-all duration-150 flex flex-col gap-2 p-4 border border-slate-200 rounded-lg items-start justify-start"
    >
      <div className=" flex  justify-between w-full">
        <div className=" font-semibold">{subject.name}</div>
        <div className=" flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setEditSubjectModalOpen(true);
              setActiveSubject(subject.id);
            }}
            size="small"
            type="text"
            icon={<EditOutlined />}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              console.log("click on delete");
            }}
            size="small"
            danger
            type="text"
            icon={<DeleteOutlined />}
          />
        </div>
      </div>
      <p className=" text-xs text-slate-500">{subject.description}</p>
      <div>
        {subject.tags?.map((tags, index) => (
          <Tag key={index}>{tags}</Tag>
        ))}
      </div>
    </div>
  );
}

export default Subject;
