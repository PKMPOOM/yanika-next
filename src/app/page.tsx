import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session && session.user.role === "admin") {
        redirect("/time_table")
    } else {
        redirect("/subjects")
    }
}
