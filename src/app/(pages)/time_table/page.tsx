import Container from "@/Components/Global/Container"
import TimeTable from "@/Components/TimeTable/TimeTable"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import React from "react"
import { headers } from "next/headers"

export default async function Request() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session?.user.role === "user") {
        redirect("/subjects")
    }

    return (
        <Container>
            <TimeTable />
        </Container>
    )
}
