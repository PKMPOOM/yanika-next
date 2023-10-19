import Container from "@/Components/Global/Container";
import { prisma } from "@/lib/db";
import { Breadcrumb, Button } from "antd";
import Link from "next/link";
import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { timeToRange } from "@/lib/timeToRange";
import dayjs from "dayjs";
import DescValue from "@/Components/Global/DescValue";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (session?.user.role === "user") {
    redirect("/classes");
  }

  const data = await prisma.timeSlot.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          TimeSlot: true,
          id: true,
        },
      },
      requestedClass: {
        select: {
          id: true,
          requestAt: true,
          day: true,
          accepted: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              _count: {
                select: {
                  classes: true,
                  request_class: true,
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    redirect("/404");
  }

  function bcProperName(
    mainString: string,
    optionalString?: keyof typeof timeToRange,
  ) {
    const firstWord = formattedUppercase(mainString);

    if (optionalString) {
      return `${firstWord} ${timeToRange[optionalString]} Hrs.`;
    }

    return firstWord;
  }

  const requestedClassAmount = data.requestedClass.length;

  const isBooked = data.userId && data.subjectId !== null;

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
              title: <Link href="/request">Request classes</Link>,
            },
            {
              title: bcProperName(data.dayId, data.start_time),
            },
          ]}
        />
      </div>
      {isBooked && (
        <div className=" flex gap-2">
          {bcProperName(data.dayId, data.start_time)}
          {`Booked by ${data.userId}`}
        </div>
      )}

      {!isBooked && (
        <div className=" flex flex-col gap-4">
          <div className=" flex flex-col gap-1">
            <p className=" text-lg font-semibold">
              {requestedClassAmount}{" "}
              {requestedClassAmount > 1 ? "classes" : "class"} requested
            </p>
            <p className=" text-sm text-slate-500">
              {bcProperName(data.dayId, data.start_time)}
            </p>
          </div>
          <div className=" flex flex-col gap-3">
            {data.requestedClass
              .sort((a, b) => {
                return b.requestAt.getTime() - a.requestAt.getTime();
              })
              .map((item) => (
                <div className="flex items-center justify-between rounded-md border border-emerald-400 p-3">
                  <div className=" ">
                    <DescValue
                      textSize="sm"
                      keyValue={"Request by"}
                      value={item.User.name || ""}
                      href={`user/${item.User.id}`}
                    />
                    <DescValue
                      textSize="sm"
                      keyValue={"Request on"}
                      value={dayjs(item.requestAt).format("DD MMM YYYY HH:MM")}
                    />
                    <DescValue
                      textSize="sm"
                      keyValue={"requested class"}
                      value={item.subject.name}
                      href={`subjects/${item.subject.id}`}
                    />
                  </div>
                  <div className=" flex gap-2">
                    <Button danger>Reject</Button>
                    <Button type="primary">
                      <span className=" w-20">Accept</span>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
};

export default page;
