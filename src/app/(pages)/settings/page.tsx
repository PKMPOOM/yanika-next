"use client"

import Container from "@/Components/Global/Container"
import type { TabsProps } from "antd"
import { Tabs } from "antd"
import CreditHistory from "./CreditHistory"
import UserDetailsTab from "./UserDetailsTab"

const items: TabsProps["items"] = [
    {
        key: "1",
        label: "User Details",
        children: <UserDetailsTab />,
    },
    {
        key: "2",
        label: "Credit History",
        children: <CreditHistory />,
    },
]

export default function AdminSettings() {
    return (
        <Container>
            <Tabs defaultActiveKey="1" items={items} />
        </Container>
    )
}
