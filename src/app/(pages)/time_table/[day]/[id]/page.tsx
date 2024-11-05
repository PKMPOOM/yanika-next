import Container from "@/Components/Global/Container";
import DescValue from "@/Components/Global/DescValue";
import { prisma } from "@/lib/db";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    id: string;
    day: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = params;

  const ClassData = await prisma.timeSlot.findUnique({
    where: {
      id,
    },

    include: {
      subject: true,
    },
  });

  if (!ClassData) {
    redirect("/404");
  }
  const classHours = `${dayjs(ClassData.start_time).format("H:mm")}-${dayjs(
    ClassData.start_time,
  )
    .add(ClassData.duration, "hour")
    .format("H:mm")} Hrs.`;
  return (
    <Container>
      <div className="mb-4 flex justify-between">
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> Dashboard
                </Link>
              ),
            },
            {
              title: <Link href="/time_table">Time Table</Link>,
            },
            {
              title: (
                <Link href={`/time_table/${ClassData.dayId}`}>
                  {formattedUppercase(ClassData.dayId)}
                </Link>
              ),
            },
            {
              title: classHours,
            },
          ]}
        />
      </div>
      <h1 className="text-xl font-semibold">{ClassData.subject?.name} class</h1>
      <DescValue keyValue="Class Duration" value={classHours} />
      <DescValue keyValue="Income" value={`${ClassData.totalPrice} Thb`} />
      {ClassData.userBooked}
    </Container>
  );
};

export default Page;
