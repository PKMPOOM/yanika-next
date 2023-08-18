import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    redirect("/dashboard");
  } else {
    redirect("/classes");
  }

  // return (
  //   <main className="flex min-h-full flex-col items-center">
  //     <div className=" w-full max-w-7xl py-4 outline-red-400 outline">
  //       <p className=" text-4xl">Welcome {session?.user.name}</p>
  //     </div>
  //   </main>
  // );
}
