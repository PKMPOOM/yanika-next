"use client";

import {
  Button,
  Typography,
  Divider,
  Form,
  Input,
  Checkbox,
  ConfigProvider,
} from "antd";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import themeConfig from "@/theme/themeConfig";
import { FaLine } from "react-icons/fa6";

const { Title, Text, Link: LinkText } = Typography;

type SiteConfigurationsType = {
  email: string;
  password: string;
  remember_me: boolean;
};

function SignInForm() {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [Error, setError] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  console.log(callbackUrl);
  console.log(callbackUrl);

  const onSignIn = async (event: SiteConfigurationsType) => {
    try {
      setError(false);
      setLoading(true);
      const response = await signIn("credentials", {
        email: event.email,
        password: event.password,
        redirect: false,
      });

      setLoading(false);

      if (!response?.error) {
        window.location.href = callbackUrl;
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="w-full max-w-xl flex justify-center mx-auto ">
        <Form
          form={form}
          style={{ maxWidth: "400px", width: "100%" }}
          layout="horizontal"
          onFinish={onSignIn}
          initialValues={{
            email: "",
            password: "",
            remember_me: false,
          }}
        >
          <div className=" mb-10">
            <Title level={1}>Happy to See You!</Title>
            <Text>Please sign In to Continue</Text>
          </div>

          <Button
            size="large"
            onClick={() => {
              signIn("line");
            }}
            block
          >
            <div className=" flex items-center gap-2 mx-auto justify-center ">
              <FaLine style={{ color: "#06c755", fontSize: 20 }} />
              <p>Log in with line</p>
            </div>
          </Button>

          <Divider>
            <Text>OR</Text>
          </Divider>

          <Form.Item<SiteConfigurationsType>
            name={"email"}
            rules={[
              {
                required: true,
                message: "Please enter your email address.",
              },
              {
                type: "email",
                message: "Invalid email format.",
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item<SiteConfigurationsType>
            name={"password"}
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Form.Item<SiteConfigurationsType>
              name="remember_me"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <LinkText
              style={{
                float: "right",
              }}
            >
              Forget password
            </LinkText>
          </Form.Item>

          {Error && (
            <div className=" flex justify-center mb-4">
              <Text type="danger">Please check your username and password</Text>
            </div>
          )}

          <Button
            loading={Loading}
            size="large"
            block
            type="primary"
            htmlType="submit"
          >
            Log in
          </Button>
        </Form>
      </div>
    </ConfigProvider>
  );
}

export default SignInForm;
