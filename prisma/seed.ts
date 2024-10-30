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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
