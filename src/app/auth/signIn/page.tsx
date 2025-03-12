import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import Meenites from "../../../../public/AppLogo.svg"
import { routepath } from "@/constant/RoutePath"
import SignInForm from "@/Components/auth/SignInForm"
import { headers } from "next/headers"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Meenites classroom management",
}

export default async function SignIn() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        switch (session.user.role) {
            case "admin":
                return redirect(routepath.TimeTable)
            case "user":
                return redirect(routepath.Subjects)
        }
    }

    return (
        <main className="flex h-screen w-full flex-col gap-6 overflow-hidden xl:flex-row">
            <div className="flex bgred h-44 w-full items-center bg-linear-to-r from-emerald-500 to-emerald-400 text-white xl:h-screen xl:w-3/5 xl:items-start xl:pt-20">
                <div className="left-8 top-8 mx-auto w-full max-w-xl px-10 xl:mx-5 pb-10 flex-1 flex flex-col h-full">
                    <p className={`left-8 top-8 text-6xl`}>
                        <Meenites className="text-white" />
                    </p>
                    <p
                        className={`bottom-8 left-8 text-xs font-light xl:text-base`}
                    >
                        Empower Educators, Elevate Education.
                    </p>
                </div>
            </div>
            <div className="flex flex-col h-screen w-full xl:w-2/5">
                <SignInForm />
                <div className="flex  w-full gap-2 mt-auto pb-5 ">
                    <Link
                        className="hover:underline"
                        href={routepath.PrivacyPolicy}
                    >
                        <p>Privacy Policy</p>
                    </Link>
                    <Link
                        className="hover:underline"
                        href={routepath.TermsOfService}
                    >
                        <p>Terms of Service</p>
                    </Link>
                </div>
            </div>
        </main>
    )
}
