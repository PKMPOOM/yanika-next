import { z } from "zod";

export const systemRoles = z.enum(["user", "admin"]);
export type systemRoles = z.infer<typeof systemRoles>;

// Nav
export const navMenuSchema = z.object({
  name: z.string(),
  id: z.string(),
  href: z.string(),
  role: z.array(systemRoles),
});
export type navMenuTypes = z.infer<typeof navMenuSchema>;

// Subjects
export const Grades = z.union([
  z.literal("school_1"),
  z.literal("school_2"),
  z.literal("school_3"),
  z.literal("school_4"),
  z.literal("school_5"),
  z.literal("school_6"),
  z.literal("high_school_1"),
  z.literal("high_school_2"),
  z.literal("high_school_3"),
  z.literal("high_school_4"),
  z.literal("high_school_5"),
  z.literal("high_school_6"),
  z.literal("university"),
]);

export const subjectListSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: Grades,
  description: z.string(),
  tags: z.array(z.string()).nullable(),
});

export type subjectListTypes = z.infer<typeof subjectListSchema>;

export const subjectExtraSchema = z.object({
  image_url: z.string().nullable(),
  course_outline: z.string(),
  group_price: z.number().nullable(),
  single_price: z.number().nullable(),
});

export const subjectFullSchema = z.object({
  ...subjectListSchema.shape,
  ...subjectExtraSchema.shape,
});

export type subjectFullTypes = z.infer<typeof subjectFullSchema>;

export const gradeSchema = z.object({
  id: Grades,
  name: z.string(),
  subjects: z.array(subjectListSchema),
});

export type gradeTypes = z.infer<typeof gradeSchema>;
