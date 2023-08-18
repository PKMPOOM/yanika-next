import React from "react";
import SignInForm from "@/Components/auth/SignInForm";
import { Playfair_Display } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

const playfair_Display = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});

export default async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <main className=" h-screen gap-6 flex items-start justify-center">
      <div className=" relative flex w-3/5 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white justify-center items-center">
        <div className=" absolute top-8 left-8">
          <p className={`${playfair_Display.className} text-6xl  top-8 left-8`}>
            Yanika
          </p>
          <p className={`text-base font-light  bottom-8 left-8`}>
            Empower Educators, Elevate Education.
          </p>
        </div>
      </div>
      <div className=" w-2/5 h-full px-10 flex pt-[15vh]">
        <SignInForm />
      </div>
    </main>
  );
}
