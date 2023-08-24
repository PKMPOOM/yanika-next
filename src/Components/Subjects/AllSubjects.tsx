"use client";

import type { gradeTypes } from "@/interface/interface";
import React, { createContext, useState } from "react";
import Subject from "./Subject";
import { Button, ConfigProvider, Input } from "antd";
import Loader from "../Global/Loader";
import themeConfig from "@/theme/themeConfig";
import EditSubjectModal from "./EditSubjectModal";
import WideBTNSpan from "../Global/WideBTNSpan";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NewSubjectModal from "./NewSubjectModal";
import { useSession } from "next-auth/react";

type SubjectPageContext = {
  EditSubjectModalOpen: boolean;
  setEditSubjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  CreateSubjectModalOpen: boolean;
  setCreateSubjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveSubject: string | undefined;
  setActiveSubject: React.Dispatch<string | undefined>;
};

export const SubjectPageContext = createContext({} as SubjectPageContext);

function AllSubjects() {
  const { data: session } = useSession();

  const [EditSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [CreateSubjectModalOpen, setCreateSubjectModalOpen] = useState(false);
  const [ActiveSubject, setActiveSubject] = useState<string | undefined>(
    undefined
  );

  const SubjectPageContextValue: SubjectPageContext = {
    EditSubjectModalOpen,
    setEditSubjectModalOpen,
    CreateSubjectModalOpen,
    setCreateSubjectModalOpen,
    ActiveSubject,
    setActiveSubject,
  };

  const fetchData = async () => {
    const res = await axios.get("/api/subject");
    return res.data.subjectList;
  };

  const { data: SubjectsData, isLoading } = useQuery<gradeTypes[]>({
    queryKey: ["SubjectList"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  if (!session?.user) {
    return <Loader />;
  }

  return (
    <SubjectPageContext.Provider value={SubjectPageContextValue}>
      <div className="  flex flex-col gap-6">
        <div className=" flex gap-2 ">
          <Input.Search placeholder="Search subjects" />
          {session.user.role === "admin" && (
            <>
              <Button
                onClick={() => {
                  setCreateSubjectModalOpen(true);
                }}
                type="primary"
              >
                <WideBTNSpan>Add Subject</WideBTNSpan>
              </Button>
            </>
          )}
        </div>

        {isLoading && <Loader />}

        {SubjectsData &&
          SubjectsData.map((grade) => {
            if (grade.subjects.length > 0) {
              return (
                <div key={grade.id} className=" flex flex-col gap-2 mb-4 ">
                  <p className=" font-bold">{grade.name}</p>
                  <div className=" grid grid-cols-4 gap-4">
                    {grade.subjects.map((items) => (
                      <Subject key={items.id} subject={items} />
                    ))}
                  </div>
                </div>
              );
            }
          })}
      </div>
      <EditSubjectModal activeSubject={ActiveSubject} />
      <NewSubjectModal />
    </SubjectPageContext.Provider>
  );
}

export default AllSubjects;
