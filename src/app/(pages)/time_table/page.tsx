// import ClassesRequest from "@/Components/Classes/ClassesRequest/ClassesRequest";
// import ClassesRequest from "@/Components/Classes/ClassesRequest/ClassesRequest";
import Container from "@/Components/Global/Container";
import TimeTable from "@/Components/TimeTable/TimeTable";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Request() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "user") {
    redirect("/subjects");
  }

  return (
    <Container>
      {/* <ClassesRequest /> */}
      <TimeTable />
    </Container>
  );
}
