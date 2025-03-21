"use client"

import { useSession } from "@/lib/auth-client"
import { UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Form, Input, Typography } from "antd"
import axios from "axios"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserDetailsTab() {
    const { data: session } = useSession()
    const [emailform] = Form.useForm<SettingsForm>()
    const [Loading, setLoading] = useState(false)

    type SettingsForm = {
        email: string | null
        displayName: string | null
        bio: string | null
    }

    useEffect(() => {
        emailform.setFieldsValue({
            email: session?.user.email,
            displayName: session?.user.name,
        })
    }, [session, emailform])

    if (session?.user.role === "admin") {
        return redirect("/settings/admin")
    }

    const onSubmit = async (event: SettingsForm) => {
        setLoading(true)
        const { email } = event
        await axios
            .post("/api/settings", {
                email,
                id: session?.user.id,
            })
            .then(() => {
                setLoading(false)
            })
    }

    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-center gap-6">
                <Avatar
                    style={{
                        backgroundColor: "#10b981",
                        cursor: "pointer",
                    }}
                    size={80}
                    src={session?.user.image}
                    icon={<UserOutlined />}
                />
            </div>

            <div className="flex w-full items-center gap-2">
                <Form
                    form={emailform}
                    layout="vertical"
                    style={{
                        width: "100%",
                        flexDirection: "column",
                        display: "flex",
                        gap: 24,
                    }}
                    requiredMark={"optional"}
                    onFinish={onSubmit}
                >
                    <Typography.Text type="secondary">
                        User ID: {session?.user.id}
                    </Typography.Text>
                    <Form.Item
                        label="Email"
                        extra={session?.user.email ? "" : "Gmail is required"}
                        name={"email"}
                        help="User email address used for account login and notifications"
                        rules={[
                            {
                                required: true,
                                message: "Email cannot be blank",
                            },
                            {
                                pattern: /\w{5,}@gmail.com$/gm,
                                message: "Please provide valid email address",
                            },
                        ]}
                    >
                        <Input placeholder="email" size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Display Name"
                        name="displayName"
                        help="Your name as shown to others"
                        rules={[
                            {
                                required: true,
                                message: "Display name cannot be blank",
                            },
                            {
                                min: 2,
                                message:
                                    "Display name must be at least 2 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Display name" size="large" />
                    </Form.Item>
                    <div>
                        <Button
                            loading={Loading}
                            type="primary"
                            htmlType="submit"
                            size="large"
                            shape="round"
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <span className="px-10">Save</span>
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
