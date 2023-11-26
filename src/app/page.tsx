import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    redirect("/time_table");
  } else {
    redirect("/subjects");
  }
}
