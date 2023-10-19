import Container from "@/Components/Global/Container";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminSettings() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "admin") {
    return redirect("/settings/admin");
  }
  return (
    <Container>
      <> test</>
    </Container>
  );
}
