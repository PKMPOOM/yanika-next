import Container from "@/Components/Global/Container";
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

const page = async ({ params }: PageProps) => {
  const { id } = params;

  const data = await prisma.newTimeSlot.findUnique({
    where: {
      id,
    },

    include: {
      subject: true,
    },
  });

  if (!data) {
    redirect("/404");
  }

  return (
    <Container>
      <div className=" mb-4 flex justify-between">
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
                <Link href={`/time_table/${data.dayId}`}>
                  {formattedUppercase(data.dayId)}
                </Link>
              ),
            },
            {
              title: `${dayjs(data.start_time).format("H:mm")}-${dayjs(
                data.start_time,
              )
                .add(data.duration, "hour")
                .format("H:mm")} Hrs.`,
            },
          ]}
        />
      </div>
      Meeting link: blablabla.ggmeet.com
      <div></div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
};

export default page;
