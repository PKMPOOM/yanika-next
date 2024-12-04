import { authOptions } from "@/app/(api)/api/auth/[...nextauth]/authOptions";
import "@/app/globals.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Meenites classroom management",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/auth/signIn");
  }

  return <>{children}</>;
}
