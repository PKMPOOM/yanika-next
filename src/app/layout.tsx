import Navbar from "@/Components/Global/Navbar";
import AuthProvider from "@/context/AuthProvider";
import themeConfig from "@/theme/themeConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { authOptions } from "./(api)/api/auth/[...nextauth]/authOptions";
import "./globals.css";

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
        <div className="h-screen w-screen overflow-hidden">
          <ConfigProvider theme={themeConfig}>
            <AuthProvider>
              <AntdRegistry>
                {session && <Navbar />}
                {children}
              </AntdRegistry>
            </AuthProvider>
          </ConfigProvider>
        </div>
      </body>
    </html>
  );
}
