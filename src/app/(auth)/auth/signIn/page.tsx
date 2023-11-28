import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import Meenites from "../../../../../public/Grou.svg";
const SignInForm = dynamic(() => import("@/Components/auth/SignInForm"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Sign In",
  description: "Meenites classroom management",
};

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <main className=" flex h-screen w-full flex-col gap-6 overflow-hidden xl:flex-row">
      <div className=" flex  h-44 w-full items-center bg-gradient-to-r from-emerald-500 to-emerald-400 text-white xl:h-screen xl:w-3/5 xl:items-start xl:pt-20">
        <div className=" left-8  top-8 mx-auto w-full max-w-xl px-10 xl:mx-5">
          <p className={` left-8  top-8 text-6xl`}>
            {/* <Image priority src={ssvvgg} alt="Follow us on Twitter" /> */}
            <Meenites className="text-white" />
          </p>
          <p className={`bottom-8 left-8  text-xs font-light xl:text-base`}>
            Empower Educators, Elevate Education.
          </p>
        </div>
      </div>
      <div className="flex h-screen w-full xl:w-2/5">
        <SignInForm />
      </div>
    </main>
    // <main className=" h-screen gap-6 flex items-start justify-center overflow-hidden">
    //   <div className=" relative flex w-3/5 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white justify-center items-center">
    //     <div className=" absolute top-8 left-8">
    //       <p className={`${playfair_Display.className} text-6xl  top-8 left-8`}>
    //         Meenites
    //       </p>
    //       <p className={`text-base font-light  bottom-8 left-8`}>
    //         Empower Educators, Elevate Education.
    //       </p>
    //     </div>
    //   </div>
    //   <div className=" w-2/5 px-10 flex h-screen pt-[15vh]">
    //     <SignInForm />
    //   </div>
    // </main>
  );
}
