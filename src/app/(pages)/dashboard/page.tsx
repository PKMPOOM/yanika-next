import React from "react"
import { Col, Row } from "antd"
import Statistics from "@/Components/Dashboard/Statistics"
import ClassLists from "@/Components/Dashboard/ClassLists"
import Container from "@/Components/Global/Container"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export const metadata = {
    title: "Dashboard",
    description: "Meenites classroom management",
}

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session?.user.role === "user") {
        redirect("/subjects")
    }

    return (
        <Container>
            <Row gutter={16}>
                <Col span={16}>
                    <div className="flex min-h-[50vh] flex-col gap-6">
                        <Statistics />
                        <div className="flex-1 bg-red-100">graph</div>
                    </div>
                </Col>
                <Col span={8}>
                    <ClassLists />
                </Col>
            </Row>
        </Container>
    )
}
