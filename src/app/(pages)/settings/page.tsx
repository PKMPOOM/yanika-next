"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const { data: session, status, update } = useSession();
  const [emailform] = Form.useForm<SettingsForm>();
  const [Loading, setLoading] = useState(false);

  type SettingsForm = {
    email: string | null;
  };

  useEffect(() => {
    emailform.setFieldsValue({
      email: session?.user.email,
    });
  }, [session, emailform]);

  if (status === "loading") {
    return <Loader />;
  }

  if (session?.user.role === "admin") {
    return redirect("/settings/admin");
  }

  const onSubmit = async (event: SettingsForm) => {
    setLoading(true);
    const { email } = event;
    await axios
      .post("/api/settings", {
        email,
        id: session?.user.id,
      })
      .then(() => {
        setLoading(false);
      });

    await update({ email: email });
  };

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
          {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        </div>

        <div className=" flex w-full items-center gap-2">
          <Form
            form={emailform}
            layout="vertical"
            style={{
              width: "100%",
            }}
            onFinish={onSubmit}
          >
            <Form.Item
              label="Email"
              extra={session?.user.email ? "" : "Gmail is required"}
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Email cannot be blank",
                },
                {
                  pattern: /\w{5,}@gmail.com$/gm,
                  message: "Please provide valid email address",
                },
              ]}
            >
              <Input placeholder="email" size="large" />
            </Form.Item>
            <Button
              loading={Loading}
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
