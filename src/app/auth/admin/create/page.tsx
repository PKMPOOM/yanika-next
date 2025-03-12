"use client"

import Container from "@/Components/Global/Container"
import Loader from "@/Components/Global/Loader"
import { authClient, signIn } from "@/lib/auth-client"
import { Button, Form, Input, Typography } from "antd"
// import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation"
import { useState } from "react"

const { Title, Text, Link: LinkText } = Typography

type SiteConfigurationsType = {
    email: string
    password: string
    remember_me: boolean
    name: string
}

const AdminSignInPage = () => {
    const [form] = Form.useForm()
    const searchParams = useSearchParams()
    const adminToken = searchParams.get("adminToken")
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const [Error, setError] = useState<boolean>(false)
    const [Loading, setLoading] = useState<boolean>(false)

    const ADMIN_TOKEN = "OKEjg2FUE8YSDXLq8c2K"

    if (!adminToken || adminToken !== ADMIN_TOKEN) {
        return <div>Unauthorized</div>
    }

    const onSignUp = async (event: SiteConfigurationsType) => {
        try {
            setError(false)
            setLoading(true)

            const { error } = await authClient.signUp.email({
                email: event.email, // user email address
                password: event.password, // user password -> min 8 characters by default
                name: "admin",
            })

            if (!error) {
                window.location.href = callbackUrl
                setLoading(false)
            } else {
                setLoading(false)
                setError(true)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    if (Loading) {
        return <Loader />
    }

    return (
        <Container>
            <div className="mx-auto w-full max-w-xl">
                <div className="mb-10">
                    <div className="hidden sm:flex">
                        <Title level={1}>Admin login</Title>
                    </div>
                </div>
                <Form
                    form={form}
                    style={{ width: "100%" }}
                    layout="horizontal"
                    onFinish={onSignUp}
                    initialValues={{
                        email: "",
                        password: "",
                        remember_me: false,
                    }}
                >
                    <div className="flex-col lg:flex">
                        <Form.Item<SiteConfigurationsType>
                            name={"name"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your name.",
                                },
                            ]}
                        >
                            <Input placeholder="Name" size="large" />
                        </Form.Item>
                        <Form.Item<SiteConfigurationsType>
                            name={"email"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email address.",
                                },
                                {
                                    type: "email",
                                    message: "Invalid email format.",
                                },
                            ]}
                        >
                            <Input placeholder="Email" size="large" />
                        </Form.Item>

                        <Form.Item<SiteConfigurationsType>
                            name={"password"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        {Error && (
                            <div className="mb-4 flex justify-center">
                                <Text type="danger">
                                    Please check your username and password
                                </Text>
                            </div>
                        )}

                        <Button
                            loading={Loading}
                            size="large"
                            block
                            type="primary"
                            htmlType="submit"
                        >
                            Log in
                        </Button>

                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                            }}
                        >
                            <LinkText>Forget password</LinkText>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Container>
    )
}

export default AdminSignInPage
