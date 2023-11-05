"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input } from "antd";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const [emailform] = Form.useForm<SettingsForm>();

  type SettingsForm = {
    email: string | null;
  };

  useEffect(() => {
    emailform.setFieldsValue({
      email: session?.user.email,
    });
  }, [session]);

  if (status === "loading") {
    return <Loader />;
  }

  if (session?.user.role === "admin") {
    return redirect("/settings/admin");
  }

  return (
    <Container>
      <div className=" flex  flex-col items-center gap-4 ">
        <Avatar
          style={{
            backgroundColor: "#10b981",
            cursor: "pointer",
          }}
          size={80}
          src={session?.user.image}
          icon={<UserOutlined />}
        />

        <div>
          <p>{session?.user.name}</p>
        </div>

        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        <div className=" flex w-full items-center gap-2">
          <Form
            form={emailform}
            layout="vertical"
            style={{
              width: "100%",
            }}
          >
            <Form.Item label="Email" extra="Gmail is required">
              <Input placeholder="email" size="large" />
            </Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              shape="round"
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}
