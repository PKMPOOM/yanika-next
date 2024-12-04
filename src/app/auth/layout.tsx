import { getServerSession } from "next-auth";
import { authOptions } from "../(api)/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  //   console.log("role", session?.user.role);

  if (!session) {
    return <div>{children}</div>;
  }

  return redirect("/subjects");
}
