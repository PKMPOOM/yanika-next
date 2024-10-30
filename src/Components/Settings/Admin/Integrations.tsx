"use client";

import Loader from "@/Components/Global/Loader";
import { useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { Button, Typography } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuTrash } from "react-icons/lu";
import { SiGooglecalendar } from "react-icons/si";
const { Title } = Typography;
import { FcGoogle } from "react-icons/fc";
import { RetweetOutlined } from "@ant-design/icons";

export type IntegrationsResponse = {
  GoogleCalendarConnect: boolean;
  GoogleToken: { email: string };
};

// export type GoogleAuthUserData = {
//   id: string;
//   email: string;
//   verified_email: boolean;
//   name: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
//   locale: string;
// };

// export type IntegrationData = {
//   id: string;
//   GoogleCalendarConnect: boolean;
// };

const Integrations = () => {
  const { data: session } = useSession();
  const [Loading, setLoading] = useState(false);

  const getTokenInfo = async () => {
    const res = await axios.get<IntegrationsResponse>(
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
      await axios.post("/api/google/calendar", {
        code: codeResponse.code,
      });

      setLoading(false);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setLoading(false);
    },
  });

  const connectToGoogle = async () => {
    setLoading(true);
    googleLogin();
    setLoading(false);
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
      <Title level={4}> Connected Calendar</Title>
      {/* integrationData.GoogleCalendarConnect */}

      {GoogleCalendarConnect ? (
        <div className=" flex items-center justify-between rounded-lg border border-slate-300 p-4">
          <div
            style={{
              fontSize: 30,
            }}
            className=" flex items-center gap-4"
          >
            <FcGoogle
              style={{
                fontSize: 30,
              }}
            />
            <div>
              <p className=" text-lg">Google</p>
              <p className=" text-sm text-slate-400">{GoogleToken.email}</p>
            </div>
          </div>
          <div className=" flex gap-2">
            <Button
              icon={<RetweetOutlined />}
              onClick={() => connectToGoogle()}
            >
              Reconnect to Google
            </Button>
            <Button danger icon={<LuTrash />}>
              Delete
            </Button>
          </div>
        </div>
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
          loading={Loading}
          size="large"
          onClick={() => connectToGoogle()}
        >
          Connect Google Calendar
        </Button>
      )}
    </div>
  );
};

export default Integrations;
