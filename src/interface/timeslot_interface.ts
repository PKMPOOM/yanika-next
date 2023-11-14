import { z } from "zod";

export const Daylist = z.union([
  z.literal("monday"),
  z.literal("tuesday"),
  z.literal("wednesday"),
  z.literal("thursday"),
  z.literal("friday"),
  z.literal("saturday"),
  z.literal("sunday"),
]);

export type DayList = z.infer<typeof Daylist>;

export const TimeList = z.union([
  z.literal("nine_ten"),
  z.literal("ten_eleven"),
  z.literal("eleven_twelve"),
  z.literal("twelve_one"),
  z.literal("one_two"),
  z.literal("two_three"),
  z.literal("three_four"),
  z.literal("four_five"),
  z.literal("five_six"),
]);

export type TimeList = z.infer<typeof TimeList>;

export const requestClass = z.object({
  id: z.string(),
  day: Daylist,
  accepted: z.boolean(),
  subjectId: z.string(),
  userId: z.string(),
  timeSlotId: z.string(),
  subject: z
    .object({
      name: z.string(),
      id: z.string(),
    })
    .nullish(),
  User: z
    .object({
      name: z.string(),
      email: z.string().nullish(),
      id: z.string(),
    })
    .nullish(),
});

export type requestClass = z.infer<typeof requestClass>;

export const TimeSlot = z.object({
  id: z.string(),
  available: z.boolean(),
  start_time: TimeList,
  index: z.number(),
  dayId: Daylist,
  selected: z.boolean().nullish(),
  requestedClass: z.number(),
  bookingData: z
    .object({
      user: z
        .object({
          id: z.string(),
          name: z.string().nullish(),
          email: z.string().nullish(),
        })
        .nullish(),
      subject: z
        .object({
          id: z.string(),
          name: z.string().nullish(),
        })
        .nullish(),
    })
    .nullish(),
});

export type TimeSlot = z.infer<typeof TimeSlot>;

export const Days = z.object({
  id: z.string(),
  name: Daylist,
  index: z.number(),
  time_slot: z.array(TimeSlot),
});

export type Days = z.infer<typeof Days>;
