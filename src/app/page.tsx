import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./(api)/api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    redirect("/time_table");
  } else {
    redirect("/subjects");
  }
}
