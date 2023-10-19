import React from "react";
import { Col, Row } from "antd";
import Statistics from "@/Components/Dashboard/Statistics";
import ClassLists from "@/Components/Dashboard/ClassLists";
import Container from "@/Components/Global/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Yanika classroom management",
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "user") {
    redirect("/classes");
  }

  return (
    <Container>
      <Row gutter={16}>
        <Col span={16}>
          <div className=" flex min-h-[50vh] flex-col gap-6">
            <Statistics />
            <div className=" flex-1 bg-red-100">graph</div>
          </div>
        </Col>
        <Col span={8}>
          <ClassLists />
        </Col>
      </Row>
    </Container>
  );
}
