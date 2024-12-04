"use client";

import type { gradeTypes } from "@/interface/interface";
import React, { createContext, useState } from "react";
import Subject from "./Subject";
import { Button, Empty, Input } from "antd";
import Loader from "../Global/Loader";
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
//todo redo responsive => mobile

function AllSubjects() {
  const { data: session } = useSession();
  const [EditSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [CreateSubjectModalOpen, setCreateSubjectModalOpen] = useState(false);
  const [ActiveSubject, setActiveSubject] = useState<string | undefined>(
    undefined,
  );
  const [SearchKey, setSearchKey] = useState("");

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

  const { data: SubjectsData } = useQuery<gradeTypes[]>({
    queryKey: ["SubjectList"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  if (!SubjectsData) {
    return <Loader />;
  }

  if (!session?.user) {
    return <Loader />;
  }

  const filteredSubjectList = SubjectsData?.map((school) => ({
    ...school,
    subjects: school.subjects.filter((subject) => {
      const valuesToSearch = [
        ...Object.values(subject),
        ...(subject.tags || []),
      ];

      return valuesToSearch.some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(SearchKey.toLowerCase()),
      );
    }),
  }));

  return (
    <SubjectPageContext.Provider value={SubjectPageContextValue}>
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <Input.Search
            value={SearchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            placeholder="Search subjects"
          />
          {session.user.role === "admin" && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setCreateSubjectModalOpen(true);
                }}
              >
                <WideBTNSpan>Add Subject</WideBTNSpan>
              </Button>
            </>
          )}
        </div>

        {filteredSubjectList && filteredSubjectList?.length > 0 ? (
          filteredSubjectList.map((grade) => {
            if (grade.subjects.length > 0) {
              return (
                <div key={grade.id} className="mb-4 flex flex-col gap-2">
                  <p className="font-bold">{grade.name}</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {grade.subjects.map((items) => (
                      <Subject key={items.id} subject={items} />
                    ))}
                  </div>
                </div>
              );
            }
          })
        ) : (
          <>
            <Empty />
          </>
        )}
      </div>
      <EditSubjectModal activeSubject={ActiveSubject} />
      <NewSubjectModal />
    </SubjectPageContext.Provider>
  );
}

export default AllSubjects;
