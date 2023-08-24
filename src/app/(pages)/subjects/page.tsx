import Container from "@/Components/Global/Container";
import React from "react";
import AllSubjects from "@/Components/Subjects/AllSubjects";
import type { gradeTypes } from "@/interface/interface";
import { prisma } from "@/lib/db";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import themeConfig from "@/theme/themeConfig";
import { ConfigProvider } from "antd";

let allSubjects: gradeTypes[] = [
  {
    id: "school_1",
    name: "School 1",
    subjects: [],
  },
  {
    id: "school_2",
    name: "School 2",
    subjects: [],
  },
  {
    id: "high_school_3",
    name: "School 3",
    subjects: [],
  },
  {
    id: "school_4",
    name: "School 4",
    subjects: [],
  },
  {
    id: "school_5",
    name: "School 5",
    subjects: [],
  },
  {
    id: "school_6",
    name: "School 6",
    subjects: [],
  },
];

export const metadata = {
  title: "Subjects",
  description: "Yanika classroom management",
};

export default async function Subjects() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Container>
        <div className=" flex flex-col gap-6">
          <div>
            <p className=" text-3xl p-6 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-lg">
              All subjects
            </p>
          </div>
          <AllSubjects />
        </div>
      </Container>
    </ConfigProvider>
  );
}
