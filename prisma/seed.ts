import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { v4 as uuid } from "uuid";
const prisma = new PrismaClient();

async function main() {
  const password = await hash(process.env.INIT_ADMIN_PASSWORD as string, 12);
  const user = await prisma.user.upsert({
    where: { email: process.env.INIT_ADMIN_EMAIL },
    update: {},
    create: {
      id: uuid(),
      email: process.env.INIT_ADMIN_EMAIL,
      name: process.env.INIT_ADMIN_USERNAME,
      password,
      role: "admin",
    },
  });

  console.log({ user });

  await prisma.day.createMany({
    data: [
      { id: "monday", name: "monday" },
      { id: "tuesday", name: "tuesday" },
      { id: "wednesday", name: "wednesday" },
      { id: "thursday", name: "thursday" },
      { id: "friday", name: "friday" },
      { id: "saturday", name: "saturday" },
      { id: "sunday", name: "sunday" },
    ],
    skipDuplicates: true,
  });

  await prisma.timeSlot.createMany({
    data: [
      {
        id: "monday_nine_ten",
        dayId: "monday",
        start_time: "nine_ten",
      },
      {
        id: "monday_ten_eleven",
        dayId: "monday",
        start_time: "ten_eleven",
      },
      {
        id: "monday_eleven_twelve",
        dayId: "monday",
        start_time: "eleven_twelve",
      },
      {
        id: "monday_twelve_one",
        dayId: "monday",
        start_time: "twelve_one",
      },
      {
        id: "monday_one_two",
        dayId: "monday",
        start_time: "one_two",
      },
      {
        id: "monday_two_three",
        dayId: "monday",
        start_time: "two_three",
      },
      { id: "monday_three_four", dayId: "monday", start_time: "three_four" },
      { id: "monday_four_five", dayId: "monday", start_time: "four_five" },
      { id: "monday_five_six", dayId: "monday", start_time: "five_six" },
      { id: "tuesday_nine_ten", dayId: "tuesday", start_time: "nine_ten" },
      { id: "tuesday_ten_eleven", dayId: "tuesday", start_time: "ten_eleven" },
      {
        id: "tuesday_eleven_twelve",
        dayId: "tuesday",
        start_time: "eleven_twelve",
      },
      { id: "tuesday_twelve_one", dayId: "tuesday", start_time: "twelve_one" },
      { id: "tuesday_one_two", dayId: "tuesday", start_time: "one_two" },
      { id: "tuesday_two_three", dayId: "tuesday", start_time: "two_three" },
      { id: "tuesday_three_four", dayId: "tuesday", start_time: "three_four" },
      { id: "tuesday_four_five", dayId: "tuesday", start_time: "four_five" },
      { id: "tuesday_five_six", dayId: "tuesday", start_time: "five_six" },
      { id: "wednesday_nine_ten", dayId: "wednesday", start_time: "nine_ten" },
      {
        id: "wednesday_ten_eleven",
        dayId: "wednesday",
        start_time: "ten_eleven",
      },
      {
        id: "wednesday_eleven_twelve",
        dayId: "wednesday",
        start_time: "eleven_twelve",
      },
      {
        id: "wednesday_twelve_one",
        dayId: "wednesday",
        start_time: "twelve_one",
      },
      { id: "wednesday_one_two", dayId: "wednesday", start_time: "one_two" },
      {
        id: "wednesday_two_three",
        dayId: "wednesday",
        start_time: "two_three",
      },
      {
        id: "wednesday_three_four",
        dayId: "wednesday",
        start_time: "three_four",
      },
      {
        id: "wednesday_four_five",
        dayId: "wednesday",
        start_time: "four_five",
      },
      { id: "wednesday_five_six", dayId: "wednesday", start_time: "five_six" },
      { id: "thursday_nine_ten", dayId: "thursday", start_time: "nine_ten" },
      {
        id: "thursday_ten_eleven",
        dayId: "thursday",
        start_time: "ten_eleven",
      },
      {
        id: "thursday_eleven_twelve",
        dayId: "thursday",
        start_time: "eleven_twelve",
      },
      {
        id: "thursday_twelve_one",
        dayId: "thursday",
        start_time: "twelve_one",
      },
      { id: "thursday_one_two", dayId: "thursday", start_time: "one_two" },
      { id: "thursday_two_three", dayId: "thursday", start_time: "two_three" },
      {
        id: "thursday_three_four",
        dayId: "thursday",
        start_time: "three_four",
      },
      { id: "thursday_four_five", dayId: "thursday", start_time: "four_five" },
      { id: "thursday_five_six", dayId: "thursday", start_time: "five_six" },
      { id: "friday_nine_ten", dayId: "friday", start_time: "nine_ten" },
      { id: "friday_ten_eleven", dayId: "friday", start_time: "ten_eleven" },
      {
        id: "friday_eleven_twelve",
        dayId: "friday",
        start_time: "eleven_twelve",
      },
      { id: "friday_twelve_one", dayId: "friday", start_time: "twelve_one" },
      { id: "friday_one_two", dayId: "friday", start_time: "one_two" },
      { id: "friday_two_three", dayId: "friday", start_time: "two_three" },
      { id: "friday_three_four", dayId: "friday", start_time: "three_four" },
      { id: "friday_four_five", dayId: "friday", start_time: "four_five" },
      { id: "friday_five_six", dayId: "friday", start_time: "five_six" },
      { id: "saturday_nine_ten", dayId: "saturday", start_time: "nine_ten" },
      {
        id: "saturday_ten_eleven",
        dayId: "saturday",
        start_time: "ten_eleven",
      },
      {
        id: "saturday_eleven_twelve",
        dayId: "saturday",
        start_time: "eleven_twelve",
      },
      {
        id: "saturday_twelve_one",
        dayId: "saturday",
        start_time: "twelve_one",
      },
      { id: "saturday_one_two", dayId: "saturday", start_time: "one_two" },
      { id: "saturday_two_three", dayId: "saturday", start_time: "two_three" },
      {
        id: "saturday_three_four",
        dayId: "saturday",
        start_time: "three_four",
      },
      { id: "saturday_four_five", dayId: "saturday", start_time: "four_five" },
      { id: "saturday_five_six", dayId: "saturday", start_time: "five_six" },
      { id: "sunday_nine_ten", dayId: "sunday", start_time: "nine_ten" },
      { id: "sunday_ten_eleven", dayId: "sunday", start_time: "ten_eleven" },
      {
        id: "sunday_eleven_twelve",
        dayId: "sunday",
        start_time: "eleven_twelve",
      },
      { id: "sunday_twelve_one", dayId: "sunday", start_time: "twelve_one" },
      { id: "sunday_one_two", dayId: "sunday", start_time: "one_two" },
      { id: "sunday_two_three", dayId: "sunday", start_time: "two_three" },
      { id: "sunday_three_four", dayId: "sunday", start_time: "three_four" },
      { id: "sunday_four_five", dayId: "sunday", start_time: "four_five" },
      { id: "sunday_five_six", dayId: "sunday", start_time: "five_six" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
