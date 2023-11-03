import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ManageUser() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "user") {
    redirect("/subjects");
  }
  return (
    <section className=" flex min-h-full items-center justify-center">
      Manage user page
    </section>
  );
}
