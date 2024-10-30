import { z } from "zod";
import { Grades } from "./interface";
import { TimeList, Daylist } from "./timeslot_interface";

// Create subject POST
export const createSubjectSchema = z.object({
  subject_name: z.string(),
  grade: Grades,
});

// Edit subject PUT
export const editSubjectSchema = z.object({
  subject_name: z.string(),
  description: z.string().optional(),
  course_outline: z.string().optional(),
  group_price: z.number().int().nullable(),
  single_price: z.number().int(),
  grade: Grades,
  tags: z.array(z.string()).optional(), //tags input is string array => mat to object
});

export const selectDateTimeSchema = z.object({
  day: Daylist,
  time: z.array(TimeList),
});

export type SelectDateTime = z.infer<typeof selectDateTimeSchema>;

export const selectedClassSchema = z.object({
  classType: z.string(),
  classPrice: z.number(),
  subjectID: z.string(),
});

export type SelectedClass = z.infer<typeof selectDateTimeSchema>;

//request class schema POST
export const requestClassSchema = z.object({
  SelectedDateTime: z.array(selectDateTimeSchema),
  SelectedClass: selectedClassSchema,
});
