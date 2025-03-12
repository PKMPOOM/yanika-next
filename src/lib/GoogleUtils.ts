import { google } from "googleapis";

export const auth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL,
);

export const getToken = (code: string) => {
  return auth2Client.getToken(code);
};
