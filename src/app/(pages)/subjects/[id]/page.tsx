import Container from "@/Components/Global/Container";
import { prisma } from "@/lib/db";
import { Tag, Breadcrumb } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import Subject from "@/Components/Subjects/Subject";
import BookingButton from "@/Components/Subjects/[id]/BookingButton";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { id } = params;

  const subject = await prisma.subject.findUnique({
    where: {
      id,
    },
  });

  if (!subject) {
    return <>404</>;
  }

  const recomendedSubject = await prisma.subject.findMany({
    where: {
      id: {
        not: id,
      },
    },
    take: 4,
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      grade: true,
    },
  });

  const formatedCourseOutline = subject.course_outline
    .replaceAll("\n", "")
    .split("--")
    .filter((item) => item !== "");

  const formatedGrade =
    subject.grade.charAt(0).toUpperCase() +
    subject.grade.slice(1).toLowerCase().replaceAll("_", " ");

  return (
    <Container>
      <div className=" flex min-h-[90vh] flex-col gap-6 ">
        <div className=" flex justify-between">
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
                title: <Link href="/subjects">Subjects</Link>,
              },

              {
                title: subject.name,
              },
            ]}
          />
        </div>
        <div className=" flex gap-10">
          <div className="   aspect-square w-3/12    ">
            <Image
              width={500}
              height={500}
              alt={subject.name}
              style={{
                objectFit: "cover",
                aspectRatio: "1/1",
                borderRadius: "16px",
                outline: "1px solid #e2e8f0",
              }}
              src={
                subject.image_url !== ""
                  ? subject.image_url
                  : "https://kgjimzdelnpigevgscbx.supabase.co/storage/v1/object/public/subject_image/book-icon-0.jpg"
              }
            />
          </div>
          <div className=" flex w-9/12 flex-col items-start gap-4">
            <h1 className=" flex items-center gap-2 text-4xl font-semibold">
              {`${subject.name} `}
              <span className=" text-xl">| {formatedGrade}</span>
            </h1>
            <div className=" flex ">
              {subject.tags.map((item) => (
                <Tag>{item}</Tag>
              ))}
            </div>
            <p>{subject.description}</p>

            <p className=" font-semibold">Course Outline</p>
            <ul>
              {formatedCourseOutline.map((item, index) => (
                <li className=" mb-2 flex gap-2 text-base">{`${
                  index + 1
                }.) ${item}`}</li>
              ))}
            </ul>

            <BookingButton
              subjectID={subject.id}
              groupPrice={subject.group_price}
              singlePrice={subject.single_price}
              subjectName={subject.name}
            />
          </div>
        </div>
        <h1 className=" text-2xl font-semibold">Other subjects</h1>
        <div className="grid grid-cols-4 gap-4">
          {recomendedSubject.map((item) => (
            <Subject subject={item} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default page;
