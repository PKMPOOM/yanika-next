"use client";

import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaLine } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

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

  // sm:bg-red-50 md:bg-yellow-50 lg:bg-blue-50 xl:bg-emerald-50 2xl:bg-orange-50
  return (
    <div className="mx-auto flex w-full max-w-xl justify-center bg-white px-10 xl:pt-20">
      <Form
        form={form}
        style={{ width: "100%" }}
        layout="horizontal"
        onFinish={onSignIn}
        initialValues={{
          email: "",
          password: "",
          remember_me: false,
        }}
      >
        <div className="mb-10">
          <div className="hidden sm:flex">
            <Title level={1}>Happy to See You!</Title>
          </div>
          <Text>Please sign In to Continue</Text>
        </div>

        <div className="flex-col lg:flex">
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
            <div className="mb-4 flex justify-center">
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

          <Divider>
            <Text>OR</Text>
          </Divider>

          <div className="flex justify-center gap-2">
            <Button
              size="large"
              onClick={() => {
                signIn("line", {
                  callbackUrl: `${window.location.origin}/subjects`,
                });
              }}
            >
              <div className="mx-auto flex items-center justify-center gap-2">
                <FaLine style={{ color: "#06c755", fontSize: 20 }} />
              </div>
            </Button>
            <Button
              size="large"
              onClick={() => {
                signIn("google", {
                  callbackUrl: `${window.location.origin}/subjects`,
                });
              }}
            >
              <div className="mx-auto flex items-center justify-center gap-2">
                <FcGoogle style={{ fontSize: 20 }} />
              </div>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default SignInForm;
