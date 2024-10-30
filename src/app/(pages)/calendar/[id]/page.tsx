"use client";

import Loader from "@/Components/Global/Loader";
import { useSession } from "next-auth/react";

export default function ClassSingle() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <Loader />;
  }

  return (
    <main className=" flex min-h-full items-center justify-center">
      <div className=" flex w-full max-w-7xl gap-4 pt-6">
        <div className=" w-3/4">Single class Data</div>
        <div className=" w-1/4">
          <p className=" text-4xl">Welcome {session?.user.name}</p>
        </div>
      </div>
    </main>
  );
}
