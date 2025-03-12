import "@/app/globals.css"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export const metadata: Metadata = {
    title: "Subjects",
    description: "Meenites classroom management",
}

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect("/auth/signIn")
    }

    return <>{children}</>
}
