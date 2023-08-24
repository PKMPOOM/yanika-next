import { z } from "zod";
import { Grades } from "./interface";

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
