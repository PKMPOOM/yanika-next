"use client";

import Container from "@/Components/Global/Container";
import DescValue from "@/Components/Global/DescValue";
import Loader from "@/Components/Global/Loader";
import { formattedUppercase } from "@/lib/formattedUppercase";
import { HomeOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { groupBy } from "lodash-es";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { LuExternalLink } from "react-icons/lu";
import { useUserData } from "../manageUser.hooks";

const { Text, Title } = Typography;

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { data, isLoading, error } = useUserData(params.id);

  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        email: data.email,
      });
    }
  }, [data]);

  const emailRef = Form.useWatch("email", form);
  const isEdited = data?.email !== emailRef;

  if (isLoading) {
    return <Loader />;
  }

  if (!data || error) {
    return redirect("/404");
  }

  const groupedResponse = groupBy(data.time_slot, (e) => e.dayId);

  return (
    <Container>
      <div className="mb-4">
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
              title: <Link href="/manage_user">Manage user</Link>,
            },

            {
              title: data.name,
            },
          ]}
        />
      </div>
      <div className="flex w-full gap-8"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start">
            <Avatar
              src={data.image}
              size={100}
              style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
            >
              {data.name.charAt(0).toUpperCase()}
            </Avatar>
          </div>

          <div className="flex max-w-2xl flex-col gap-2">
            <div className="flex flex-col justify-between gap-2">
              <DescValue
                keyValue="id"
                element={<Text copyable>{data.id}</Text>}
                textSize="sm"
              />
              <DescValue keyValue="name" value={data.name} textSize="sm" />
            </div>

            <Form
              form={form}
              onFinish={(e) => console.log(e)}
              requiredMark="optional"
            >
              <div className="flex gap-2">
                <Form.Item
                  name={"email"}
                  label="Connected Email"
                  style={{
                    width: "100%",
                    marginBottom: 0,
                  }}
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
                  <Input />
                </Form.Item>
                <Button disabled={!isEdited} htmlType="submit">
                  Save
                </Button>
              </div>
            </Form>
          </div>
          <Divider />

          {data.accounts &&
            data.accounts.map((item, idx) => {
              return (
                <div
                  key={item.providerAccountId + idx}
                  className="flex flex-col gap-2"
                >
                  <DescValue
                    keyValue="Auth Type"
                    value={item.type}
                    textSize="sm"
                  />
                  <DescValue
                    keyValue="provider"
                    value={item.provider.toUpperCase()}
                    textSize="sm"
                  />
                  <DescValue
                    keyValue="scope"
                    value={item.scope}
                    textSize="sm"
                  />
                  <DescValue
                    keyValue="providerAccountId"
                    element={<Text copyable>{item.providerAccountId}</Text>}
                    textSize="sm"
                  />
                </div>
              );
            })}
        </div>
        <div className="flex flex-col gap-4">
          <h2>Booked Date & time</h2>
          {Object.keys(groupedResponse).map((dayName) => {
            const current = groupedResponse[dayName];

            return (
              <div
                key={dayName}
                className="flex flex-col justify-between gap-2 border-b border-dashed pb-6"
              >
                <div className="flex items-start gap-2">
                  <Title level={5}>{formattedUppercase(dayName)}</Title>
                  <Link href={`/time_table/${dayName}`}>
                    <div className="-translate-x-1 rounded-md p-2 pt-0 text-slate-800 transition-all duration-150 hover:translate-x-0 hover:text-emerald-500">
                      <LuExternalLink />
                    </div>
                  </Link>
                </div>

                {current.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border bg-white p-2 transition-all duration-150 hover:shadow"
                    >
                      <div className="flex flex-col gap-2">
                        <DescValue
                          keyValue="Subject"
                          value={item.subject.name}
                          textSize="sm"
                        />
                        <DescValue
                          keyValue="userBooked"
                          value={item.userBooked
                            .map((userbooked) => userbooked)
                            .join(",")}
                          textSize="sm"
                        />

                        <DescValue
                          keyValue="Time"
                          value={`${dayjs(item.start_time).format(
                            "H:mm",
                          )} - ${dayjs(item.start_time)
                            .add(item.duration, "hour")
                            .format("H:mm")} `}
                          textSize="sm"
                        />
                        <DescValue
                          keyValue="Accepted"
                          value={item.accept ? "Yes" : "No"}
                          textSize="sm"
                        />
                      </div>
                      <Link href={`/time_table/${dayName}/${item.id}`}>
                        <div className="-translate-x-1 rounded-md p-2 text-slate-800 transition-all duration-150 hover:translate-x-0 hover:text-emerald-500">
                          <LuExternalLink />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Page;
