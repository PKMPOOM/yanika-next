"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import Integrations from "@/Components/Settings/Admin/Integrations";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Tabs } from "antd";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminSettings() {
  const { data: session } = useSession();

  if (!session) {
    return <Loader />;
  }

  if (session.user.role !== "admin") {
    return redirect("/settings");
  }

  return (
    <GoogleOAuthProvider clientId="151735745914-jjcls6sa6i7f9mach7e6v7chbqvtjrnh.apps.googleusercontent.com">
      <Container>
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
              children: <Integrations />,
            },
          ]}
        />
      </Container>
    </GoogleOAuthProvider>
  );
}
