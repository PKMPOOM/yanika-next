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

type state = {
  googleToken: {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expire_at: string;
  };
};

type Action = {
  setGoogleToken: (tokenData: state["googleToken"]) => void;
};

export const useApplicationStore = create<state & Action>((set) => ({
  googleToken: {
    access_token: "string",
    refresh_token: "string",
    scope: "string",
    token_type: "string",
    id_token: "string",
    expire_at: "string",
  },
  setGoogleToken: (event) => set(() => ({ googleToken: event })),
}));
