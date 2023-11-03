import { google } from "googleapis";
import { prisma } from "./db";
import dayjs from "dayjs";

export const auth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL,
);

export const getToken = (code: string) => {
  return auth2Client.getToken(code);
};

export const getNewAccessTokenByRefreshToken = async (refreshToken: string) => {
  auth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { res } = await auth2Client.getAccessToken();

  const { access_token, token_type, id_token, expiry_date, refresh_token } =
    res?.data;

  await prisma.integrations.update({
    where: { id: "main_app" },
    data: {
      GoogleToken: {
        update: {
          access_token: access_token,
          expiry_date: expiry_date.toString(),
          id_token: id_token,
          token_type: token_type,
          refresh_token: refresh_token,
          expire_at: dayjs(expiry_date).toDate(),
        },
      },
    },
  });

  return access_token;
};
