import Container from "@/Components/Global/Container";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Tabs } from "antd";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminSettings() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "admin") {
    return redirect("/settings");
  }
  return (
    <Container>
      {/* <p>set available days</p>
      <p>line id settings</p> */}
      <Tabs
        tabPosition={"left"}
        items={[
          {
            label: "Account",
            key: "account",
            children: `account`,
          },
          {
            label: "Previous classes",
            key: "previous classes",
            children: `previous classes`,
          },
          {
            label: "Integrations",
            key: "Integrations",
            children: `gg ids, zoom ids and other integrations`,
          },
        ]}
      />
    </Container>
  );
}
