import { Grades } from "@/interface/interface";
import { z } from "zod";
import { create } from "zustand";

export const subjectListSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: Grades,
  description: z.string(),
  tags: z.array(z.string()).nullable(),
  img_url: z.string().nullable(),
  course_outline: z.string().nullable(),
  group_price: z.number().nullable(),
  single_price: z.number().nullable(),
});

export type subjectFullTypes = z.infer<typeof subjectListSchema>;

type Action = {
  onNameChange: (label: string) => void;
  setName: (label: string) => void;
  onDescriptionChange: (label: string) => void;
  setDescription: (label: string) => void;
  onCourseOutlineChange: (label: string) => void;
  setCourseOutline: (label: string) => void;
  onGradeChange: (label: subjectFullTypes["grade"]) => void;
  setGrade: (label: subjectFullTypes["grade"]) => void;
  onGroupPriceChange: (label: number) => void;
  setGroupPrice: (label: number) => void;
  onImgUrlChange: (label: string) => void;
  setImgUrl: (label: string) => void;
  onSinglePriceChange: (label: number) => void;
  setSinglePrice: (label: number) => void;
};

type Tags = {
  tags: string[] | null;
  onTagsChange: (label: string[]) => void;
  setTags: (label: string[]) => void;
};

export const useSubjectStore = create<subjectFullTypes & Action & Tags>(
  (set) => ({
    id: "",
    //   name
    name: "",
    onNameChange: (event) => set(() => ({ name: event })),
    setName: (event) => set(() => ({ name: event })),

    // description
    description: "",
    onDescriptionChange: (event) => set(() => ({ description: event })),
    setDescription: (event) => set(() => ({ description: event })),

    // course outline
    course_outline: "",
    onCourseOutlineChange: (event) => set(() => ({ course_outline: event })),
    setCourseOutline: (event) => set(() => ({ course_outline: event })),

    // grade
    grade: "school_1",
    onGradeChange: (event) => set(() => ({ grade: event })),
    setGrade: (event) => set(() => ({ grade: event })),

    // group price
    group_price: 0,
    onGroupPriceChange: (event) => set(() => ({ group_price: event })),
    setGroupPrice: (event) => set(() => ({ group_price: event })),

    // image URL
    img_url: "",
    onImgUrlChange: (event) => set(() => ({ img_url: event })),
    setImgUrl: (event) => set(() => ({ img_url: event })),

    // single price
    single_price: 0,
    onSinglePriceChange: (event) => set(() => ({ single_price: event })),
    setSinglePrice: (event) => set(() => ({ single_price: event })),

    // tags
    tags: null,
    onTagsChange: (event) => set(() => ({ tags: event })),
    setTags: (event) => set(() => ({ tags: event })),
  })
);
