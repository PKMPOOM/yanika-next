import Container from "@/Components/Global/Container";
import Subject from "@/Components/Subjects/Subject";
import BookingButton from "@/Components/Subjects/[id]/BookingButton";
import Editor from "@/lib/Editor";
import { prisma } from "@/lib/db";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
// const Editor = dynamic(() => import("@/lib/Editor"), { ssr: false });

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
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

  const formatedGrade =
    subject.grade.charAt(0).toUpperCase() +
    subject.grade.slice(1).toLowerCase().replaceAll("_", " ");

  return (
    <Container>
      <div className="flex min-h-[90vh] flex-col gap-6">
        <div className="flex justify-between">
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
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="aspect-square max-w-full md:max-w-lg">
            <Image
              width={1000}
              height={1000}
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
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full gap-3 sm:flex-row sm:justify-between md:flex-col md:items-start lg:flex-row">
              <div className="flex flex-col gap-2 text-3xl">
                <div className="font-semibold">{subject.name}</div>
                <div className="text-sm font-semibold">| {formatedGrade}</div>
                <div className="flex flex-wrap gap-y-2">
                  {subject.tags.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>

              <BookingButton
                subjectID={subject.id}
                groupPrice={subject.group_price}
                singlePrice={subject.single_price}
                subjectName={subject.name}
              />
            </div>

            <p>{subject.description}</p>

            <p className="font-semibold">Course Outline</p>
            <div className="h-[600px] overflow-auto overflow-y-auto">
              <Editor data={subject.course_outline} />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Other subjects</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recomendedSubject.map((item) => (
            <Subject key={item.id} subject={item} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Page;
