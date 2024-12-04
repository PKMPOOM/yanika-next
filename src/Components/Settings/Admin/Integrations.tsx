"use client";

import Loader from "@/Components/Global/Loader";
import { useGoogleLogin } from "@react-oauth/google";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space, Spin, Typography } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuTrash } from "react-icons/lu";
import { SiGooglecalendar } from "react-icons/si";
const { Title } = Typography;
import { FcGoogle } from "react-icons/fc";
import {
  checkGoogleConnection,
  connectGoogleCalendar,
  removeGoogleIntegration,
} from "./api";
import { RetweetOutlined } from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";

export type TIntegrationsResponse = {
  GoogleCalendarConnect: boolean;
  GoogleToken: { email: string };
};

type TLoadingElement = "check" | "connect" | "delete" | undefined;

const Integrations = () => {
  const { data: session } = useSession();
  const [Loading, setLoading] = useState<TLoadingElement>(undefined);
  const [messageApi, messageContextHolder] = useMessage();
  const queryClient = useQueryClient();

  const getTokenInfo = async () => {
    const res = await axios.get<TIntegrationsResponse>(
      "/api/admin/integrations",
    );
    return res.data;
  };

  const { data: integrationsSettings } = useQuery({
    queryFn: getTokenInfo,
    queryKey: ["TokenInfo"],
    refetchOnWindowFocus: false,
  });

  const scopes =
    "https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar";

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: scopes,
    onSuccess: async (codeResponse) => {
      await connectGoogleCalendar(codeResponse.code);

      //force refresh
      // window.location.reload();
      queryClient.invalidateQueries({ queryKey: ["TokenInfo"] });

      setLoading(undefined);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setLoading(undefined);
    },
  });

  const checkConnection = async () => {
    try {
      setLoading("check");
      await checkGoogleConnection();

      setLoading(undefined);
      messageApi.success("Calendar connected");
    } catch (error) {
      setLoading(undefined);
      messageApi.error("Calendar connection failed");
      queryClient.invalidateQueries({ queryKey: ["TokenInfo"] });

      console.log(error);
    }
  };

  const connectToGoogle = async () => {
    setLoading("connect");
    googleLogin();
    setLoading(undefined);
  };

  if (!session) {
    return <Loader />;
  }

  if (!integrationsSettings) {
    return <Loader />;
  }

  const { GoogleCalendarConnect, GoogleToken } = integrationsSettings;

  return (
    <div>
      {messageContextHolder}
      <Title level={4}> Connected Calendar</Title>

      <Spin
        spinning={
          Loading === "check" || Loading === "connect" || Loading === "delete"
        }
      >
        <div className="flex items-center justify-between rounded-lg border border-slate-300 p-4">
          <div
            style={{
              fontSize: 30,
            }}
            className="flex items-center gap-4"
          >
            <FcGoogle
              style={{
                fontSize: 30,
              }}
            />
            <div>
              <p className="text-lg">Google</p>
              <p className="text-sm text-slate-400">{GoogleToken?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {GoogleCalendarConnect ? (
              <Space>
                <Button
                  loading={Loading === "check"}
                  onClick={checkConnection}
                  icon={<RetweetOutlined />}
                >
                  Check connection
                </Button>
                <Button
                  danger
                  icon={<LuTrash />}
                  onClick={removeGoogleIntegration}
                >
                  Remove connection
                </Button>
              </Space>
            ) : (
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                icon={
                  <div className="bg-red-50">
                    <SiGooglecalendar />
                  </div>
                }
                loading={Loading === "connect"}
                size="large"
                onClick={() => connectToGoogle()}
              >
                Connect Google Calendar
              </Button>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Integrations;
