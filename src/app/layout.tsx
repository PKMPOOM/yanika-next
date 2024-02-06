import Navbar from "@/Components/Global/Navbar";
import "@/app/globals.css";
import AuthProvider from "@/context/AuthProvider";
import themeConfig from "@/theme/themeConfig";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meenites",
  description: "Meenites classroom management",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>
            <ConfigProvider theme={themeConfig}>
              {session && <Navbar />}
              {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
