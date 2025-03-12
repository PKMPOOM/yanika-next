import "@/app/globals.css"
import { auth } from "@/lib/auth"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

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
