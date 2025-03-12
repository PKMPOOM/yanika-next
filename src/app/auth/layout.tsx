import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    //   console.log("role", session?.user.role);

    if (!session) {
        return <div>{children}</div>
    }

    return redirect("/subjects")
}
